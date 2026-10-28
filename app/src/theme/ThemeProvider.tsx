/* =========================================================================
  IMPORTS
========================================================================= */
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Theme } from '@/types/common.types';
import { THEME_KEY, applyTheme, getInitialTheme, getNextTheme } from './theme.helpers';

/* =========================================================================
  TYPES ET CONSTANTES
========================================================================= */

/** Valeurs exposées par le contexte de thème. */
export type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

/* =========================================================================
  DÉFINITION DU CONTEXTE
========================================================================= */

/** Contexte de thème consommé par `useTheme`. */
export const ThemeContext = createContext<ThemeContextValue | null>(null);

/* =========================================================================
  PROVIDER : ThemeProvider
  Expose le thème courant et ses actions de changement.
========================================================================= */
export function ThemeProvider({ children }: { children: ReactNode }) {

  // Thème courant, lu dans le stockage au premier rendu.
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

  // Applique un thème précis.
  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  // Bascule entre clair et sombre.
  const toggleTheme = useCallback(() => {
    setThemeState((current) => getNextTheme(current));
  }, []);

  // Applique le thème et le persiste à chaque changement.
  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  // Valeur exposée aux consommateurs du contexte.
  const value = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
