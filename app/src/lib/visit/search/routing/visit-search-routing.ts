/* =========================================================================
  ROUTAGE : sélection des sections, verdict et écarts
  La demande choisit les sections ; le profil fournit l'ordre et les attentes.
========================================================================= */
import {
  filterRankedSections,
  selectRankedSections,
} from '@/lib/visit/search/routing/visit-search-routing.selection';
import { buildRoutingVerdict } from '@/lib/visit/search/routing/visit-search-routing.verdict';
import type {
  RoutingSelection,
} from '@/lib/visit/search/routing/visit-search-routing.types';
import type { Locale } from '@/types/common.types';
import type {
  VisitSearchRouting,
  VisitSearchSection,
} from '@/types/visit-search.types';
import type {
  VisitMode,
  VisitPersonaDefinition,
  VisitSectionId,
} from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   SÉLECTION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Applique les filtres du profil et de la demande, puis retient les sections.
 *
 * @param ranked - Sections classées.
 * @param mode - Mode essentiel ou approfondi.
 * @param persona - Profil de lecture.
 * @param availabilityMatch - Demande liée à la disponibilité.
 * @param strictNamedSectionIds - Sections nommées par la demande.
 * @returns La sélection, ou `null` si rien ne correspond.
 */
function selectRoutingSections(
  ranked: VisitSearchSection[],
  mode: VisitMode,
  persona: VisitPersonaDefinition,
  availabilityMatch: boolean,
  strictNamedSectionIds: Set<VisitSectionId>,
): RoutingSelection | null {
  const filteredRanked = filterRankedSections(
    ranked,
    persona,
    availabilityMatch,
    strictNamedSectionIds,
  );

  if (filteredRanked.length === 0 && !availabilityMatch) {
    return null;
  }

  const selected = selectRankedSections(
    filteredRanked,
    mode,
    strictNamedSectionIds,
  );
  const strongSelected = selected.filter((entry) => entry.hasRealItem);
  const weakRankedSections = filteredRanked.filter(
    (entry) =>
      !entry.hasRealItem &&
      strictNamedSectionIds.has(entry.section),
  );
  // Une section nommée sans contenu réel reste proposée dans les deux modes.
  const complementSections = filteredRanked
    .filter(
      (entry) =>
        !entry.hasRealItem &&
        strictNamedSectionIds.has(entry.section) &&
        !selected.some(
          (item) => item.section === entry.section,
        ),
    )
    .slice(0, 2);
  const displaySelected = [...selected, ...complementSections].sort(
    (left, right) => right.score - left.score,
  );

  return {
    selected,
    strongSelected,
    strongSelectedIds: new Set(
      strongSelected.map((entry) => entry.section),
    ),
    weakRankedSections,
    weakIds: new Set(
      weakRankedSections.map((entry) => entry.section),
    ),
    displaySelected,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Sélectionne les sections et calcule le verdict.
 *
 * @param ranked - Sections classées.
 * @param mode - Mode essentiel ou approfondi.
 * @param persona - Profil de lecture.
 * @param availabilityMatch - Demande liée à la disponibilité.
 * @param strictNamedSectionIds - Sections nommées par la demande.
 * @param coverage - Couverture de la demande.
 * @param themeOnlyMatch - Correspondance uniquement thématique.
 * @param query - Demande saisie.
 * @param queryTokens - Mots normalisés de la demande.
 * @param locale - Langue de lecture.
 * @returns Le parcours sélectionné, ou `null`.
 */
export function buildVisitRouting(
  ranked: VisitSearchSection[],
  mode: VisitMode,
  persona: VisitPersonaDefinition,
  availabilityMatch: boolean,
  strictNamedSectionIds: Set<VisitSectionId>,
  coverage: number,
  themeOnlyMatch: boolean,
  query: string,
  queryTokens: string[],
  locale: Locale,
  referenceYear: number,
): VisitSearchRouting | null {
  const selection = selectRoutingSections(
    ranked,
    mode,
    persona,
    availabilityMatch,
    strictNamedSectionIds,
  );

  if (!selection) {
    return null;
  }

  const verdict = buildRoutingVerdict({
    selection,
    availabilityMatch,
    strictNamedSectionIds,
    coverage,
    themeOnlyMatch,
    query,
    queryTokens,
    locale,
    referenceYear,
  });

  return {
    displaySelected: selection.displaySelected,
    strongSelectedIds: selection.strongSelectedIds,
    verdict,
  };
}
