/* =========================================================================
   PREUVES : projets — fonctions pures
   Un projet compte par sa catégorie, sa récence, sa stack et son thème.
========================================================================= */
import { projects } from '@/data/content/projects.data';
import { visitTarget } from '@/lib/visit/visit-targets';
import { detectThemes, getThemeScore } from '@/lib/visit/visit-themes';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import { parseYear } from '@/lib/date.helpers';
import {
  pickHighlights,
  recencyScore,
} from './visit-evidence.helpers';
import type { VisitEvidenceEntry } from './visit-evidence.types';
import type { Locale } from '@/types/common.types';
import type {
  VisitHighlight,
  VisitPersonaDefinition,
} from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Poids des catégories de projets. */
const PROJECT_CATEGORY_WEIGHT: Record<string, number> = {
  professional: 20,
  personal: 12,
  academic: 6,
  notebook: 4,
};

/* ─────────────────────────────────────────────────────────────────────────
   SÉLECTION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Score un projet pour un profil de lecture.
 *
 * @param project - Projet du portfolio.
 * @param locale - Langue de lecture.
 * @param persona - Profil de lecture.
 * @returns Le contenu scoré.
 */
function buildProjectEntry(
  project: (typeof projects)[number],
  locale: Locale,
  persona: VisitPersonaDefinition,
): VisitEvidenceEntry {
  const allowed =
    !persona.projectCategories ||
    persona.projectCategories.includes(project.category);
  const texts = [
    project.title[locale],
    project.description[locale],
    project.details[locale],
    project.stack.join(' '),
    project.year,
    project.category,
  ];
  const year = parseYear(project.year);
  const base = allowed
    ? recencyScore(year) +
      (PROJECT_CATEGORY_WEIGHT[project.category] ?? 0) +
      project.stack.length
    : 0;
  const themeScore = allowed
    ? getThemeScore(detectThemes(texts), persona.projectThemes)
    : 0;

  return {
    score: base + themeScore * VISIT_CONFIG.evidenceThemeWeight,
    themeScore,
    highlight: {
      label: project.title[locale],
      detail: [project.year, ...project.stack.slice(0, 3)].join(' · '),
      target: visitTarget('project', project.id),
    },
  };
}

/**
 * Retourne les projets à mettre en avant.
 *
 * @param locale - Langue de lecture.
 * @param limit - Nombre maximal de contenus.
 * @param persona - Profil de lecture.
 * @returns Les projets retenus.
 */
export function getProjectHighlights(
  locale: Locale,
  limit: number,
  persona: VisitPersonaDefinition,
): VisitHighlight[] {
  const entries = projects.map((project) =>
    buildProjectEntry(project, locale, persona),
  );
  const filtered =
    persona.projectThemes.length > 0
      ? entries.filter((entry) => entry.themeScore > 0)
      : entries;

  return pickHighlights(filtered, limit);
}
