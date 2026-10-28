/* =========================================================================
  IMPORTS
========================================================================= */
import { useContext } from 'react';
import { I18nContext } from './I18nProvider';

/* =========================================================================
  HOOK : useI18n
  Récupère le contexte i18n courant : locale, `t` et `loc`.
========================================================================= */
export function useI18n() {
  const context = useContext(I18nContext);

  // Erreur explicite plutôt qu'un contexte null propagé
  if (!context) {
    throw new Error('useI18n doit être utilisé dans un I18nProvider');
  }

  return context;
}
