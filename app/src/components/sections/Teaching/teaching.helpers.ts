/* =========================================================================
  IMPORTS
========================================================================= */
import type { TeachingCourse, TeachingLevel } from '@/types/teaching.types';
import { matchesQuery } from '@/lib/search';

/* =========================================================================
  HELPERS : teaching — fonctions pures
  Filtrage, niveaux, totaux et formatage de l'enseignement.
========================================================================= */

/**
 * Vérifie qu'un cours appartient à une année donnée.
 *
 * @param course - Cours à tester.
 * @param year - Année sélectionnée, ou `all`.
 * @returns `true` si l'année est dans la période du cours.
 */
export function courseMatchesYear(course: TeachingCourse, year: number | 'all'): boolean {
  return year === 'all' || (year >= course.start && year <= course.end);
}

/**
 * Filtre les cours par année, niveau et recherche.
 *
 * @param courses - Liste complète des cours.
 * @param year - Année sélectionnée, ou `all`.
 * @param level - Niveau sélectionné, ou `all`.
 * @param query - Recherche saisie.
 * @returns Les cours correspondant aux filtres.
 */
export function filterCourses(
  courses: TeachingCourse[],
  year: number | 'all',
  level: TeachingLevel | 'all',
  query = '',
): TeachingCourse[] {
  return courses.filter(
    (course) =>
      courseMatchesYear(course, year) &&
      (level === 'all' || course.level === level) &&
      matchesQuery(Object.values(course.theme), query),
  );
}

/** Ordre d'affichage des niveaux. */
const levelOrder: TeachingLevel[] = ['but1', 'but2', 'but3', 'licence2', 'master1'];

/**
 * Retourne les années de début présentes, de la plus récente à la plus ancienne.
 *
 * @param courses - Liste des cours.
 * @returns Les années triées.
 */
export function getYears(courses: TeachingCourse[]): number[] {
  return [...new Set(courses.map((course) => course.start))].sort((a, b) => b - a);
}

/**
 * Retourne les niveaux présents, dans l'ordre pédagogique.
 *
 * @param courses - Liste des cours.
 * @returns Les niveaux présents, puis les niveaux inconnus.
 */
export function getLevels(courses: TeachingCourse[]): TeachingLevel[] {
  const present = new Set(courses.map((course) => course.level));
  const ordered = levelOrder.filter((level) => present.has(level));
  const extra = [...present].filter((level) => !levelOrder.includes(level));

  return [...ordered, ...extra];
}

/**
 * Additionne les heures d'une liste de cours.
 *
 * @param courses - Liste des cours.
 * @returns Le total d'heures.
 */
export function totalHours(courses: TeachingCourse[]): number {
  return courses.reduce((sum, course) => sum + course.hours, 0);
}

/**
 * Formate un nombre d'heures sans décimale inutile.
 *
 * @param value - Nombre d'heures.
 * @returns Le nombre en texte.
 */
export function formatHours(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

/**
 * Formate la période d'un cours.
 *
 * @param course - Cours concerné.
 * @returns L'année seule ou la plage `début — fin`.
 */
export function formatCourseYears(course: TeachingCourse): string {
  return course.start === course.end ? String(course.start) : `${course.start} — ${course.end}`;
}
