/* =========================================================================
   PREUVES : publications — fonctions pures
   Une publication compte par sa récence, ses versions et son thème.
========================================================================= */
import { publicationSummaries } from '@/data/content/publication-summaries.data';
import { publications } from '@/data/content/publications.data';
import { visitTarget } from '@/lib/visit/visit-targets';
import { detectThemes, getThemeScore } from '@/lib/visit/visit-themes';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import { parseYear } from '@/lib/date.helpers';
import {
  pickHighlights,
  publicationTitle,
  recencyScore,
} from './visit-evidence.helpers';
import type { VisitEvidenceEntry } from './visit-evidence.types';
import type { Locale } from '@/types/common.types';
import type {
  VisitHighlight,
  VisitPersonaDefinition,
} from '@/types/visit.types';

/**
 * Retourne les publications à mettre en avant.
 *
 * @param locale - Langue de lecture.
 * @param limit - Nombre maximal de contenus.
 * @param persona - Profil de lecture.
 * @returns Les publications retenues.
 */
export function getPublicationHighlights(
  locale: Locale,
  limit: number,
  persona: VisitPersonaDefinition,
): VisitHighlight[] {
  const entries: VisitEvidenceEntry[] = publications.map((publication) => {
    const summary = publicationSummaries[publication.id];
    const points = summary?.points[locale];
    const texts = [
      ...publication.versions.map((version) => version.title),
      ...publication.versions.map((version) => version.abstract),
      publication.venue[locale],
      publication.year,
      summary?.keywords[locale].join(' ') ?? '',
      points
        ? `${points.context} ${points.problem} ${points.solution}`
        : '',
    ];
    const base =
      recencyScore(parseYear(publication.year)) +
      publication.versions.length;
    const themeScore = getThemeScore(
      detectThemes(texts),
      persona.themes,
    );

    return {
      score: base + themeScore * VISIT_CONFIG.evidenceThemeWeight,
      themeScore,
      highlight: {
        label: publicationTitle(publication, locale),
        detail: `${publication.year} · ${publication.venue[locale]}`,
        target: visitTarget('publication', publication.id),
      },
    };
  });
  const filtered =
    persona.themes.length > 0
      ? entries.filter((entry) => entry.themeScore > 0)
      : entries;

  return pickHighlights(filtered, limit);
}
