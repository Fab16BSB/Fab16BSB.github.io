/* =========================================================================
  IMPORTS
========================================================================= */
import type { Project, ProjectCategory } from '@/types/project.types';


/* =========================================================================
  CONSTANTE
========================================================================= */

/** Catégories de projets, dans l'ordre des onglets. */
export const projectCategories: ProjectCategory[] = [
  'personal',
  'professional',
  'academic',
  'notebook',
];


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
