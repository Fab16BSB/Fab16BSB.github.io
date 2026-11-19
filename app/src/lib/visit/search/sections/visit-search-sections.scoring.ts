/* =========================================================================
  SCORING : correspondance d'un contenu avec l'offre
  Catégorie, thèmes et graphe décident du score ou de l'exclusion.
========================================================================= */
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import {
  getGraphCoherence,
  getVisitGraphSignals,
} from '@/lib/visit/visit-graph';
import { getSectionThemes } from '@/lib/visit/search/corpus/visit-search-corpus';
import { getSkillUsageScore } from '@/lib/visit/evidence/visit-skills';
import { getThemeScore } from '@/lib/visit/visit-themes';
import type { VisitOfferGraphSignals } from '@/lib/visit/visit-graph';
import type {
  VisitSearchMatch,
  VisitSearchMeta,
} from '@/types/visit-search.types';
import type {
  VisitPersonaDefinition,
  VisitSectionId,
} from '@/types/visit.types';

/**
 * Vérifie que la catégorie d'un projet est autorisée par le profil.
 *
 * @param meta - Métadonnées du contenu.
 * @param categories - Catégories acceptées, ou `undefined` pour toutes.
 * @returns `true` si le contenu est autorisé.
 */
function keepsProjectCategory(
  meta: VisitSearchMeta,
  categories: string[] | undefined,
): boolean {
  return (
    meta.section !== 'projects' ||
    !categories ||
    (meta.projectCategory !== undefined &&
      categories.includes(meta.projectCategory))
  );
}

/**
 * Vérifie qu'un contenu partage assez de signaux avec l'offre.
 *
 * @param section - Section du contenu.
 * @param coherence - Cohérence calculée avec l'offre.
 * @param hasDomain - Indique que l'offre porte un thème principal.
 * @returns `true` si le contenu passe le filtre de cohérence.
 */
function passesGraphFilter(
  section: VisitSectionId,
  coherence: ReturnType<typeof getGraphCoherence>,
  hasDomain: boolean,
): boolean {
  if (section === 'skills') {
    return true;
  }

  if (section === 'publications') {
    return (
      !hasDomain ||
      coherence.sharesPrimary ||
      coherence.sharesConcept
    );
  }

  if (section === 'teaching') {
    return !hasDomain || coherence.score > 0;
  }

  if (section === 'projects' || section === 'timeline') {
    return (
      !hasDomain ||
      coherence.sharesPrimary ||
      coherence.sharesConcept ||
      coherence.score >= VISIT_CONFIG.graphSecondaryMin
    );
  }

  return true;
}

/**
 * Score une correspondance réelle avec un contenu.
 *
 * @param match - Correspondance de la recherche.
 * @param themes - Thèmes attendus par le profil pour la section.
 * @param persona - Profil de lecture.
 * @param referenceYear - Année de référence.
 * @param offerGraph - Signaux du graphe pour l'offre.
 * @returns Le score, ou `null` si le contenu est écarté.
 */
export function scoreStrongMatch(
  match: VisitSearchMatch,
  themes: ReturnType<typeof getSectionThemes>,
  persona: VisitPersonaDefinition,
  referenceYear: number,
  offerGraph: VisitOfferGraphSignals,
): number | null {
  if (!keepsProjectCategory(match.meta, persona.projectCategories)) {
    return null;
  }

  const themeScore = getThemeScore(match.meta.themes, themes);

  if (themes.length > 0 && themeScore === 0) {
    return null;
  }

  const coherence = getGraphCoherence(
    getVisitGraphSignals(match.meta.id),
    offerGraph,
  );
  const hasDomain = offerGraph.primaryTheme !== null;

  if (!passesGraphFilter(match.meta.section, coherence, hasDomain)) {
    return null;
  }

  const skillScore = match.meta.skillId
    ? getSkillUsageScore(match.meta.skillId, referenceYear) *
      VISIT_CONFIG.skillUsageWeight
    : 0;
  const graphBoost =
    1 +
    Math.min(1, coherence.score) * VISIT_CONFIG.graphBoostWeight;

  return (
    (match.score *
      (1 + themeScore * VISIT_CONFIG.searchThemeWeight) +
      skillScore) *
    graphBoost
  );
}

/**
 * Indique si un contenu reste dans les thèmes du profil.
 *
 * Seuls les prix portent un filtre propre (`awardThemes`) : une section nommée
 * ne doit pas ramener un prix d'un autre domaine.
 *
 * @param section - Section du contenu.
 * @param meta - Métadonnées du contenu.
 * @param themes - Thèmes attendus pour la section.
 * @param projectCategories - Catégories de projets acceptées.
 * @returns `true` si le contenu peut être retenu.
 */
export function keepsSectionThemes(
  section: VisitSectionId,
  meta: VisitSearchMeta,
  themes: ReturnType<typeof getSectionThemes>,
  projectCategories: string[] | undefined,
): boolean {
  return (
    (section !== 'awards' ||
      getThemeScore(meta.themes, themes) > 0) &&
    keepsProjectCategory(meta, projectCategories)
  );
}
