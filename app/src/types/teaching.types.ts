import type { Localized } from './common.types';

/** Niveau d'enseignement. */
export type TeachingLevel = 'but1' | 'but2' | 'but3' | 'master1' | 'licence2';

/** Modalité d'enseignement. */
export type TeachingPlace = 'onsite' | 'online';

/** Type d'activité pédagogique. */
export type TeachingActivity = 'CM' | 'TD' | 'TP' | 'SAE' | 'CS';

/**
 * Répartition horaire d'un cours par type d'activité.
 *
 * @property {TeachingActivity} type - Type d'activité.
 * @property {number} hours - Nombre d'heures.
 */
export type TeachingDistribution = {
  type: TeachingActivity;
  hours: number;
};

/**
 * Cours affiché dans la section Enseignement.
 *
 * @property {string} id - Identifiant stable.
 * @property {number} start - Année de début.
 * @property {number} end - Année de fin.
 * @property {Localized} theme - Intitulé du cours.
 * @property {TeachingLevel} level - Niveau d'enseignement.
 * @property {string} students - Effectif affiché.
 * @property {TeachingPlace} place - Présentiel ou en ligne.
 * @property {number} hours - Volume horaire total.
 * @property {TeachingDistribution[]} distribution - Répartition par activité.
 */
export type TeachingCourse = {
  id: string;
  start: number;
  end: number;
  theme: Localized;
  level: TeachingLevel;
  students: string;
  place: TeachingPlace;
  hours: number;
  distribution: TeachingDistribution[];
};
