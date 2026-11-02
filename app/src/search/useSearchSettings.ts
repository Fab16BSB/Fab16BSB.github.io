/* =========================================================================
  IMPORTS
========================================================================= */
import { useContext } from 'react';
import { SearchContext } from './SearchProvider';

/* =========================================================================
  HOOK : useSearchSettings
  Récupère la préférence et l'état de la recherche sémantique.
========================================================================= */
export function useSearchSettings() {
  const context = useContext(SearchContext);

  // Erreur explicite plutôt qu'un contexte null propagé.
  if (!context) {
    throw new Error('useSearchSettings doit être utilisé dans un SearchProvider');
  }

  return context;
}
