import type { Accent, Locale, Localized } from './common.types';

/** Langue d'une version de publication. */
export type PublicationLanguage = 'fr' | 'en';

/**
 * Points clés d'une publication.
 *
 * `context` : le sujet et pourquoi il compte.
 * `problem` : la difficulté que l'article cherche à résoudre.
 * `solution` : ce que l'article propose pour la résoudre.
 */
export type PublicationPoints = {
  context: string;
  problem: string;
  solution: string;
};

/**
 * Contenu éditorial d'une publication.
 *
 * `points` : contexte, problématique et solution proposée, sans jargon.
 * `keywords` : mots-clés affichés sous forme d'étiquettes.
 */
export type PublicationSummary = {
  points: Record<Locale, PublicationPoints>;
  keywords: Record<Locale, string[]>;
};

/**
 * Lien associé à une publication.
 *
 * @property {'article' | 'pdf' | 'poster' | 'demo' | 'code'} key - Type de lien.
 * @property {string} label - Libellé affiché.
 * @property {string} url - URL cible.
 */
export type PublicationLink = {
  key: 'article' | 'pdf' | 'poster' | 'demo' | 'code';
  label: string;
  url: string;
};

/**
 * Version localisée d'une publication.
 *
 * @property {PublicationLanguage} language - Langue de la version.
 * @property {string} title - Titre.
 * @property {Localized} [subtitle] - Sous-titre optionnel.
 * @property {string} abstract - Abstract original de la version.
 * @property {PublicationLink[]} links - Liens de la version.
 * @property {string} bibtex - BibTeX utilisé pour la citation.
 * @property {string} [rights] - Mention de copyright à afficher avec l'abstract.
 */
export type PublicationVersion = {
  language: PublicationLanguage;
  title: string;
  subtitle?: Localized;
  abstract: string;
  links: PublicationLink[];
  bibtex: string;
  rights?: string;
};

/**
 * Publication affichée dans la section Publications.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} year - Année de publication.
 * @property {Localized} venue - Revue, conférence ou dépôt.
 * @property {string} [venueUrl] - URL de la publication.
 * @property {string[]} authors - Liste des auteurs.
 * @property {PublicationVersion[]} versions - Versions localisées.
 * @property {boolean} [preprint] - Indique un préprint.
 * @property {Accent} accent - Couleur d'accent.
 */
export type Publication = {
  id: string;
  year: string;
  venue: Localized;
  venueUrl?: string;
  authors: string[];
  versions: PublicationVersion[];
  preprint?: boolean;
  accent: Accent;
};
