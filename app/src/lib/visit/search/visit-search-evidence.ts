/* =========================================================================
  PREUVES : sélection des contenus du moteur de visite
  Une preuve par section, puis complément par recouvrement avec la demande.
========================================================================= */
import { tokenizeSearchText } from '@/lib/search/search-engine';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import { getSkillUsageScore } from '@/lib/visit/evidence/visit-skills';
import type { Locale } from '@/types/common.types';
import type { VisitSearchMeta } from '@/types/visit-search.types';
import type { VisitSectionId } from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Priorité des sections dans les preuves. */
const EVIDENCE_SECTION_PRIORITY: Partial<Record<VisitSectionId, number>> = {
  skills: 0,
  projects: 1,
  timeline: 2,
  publications: 3,
  teaching: 4,
  videos: 5,
  awards: 6,
  about: 7,
};

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Candidat de preuve dans une section. */
type EvidenceCandidate = {
  label: string;
  target: string;
  section: VisitSectionId;
  score: number;
  usage: number;
  labelOverlap: number;
  contentOverlap: number;
};

/** Accumulateur de preuves déjà retenues. */
type EvidenceSelection = {
  picked: EvidenceCandidate[];
  used: Set<string>;
};

/** Section retenue avec ses contenus scorés. */
type EvidenceSection = {
  section: VisitSectionId;
  entries: Array<{ meta: VisitSearchMeta; score: number }>;
};

/* ─────────────────────────────────────────────────────────────────────────
   CANDIDATS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Compte les mots de la demande présents dans un ensemble de termes.
 *
 * @param terms - Termes normalisés du contenu.
 * @param queryTokens - Mots normalisés de l'offre.
 * @returns Le nombre de mots partagés.
 */
function countOverlap(terms: Set<string>, queryTokens: string[]): number {
  let count = 0;

  for (const token of queryTokens) {
    if (terms.has(token)) {
      count += 1;
    }
  }

  return count;
}

/**
 * Construit les candidats de preuve à partir des sections retenues.
 *
 * @param sections - Sections retenues par la recherche.
 * @param queryTokens - Mots normalisés de l'offre.
 * @param locale - Langue de lecture.
 * @returns Les candidats scorés.
 */
function buildCandidates(
  sections: EvidenceSection[],
  queryTokens: string[],
  locale: Locale,
  referenceYear: number,
): EvidenceCandidate[] {
  return sections.flatMap((section) =>
    section.entries.map((item) => ({
      label: item.meta.label,
      target: item.meta.target,
      section: section.section,
      score: item.score,
      usage: item.meta.skillId
        ? getSkillUsageScore(item.meta.skillId, referenceYear)
        : 0,
      labelOverlap: countOverlap(
        new Set(tokenizeSearchText(locale, item.meta.label)),
        queryTokens,
      ),
      contentOverlap: countOverlap(item.meta.terms, queryTokens),
    })),
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   SÉLECTION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Ajoute un candidat sans doublon, dans la limite du nombre de preuves.
 *
 * @param selection - Preuves déjà retenues.
 * @param candidate - Candidat à ajouter.
 * @param maxEvidence - Nombre maximal de preuves.
 */
function addCandidate(
  selection: EvidenceSelection,
  candidate: EvidenceCandidate,
  maxEvidence: number,
): void {
  const canAdd =
    !selection.used.has(candidate.target) &&
    selection.picked.length < maxEvidence;

  if (canAdd) {
    selection.used.add(candidate.target);
    selection.picked.push(candidate);
  }
}

/**
 * Retient la meilleure preuve de chaque section.
 *
 * @param candidates - Candidats disponibles.
 * @param sections - Sections retenues.
 * @param selection - Preuves déjà retenues, enrichies sur place.
 * @param maxEvidence - Nombre maximal de preuves.
 * @param compare - Ordre de préférence des candidats.
 * @param isRelevant - Filtre de pertinence.
 */
function selectSectionCandidates(
  candidates: EvidenceCandidate[],
  sections: Array<{ section: VisitSectionId }>,
  selection: EvidenceSelection,
  maxEvidence: number,
  compare: (left: EvidenceCandidate, right: EvidenceCandidate) => number,
  isRelevant: (candidate: EvidenceCandidate) => boolean,
): void {
  for (const section of sections) {
    const best = candidates
      .filter((candidate) => candidate.section === section.section)
      .sort(compare)[0];

    if (best && isRelevant(best)) {
      addCandidate(selection, best, maxEvidence);
    }
  }
}

/**
 * Complète la sélection avec les meilleurs candidats restants.
 *
 * @param candidates - Candidats disponibles.
 * @param selection - Preuves déjà retenues, enrichies sur place.
 * @param maxEvidence - Nombre maximal de preuves.
 * @param isRelevant - Filtre de pertinence.
 * @param compare - Ordre de préférence des candidats.
 */
function fillSelection(
  candidates: EvidenceCandidate[],
  selection: EvidenceSelection,
  maxEvidence: number,
  isRelevant: (candidate: EvidenceCandidate) => boolean,
  compare: (left: EvidenceCandidate, right: EvidenceCandidate) => number,
): void {
  for (const candidate of [...candidates].sort(compare)) {
    if (isRelevant(candidate)) {
      addCandidate(selection, candidate, maxEvidence);
    }
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Sélectionne les preuves les plus proches de l'offre.
 *
 * Une preuve est d'abord choisie par section, puis complétée par les contenus
 * qui partagent le plus de mots avec la demande. Aucun contenu spécifique
 * n'est nommé ici : tout vient des termes indexés et du score de recherche.
 *
 * @param sections - Sections retenues par la recherche.
 * @param queryTokens - Mots normalisés de l'offre.
 * @param relevantSections - Sections nommées par la demande.
 * @param maxEvidence - Nombre maximal de preuves.
 * @param locale - Langue de lecture.
 * @returns Les libellés et cibles des preuves.
 */
export function selectEvidence(
  sections: EvidenceSection[],
  queryTokens: string[],
  relevantSections: Set<VisitSectionId>,
  maxEvidence: number,
  locale: Locale,
  referenceYear: number,
): { labels: string[]; targets: string[] } {
  const candidates = buildCandidates(
    sections,
    queryTokens,
    locale,
    referenceYear,
  );
  const compare = (
    left: EvidenceCandidate,
    right: EvidenceCandidate,
  ): number =>
    right.labelOverlap - left.labelOverlap ||
    right.contentOverlap - left.contentOverlap ||
    (EVIDENCE_SECTION_PRIORITY[left.section] ?? 99) -
      (EVIDENCE_SECTION_PRIORITY[right.section] ?? 99) ||
    right.usage - left.usage ||
    right.score - left.score;
  const selection: EvidenceSelection = {
    picked: [],
    used: new Set<string>(),
  };
  const teachingOnly =
    relevantSections.size === 1 && relevantSections.has('teaching');

  const isPrimaryRelevant = (candidate: EvidenceCandidate): boolean =>
    (!teachingOnly || candidate.section !== 'timeline') &&
    (candidate.labelOverlap > 0 ||
      relevantSections.has(candidate.section));

  const isFillRelevant = (candidate: EvidenceCandidate): boolean =>
    teachingOnly
      ? candidate.labelOverlap > 0 || candidate.contentOverlap > 0
      : candidate.labelOverlap > 0 ||
        candidate.contentOverlap >= VISIT_CONFIG.evidenceContentOverlap;

  const compareFill = teachingOnly
    ? (left: EvidenceCandidate, right: EvidenceCandidate): number =>
        (EVIDENCE_SECTION_PRIORITY[left.section] ?? 99) -
          (EVIDENCE_SECTION_PRIORITY[right.section] ?? 99) ||
        compare(left, right)
    : compare;

  selectSectionCandidates(
    candidates,
    sections,
    selection,
    maxEvidence,
    compare,
    isPrimaryRelevant,
  );
  fillSelection(
    candidates,
    selection,
    maxEvidence,
    isFillRelevant,
    compareFill,
  );

  if (selection.picked.length < maxEvidence) {
    fillSelection(
      candidates,
      selection,
      maxEvidence,
      () => true,
      compareFill,
    );
  }

  return {
    labels: selection.picked.map((candidate) => candidate.label),
    targets: selection.picked.map((candidate) => candidate.target),
  };
}
