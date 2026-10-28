/**
 * Vidéo YouTube synchronisée depuis le flux de la chaîne.
 *
 * @property {string} id - Identifiant de la vidéo.
 * @property {string} title - Titre.
 * @property {string} url - URL YouTube.
 * @property {string} publishedAt - Date ISO de publication.
 * @property {string} thumbnail - URL de la miniature.
 * @property {string} fallbackThumbnail - URL de secours de la miniature.
 * @property {number} views - Nombre de vues.
 * @property {'video' | 'short'} type - Format de la vidéo.
 */
export type YoutubeVideo = {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  thumbnail: string;
  fallbackThumbnail: string;
  views: number;
  type: 'video' | 'short';
};
