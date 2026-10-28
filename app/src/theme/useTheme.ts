/* =========================================================================
  IMPORTS
========================================================================= */
import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

/* =========================================================================
  HOOK : useTheme
  Récupère le thème courant et ses actions de changement.
========================================================================= */
export function useTheme() {
  const context = useContext(ThemeContext);

  // Erreur explicite plutôt qu'un contexte null propagé.
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }

  return context;
}
