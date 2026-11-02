/* =========================================================================
  IMPORTS
========================================================================= */
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '@/hooks/ui/useLocalStorage';
import { SemanticDialog } from '@/components/ui/SemanticSearch/SemanticDialog';
import type { EmbeddingStatus } from '@/types/search.types';
import { detectSemanticCapability, type SemanticCapability } from './capabilities';
import {
  getEmbeddingStatus,
  resetEmbeddingWorker,
  subscribeEmbeddingStatus,
  warmupEmbedding,
} from './embeddings.client';

/* =========================================================================
  TYPES ET CONSTANTES
========================================================================= */

/** Clé de persistance de la préférence de recherche approfondie. */
const SEMANTIC_KEY = 'fp-search-semantic';

/** Valeurs exposées par le contexte de recherche. */
export type SearchContextValue = {
  semanticEnabled: boolean;
  semanticStatus: EmbeddingStatus;
  semanticProgress: number;
  capability: SemanticCapability;
  promptOpen: boolean;
  requestSemantic: () => void;
  confirmSemantic: () => void;
  cancelSemantic: () => void;
  disableSemantic: () => void;
  retrySemantic: () => void;
};

/* =========================================================================
  DÉFINITION DU CONTEXTE
========================================================================= */

/** Contexte de recherche consommé par `useSearchSettings`. */
export const SearchContext = createContext<SearchContextValue | null>(null);

/* =========================================================================
  PROVIDER : SearchProvider
  Expose la préférence de recherche approfondie et son état de chargement.
========================================================================= */
export function SearchProvider({ children }: { children: ReactNode }) {

  // Préférence globale, partagée par toutes les barres de recherche.
  const [semanticEnabled, setSemanticEnabled] = useLocalStorage<boolean>(SEMANTIC_KEY, false);

  // Demande de confirmation affichée avant le téléchargement.
  const [promptOpen, setPromptOpen] = useState(false);

  // Capacité de l'appareil, calculée une seule fois au montage.
  const capability = useMemo(() => detectSemanticCapability(), []);

  // État du worker, mis à jour hors de React.
  const embedding = useSyncExternalStore(
    subscribeEmbeddingStatus,
    getEmbeddingStatus,
    getEmbeddingStatus,
  );

  // Lance le téléchargement dès qu'une préférence active est retrouvée.
  useEffect(() => {
    if (semanticEnabled && capability.supported) {
      warmupEmbedding();
    }
  }, [capability.supported, semanticEnabled]);

  // Ouvre la confirmation de téléchargement.
  const requestSemantic = useCallback(() => {
    if (capability.supported) {
      setPromptOpen(true);
    }
  }, [capability.supported]);

  // Active la recherche approfondie après confirmation.
  const confirmSemantic = useCallback(() => {
    setPromptOpen(false);
    setSemanticEnabled(true);
  }, [setSemanticEnabled]);

  // Ferme la confirmation sans rien changer.
  const cancelSemantic = useCallback(() => {
    setPromptOpen(false);
  }, []);

  // Désactive la recherche approfondie sans supprimer le modèle du cache.
  const disableSemantic = useCallback(() => {
    if (embedding.status === 'loading') {
      resetEmbeddingWorker();
    }

    setSemanticEnabled(false);
  }, [embedding.status, setSemanticEnabled]);

  // Relance un chargement après une erreur.
  const retrySemantic = useCallback(() => {
    resetEmbeddingWorker();
    warmupEmbedding();
  }, []);

  // Valeur exposée aux consommateurs du contexte.
  const value = useMemo<SearchContextValue>(
    () => ({
      semanticEnabled,
      semanticStatus: embedding.status,
      semanticProgress: embedding.progress,
      capability,
      promptOpen,
      requestSemantic,
      confirmSemantic,
      cancelSemantic,
      disableSemantic,
      retrySemantic,
    }),
    [
      capability,
      cancelSemantic,
      confirmSemantic,
      disableSemantic,
      embedding.progress,
      embedding.status,
      promptOpen,
      requestSemantic,
      retrySemantic,
      semanticEnabled,
    ],
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
      <SemanticDialog />
    </SearchContext.Provider>
  );
}
