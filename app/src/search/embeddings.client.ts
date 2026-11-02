/* =========================================================================
  IMPORTS
========================================================================= */
import { logger } from '@/lib/logger';
import type {
  EmbeddingRequest,
  EmbeddingResponse,
  EmbeddingStatus,
} from '@/types/search.types';

/* =========================================================================
  TYPES ET CONSTANTES
========================================================================= */

/** État exposé aux composants React. */
export type EmbeddingSnapshot = {
  status: EmbeddingStatus;
  progress: number;
};

/** Promesse en attente de réponse du worker. */
type PendingRequest = {
  resolve: (vector: Float32Array) => void;
  reject: (error: Error) => void;
};

/** Taille maximale du cache de vecteurs de requête. */
const CACHE_LIMIT = 64;

/* =========================================================================
  ÉTAT PARTAGÉ
========================================================================= */
let snapshot: EmbeddingSnapshot = { status: 'idle', progress: 0 };
let worker: Worker | null = null;
let nextRequestId = 0;
const listeners = new Set<() => void>();
const pending = new Map<number, PendingRequest>();
const queryCache = new Map<string, Float32Array>();

/* =========================================================================
  CLIENT : embeddings
  Gère le worker, son état de chargement et le cache des requêtes.
========================================================================= */

/**
 * Publie un nouvel état auprès des abonnés.
 *
 * @param next - État à exposer.
 */
function publish(next: EmbeddingSnapshot): void {
  snapshot = next;

  for (const listener of listeners) {
    listener();
  }
}

/**
 * Abonne un composant aux changements d'état.
 *
 * @param listener - Callback appelé à chaque changement.
 * @returns La fonction de désabonnement.
 */
export function subscribeEmbeddingStatus(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

/**
 * Retourne l'état courant, pour `useSyncExternalStore`.
 *
 * @returns L'instantané courant.
 */
export function getEmbeddingStatus(): EmbeddingSnapshot {
  return snapshot;
}

/**
 * Indique si le navigateur peut exécuter le modèle.
 *
 * @returns `true` si un worker et WebAssembly sont disponibles.
 */
export function supportsEmbeddings(): boolean {
  return typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined';
}


/**
 * Rejette toutes les requêtes en attente.
 *
 * @param error - Erreur transmise à chaque promesse.
 */
function rejectPending(error: Error): void {
  for (const request of pending.values()) {
    request.reject(error);
  }

  pending.clear();
}

/**
 * Ferme le worker courant.
 */
function terminateWorker(): void {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

/**
 * Traite les messages du worker.
 *
 * @param event - Message reçu.
 */
function handleMessage(event: MessageEvent<EmbeddingResponse>): void {
  const message = event.data;

  if (message.type === 'status') {
    publish({ status: message.status, progress: message.progress });
  } else if (message.type === 'result') {
    const request = pending.get(message.id);

    if (request) {
      pending.delete(message.id);
      request.resolve(message.vector);
    }
  } else if (typeof message.id === 'number') {
    const request = pending.get(message.id);

    if (request) {
      pending.delete(message.id);
      request.reject(new Error(message.message));
    }
  } else {
    rejectPending(new Error(message.message));
    terminateWorker();
    publish({ status: 'error', progress: 0 });
  }
}

/**
 * Traite une erreur fatale du worker.
 *
 * @param event - Erreur du worker.
 */
function handleWorkerError(event: ErrorEvent): void {
  const detail = event.message || 'Erreur inconnue du worker d’embedding';
  logger.error('Le worker de recherche sémantique a échoué — repli sur la recherche lexicale', detail);
  rejectPending(new Error(detail));
  terminateWorker();
  publish({ status: 'error', progress: 0 });
}

/**
 * Crée le worker à la première utilisation.
 *
 * @returns Le worker prêt à recevoir des messages.
 */
function ensureWorker(): Worker {
  if (!worker) {
    worker = new Worker(new URL('./embeddings.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = handleMessage;
    worker.onerror = handleWorkerError;
  }

  return worker;
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Lance le téléchargement du modèle, sans requête utilisateur.
 */
export function warmupEmbedding(): void {
  if (!supportsEmbeddings()) {
    publish({ status: 'unsupported', progress: 0 });
  } else if (snapshot.status !== 'ready' && snapshot.status !== 'loading') {
    try {
      if (snapshot.status === 'error') {
        resetEmbeddingWorker();
      }

      const current = ensureWorker();
      publish({ status: 'loading', progress: 0 });
      current.postMessage({ type: 'warmup' } satisfies EmbeddingRequest);
    } catch (error) {
      logger.error(
        'Création du worker de recherche sémantique impossible — repli sur le lexical',
        error,
      );
      publish({ status: 'error', progress: 0 });
    }
  }
}

/**
 * Encode une requête avec le modèle, avec cache mémoire.
 *
 * @param text - Requête saisie.
 * @returns Le vecteur normalisé de la requête.
 */
export function embedQuery(text: string): Promise<Float32Array> {
  const key = text.trim();
  const cached = queryCache.get(key);
  let result: Promise<Float32Array>;

  if (cached) {
    result = Promise.resolve(cached);
  } else {
    result = new Promise<Float32Array>((resolve, reject) => {
      try {
        const current = ensureWorker();
        const id = nextRequestId;
        nextRequestId += 1;

        pending.set(id, {
          resolve: (vector) => {
            if (queryCache.size >= CACHE_LIMIT) {
              const oldest = queryCache.keys().next().value;

              if (oldest !== undefined) {
                queryCache.delete(oldest);
              }
            }

            queryCache.set(key, vector);
            resolve(vector);
          },
          reject,
        });

        current.postMessage({ type: 'embed', id, text: key } satisfies EmbeddingRequest);
      } catch (error) {
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  return result;
}

/**
 * Réinitialise le worker après une erreur, pour permettre une nouvelle tentative.
 */
export function resetEmbeddingWorker(): void {
  rejectPending(new Error('Modèle de recherche sémantique réinitialisé'));
  terminateWorker();
  queryCache.clear();
  publish({ status: 'idle', progress: 0 });
}
