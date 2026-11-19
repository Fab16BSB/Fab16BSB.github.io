/* =========================================================================
  HELPERS : dates — fonctions pures
  Formatage localisé, extraction d'année et listes d'années.
========================================================================= */
import type { Locale } from '@/types/common.types';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Locale `Intl` utilisée pour chaque langue du site. */
const DATE_LOCALES: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
  es: 'es-ES',
};

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Formate une date ISO pour l'affichage.
 *
 * @param value - Date ISO.
 * @param locale - Langue courante.
 * @param month - Longueur du mois affiché.
 * @returns La date formatée, ou la valeur brute si elle est invalide.
 */
export function formatDisplayDate(
  value: string,
  locale: Locale,
  month: 'short' | 'long' = 'short',
): string {
  const date = new Date(value);
  let result = value;

  if (!Number.isNaN(date.getTime())) {
    result = new Intl.DateTimeFormat(DATE_LOCALES[locale], {
      day: 'numeric',
      month,
      year: 'numeric',
    }).format(date);
  }

  return result;
}

/**
 * Extrait l'année d'une date ISO.
 *
 * @param value - Date ISO.
 * @returns Les quatre premiers caractères.
 */
export function extractYear(value: string): string {
  return value.slice(0, 4);
}

/**
 * Récupère la dernière année à quatre chiffres d'un texte.
 *
 * @param value - Texte contenant une ou plusieurs années.
 * @returns La dernière année, ou 0.
 */
export function parseYear(value: string): number {
  const years = value.match(/\d{4}/g);

  return years ? Math.max(...years.map((year) => Number(year))) : 0;
}

/**
 * Liste les années uniques, de la plus récente à la plus ancienne.
 *
 * @param values - Années à dédoublonner.
 * @returns Les années triées.
 */
export function collectYears(values: string[]): string[] {
  return [...new Set(values)].sort(
    (left, right) => Number(right) - Number(left),
  );
}
