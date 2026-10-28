import type { Localized } from './common.types';

/** Type d'encadrement. */
export type SupervisionKind = 'apprenticeship' | 'internship' | 'tutoring';

/** Modalité d'encadrement. */
export type SupervisionMode = 'onsite' | 'remote' | 'hybrid';

/**
 * Encadrement affiché dans la section Enseignement.
 *
 * @property {string} id - Identifiant stable.
 * @property {SupervisionKind} kind - Type d'encadrement.
 * @property {SupervisionMode} mode - Modalité d'encadrement.
 * @property {number} [start] - Année de début.
 * @property {number | 'present'} [end] - Année de fin ou `'present'`.
 * @property {Localized} topic - Sujet de l'encadrement.
 * @property {Localized} role - Rôle tenu.
 * @property {number} students - Nombre d'étudiants encadrés.
 * @property {string} institution - Établissement ou entreprise.
 * @property {Localized} description - Description.
 */
export type Supervision = {
  id: string;
  kind: SupervisionKind;
  mode: SupervisionMode;
  start?: number;
  end?: number | 'present';
  topic: Localized;
  role: Localized;
  students: number;
  institution: string;
  description: Localized;
};
