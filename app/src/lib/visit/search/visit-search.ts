/* =========================================================================
  RECHERCHE : parcours proposé à partir d'une offre
  Contenus réels et fiches de section, puis agrégation par section.
========================================================================= */
import { normalizeSearchText } from '@/lib/search/search';
import { tokenizeSearchText } from '@/lib/search/search-engine';
import { getOfferGraphSignals } from '@/lib/visit/visit-graph';
import {
  getAvailabilityText,
  getCorpus,
} from '@/lib/visit/search/corpus/visit-search-corpus';
import {
  collectRawMatches,
  getCoverage,
  getStrictNamedSections,
  getThemeOnlyMatch,
} from '@/lib/visit/search/visit-search.matches';
import { buildVisitRouting } from '@/lib/visit/search/routing/visit-search-routing';
import { rankVisitSections } from '@/lib/visit/search/sections/visit-search-sections';
import {
  buildAboutStop,
  buildPlanStops,
} from '@/lib/visit/search/visit-search.stops';
import type { Locale } from '@/types/common.types';
import type {
  VisitMode,
  VisitPersonaDefinition,
  VisitPlan,
} from '@/types/visit.types';

/**
 * Construit un parcours à partir d'une offre.
 *
 * @param query - Offre ou besoin formulé.
 * @param persona - Profil de lecture.
 * @param mode - Mode essentiel ou approfondi.
 * @param locale - Langue de lecture.
 * @param referenceYear - Année de référence.
 * @returns Le parcours, ou `null` si aucun contenu ne correspond.
 */
export function buildSearchVisitPlan(
  query: string,
  persona: VisitPersonaDefinition,
  mode: VisitMode,
  locale: Locale,
  referenceYear: number,
): VisitPlan | null {
  const { index, byId, sectionTagTerms } = getCorpus(locale);
  const normalized = normalizeSearchText(query);
  const strictNamedSectionIds = getStrictNamedSections(normalized);
  const rawMatches = collectRawMatches(
    index,
    byId,
    sectionTagTerms,
    normalized,
  );
  const offerGraph = getOfferGraphSignals(query);
  const queryTokens = tokenizeSearchText(locale, normalized);
  const availabilityMatch = rawMatches.some(
    (match) => match.id === 'availability-profile',
  );
  const coverage = getCoverage(rawMatches, queryTokens);
  const themeOnlyMatch = getThemeOnlyMatch(rawMatches);
  const ranked = rankVisitSections(
    rawMatches,
    persona,
    referenceYear,
    byId,
    offerGraph,
  );

  if (ranked.length === 0) {
    return null;
  }

  const routing = buildVisitRouting(
    ranked,
    mode,
    persona,
    availabilityMatch,
    strictNamedSectionIds,
    coverage,
    themeOnlyMatch,
    query,
    queryTokens,
    locale,
    referenceYear,
  );

  if (!routing) {
    return null;
  }

  const { displaySelected, strongSelectedIds, verdict } = routing;
  const stops = buildPlanStops(
    displaySelected,
    buildAboutStop(
      locale,
      availabilityMatch,
      getAvailabilityText(locale),
    ),
    locale,
    referenceYear,
    mode,
    strongSelectedIds,
  );
  const duration = stops.reduce((total, stop) => total + stop.duration, 0);

  return {
    stops,
    duration,
    mode,
    persona: persona.id,
    hasMatches: true,
    verdict,
  };
}
