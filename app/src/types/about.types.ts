import type { Locale } from './common.types';

/**
 * Passion affichée dans la section À propos.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} image - Chemin de l'illustration.
 * @property {string} labelKey - Clé de traduction du libellé.
 */
export type Passion = {
  id: string;
  image: string;
  labelKey: string;
};

/**
 * Qualité illustrée dans la section À propos.
 *
 * @property {string} id - Identifiant stable.
 * @property {Record<Locale, string>} images - Illustration par langue.
 * @property {string} labelKey - Clé de traduction du libellé.
 */
export type Quality = {
  id: string;
  images: Record<Locale, string>;
  labelKey: string;
};
