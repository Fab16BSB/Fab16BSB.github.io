/* =========================================================================
  ROUTAGE : sélection des sections autorisées et retenues
  Le profil filtre les sections contextuelles, la demande réserve sa place.
========================================================================= */
import { getMaxContentSections } from '@/lib/visit/visit-mode';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import type { VisitSearchSection } from '@/types/visit-search.types';
import type {
  VisitMode,
  VisitPersonaDefinition,
  VisitSectionId,
} from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Sections toujours candidates : les autres exigent un profil ou une demande.
 */
const CORE_SECTIONS = new Set<VisitSectionId>([
  'about',
  'timeline',
  'projects',
  'skills',
]);

/* ─────────────────────────────────────────────────────────────────────────
   FILTRAGE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Retire les sections qu'un profil ou une demande n'autorisent pas.
 *
 * @param ranked - Sections classées.
 * @param persona - Profil de lecture.
 * @param availabilityMatch - Demande liée à la disponibilité.
 * @param strictNamedSectionIds - Sections nommées par la demande.
 * @returns Les sections autorisées.
 */
export function filterRankedSections(
  ranked: VisitSearchSection[],
  persona: VisitPersonaDefinition,
  availabilityMatch: boolean,
  strictNamedSectionIds: Set<VisitSectionId>,
): VisitSearchSection[] {
  return ranked.filter((entry) => {
    if (!entry.hasRealItem && !strictNamedSectionIds.has(entry.section)) {
      return false;
    }

    if (availabilityMatch) {
      return (
        VISIT_CONFIG.availabilitySections.some(
          (section) => section === entry.section,
        ) || strictNamedSectionIds.has(entry.section)
      );
    }

    if (!entry.hasRealItem || CORE_SECTIONS.has(entry.section)) {
      return true;
    }

    return (
      strictNamedSectionIds.has(entry.section) ||
      persona.contextSections.includes(entry.section)
    );
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   SÉLECTION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Garde les meilleures sections et réserve une place aux sections nommées.
 *
 * @param filteredRanked - Sections autorisées, classées.
 * @param mode - Mode essentiel ou approfondi.
 * @param strictNamedSectionIds - Sections nommées par la demande.
 * @returns Les sections retenues, du meilleur au moins bon score.
 */
export function selectRankedSections(
  filteredRanked: VisitSearchSection[],
  mode: VisitMode,
  strictNamedSectionIds: Set<VisitSectionId>,
): VisitSearchSection[] {
  const best = filteredRanked[0]?.score ?? 0;
  const aboveFloor = filteredRanked.filter(
    (entry) => entry.score >= best * VISIT_CONFIG.sectionFloorRatio,
  );
  const maxSections = getMaxContentSections(mode);
  let selected =
    maxSections === null ? [...aboveFloor] : aboveFloor.slice(0, maxSections);
  const selectedIds = new Set(selected.map((entry) => entry.section));
  const reserved = filteredRanked.filter(
    (entry) =>
      entry.hasRealItem &&
      strictNamedSectionIds.has(entry.section) &&
      !selectedIds.has(entry.section),
  );

  // Le mode complet n'a pas de plafond : toutes les sections nommées restent.
  if (maxSections === null) {
    selected = [...selected, ...reserved];
  } else {
    for (const entry of reserved) {
      if (selected.length < maxSections) {
        selected = [...selected, entry];
        selectedIds.add(entry.section);
        continue;
      }

      const replaceIndex = selected
        .map((item, index) => ({ item, index }))
        .filter(({ item }) => !strictNamedSectionIds.has(item.section))
        .sort((left, right) => left.item.score - right.item.score)[0]
        ?.index;

      if (replaceIndex !== undefined) {
        selected = selected.map((item, index) =>
          index === replaceIndex ? entry : item,
        );
        selectedIds.add(entry.section);
      }
    }
  }

  return [...selected].sort(
    (left, right) => right.score - left.score,
  );
}
