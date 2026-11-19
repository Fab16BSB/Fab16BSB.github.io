/* =========================================================================
   HELPERS : formatage de l'ancienneté — fonctions pures
   Libellés partagés par le parcours de visite et la fiche compétence.
========================================================================= */
import type { SkillTenureSummary } from '@/types/skill.types';

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Signature minimale du traducteur i18n. */
export type TenureTranslate = (
  key: string,
  vars?: Record<string, string | number>,
) => string;

/* ─────────────────────────────────────────────────────────────────────────
   FORMATAGE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Formate un nombre d'années avec la bonne unité.
 *
 * @param count - Nombre d'années.
 * @param t - Fonction de traduction.
 * @returns Le libellé localisé.
 */
export function formatTenureYears(
  count: number,
  t: TenureTranslate,
): string {
  let result = t('skills.tenure.lessThanOne');

  if (count === 1) {
    result = t('skills.tenure.year', { count });
  } else if (count > 1) {
    result = t('skills.tenure.years', { count });
  }

  return result;
}

/**
 * Formate l'ancienneté compacte affichée dans une étape.
 *
 * @param tenure - Ancienneté calculée.
 * @param t - Fonction de traduction.
 * @returns Le libellé compact.
 */
export function formatTenureCompact(
  tenure: SkillTenureSummary,
  t: TenureTranslate,
): string {
  let result = t('skills.tenure.undated');

  if (
    tenure.firstYear !== null &&
    tenure.lastYear !== null &&
    tenure.spanYears !== null
  ) {
    if (tenure.spanYears === 0) {
      result = t('skills.tenure.singleYear', { year: tenure.firstYear });
    } else {
      result = t('skills.tenure.compact', {
        first: tenure.firstYear,
        last: tenure.lastYear,
        years: formatTenureYears(tenure.spanYears, t),
      });
    }
  }

  return result;
}

/**
 * Formate une plage d'années courte, sans traduction.
 *
 * @param start - Année de début.
 * @param end - Année de fin ou `present`.
 * @param separator - Séparateur entre les deux années.
 * @returns La plage, ou l'année seule.
 */
export function formatYearRange(
  start: number,
  end: number | 'present',
  separator = '–',
): string {
  let result = String(start);

  if (end === 'present') {
    result = `${start}${separator}...`;
  } else if (end !== start) {
    result = `${start}${separator}${end}`;
  }

  return result;
}
