/* =========================================================================
   HELPERS : preuves du parcours — fonctions pures
   Récence, sélection des meilleurs contenus et titre de publication.
========================================================================= */
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import type { Locale } from '@/types/common.types';
import type { Publication } from '@/types/publication.types';
import type { VisitHighlight } from '@/types/visit.types';
import type { VisitEvidenceEntry } from './visit-evidence.types';

/**
 * Donne un score de récence.
 *
 * @param year - Année à valoriser.
 * @returns Un score croissant avec l'année.
 */
export function recencyScore(year: number): number {
  return year > 0 ? year * VISIT_CONFIG.recencyYearWeight : 0;
}

/**
 * Donne l'année de fin effective d'une expérience.
 *
 * @param end - Année de fin ou `present`.
 * @param referenceYear - Année de référence.
 * @returns L'année de fin.
 */
export function endYear(
  end: number | 'present',
  referenceYear: number,
): number {
  return end === 'present' ? referenceYear : end;
}

/**
 * Garde les meilleurs contenus d'une étape.
 *
 * @param entries - Contenus scorés.
 * @param limit - Nombre maximal de contenus.
 * @returns Les contenus retenus, du plus fort au plus faible.
 */
export function pickHighlights(
  entries: VisitEvidenceEntry[],
  limit: number,
): VisitHighlight[] {
  const result = entries
    .filter((entry) => entry.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        left.highlight.label.localeCompare(right.highlight.label),
    )
    .slice(0, limit)
    .map((entry) => entry.highlight);

  return result;
}

/**
 * Retourne le titre de publication le plus lisible pour la langue.
 *
 * @param publication - Publication à présenter.
 * @param locale - Langue de lecture.
 * @returns Le titre localisé lorsqu'il existe, sinon le titre original.
 */
export function publicationTitle(
  publication: Publication,
  locale: Locale,
): string {
  const language = locale === 'fr' ? 'fr' : 'en';
  const version =
    publication.versions.find((item) => item.language === language) ??
    publication.versions[0];
  const result = version?.title ?? publication.id;

  return result;
}
