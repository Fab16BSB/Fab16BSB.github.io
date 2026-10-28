/* =========================================================================
  IMPORTS
========================================================================= */
import type { Locale, Localized } from '@/types/common.types';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Langues supportées par le site. */
export const SUPPORTED_LOCALES: Locale[] = ['fr', 'en', 'es'];

/** Langue utilisée par défaut. */
export const DEFAULT_LOCALE: Locale = 'fr';

/** Clé de stockage de la langue dans le localStorage. */
export const LANGUAGE_KEY = 'fp-lang';

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Vérifie qu'une valeur est une locale supportée.
 *
 * @param value - Valeur à vérifier.
 * @returns `true` si la valeur est une locale supportée.
 */
export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'fr' || value === 'en' || value === 'es';
}

/**
 * Détecte la locale à utiliser :
 * 1. langue stockée dans le localStorage ;
 * 2. langue du navigateur ;
 * 3. langue par défaut.
 *
 * @returns La locale détectée.
 */
export function detectLocale(): Locale {
  let detected: Locale = DEFAULT_LOCALE;

  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);

    if (isLocale(stored)) {
      detected = stored;
    } else {
      const candidates = window.navigator.languages ?? [window.navigator.language];
      const browserLocale = candidates
        .map((candidate) => candidate.split('-')[0]?.toLowerCase())
        .find((base): base is Locale => isLocale(base));

      if (browserLocale) {
        detected = browserLocale;
      }
    }
  }

  return detected;
}

/**
 * Retourne la valeur traduite pour la locale demandée, avec fallback sur le français.
 *
 * @param value - Texte disponible en FR / EN / ES.
 * @param locale - Langue demandée.
 * @returns Le texte traduit, ou le texte français si la traduction manque.
 */
export function localized(value: Localized, locale: Locale): string {
  return value[locale] ?? value.fr;
}

/**
 * Résout une clé de traduction de type `section.key` dans un objet.
 *
 * @param source - Dictionnaire de traductions.
 * @param path - Chemin de la clé, par exemple `nav.about`.
 * @returns La valeur texte trouvée, ou `undefined`.
 */
export function getByPath(source: unknown, path: string): string | undefined {
  let current: unknown = source;
  let result: string | undefined;

  const pathIsValid = path.split('.').every((part) => {
    const next =
      current && typeof current === 'object' && part in current
        ? (current as Record<string, unknown>)[part]
        : undefined;
    current = next;

    return current !== undefined;
  });

  if (pathIsValid && typeof current === 'string') {
    result = current;
  }

  return result;
}

/**
 * Remplace les variables `{nom}` d'un texte traduit.
 *
 * @param value - Texte contenant éventuellement des variables.
 * @param vars - Variables à injecter.
 * @returns Le texte interpolé.
 */
export function interpolate(value: string, vars?: Record<string, string | number>): string {
  let result = value;

  if (vars) {
    result = value.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? `{${key}}`));
  }

  return result;
}
