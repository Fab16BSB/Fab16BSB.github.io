/**
 * Synchronise les articles Medium depuis le flux RSS.
 * En cas d'échec, le JSON existant est conservé.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { franc } from 'franc';
import { XMLParser } from 'fast-xml-parser';

/* =========================================================================
  CONFIGURATION
========================================================================= */
// Configuration du flux et du fichier de sortie.
const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, '../src/data/medium-posts.json');
const feedUrl = process.env.MEDIUM_FEED_URL ?? 'https://medium.com/feed/@fab.16';

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
  HELPERS TEXTE ET HTML
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

/** Décode les entités HTML du flux. */
function decodeEntities(value) {
  const named = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    hellip: '…',
    mdash: '—',
    ndash: '–',
    rsquo: '’',
    lsquo: '‘',
    rdquo: '”',
    ldquo: '“',
    laquo: '«',
    raquo: '»',
    copy: '©',
  };
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (_, name) => named[name.toLowerCase()] ?? `&${name};`);
}

/** Convertit le HTML en texte brut. */
function stripHtml(html) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim(),
  );
}

/** Retourne la première image d'un contenu HTML. */
function firstImage(html) {
  const match = html.match(/<img[^>]+src="([^"]+)"/i);
  return match?.[1] ?? undefined;
}

/* =========================================================================
  HELPERS MÉTIER
========================================================================= */
// Correspondance franc → code de locale.
const languageCodes = {
  eng: 'en',
  fra: 'fr',
  spa: 'es',
};

/** Détecte la langue d'un texte (FR / EN / ES). */
function detectLanguage(content) {
  const code = franc(content.slice(0, 4000), { only: ['eng', 'fra', 'spa'] });
  return languageCodes[code] ?? 'en';
}

/** Nettoie et tronque l'extrait d'un article. */
function cleanExcerpt(content) {
  let value = stripHtml(content);
  const intro = value.search(/\b(Introduction|Introducción)\b/i);
  if (intro > 0 && intro < 320) value = value.slice(intro);
  value = value
    .replace(/^(Introduction|Introducción)\s*/i, '')
    .replace(/^(\?\?\s*)?(French|English|Spanish)\s*Post(\s*\?\?)?/gi, '')
    .trim();
  return value.length > 190 ? `${value.slice(0, 187).trimEnd()}…` : value;
}

/** Convertit une date en ISO, avec repli sur la date courante. */
function toIsoDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

/* =========================================================================
  PARSING
========================================================================= */
/** Transforme le XML du flux en liste d'articles. */
function parsePosts(xml) {
  const doc = parser.parse(xml);
  const channel = doc?.rss?.channel;
  const items = Array.isArray(channel?.item) ? channel.item : channel?.item ? [channel.item] : [];
  const seen = new Set();

  return items
    .map((item) => {
      const rawTitle = text(item.title).trim();
      const rawLink = text(item.link).trim();

      // Ignore les entrées incomplètes.
      if (!rawTitle || !rawLink) return null;

      // Retire les paramètres de suivi de l'URL.
      let url = rawLink;
      try {
        const parsed = new URL(rawLink);
        parsed.search = '';
        url = parsed.toString();
      } catch (error) {
        console.warn(`[medium] invalid post URL, keeping raw link: ${rawLink}`, error);
      }
      const content = text(item['content:encoded']);
      const plainText = stripHtml(content);
      const categories = (Array.isArray(item.category) ? item.category : item.category ? [item.category] : [])
        .map((category) => text(category).trim())
        .filter(Boolean)
        .slice(0, 5);
      const words = plainText.split(/\s+/).filter(Boolean).length;
      const id = text(item.guid).trim() || url;

      // Déduplique par identifiant.
      if (seen.has(id)) return null;

      seen.add(id);
      return {
        id,
        title: rawTitle,
        url,
        publishedAt: toIsoDate(text(item.pubDate).trim()),
        excerpt: cleanExcerpt(content),
        image: firstImage(content),
        tags: categories,
        // Estimation : 240 mots par minute.
        readingTime: Math.max(1, Math.round(words / 240)),
        language: detectLanguage(plainText),
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
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
        accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    const posts = parsePosts(xml);
    if (!posts.length) throw new Error('No posts found in feed');

    await writeFile(outputPath, `${JSON.stringify(posts, null, 2)}\n`, 'utf8');
    console.log(`[medium] ${posts.length} posts written to ${outputPath}`);
  } catch (error) {
    console.warn(`[medium] sync failed, keeping existing data: ${error instanceof Error ? error.message : error}`);

    // Conserve le JSON existant en cas d'échec.
    try {
      const existing = await readFile(outputPath, 'utf8');
      if (!existing.trim()) throw new Error('empty fallback');
    } catch (error) {
      console.warn('[medium] existing data unreadable, writing empty fallback', error);
      await writeFile(outputPath, '[]\n', 'utf8');
    }
  }
}

main();
