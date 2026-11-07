/* =========================================================================
  IMPORTS
========================================================================= */
import type { Skill, SkillCategory } from '@/types/skill.types';


/* =========================================================================
  CONSTANTES
========================================================================= */

/** Catégories de compétences, dans l'ordre des onglets. */
export const skillCategories: SkillCategory[] = [
  'languages',
  'libraries',
  'llm',
  'databases',
  'deployment',
  'tools',
];


/* =========================================================================
  HELPERS : skills — fonctions pures
  Catégories, domaines de connaissance et filtrage des compétences.
========================================================================= */

/**
 * Filtre les compétences par catégorie.
 *
 * @param skills - Liste complète des compétences.
 * @param category - Catégorie à conserver, ou `all`.
 * @returns Les compétences de la catégorie demandée.
 */
export function filterSkills(skills: Skill[], category: SkillCategory | 'all'): Skill[] {
  return category === 'all' ? skills : skills.filter((skill) => skill.category === category);
}

/**
 * Compte les compétences d'une catégorie.
 *
 * @param skills - Liste complète des compétences.
 * @param category - Catégorie à compter, ou `all`.
 * @returns Le nombre de compétences.
 */
export function countSkills(skills: Skill[], category: SkillCategory | 'all'): number {
  return filterSkills(skills, category).length;
}
