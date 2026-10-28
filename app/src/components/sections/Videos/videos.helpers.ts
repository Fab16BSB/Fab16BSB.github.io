/* =========================================================================
  IMPORTS
========================================================================= */
import type { Locale } from '@/types/common.types';
import type { YoutubeVideo } from '@/types/youtube.types';

/* =========================================================================
  HELPERS : videos — fonctions pures
  Année et formatage des dates des vidéos.
========================================================================= */

/**
 * Retourne l'année de publication d'une vidéo.
 *
 * @param video - Vidéo YouTube.
 * @returns L'année de publication.
 */
export function videoYear(video: YoutubeVideo): string {
  return video.publishedAt.slice(0, 4);
}

/**
 * Formate la date de publication d'une vidéo.
 *
 * @param value - Date ISO.
 * @param locale - Langue courante.
 * @returns La date formatée, ou la valeur brute si elle est invalide.
 */
export function formatVideoDate(value: string, locale: Locale): string {
  const date = new Date(value);
  let formatted = value;

  if (!Number.isNaN(date.getTime())) {
    formatted = new Intl.DateTimeFormat(
      locale === 'fr' ? 'fr-FR' : locale === 'es' ? 'es-ES' : 'en-GB',
      { day: 'numeric', month: 'short', year: 'numeric' },
    ).format(date);
  }

  return formatted;
}
