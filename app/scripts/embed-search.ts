/**
 * Génère les index de recherche sémantique par langue.
 *
 * Lancé par le CI après les synchronisations Medium / YouTube.
 *
 * Le texte indexé provient des mêmes champs que la recherche lexicale. Les
 * vecteurs des documents inchangés sont réutilisés grâce à un hash du texte :
 * seuls les nouveaux documents ou ceux modifiés sont ré-encodés.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { env, pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers';
import mediumPostsRaw from '../src/data/medium-posts.json';
import { publicationSummaries } from '../src/data/publication-summaries.data';
import { publications } from '../src/data/publications.data';
import { projects } from '../src/data/projects.data';
import { teaching } from '../src/data/teaching.data';
import videosRaw from '../src/data/youtube-videos.json';
import { filterMediumPosts } from '../src/components/sections/Publications/publications.helpers';
import { EMBEDDING_CONFIG } from '../src/lib/search.config';
import {
  buildSearchText,
  mediumPostSearchFields,
  projectSearchFields,
  publicationSearchFields,
  teachingCourseSearchFields,
  videoSearchFields,
} from '../src/lib/search-fields';
import type { Locale } from '../src/types/common.types';
import type { MediumPost } from '../src/types/medium.types';
import type { SearchIndexManifest, SearchSection } from '../src/types/search.types';
import type { YoutubeVideo } from '../src/types/youtube.types';

/* =========================================================================
  CONFIGURATION
========================================================================= */

/** Répertoire du script, pour résoudre les chemins. */
const scriptDir = dirname(fileURLToPath(import.meta.url));

/** Répertoire des index de recherche générés. */
const outputDir = resolve(scriptDir, '../src/data/search');

/** Cache local du modèle d'embedding. */
const cacheDir = resolve(scriptDir, '../.cache/transformers');

/** Langues indexées. */
const locales: Locale[] = ['fr', 'en', 'es'];

/** Nombre de textes encodés par lot. */
const batchSize = 8;

/** Articles Medium normalisés depuis le JSON brut. */
const mediumPosts = mediumPostsRaw as unknown as MediumPost[];

/** Vidéos YouTube normalisées depuis le JSON brut. */
const videos = videosRaw as unknown as YoutubeVideo[];

// Force le cache local et interdit les modèles distants non versionnés.
env.cacheDir = cacheDir;
env.allowLocalModels = false;
env.allowRemoteModels = true;

/* =========================================================================
  TYPES
========================================================================= */

/** Document indexé pour une section et une langue. */
type SearchDocument = {
  id: string;
  section: SearchSection;
  text: string;
};

/* =========================================================================
  HELPERS : corpus
========================================================================= */

/**
 * Construit les documents indexables d'une langue.
 *
 * @param locale - Langue de l'index.
 * @returns Les documents de toutes les sections.
 */
function buildDocuments(locale: Locale): SearchDocument[] {
  const documents: SearchDocument[] = [
    ...projects.map((project) => ({
      id: `projects:${project.id}`,
      section: 'projects' as const,
      text: buildSearchText(projectSearchFields(project, locale)),
    })),
    ...publications.map((publication) => ({
      id: `publications:${publication.id}`,
      section: 'publications' as const,
      text: buildSearchText(
        publicationSearchFields(publication, locale, publicationSummaries[publication.id]),
      ),
    })),
    ...filterMediumPosts(mediumPosts, locale).map((post) => ({
      id: `publications:${post.id}`,
      section: 'publications' as const,
      text: buildSearchText(mediumPostSearchFields(post, locale)),
    })),
    ...videos.map((video) => ({
      id: `videos:${video.id}`,
      section: 'videos' as const,
      text: buildSearchText(videoSearchFields(video, locale)),
    })),
    ...teaching.map((course) => ({
      id: `teaching:${course.id}`,
      section: 'teaching' as const,
      text: buildSearchText(teachingCourseSearchFields(course, locale)),
    })),
  ];

  return documents.sort(
    (left, right) =>
      left.section.localeCompare(right.section) || left.id.localeCompare(right.id),
  );
}

/**
 * Calcule le hash du texte indexé.
 *
 * @param text - Texte à hasher.
 * @returns Le hash SHA-256 hexadécimal.
 */
function hashText(text: string): string {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/* =========================================================================
  HELPERS : vecteurs
========================================================================= */

/**
 * Encode un vecteur float32 en base64.
 *
 * @param vector - Vecteur à encoder.
 * @returns La chaîne base64.
 */
function encodeVector(vector: Float32Array): string {
  return Buffer.from(vector.buffer, vector.byteOffset, vector.byteLength).toString('base64');
}

/**
 * Décode un vecteur float32 encodé en base64.
 *
 * @param value - Chaîne base64.
 * @returns Le vecteur décodé.
 */
function decodeVector(value: string): Float32Array {
  const source = Buffer.from(value, 'base64');
  const bytes = new Uint8Array(source.length);
  bytes.set(source);

  return new Float32Array(bytes.buffer);
}

/**
 * Calcule la moyenne du corpus.
 *
 * @param vectors - Vecteurs normalisés des documents.
 * @returns La moyenne, de même dimension.
 */
function meanVector(vectors: Float32Array[]): Float32Array {
  const mean = new Float32Array(EMBEDDING_CONFIG.dimension);

  for (const vector of vectors) {
    for (let index = 0; index < mean.length; index += 1) {
      mean[index] += vector[index] / vectors.length;
    }
  }

  return mean;
}

/* =========================================================================
  HELPERS : index existant
========================================================================= */

/**
 * Vérifie qu'un manifeste existant utilise la configuration courante.
 *
 * @param manifest - Manifeste relu.
 * @returns `true` si les vecteurs peuvent être réutilisés.
 */
function isCompatible(manifest: SearchIndexManifest): boolean {
  const current = EMBEDDING_CONFIG;

  return (
    manifest.version === 1 &&
    manifest.config.model === current.model &&
    manifest.config.revision === current.revision &&
    manifest.config.dtype === current.dtype &&
    manifest.config.dimension === current.dimension &&
    manifest.config.queryPrefix === current.queryPrefix &&
    manifest.config.passagePrefix === current.passagePrefix &&
    manifest.config.normalized === current.normalized &&
    manifest.config.centered === current.centered
  );
}

/**
 * Relit le manifeste existant d'une langue.
 *
 * @param locale - Langue de l'index.
 * @returns Le manifeste, ou `null` s'il est absent, illisible ou obsolète.
 */
async function readExisting(locale: Locale): Promise<SearchIndexManifest | null> {
  const path = resolve(outputDir, `${locale}.json`);
  let manifest: SearchIndexManifest | null = null;

  if (existsSync(path)) {
    try {
      const raw = await readFile(path, 'utf8');
      const parsed = JSON.parse(raw) as SearchIndexManifest;
      manifest = isCompatible(parsed) ? parsed : null;
    } catch (error) {
      console.warn(`Index ${locale} illisible — régénération complète`, error);
    }
  }

  return manifest;
}

/* =========================================================================
  HELPERS : encodage
========================================================================= */

/**
 * Encode des textes en vecteurs par lots.
 *
 * @param extractor - Pipeline d'extraction.
 * @param texts - Textes à encoder.
 * @returns Les vecteurs normalisés, dans l'ordre des textes.
 */
async function embedTexts(
  extractor: FeatureExtractionPipeline,
  texts: string[],
): Promise<Float32Array[]> {
  const vectors: Float32Array[] = [];

  for (let start = 0; start < texts.length; start += batchSize) {
    const batch = texts
      .slice(start, start + batchSize)
      .map((text) => `${EMBEDDING_CONFIG.passagePrefix}${text}`);
    const output = await extractor(batch, { pooling: 'mean', normalize: true });
    const data = output.data as Float32Array;

    for (let index = 0; index < batch.length; index += 1) {
      const offset = index * EMBEDDING_CONFIG.dimension;
      vectors.push(data.slice(offset, offset + EMBEDDING_CONFIG.dimension));
    }
  }

  return vectors;
}

/* =========================================================================
  HELPERS : génération
========================================================================= */

/**
 * Génère l'index d'une langue.
 *
 * @param extractor - Pipeline d'extraction.
 * @param locale - Langue à générer.
 * @param force - Ré-encode tous les documents quand `true`.
 */
async function buildLocale(
  extractor: FeatureExtractionPipeline,
  locale: Locale,
  force: boolean,
): Promise<void> {
  const documents = buildDocuments(locale);
  const hashes = documents.map((document) => hashText(document.text));
  const existing = force ? null : await readExisting(locale);
  const existingById = new Map(
    (existing?.documents ?? []).map((document) => [document.id, document]),
  );
  const vectors = new Map<string, Float32Array>();
  const missing: SearchDocument[] = [];

  for (let index = 0; index < documents.length; index += 1) {
    const document = documents[index];
    const previous = existingById.get(document.id);

    if (previous && previous.textHash === hashes[index] && previous.section === document.section) {
      const vector = decodeVector(previous.vector);

      if (vector.length === EMBEDDING_CONFIG.dimension) {
        vectors.set(document.id, vector);
      } else {
        missing.push(document);
      }
    } else {
      missing.push(document);
    }
  }

  if (missing.length > 0) {
    const embedded = await embedTexts(
      extractor,
      missing.map((document) => document.text),
    );

    for (let index = 0; index < missing.length; index += 1) {
      vectors.set(missing[index].id, embedded[index]);
    }
  }

  const ordered = documents.map((document) => {
    const vector = vectors.get(document.id);

    if (!vector) {
      throw new Error(`Vecteur manquant pour le document ${document.id}`);
    }

    return vector;
  });
  const manifest: SearchIndexManifest = {
    version: 1,
    generatedAt:
      missing.length > 0 || !existing ? new Date().toISOString() : existing.generatedAt,
    config: EMBEDDING_CONFIG,
    mean: encodeVector(meanVector(ordered)),
    documents: documents.map((document, index) => ({
      id: document.id,
      section: document.section,
      textHash: hashes[index],
      vector: encodeVector(ordered[index]),
    })),
  };

  await writeFile(
    resolve(outputDir, `${locale}.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );
  console.log(`${locale} : ${documents.length} documents, ${missing.length} ré-encodés`);
}

/* =========================================================================
  EXÉCUTION
========================================================================= */

/**
 * Point d'entrée du script : reconstruit les index de recherche.
 */
async function main(): Promise<void> {
  const force = process.argv.includes('--force');
  let lastProgress = -10;

  await mkdir(outputDir, { recursive: true });

  const extractor = await pipeline('feature-extraction', EMBEDDING_CONFIG.model, {
    dtype: EMBEDDING_CONFIG.dtype,
    revision: EMBEDDING_CONFIG.revision,
    progress_callback: (info) => {
      if (info.status === 'progress_total' && info.progress - lastProgress >= 10) {
        lastProgress = info.progress;
        console.log(`Modèle : ${Math.round(info.progress)} %`);
      }
    },
  });

  for (const locale of locales) {
    await buildLocale(extractor, locale, force);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Génération de l’index de recherche impossible — index précédent conservé', message);
  process.exitCode = 1;
});
