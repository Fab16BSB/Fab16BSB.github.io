/**
 * Synchronise les vidéos YouTube depuis le flux Atom.
 * En cas d'échec, le JSON existant est conservé.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { XMLParser } from 'fast-xml-parser';

/* =========================================================================
  CONFIGURATION
========================================================================= */
// Configuration du flux et du fichier de sortie.
const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '../src/data/youtube-videos.json');
const feedUrl =
  process.env.YOUTUBE_FEED_URL ??
  'https://www.youtube.com/feeds/videos.xml?channel_id=UCHS2xgITwh7olsnznmq8o0A';

// Parseur XML : conserve les CDATA et les attributs.
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  cdataPropName: '__cdata',
  textNodeName: '__text',
  trimValues: true,
  processEntities: true,
});

/* =========================================================================
  HELPERS
========================================================================= */
/** Extrait le texte d'un nœud XML. */
function text(node) {
  if (node == null) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(text).filter(Boolean).join(' ');
  if (typeof node === 'object') {
    if ('__cdata' in node) return text(node.__cdata);
    if ('__text' in node) return text(node.__text);
    if ('#text' in node) return text(node['#text']);
    return Object.values(node).map(text).filter(Boolean).join(' ');
  }
  return '';
}

/** Retourne le premier élément d'un nœud XML. */
function first(node) {
  return Array.isArray(node) ? node[0] : node;
}

/* =========================================================================
  EXÉCUTION
========================================================================= */
/** Récupère le flux et écrit le JSON. */
async function main() {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; FabienPoirierPortfolio/1.0)',
        accept: 'application/atom+xml, application/xml, text/xml, */*',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const xml = await response.text();
    const doc = parser.parse(xml);
    const entries = Array.isArray(doc?.feed?.entry)
      ? doc.feed.entry
      : doc?.feed?.entry
        ? [doc.feed.entry]
        : [];

    let existing = [];
    // Conserve les types déjà connus (video / short).
    try {
      const stored = JSON.parse(await readFile(outputPath, 'utf8'));

      if (!Array.isArray(stored)) {
        console.warn('[youtube] existing data is not an array, starting empty');
      }

      existing = Array.isArray(stored) ? stored : [];
    } catch (error) {
      console.warn('[youtube] existing data unreadable, starting empty', error);
      existing = [];
    }
    const existingTypes = new Map(existing.map((video) => [video.id, video.type]));

    const videos = entries
      .map((entry) => {
        const id = text(entry['yt:videoId']).trim();
        if (!id) return null;

        const group = first(entry['media:group']);
        const contentNode = first(group?.['media:content']);
        const statistics = first(group?.['media:community']?.['media:statistics']);

        // Miniature principale et miniature de secours.
        const thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
        const fallbackThumbnail = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

        // Détecte un Short via le ratio de la vidéo.
        const width = Number(contentNode?.['@_width'] ?? 0);
        const height = Number(contentNode?.['@_height'] ?? 0);
        const detectedType = height > width && width > 0 ? 'short' : 'video';

        return {
          id,
          title: text(entry.title).trim(),
          url: `https://www.youtube.com/watch?v=${id}`,
          publishedAt: text(entry.published).trim(),
          thumbnail,
          fallbackThumbnail,
          views: Number(statistics?.['@_views'] ?? 0) || 0,
          type: existingTypes.get(id) ?? detectedType,
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    if (!videos.length) throw new Error('No videos found in feed');

    await writeFile(outputPath, `${JSON.stringify(videos, null, 2)}\n`, 'utf8');
    console.log(`[youtube] ${videos.length} videos written to ${outputPath}`);
  } catch (error) {
    console.warn(
      `[youtube] sync failed, keeping existing data: ${error instanceof Error ? error.message : error}`,
    );
  }
}

main();
