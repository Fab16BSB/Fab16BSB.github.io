import type { Locale, Localized } from './common.types';

/**
 * Valeur exposée par le contexte i18n.
 *
 * @property {Locale} locale - Langue courante.
 * @property {(locale: Locale) => void} setLocale - Change la langue courante.
 * @property {(key: string, vars?: Record<string, string | number>) => string} t - Traduit une clé.
 * @property {(value: Localized) => string} loc - Retourne un texte localisé.
 */
export type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  loc: (value: Localized) => string;
};

/**
 * Langue proposée par le sélecteur.
 *
 * @property {Locale} code - Code de la langue.
 * @property {string} label - Nom affiché.
 * @property {string} short - Code court affiché.
 */
export type LanguageOption = {
  code: Locale;
  label: string;
  short: string;
};
