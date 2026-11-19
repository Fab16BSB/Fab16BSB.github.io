/* =========================================================================
  AGRÉGATION : contenus d'une section et score de section
  Le classement ne dépend pas du mode ; l'affichage coupe dans `visit-mode`.
========================================================================= */
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import { getSectionThemes } from '@/lib/visit/search/corpus/visit-search-corpus';
import { keepsSectionThemes } from '@/lib/visit/search/sections/visit-search-sections.scoring';
import type {
  VisitSectionEntry,
} from '@/lib/visit/search/sections/visit-search-sections.types';
import type {
  VisitSearchMatch,
  VisitSearchMeta,
  VisitSearchSection,
} from '@/types/visit-search.types';
import type { VisitSectionId } from '@/types/visit.types';

/**
 * Choisit les contenus réels d'une section.
 *
 * Tous les contenus correspondants sont conservés : le classement ne dépend
 * pas du mode. C'est l'affichage qui coupe, dans `visit-mode.ts`.
 *
 * @param strong - Contenus réels correspondants.
 * @returns Les contenus retenus, du plus pertinent au moins pertinent.
 */
function selectStrongEntries(
  strong: VisitSectionEntry[],
): VisitSectionEntry[] {
  return [...strong].sort(
    (left, right) =>
      right.score - left.score ||
      right.meta.year - left.meta.year,
  );
}

/**
 * Choisit les contenus d'une section reconnue sans correspondance réelle.
 *
 * @param section - Section concernée.
 * @param weak - Correspondances limitées au nom de la section.
 * @param byId - Métadonnées indexées.
 * @param themes - Thèmes attendus pour la section.
 * @param projectCategories - Catégories de projets acceptées.
 * @returns Les contenus retenus.
 */
function selectWeakEntries(
  section: VisitSectionId,
  weak: VisitSearchMatch[],
  byId: Map<string, VisitSearchMeta>,
  themes: ReturnType<typeof getSectionThemes>,
  projectCategories: string[] | undefined,
): VisitSectionEntry[] {
  const entries = weak
    .filter(
      (match) =>
        match.meta.kind === 'item' &&
        keepsSectionThemes(
          section,
          match.meta,
          themes,
          projectCategories,
        ),
    )
    .map((match) => ({ meta: match.meta, score: match.score }))
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.meta.year - left.meta.year,
    );

  if (entries.length > 0) {
    return entries;
  }

  return [...byId.values()]
    .filter(
      (meta) =>
        meta.kind === 'item' &&
        meta.section === section &&
        keepsSectionThemes(
          section,
          meta,
          themes,
          projectCategories,
        ),
    )
    .sort(
      (left, right) =>
        right.year - left.year ||
        left.label.localeCompare(right.label),
    )
    .slice(0, 3)
    .map((meta) => ({ meta, score: 0 }));
}

/**
 * Calcule le score d'une section à partir de ses contenus.
 *
 * @param section - Section concernée.
 * @param entries - Contenus retenus.
 * @param weak - Correspondances limitées au nom de la section.
 * @param hasRealItem - Indique qu'un contenu réel correspond.
 * @returns Le score de la section.
 */
function scoreSectionRank(
  section: VisitSectionId,
  entries: VisitSectionEntry[],
  weak: VisitSearchMatch[],
  hasRealItem: boolean,
): number {
  const scores = entries.map((entry) => entry.score);
  const strongScore =
    (scores[0] ?? 0) +
    (scores[1] ?? 0) * VISIT_CONFIG.searchSecondWeight +
    (scores[2] ?? 0) * VISIT_CONFIG.searchThirdWeight;
  const weakScore = Math.max(
    0,
    ...weak.map((match) => match.score),
  );

  const sectionWeight =
    section === 'skills' ? VISIT_CONFIG.skillsSectionWeight : 1;

  return hasRealItem
    ? strongScore * sectionWeight
    : weakScore * sectionWeight * VISIT_CONFIG.sectionLabelWeight;
}

/**
 * Choisit les contenus d'une section et calcule son score.
 *
 * @param section - Section concernée.
 * @param strong - Contenus réels correspondants.
 * @param weak - Correspondances limitées au nom de la section.
 * @param byId - Métadonnées indexées.
 * @param themes - Thèmes attendus pour la section.
 * @param projectCategories - Catégories de projets acceptées.
 * @returns La section classée.
 */
export function buildSectionRank(
  section: VisitSectionId,
  strong: VisitSectionEntry[],
  weak: VisitSearchMatch[],
  byId: Map<string, VisitSearchMeta>,
  themes: ReturnType<typeof getSectionThemes>,
  projectCategories: string[] | undefined,
): VisitSearchSection {
  const hasRealItem = strong.length > 0;
  const entries = hasRealItem
    ? selectStrongEntries(strong)
    : selectWeakEntries(
        section,
        weak,
        byId,
        themes,
        projectCategories,
      );

  return {
    section,
    entries,
    score: scoreSectionRank(section, entries, weak, hasRealItem),
    hasRealItem,
  };
}
