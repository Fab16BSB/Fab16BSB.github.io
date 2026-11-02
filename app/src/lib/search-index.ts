/* =========================================================================
  HELPERS : index sémantique côté navigateur
  Chargement paresseux des vecteurs et calcul du cosinus.
========================================================================= */
import { EMBEDDING_CONFIG } from '@/lib/search.config';
import type { Locale } from '@/types/common.types';
import type {
  SearchIndex,
  SearchIndexManifest,
  SearchSection,
  SearchSectionIndex,
} from '@/types/search.types';

/* =========================================================================
  TYPES ET CONSTANTES
========================================================================= */

/** Chargeur d'index par langue, découpé en chunks par Vite. */
const loaders: Record<Locale, () => Promise<{ default: SearchIndexManifest }>> = {
  fr: () => import('@/data/search/fr.json') as Promise<{ default: SearchIndexManifest }>,
  en: () => import('@/data/search/en.json') as Promise<{ default: SearchIndexManifest }>,
  es: () => import('@/data/search/es.json') as Promise<{ default: SearchIndexManifest }>,
};

/** Index déjà chargés, pour ne télécharger chaque langue qu'une fois. */
const cache = new Map<Locale, Promise<SearchIndex>>();

/* =========================================================================
  HELPERS : décodage et normalisation
========================================================================= */

/**
 * Décode un vecteur float32 encodé en base64.
 *
 * @param value - Chaîne base64 produite par le script de build.
 * @returns Le vecteur décodé.
 */
function decodeVector(value: string): Float32Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Float32Array(bytes.buffer);
}

/**
 * Centre un vecteur sur la moyenne du corpus puis le normalise.
 *
 * Le centrage réduit l'anisotropie des embeddings : sans lui, deux textes sans
 * rapport obtiennent un cosinus très élevé et le seuil perd tout sens.
 *
 * @param vector - Vecteur brut normalisé.
 * @param mean - Moyenne du corpus.
 * @returns Le vecteur centré et de norme 1.
 */
function centerVector(vector: Float32Array, mean: Float32Array): Float32Array {
  const centered = new Float32Array(vector.length);
  let norm = 0;

  for (let index = 0; index < vector.length; index += 1) {
    const value = vector[index] - mean[index];
    centered[index] = value;
    norm += value * value;
  }

  const scale = norm > 0 ? 1 / Math.sqrt(norm) : 0;

  for (let index = 0; index < centered.length; index += 1) {
    centered[index] *= scale;
  }

  return centered;
}

/**
 * Crée les quatre sections vides d'un index.
 *
 * @returns Un index de sections initialisé.
 */
function emptySections(): Record<SearchSection, SearchSectionIndex> {
  return {
    projects: { ids: [], vectors: [] },
    publications: { ids: [], vectors: [] },
    videos: { ids: [], vectors: [] },
    teaching: { ids: [], vectors: [] },
  };
}

/**
 * Vérifie que le manifeste correspond au modèle configuré.
 *
 * @param manifest - Manifeste chargé.
 * @throws Si le modèle, la révision ou la dimension diffèrent.
 */
function validateManifest(manifest: SearchIndexManifest): void {
  const compatible =
    manifest.version === 1 &&
    manifest.config.model === EMBEDDING_CONFIG.model &&
    manifest.config.revision === EMBEDDING_CONFIG.revision &&
    manifest.config.dtype === EMBEDDING_CONFIG.dtype &&
    manifest.config.dimension === EMBEDDING_CONFIG.dimension &&
    manifest.config.queryPrefix === EMBEDDING_CONFIG.queryPrefix &&
    manifest.config.passagePrefix === EMBEDDING_CONFIG.passagePrefix &&
    manifest.config.normalized === EMBEDDING_CONFIG.normalized &&
    manifest.config.centered === EMBEDDING_CONFIG.centered;

  if (!compatible) {
    throw new Error(
      'Index de recherche incompatible avec la configuration du modèle — relancer npm run embed:search',
    );
  }
}

/**
 * Décode un manifeste en index exploitable.
 *
 * @param locale - Langue de l'index.
 * @param manifest - Manifeste chargé.
 * @returns L'index avec les vecteurs centrés.
 */
function buildIndex(locale: Locale, manifest: SearchIndexManifest): SearchIndex {
  validateManifest(manifest);
  const mean = decodeVector(manifest.mean);
  const sections = emptySections();

  for (const document of manifest.documents) {
    const vector = centerVector(decodeVector(document.vector), mean);
    sections[document.section].ids.push(document.id);
    sections[document.section].vectors.push(vector);
  }

  return { locale, config: manifest.config, mean, sections };
}

/* =========================================================================
  HELPERS : chargement et score
========================================================================= */

/**
 * Charge l'index d'une langue, avec cache mémoire.
 *
 * @param locale - Langue demandée.
 * @returns L'index prêt à l'emploi.
 */
export function loadSearchIndex(locale: Locale): Promise<SearchIndex> {
  let promise = cache.get(locale);

  if (!promise) {
    promise = loaders[locale]().then((module) => buildIndex(locale, module.default));
    promise = promise.catch((error: unknown) => {
      cache.delete(locale);
      throw error;
    });
    cache.set(locale, promise);
  }

  return promise;
}

/**
 * Calcule le cosinus entre la requête et chaque document d'une section.
 *
 * @param index - Index chargé.
 * @param section - Section à scorer.
 * @param query - Vecteur brut normalisé de la requête.
 * @returns Les scores par identifiant de document.
 * @throws Si la dimension du vecteur de requête ne correspond pas à l'index.
 */
export function computeSemanticScores(
  index: SearchIndex,
  section: SearchSection,
  query: Float32Array,
): Map<string, number> {
  if (query.length !== index.config.dimension) {
    throw new Error('Vecteur de requête incompatible avec l’index de recherche');
  }

  const centeredQuery = centerVector(query, index.mean);
  const sectionIndex = index.sections[section];
  const scores = new Map<string, number>();

  for (let item = 0; item < sectionIndex.ids.length; item += 1) {
    const vector = sectionIndex.vectors[item];
    let dot = 0;

    for (let dimension = 0; dimension < vector.length; dimension += 1) {
      dot += centeredQuery[dimension] * vector[dimension];
    }

    scores.set(sectionIndex.ids[item], dot);
  }

  return scores;
}
