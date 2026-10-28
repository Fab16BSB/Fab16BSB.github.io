import type { Locale } from './common.types';

/**
 * Article Medium synchronisé depuis le flux RSS.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} title - Titre.
 * @property {string} url - URL de l'article.
 * @property {string} publishedAt - Date ISO de publication.
 * @property {string} excerpt - Extrait.
 * @property {string} [image] - Image de couverture.
 * @property {string[]} tags - Tags de l'article.
 * @property {number} readingTime - Temps de lecture en minutes.
 * @property {Locale | 'unknown'} language - Langue détectée.
 */
export type MediumPost = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  excerpt: string;
  image?: string;
  tags: string[];
  readingTime: number;
  language: Locale | 'unknown';
};
