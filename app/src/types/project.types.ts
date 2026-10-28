import type { Accent, Localized } from './common.types';

/** Catégorie d'un projet. */
export type ProjectCategory = 'personal' | 'professional' | 'academic';

/** Niveau d'études associé à un projet académique. */
export type ProjectStudyLevel =
  | 'but1'
  | 'but2'
  | 'but3'
  | 'master1'
  | 'master2'
  | 'doctorate';

/** Clés de liens possibles pour un projet. */
export type ProjectLinkKey = 'github' | 'demo' | 'video' | 'site' | 'pdf';

/**
 * Lien supplémentaire affiché sur une carte projet.
 *
 * @property {Localized} label - Libellé traduit.
 * @property {string} url - URL cible.
 * @property {'github' | 'external' | 'book' | 'download' | 'play'} [icon] - Icône du lien.
 */
export type ProjectExtraLink = {
  label: Localized;
  url: string;
  icon?: 'github' | 'external' | 'book' | 'download' | 'play';
};

/**
 * Visuel de la galerie d'un projet.
 *
 * @property {string} src - Chemin de l'image servie.
 * @property {Localized} caption - Légende traduite.
 */
export type ProjectGalleryImage = {
  src: string;
  caption: Localized;
};

/**
 * Projet affiché dans la section Projects.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} year - Année affichée.
 * @property {ProjectCategory} category - Projet académique, personnel ou professionnel.
 * @property {Localized} title - Titre.
 * @property {Localized} description - Description courte.
 * @property {Localized} details - Description détaillée.
 * @property {Localized[]} [highlights] - Points clés affichés en liste.
 * @property {string[]} stack - Technologies utilisées.
 * @property {Partial<Record<ProjectLinkKey, string>>} links - Liens du projet.
 * @property {ProjectExtraLink[]} [extraLinks] - Liens supplémentaires.
 * @property {string} [image] - Visuel de la carte.
 * @property {ProjectGalleryImage[]} [gallery] - Captures détaillées du projet.
 * @property {'active' | 'archived'} [status] - Statut du projet.
 * @property {ProjectStudyLevel} [studyLevel] - Niveau d'études associé.
 * @property {Accent} accent - Couleur d'accent.
 * @property {string} icon - Texte affiché si le visuel manque.
 */
export type Project = {
  id: string;
  year: string;
  category: ProjectCategory;
  title: Localized;
  description: Localized;
  details: Localized;
  highlights?: Localized[];
  stack: string[];
  links: Partial<Record<ProjectLinkKey, string>>;
  extraLinks?: ProjectExtraLink[];
  image?: string;
  gallery?: ProjectGalleryImage[];
  status?: 'active' | 'archived';
  studyLevel?: ProjectStudyLevel;
  accent: Accent;
  icon: string;
};
