/* =========================================================================
  VERDICT : couverture attendue et écarts
  Compare les sections retenues aux attentes du profil puis note la demande.
========================================================================= */
import { getUnknownTechTerms } from '@/lib/visit/search/corpus/visit-search-corpus';
import { selectEvidence } from '@/lib/visit/search/visit-search-evidence';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import type { VerdictContext } from '@/lib/visit/search/routing/visit-search-routing.types';
import type { Locale } from '@/types/common.types';
import type {
  RequiredSectionGroup,
  VisitSearchSection,
} from '@/types/visit-search.types';
import type {
  VisitFit,
  VisitSectionId,
  VisitVerdict,
  VisitVerdictGap,
} from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Sections exigées par un profil de recherche. */
const RESEARCH_GROUPS: RequiredSectionGroup[] = [
  { sections: ['publications'], gapKey: 'visit.gaps.publications' },
  { sections: ['projects', 'timeline'], gapKey: 'visit.gaps.projects' },
];

/** Sections exigées par un profil d'enseignement. */
const TEACHING_GROUPS: RequiredSectionGroup[] = [
  { sections: ['teaching'], gapKey: 'visit.gaps.teaching' },
  { sections: ['skills'], gapKey: 'visit.gaps.skills' },
];

/** Sections exigées par défaut. */
const DEFAULT_GROUPS: RequiredSectionGroup[] = [
  { sections: ['skills'], gapKey: 'visit.gaps.skills' },
  { sections: ['projects', 'timeline'], gapKey: 'visit.gaps.projects' },
];

/** Écart nommé associé à une section reconnue sans contenu réel. */
const WEAK_SECTION_GAP_KEYS: Partial<Record<VisitSectionId, string>> = {
  publications: 'visit.gaps.publications',
  teaching: 'visit.gaps.teaching',
  timeline: 'visit.gaps.timeline',
  projects: 'visit.gaps.projects',
  skills: 'visit.gaps.skills',
};

/* ─────────────────────────────────────────────────────────────────────────
   GROUPES ET ÉCARTS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Détermine les sections qu'un profil attend pour couvrir le besoin.
 *
 * @param weakIds - Sections reconnues sans contenu réel.
 * @param strongSelectedIds - Sections retenues sur un contenu réel.
 * @param dominantStrong - Meilleure section forte.
 * @returns Les groupes de sections attendus.
 */
function getRequiredGroups(
  weakIds: Set<VisitSectionId>,
  strongSelectedIds: Set<VisitSectionId>,
  dominantStrong: VisitSectionId | undefined,
): RequiredSectionGroup[] {
  if (weakIds.has('publications')) {
    return RESEARCH_GROUPS;
  }

  if (weakIds.has('teaching')) {
    return TEACHING_GROUPS;
  }

  if (strongSelectedIds.has('publications')) {
    return RESEARCH_GROUPS;
  }

  return dominantStrong === 'teaching' ? TEACHING_GROUPS : DEFAULT_GROUPS;
}

/**
 * Rassemble les écarts du verdict.
 *
 * @param missingGroups - Groupes attendus sans section correspondante.
 * @param weakRankedSections - Sections reconnues sans contenu réel.
 * @param availabilityMatch - Demande liée à la disponibilité.
 * @param query - Demande saisie.
 * @param locale - Langue de lecture.
 * @returns Les écarts, limités par la configuration.
 */
function collectGaps(
  missingGroups: RequiredSectionGroup[],
  weakRankedSections: VisitSearchSection[],
  availabilityMatch: boolean,
  query: string,
  locale: Locale,
): VisitVerdictGap[] {
  const gaps: VisitVerdictGap[] = missingGroups.map((group) => ({
    key: group.gapKey,
  }));

  if (!availabilityMatch) {
    for (const entry of weakRankedSections) {
      const gapKey = WEAK_SECTION_GAP_KEYS[entry.section];

      if (
        gapKey &&
        !gaps.some((gap) => gap.key === gapKey) &&
        gaps.length < VISIT_CONFIG.maxGaps
      ) {
        gaps.push({ key: gapKey });
      }
    }
  }

  for (const term of getUnknownTechTerms(query, locale)) {
    const hasRoom = gaps.length < VISIT_CONFIG.maxGaps;

    if (hasRoom) {
      gaps.push({
        key: 'visit.gaps.unknown',
        params: { term },
      });
    }
  }

  return gaps;
}

/* ─────────────────────────────────────────────────────────────────────────
   SCORE ET VERDICT
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Détermine la qualité globale de la correspondance.
 *
 * @param fitScore - Score de couverture des sections attendues.
 * @param coverage - Couverture de la demande.
 * @param strongSelectedIds - Sections retenues sur un contenu réel.
 * @param strictNamedSectionIds - Sections nommées par la demande.
 * @param availabilityMatch - Demande liée à la disponibilité.
 * @param themeOnlyMatch - Correspondance uniquement thématique.
 * @param hasNamedWeakSection - Section nommée sans contenu réel.
 * @returns Le niveau de correspondance.
 */
function resolveFit(
  fitScore: number,
  coverage: number,
  strongSelectedIds: Set<VisitSectionId>,
  strictNamedSectionIds: Set<VisitSectionId>,
  availabilityMatch: boolean,
  themeOnlyMatch: boolean,
  hasNamedWeakSection: boolean,
): VisitFit {
  const lowCoverageWithoutSkills =
    coverage < VISIT_CONFIG.coverageMin &&
    strictNamedSectionIds.size === 0 &&
    !availabilityMatch &&
    !strongSelectedIds.has('skills');
  const sparseThemeMatch =
    themeOnlyMatch &&
    strictNamedSectionIds.size === 0 &&
    !availabilityMatch;

  if (lowCoverageWithoutSkills || sparseThemeMatch) {
    return 'weak';
  }

  if (fitScore >= VISIT_CONFIG.fitStrong) {
    return 'strong';
  }

  return fitScore >= VISIT_CONFIG.fitPartial || hasNamedWeakSection
    ? 'partial'
    : 'weak';
}

/**
 * Calcule le verdict et les écarts d'une sélection.
 *
 * @param context - Sélection, demande et configuration du parcours.
 * @returns Le verdict prêt à afficher.
 */
export function buildRoutingVerdict(context: VerdictContext): VisitVerdict {
  const {
    selection,
    availabilityMatch,
    strictNamedSectionIds,
    coverage,
    themeOnlyMatch,
    query,
    queryTokens,
    locale,
    referenceYear,
  } = context;
  const {
    selected,
    strongSelected,
    strongSelectedIds,
    weakRankedSections,
    weakIds,
  } = selection;
  const requiredGroups = availabilityMatch
    ? []
    : getRequiredGroups(
        weakIds,
        strongSelectedIds,
        strongSelected[0]?.section,
      );
  const fitSectionIds =
    strongSelected.length > 0
      ? new Set<VisitSectionId>(['about', ...strongSelectedIds])
      : new Set<VisitSectionId>([
          'about',
          ...selected.map((entry) => entry.section),
        ]);
  const missingGroups = requiredGroups.filter(
    (group) =>
      !group.sections.some((section) => fitSectionIds.has(section)),
  );
  const gaps = collectGaps(
    missingGroups,
    weakRankedSections,
    availabilityMatch,
    query,
    locale,
  );
  let requiredCovered = 0;

  // Une demande de disponibilité est portée par la présentation, toujours là.
  if (availabilityMatch) {
    requiredCovered = 1;
  }

  // Sinon, le score suit la part des groupes attendus déjà couverts.
  else if (requiredGroups.length > 0) {
    requiredCovered =
      (requiredGroups.length - missingGroups.length) /
      requiredGroups.length;
  }
  const fitScore =
    requiredCovered * VISIT_CONFIG.fitRequiredWeight +
    coverage * VISIT_CONFIG.fitCoverageWeight;
  const hasNamedWeakSection = weakRankedSections.some((entry) =>
    strictNamedSectionIds.has(entry.section),
  );
  const fit = resolveFit(
    fitScore,
    coverage,
    strongSelectedIds,
    strictNamedSectionIds,
    availabilityMatch,
    themeOnlyMatch,
    hasNamedWeakSection,
  );

  if (
    fit !== 'strong' &&
    coverage < VISIT_CONFIG.coverageMin &&
    gaps.length < VISIT_CONFIG.maxGaps
  ) {
    gaps.push({ key: 'visit.gaps.coverage' });
  }

  const evidence = selectEvidence(
    strongSelected,
    queryTokens,
    strictNamedSectionIds,
    VISIT_CONFIG.maxEvidence,
    locale,
    referenceYear,
  );

  return {
    fit,
    coverage,
    evidence: evidence.labels,
    evidenceTargets: evidence.targets,
    gaps: gaps.slice(0, VISIT_CONFIG.maxGaps),
  };
}
