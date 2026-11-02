/* =========================================================================
  IMPORTS
========================================================================= */
import { env, pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers';
import { EMBEDDING_CONFIG } from '@/lib/search.config';
import type { EmbeddingRequest, EmbeddingResponse } from '@/types/search.types';

/* =========================================================================
  TYPES
========================================================================= */
/** Surface minimale du worker, sans dépendre de la lib WebWorker dans tsconfig. */
type WorkerScope = {
  postMessage: (message: EmbeddingResponse, transfer?: Transferable[]) => void;
  onmessage: ((event: MessageEvent<EmbeddingRequest>) => void) | null;
};

/* =========================================================================
  CONFIGURATION
========================================================================= */
const scope = self as unknown as WorkerScope;

env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;

/** Chargement unique du modèle, partagé par toutes les requêtes. */
let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

/* =========================================================================
  WORKER : embeddings
  Charge le modèle multilingue et calcule le vecteur de la requête.
========================================================================= */

/**
 * Charge le modèle d'embedding avec un état de progression.
 *
 * @returns Le pipeline prêt à encoder du texte.
 */
function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline('feature-extraction', EMBEDDING_CONFIG.model, {
      dtype: EMBEDDING_CONFIG.dtype,
      revision: EMBEDDING_CONFIG.revision,
      progress_callback: (info) => {
        if (info.status === 'progress_total') {
          scope.postMessage({
            type: 'status',
            status: 'loading',
            progress: Math.round(info.progress),
          });
        }
      },
    })
      .then((instance) => {
        scope.postMessage({ type: 'status', status: 'ready', progress: 100 });
        return instance;
      })
      .catch((error: unknown) => {
        extractorPromise = null;
        const message = error instanceof Error ? error.message : String(error);
        scope.postMessage({ type: 'error', message });
        throw error;
      });
  }

  return extractorPromise;
}

/**
 * Encode une requête et renvoie son vecteur normalisé.
 *
 * @param id - Identifiant de la requête, pour corréler la réponse.
 * @param text - Texte saisi par l'utilisateur.
 */
async function embed(id: number, text: string): Promise<void> {
  try {
    const extractor = await getExtractor();
    const output = await extractor(`${EMBEDDING_CONFIG.queryPrefix}${text}`, {
      pooling: 'mean',
      normalize: true,
    });
    const vector = new Float32Array(output.data as Float32Array);

    scope.postMessage({ type: 'result', id, vector }, [vector.buffer as ArrayBuffer]);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    scope.postMessage({ type: 'error', id, message });
  }
}

/* =========================================================================
  EXÉCUTION
========================================================================= */
scope.onmessage = (event) => {
  const message = event.data;

  if (message.type === 'warmup') {
    getExtractor().catch((error: unknown) => {
      const detail = error instanceof Error ? error.message : String(error);
      console.warn('Chargement du modèle de recherche sémantique impossible', detail);
    });
  } else {
    void embed(message.id, message.text);
  }
};
