/* =========================================================================
  HELPERS : compétences proposées dans le parcours — fonctions pures
  Les correspondances de la demande passent devant, puis l'ancienneté
  réelle et le nombre de traces d'usage départagent les compétences.
========================================================================= */
import { skills } from '@/data/career/skills.data';
import { knowledgeConcepts } from '@/lib/knowledge/knowledge-concepts';
import { getSkillTenures } from '@/lib/skill-tenure';
import { visitTarget } from '@/lib/visit/visit-targets';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import { detectThemes, getThemeScore } from '@/lib/visit/visit-themes';
import type { KnowledgeThemeId } from '@/types/knowledge.types';
import type { VisitHighlight } from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Compétences indexées par identifiant. */
const skillById = new Map(skills.map((skill) => [skill.id, skill]));

/** Termes des concepts, utilisés pour élargir la détection des thèmes. */
const conceptTermsById = new Map(
  knowledgeConcepts.map((concept) => [
    concept.id,
    [concept.label, ...concept.aliases],
  ]),
);

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Compétence classée avant sélection. */
type RankedSkill = {
  id: string;
  themeScore: number;
  score: number;
};

/* ─────────────────────────────────────────────────────────────────────────
   CLASSEMENT
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Rassemble les textes qui décrivent une compétence.
 *
 * Le nom, la catégorie et les alias décrivent la compétence elle-même ; les
 * concepts déclarés par `conceptIds` apportent les thèmes qu'elle sert.
 *
 * @param skill - Compétence du portfolio.
 * @returns Les textes à analyser pour détecter les thèmes.
 */
function getSkillThemeTexts(skill: (typeof skills)[number]): string[] {
  const conceptTerms = (skill.conceptIds ?? []).flatMap(
    (id) => conceptTermsById.get(id) ?? [],
  );

  return [
    skill.name,
    skill.category,
    ...(skill.aliases ?? []),
    ...conceptTerms,
  ];
}

/**
 * Calcule le poids d'usage d'une compétence.
 *
 * @param skillId - Compétence concernée.
 * @param referenceYear - Année de référence.
 * @returns Un score qui favorise l'ancienneté et les traces concrètes.
 */
export function getSkillUsageScore(
  skillId: string,
  referenceYear: number,
): number {
  const tenure = getSkillTenures(referenceYear).get(skillId);

  if (!tenure) {
    return 0;
  }

  const sourceCount = tenure.sources.length;
  const sourceKinds = new Set(
    tenure.sources.map((source) => source.kind),
  ).size;

  return (
    (tenure.spanYears ?? 0) * VISIT_CONFIG.skillSpanWeight +
    (tenure.professionalYears ?? 0) *
      VISIT_CONFIG.skillProfessionalWeight +
    (tenure.isCurrent ? VISIT_CONFIG.skillCurrentBonus : 0) +
    sourceCount * VISIT_CONFIG.skillSourceWeight +
    sourceKinds
  );
}

/**
 * Classe les compétences par thème puis par usage réel.
 *
 * @param referenceYear - Année de référence.
 * @param profileThemes - Thèmes attendus par le profil.
 * @returns Les compétences classées.
 */
function rankSkills(
  referenceYear: number,
  profileThemes: KnowledgeThemeId[],
): RankedSkill[] {
  return [...skills]
    .map((skill) => {
      const themes = detectThemes(getSkillThemeTexts(skill));
      const themeScore = getThemeScore(themes, profileThemes);

      return {
        id: skill.id,
        themeScore,
        score:
          getSkillUsageScore(skill.id, referenceYear) +
          themeScore * VISIT_CONFIG.skillThemeWeight,
      };
    })
    .sort(
      (left, right) =>
        right.score - left.score || left.id.localeCompare(right.id),
    );
}

/**
 * Remonte le langage principal d'un profil technique.
 *
 * @param ordered - Identifiants déjà classés.
 * @param languageId - Langage principal, ou `undefined`.
 * @param profileThemes - Thèmes attendus par le profil.
 * @param limit - Nombre maximal de compétences.
 * @returns Les identifiants avec le langage en tête si nécessaire.
 */
function prioritizeLanguage(
  ordered: string[],
  languageId: string | undefined,
  profileThemes: KnowledgeThemeId[],
  limit: number,
): string[] {
  if (
    profileThemes.length === 0 ||
    limit <= 0 ||
    !languageId ||
    ordered.slice(0, limit).includes(languageId)
  ) {
    return ordered;
  }

  const result = [...ordered];
  result.splice(limit > 1 ? 1 : 0, 0, languageId);

  return result;
}

/**
 * Convertit une compétence en contenu de visite.
 *
 * @param skill - Compétence du portfolio.
 * @param referenceYear - Année de référence.
 * @returns Le contenu prêt à afficher.
 */
function toSkillHighlight(
  skill: (typeof skills)[number],
  referenceYear: number,
): VisitHighlight {
  const tenure = getSkillTenures(referenceYear).get(skill.id);

  return {
    label: skill.name,
    skillId: skill.id,
    target: visitTarget('skill', skill.id),
    tenure: {
      firstYear: tenure?.firstYear ?? null,
      lastYear: tenure?.lastYear ?? null,
      spanYears: tenure?.spanYears ?? null,
      professionalYears: tenure?.professionalYears ?? null,
      isCurrent: tenure?.isCurrent ?? false,
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Retourne les compétences à afficher pour une étape.
 *
 * Les thèmes du profil passent devant, puis les compétences les plus
 * anciennes et les plus utilisées complètent la liste.
 *
 * @param referenceYear - Année de référence du calcul d'ancienneté.
 * @param limit - Nombre maximal de compétences.
 * @param profileThemes - Thèmes attendus par le profil.
 * @returns Les compétences avec leur ancienneté.
 */
export function getSkillHighlights(
  referenceYear: number,
  limit = 4,
  profileThemes: KnowledgeThemeId[] = [],
): VisitHighlight[] {
  const rankedAll = rankSkills(referenceYear, profileThemes);
  const languageId = rankedAll.find(
    (item) => skillById.get(item.id)?.category === 'languages',
  )?.id;
  const matched = rankedAll.filter(
    (item) =>
      profileThemes.length === 0 ||
      item.themeScore > 0 ||
      item.id === languageId,
  );
  const ordered = prioritizeLanguage(
    matched.map((item) => item.id),
    languageId,
    profileThemes,
    limit,
  );

  return ordered
    .map((id) => skillById.get(id))
    .filter((skill): skill is NonNullable<typeof skill> => Boolean(skill))
    .slice(0, limit)
    .map((skill) => toSkillHighlight(skill, referenceYear));
}
