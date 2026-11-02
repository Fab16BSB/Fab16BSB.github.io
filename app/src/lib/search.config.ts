/* =========================================================================
  CONFIGURATION : recherche sémantique
  Modèle, préfixes et réglages de classement partagés build / navigateur.
========================================================================= */
import type { EmbeddingConfig } from '@/types/search.types';

/**
 * Configuration du modèle d'embedding.
 *
 * La révision est figée pour que les vecteurs du build et ceux de la requête
 * proviennent exactement du même modèle. Changer cette configuration impose de
 * régénérer l'index avec `npm run embed:search`.
 */
export const EMBEDDING_CONFIG: EmbeddingConfig = {
  model: 'Xenova/multilingual-e5-small',
  revision: '761b726dd34fb83930e26aab4e9ac3899aa1fa78',
  dtype: 'q8',
  dimension: 384,
  queryPrefix: 'query: ',
  passagePrefix: 'passage: ',
  normalized: true,
  centered: true,
};

/** Réglages de la fusion lexicale / sémantique. */
export const SEARCH_RANKING = {

  /** Poids du score lexical normalisé. */
  lexicalWeight: 0.55,

  /** Poids du score sémantique. */
  semanticWeight: 0.45,

  /** Cosinus centré minimal pour retenir un document purement sémantique. */
  semanticMin: 0.19,

  /** Nombre maximal de documents retenus par le seul score sémantique. */
  semanticTopK: 8,
};
