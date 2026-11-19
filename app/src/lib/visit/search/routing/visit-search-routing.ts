/* =========================================================================
  ROUTAGE : sélection des sections, verdict et écarts
  La demande choisit les sections ; le profil fournit l'ordre et les attentes.
========================================================================= */
import {
  filterRankedSections,
  selectRankedSections,
} from '@/lib/visit/search/routing/visit-search-routing.selection';
import { buildRoutingVerdict } from '@/lib/visit/search/routing/visit-search-routing.verdict';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
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
 * Applique les filtres de l'essentiel et retient les sections de référence.
 *
 * La base sert au verdict et à l'affichage essentiel, quel que soit le mode
 * demandé : le verdict ne doit pas dépendre de la longueur du parcours.
 *
 * @param filteredRanked - Sections autorisées en mode essentiel.
 * @param availabilityMatch - Demande liée à la disponibilité.
 * @param strictNamedSectionIds - Sections nommées par la demande.
 * @param prioritySectionIds - Sections cœur ouvertes par les thèmes.
 * @returns La sélection de référence, ou `null` si rien ne correspond.
 */
function selectCoreSections(
  filteredRanked: VisitSearchSection[],
  availabilityMatch: boolean,
  strictNamedSectionIds: Set<VisitSectionId>,
  prioritySectionIds: Set<VisitSectionId>,
): RoutingSelection | null {
  if (filteredRanked.length === 0 && !availabilityMatch) {
    return null;
  }

  const selected = selectRankedSections(
    filteredRanked,
    'express',
    strictNamedSectionIds,
    prioritySectionIds,
  );
  const strongSelected = selected.filter((entry) => entry.hasRealItem);
  const weakRankedSections = filteredRanked.filter(
    (entry) =>
      !entry.hasRealItem &&
      strictNamedSectionIds.has(entry.section),
  );
  const maxSections = VISIT_CONFIG.modes.express.maxSections ?? 0;
  // Une section nommée sans contenu réel reste proposée, dans la limite du
  // plafond de l'essentiel.
  const complementSections = filteredRanked
    .filter(
      (entry) =>
        !entry.hasRealItem &&
        strictNamedSectionIds.has(entry.section) &&
        !selected.some(
          (item) => item.section === entry.section,
        ),
    )
    .slice(0, Math.min(2, Math.max(0, maxSections - selected.length)));
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

/**
 * Étend l'affichage du mode complet après le parcours essentiel.
 *
 * @param sections - Sections enrichies par les thèmes de la demande.
 * @param persona - Profil de lecture.
 * @param availabilityMatch - Demande liée à la disponibilité.
 * @param strictNamedSectionIds - Sections nommées par la demande.
 * @param core - Sélection essentielle de référence.
 * @returns Les sections affichées par le mode complet.
 */
function buildFullDisplay(
  sections: VisitSearchSection[],
  persona: VisitPersonaDefinition,
  availabilityMatch: boolean,
  strictNamedSectionIds: Set<VisitSectionId>,
  core: RoutingSelection,
): VisitSearchSection[] {
  const sectionById = new Map(
    sections.map((entry) => [entry.section, entry] as const),
  );
  const fullFiltered = filterRankedSections(
    sections,
    persona,
    availabilityMatch,
    strictNamedSectionIds,
    'full',
  );
  const baseDisplay = core.displaySelected.map(
    (entry) => sectionById.get(entry.section) ?? entry,
  );
  const baseIds = new Set(
    baseDisplay.map((entry) => entry.section),
  );
  const extras = selectRankedSections(
    fullFiltered,
    'full',
    strictNamedSectionIds,
  )
    .filter(
      (entry) => entry.hasRealItem && !baseIds.has(entry.section),
    )
    .map((entry) => sectionById.get(entry.section) ?? entry);

  return [...baseDisplay, ...extras];
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Sélectionne les sections et calcule le verdict.
 *
 * @param sections - Sections enrichies par les thèmes de la demande.
 * @param themeSectionIds - Sections cœur ouvertes par les seuls thèmes.
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
  sections: VisitSearchSection[],
  themeSectionIds: Set<VisitSectionId>,
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
  const coreFiltered = filterRankedSections(
    sections,
    persona,
    availabilityMatch,
    strictNamedSectionIds,
    'express',
  );
  const selection = selectCoreSections(
    coreFiltered,
    availabilityMatch,
    strictNamedSectionIds,
    themeSectionIds,
  );

  if (!selection) {
    return null;
  }

  const displaySelected =
    mode === 'full'
      ? buildFullDisplay(
          sections,
          persona,
          availabilityMatch,
          strictNamedSectionIds,
          selection,
        )
      : selection.displaySelected;
  const strongSelectedIds = new Set(
    displaySelected
      .filter((entry) => entry.hasRealItem)
      .map((entry) => entry.section),
  );
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
    displaySelected,
    strongSelectedIds,
    verdict,
  };
}
