import type { Accent, Localized } from './common.types';

/**
 * Lien complémentaire affiché sur une formation.
 *
 * @property {Localized} label - Libellé traduit.
 * @property {string} url - URL cible.
 * @property {'download' | 'external' | 'code' | 'play'} icon - Icône du lien.
 */
export type EducationLink = {
  label: Localized;
  url: string;
  icon: 'download' | 'external' | 'code' | 'play';
};

/**
 * Formation ou diplôme affiché dans la timeline.
 *
 * @property {string} id - Identifiant stable.
 * @property {number} start - Année de début.
 * @property {number} end - Année de fin.
 * @property {Localized} degree - Intitulé du diplôme.
 * @property {Localized} school - Établissement.
 * @property {Localized} [detail] - Précision optionnelle.
 * @property {string} [schoolUrl] - URL de l'établissement.
 * @property {EducationLink[]} [links] - Liens complémentaires.
 * @property {Accent} accent - Couleur d'accent.
 */
export type Education = {
  id: string;
  start: number;
  end: number;
  degree: Localized;
  school: Localized;
  detail?: Localized;
  schoolUrl?: string;
  links?: EducationLink[];
  accent: Accent;
};
