import type { Accent, Localized } from './common.types';
import type { EducationId } from './education.types';

/** Identifiants stables des expériences du portfolio. */
export type ExperienceId =
  | 'freelance-leasup'
  | 'ater-paris8'
  | 'these-othello'
  | 'stage-quatorze'
  | 'stage-directannonces'
  | 'stage-soldout';

/** Type de contrat ou d'expérience professionnelle. */
export type ExperienceType = 'freelance' | 'cdd' | 'thesis' | 'internship';

/**
 * Expérience professionnelle affichée dans la timeline.
 *
 * @property {string} id - Identifiant stable.
 * @property {number} start - Année de début.
 * @property {number | 'present'} end - Année de fin ou `'present'`.
 * @property {ExperienceType} type - Type de contrat.
 * @property {Localized} role - Intitulé du poste.
 * @property {string} company - Nom de l'entreprise.
 * @property {string} [companyUrl] - URL de l'entreprise.
 * @property {string} [secondaryUrl] - URL secondaire, par exemple le laboratoire.
 * @property {EducationId} [educationId] - Formation suivie pendant l'expérience.
 * @property {Localized} [description] - Description longue.
 * @property {Localized[]} [points] - Points clés.
 * @property {string[]} tags - Technologies et mots-clés.
 * @property {Accent} accent - Couleur d'accent.
 * @property {boolean} [legacy] - Marque les expériences anciennes.
 */
export type Experience = {
  id: ExperienceId;
  start: number;
  end: number | 'present';
  type: ExperienceType;
  role: Localized;
  company: string;
  companyUrl?: string;
  secondaryUrl?: string;
  educationId?: EducationId;
  description?: Localized;
  points?: Localized[];
  tags: string[];
  accent: Accent;
  legacy?: boolean;
};
