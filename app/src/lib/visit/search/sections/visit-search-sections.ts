/* =========================================================================
  CLASSEMENT : requête → sections scorées
  Les thèmes filtrent, le graphe pondère et la recherche fournit le score.
========================================================================= */
import { getSectionThemes } from '@/lib/visit/search/corpus/visit-search-corpus';
import { buildSectionRank } from '@/lib/visit/search/sections/visit-search-sections.entries';
import {
  collectSectionMatches,
  isVideoSectionCovered,
} from '@/lib/visit/search/sections/visit-search-sections.matches';
import type { VisitOfferGraphSignals } from '@/lib/visit/visit-graph';
import type {
  VisitSearchMatch,
  VisitSearchMeta,
  VisitSearchSection,
} from '@/types/visit-search.types';
import type {
  VisitPersonaDefinition,
  VisitSectionId,
} from '@/types/visit.types';

/**
 * Classe les sections à partir des correspondances brutes.
 *
 * @param rawMatches - Correspondances de la recherche.
 * @param persona - Profil de lecture.
 * @param referenceYear - Année de référence.
 * @param byId - Métadonnées indexées.
 * @param offerGraph - Signaux du graphe pour l'offre.
 * @returns Les sections classées.
 */
export function rankVisitSections(
  rawMatches: VisitSearchMatch[],
  persona: VisitPersonaDefinition,
  referenceYear: number,
  byId: Map<string, VisitSearchMeta>,
  offerGraph: VisitOfferGraphSignals,
): VisitSearchSection[] {
  const allowedSections = new Set<VisitSectionId>(
    persona.sectionOrder.filter((id) => id !== 'about'),
  );
  const { strongEntries, weakMatches, sectionTerms } =
    collectSectionMatches(
      rawMatches,
      persona,
      referenceYear,
      offerGraph,
      allowedSections,
    );
  const coveredVideos = isVideoSectionCovered(
    rawMatches,
    sectionTerms,
    allowedSections,
  );
  const sectionIds = new Set<VisitSectionId>([
    ...strongEntries.keys(),
    ...weakMatches.keys(),
  ]);

  return [...sectionIds]
    .filter((section) => !(section === 'videos' && coveredVideos))
    .map((section) =>
      buildSectionRank(
        section,
        strongEntries.get(section) ?? [],
        weakMatches.get(section) ?? [],
        byId,
        getSectionThemes(persona, section),
        persona.projectCategories,
      ),
    )
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score);
}
