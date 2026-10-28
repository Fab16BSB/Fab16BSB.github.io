/* =========================================================================
  IMPORTS
========================================================================= */
import type { Theme } from '@/types/common.types';


/* =========================================================================
  CONSTANTE
========================================================================= */

/** Clé de stockage du thème dans le localStorage. */
export const THEME_KEY = 'fp-theme';


/* =========================================================================
  HELPERS : theme — lecture et application du thème
========================================================================= */

/**
 * Lit le thème initial dans le stockage.
 *
 * @returns Le thème stocké, ou `dark` par défaut.
 */
export function getInitialTheme(): Theme {
  let theme: Theme = 'dark';

  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(THEME_KEY);

    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    }
  }

  return theme;
}

/**
 * Applique le thème au document et à la couleur de la barre du navigateur.
 *
 * @param theme - Thème à appliquer.
 */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');

  if (meta) {
    meta.setAttribute('content', theme === 'dark' ? '#070b14' : '#e7dfd1');
  }
}

/**
 * Retourne le thème opposé.
 *
 * @param theme - Thème courant.
 * @returns Le thème suivant.
 */
export function getNextTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}
