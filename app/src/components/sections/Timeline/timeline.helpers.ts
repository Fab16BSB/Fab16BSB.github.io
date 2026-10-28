/* =========================================================================
  IMPORTS
========================================================================= */
import type { Experience, ExperienceType } from '@/types/experience.types';
import type { Localized } from '@/types/common.types';


/* =========================================================================
  CONSTANTES
========================================================================= */

/** Libellé traduit de chaque type d'expérience. */
export const experienceTypeLabels: Record<ExperienceType, Localized> = {
  freelance: { fr: 'Freelance', en: 'Freelance', es: 'Freelance' },
  cdd: { fr: 'CDD', en: 'Fixed-term', es: 'CDD' },
  thesis: { fr: 'Thèse CIFRE', en: 'CIFRE PhD', es: 'Tesis CIFRE' },
  internship: { fr: 'Stage', en: 'Internship', es: 'Prácticas' },
};


/* =========================================================================
  HELPERS : timeline — fonctions pures
  Libellés, périodes et tri du parcours.
========================================================================= */

/**
 * Formate une période d'expérience ou de formation.
 *
 * @param start - Année de début.
 * @param end - Année de fin, ou `present`.
 * @param presentLabel - Libellé de l'année en cours.
 * @returns L'année seule ou la plage formatée.
 */
export function formatRange(start: number, end: number | 'present', presentLabel: string): string {
  let range = `${start} — ${end}`;

  if (end === 'present') {
    range = `${start} — ${presentLabel}`;
  } else if (end === start) {
    range = String(start);
  }

  return range;
}

/**
 * Convertit une fin de période en valeur comparable.
 *
 * @param end - Année de fin, ou `present`.
 * @returns L'année, ou l'infini pour une expérience en cours.
 */
function endValue(end: number | 'present'): number {
  return end === 'present' ? Number.POSITIVE_INFINITY : end;
}

/**
 * Trie les expériences de la plus récente à la plus ancienne.
 *
 * @param items - Expériences à trier.
 * @returns Une copie triée.
 */
export function sortExperiences(items: Experience[]): Experience[] {
  return [...items].sort((a, b) => b.start - a.start || endValue(b.end) - endValue(a.end));
}
