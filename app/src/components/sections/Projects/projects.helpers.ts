/* =========================================================================
  IMPORTS
========================================================================= */
import type { Project, ProjectCategory } from '@/types/project.types';
import { matchesQuery } from '@/lib/search';


/* =========================================================================
  CONSTANTE
========================================================================= */

/** Catégories de projets, dans l'ordre des onglets. */
export const projectCategories: ProjectCategory[] = ['personal', 'professional', 'academic'];


/* =========================================================================
  HELPERS : projects — fonctions pures
  Filtrage, comptage et recherche des projets.
========================================================================= */

/**
 * Filtre les projets par catégorie.
 *
 * @param projects - Liste complète des projets.
 * @param category - Catégorie à conserver, ou `all`.
 * @returns Les projets de la catégorie demandée.
 */
export function filterProjects(projects: Project[], category: ProjectCategory | 'all'): Project[] {
  return category === 'all'
    ? [...projects]
    : projects.filter((project) => project.category === category);
}

/**
 * Compte les projets d'une catégorie.
 *
 * @param projects - Liste complète des projets.
 * @param category - Catégorie à compter, ou `all`.
 * @returns Le nombre de projets.
 */
export function countProjects(projects: Project[], category: ProjectCategory | 'all'): number {
  return category === 'all'
    ? projects.length
    : projects.filter((project) => project.category === category).length;
}

/**
 * Retourne les années présentes, de la plus récente à la plus ancienne.
 *
 * @param projects - Liste des projets.
 * @returns Les années triées.
 */
export function getProjectYears(projects: Project[]): string[] {
  return [...new Set(projects.map((project) => project.year))].sort(
    (a, b) => Number(b) - Number(a),
  );
}

/**
 * Vérifie qu'un projet correspond à la recherche.
 *
 * @param project - Projet à tester.
 * @param query - Recherche saisie.
 * @returns `true` si un champ du projet contient les termes recherchés.
 */
export function projectMatches(project: Project, query: string): boolean {
  return matchesQuery(
    [
      project.year,
      ...Object.values(project.title),
      ...Object.values(project.description),
      ...Object.values(project.details),
      ...project.stack,
    ],
    query,
  );
}
