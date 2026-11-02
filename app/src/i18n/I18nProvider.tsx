/* =========================================================================
  IMPORTS
========================================================================= */
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { localizedSiteMeta } from '@/data/siteMeta.data';
import type { Locale, Localized } from '@/types/common.types';
import type { I18nContextValue } from '@/types/i18n.types';
import fr from './locales/fr.json';
import en from './locales/en.json';
import es from './locales/es.json';
import {
  DEFAULT_LOCALE,
  LANGUAGE_KEY,
  detectLocale,
  getByPath,
  interpolate,
  localized,
} from './i18n.helpers';

/* =========================================================================
  TYPES ET CONSTANTES
========================================================================= */
type Messages = typeof fr;

/** Dictionnaires de traduction par langue. */
const dictionaries: Record<Locale, Messages> = { fr, en, es };

/* =========================================================================
  DÉFINITION DU CONTEXTE
========================================================================= */

/** Contexte i18n consommé par `useI18n`. */
export const I18nContext = createContext<I18nContextValue | null>(null);

/* =========================================================================
  PROVIDER : I18nProvider
  Expose la langue courante et les helpers de traduction.
========================================================================= */
export function I18nProvider({ children }: { children: ReactNode }) {

  // Langue courante, détectée au premier rendu.
  const [locale, setLocaleState] = useState<Locale>(() => detectLocale());

  // Change la langue courante.
  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  // Synchronise le stockage et les métadonnées du document.
  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.title = localizedSiteMeta[locale].title;

    const description = document.querySelector('meta[name="description"]');

    if (description) {
      description.setAttribute('content', localizedSiteMeta[locale].description);
    }
  }, [locale]);

  // Traduit une clé dans une langue donnée, avec repli sur le français.
  const tFor = useCallback((target: Locale, key: string, vars?: Record<string, string | number>) => {
    const value =
      getByPath(dictionaries[target], key) ??
      getByPath(dictionaries[DEFAULT_LOCALE], key) ??
      key;

    return interpolate(value, vars);
  }, []);

  // Traduit une clé dans la langue courante.
  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => tFor(locale, key, vars),
    [locale, tFor],
  );

  // Retourne un texte localisé.
  const loc = useCallback((value: Localized) => localized(value, locale), [locale]);

  // Valeur exposée aux consommateurs du contexte.
  const context = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, tFor, loc }),
    [locale, setLocale, t, tFor, loc],
  );

  return <I18nContext.Provider value={context}>{children}</I18nContext.Provider>;
}
