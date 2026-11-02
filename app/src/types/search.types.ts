import type { Locale } from './common.types';

/** Section du site disposant d'une barre de recherche. */
export type SearchSection = 'projects' | 'publications' | 'videos' | 'teaching';

/** Précision utilisée pour le modèle d'embedding. */
export type EmbeddingDtype = 'q8' | 'fp16' | 'fp32';

/** État de chargement du modèle d'embedding. */
export type EmbeddingStatus = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported';

/** Message envoyé au worker d'embedding. */
export type EmbeddingRequest =
  | { type: 'warmup' }
  | { type: 'embed'; id: number; text: string };

/** Message renvoyé par le worker d'embedding. */
export type EmbeddingResponse =
  | { type: 'status'; status: 'loading' | 'ready'; progress: number }
  | { type: 'result'; id: number; vector: Float32Array }
  | { type: 'error'; id?: number; message: string };

/** Champs textuels indexés d'un document. */
export type SearchDocumentFields = {
  title: string;
  tags: string;
  body: string;
};

/** Document indexé par le moteur de recherche. */
export type SearchDocument = SearchDocumentFields & {
  id: string;
};

/** Résultat lexical renvoyé par le moteur de recherche. */
export type LexicalMatch = {
  id: string;
  score: number;
};

/** Configuration du modèle d'embedding, partagée par le build et le navigateur. */
export type EmbeddingConfig = {
  model: string;
  revision: string;
  dtype: EmbeddingDtype;
  dimension: number;
  queryPrefix: string;
  passagePrefix: string;
  normalized: boolean;
  centered: boolean;
};

/** Document vectorisé du manifeste d'index. */
export type SearchIndexDocument = {
  id: string;
  section: SearchSection;
  textHash: string;
  vector: string;
};

/** Manifeste d'index pour une langue. */
export type SearchIndexManifest = {
  version: 1;
  generatedAt: string;
  config: EmbeddingConfig;
  mean: string;
  documents: SearchIndexDocument[];
};

/** Vecteurs d'une section, prêts pour le cosinus. */
export type SearchSectionIndex = {
  ids: string[];
  vectors: Float32Array[];
};

/** Index décodé en mémoire pour une langue. */
export type SearchIndex = {
  locale: Locale;
  config: EmbeddingConfig;
  mean: Float32Array;
  sections: Record<SearchSection, SearchSectionIndex>;
};
