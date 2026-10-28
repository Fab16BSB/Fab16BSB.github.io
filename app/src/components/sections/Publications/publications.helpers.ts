/* =========================================================================
  IMPORTS
========================================================================= */
import type { Locale } from '@/types/common.types';
import type { MediumPost } from '@/types/medium.types';
import type { Publication, PublicationVersion } from '@/types/publication.types';
import { matchesQuery } from '@/lib/search';

/* =========================================================================
  HELPERS : publications — fonctions pures
  Tri, filtrage, recherche et formatage des publications.
========================================================================= */

/**
 * Trie les publications par année décroissante.
 *
 * @param items - Publications à trier.
 * @returns Une copie triée.
 */
export function sortPublications<T extends { year: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => Number(b.year) - Number(a.year));
}

/**
 * Trie les articles Medium du plus récent au plus ancien.
 *
 * @param posts - Articles à trier.
 * @returns Une copie triée.
 */
export function sortMediumPosts(posts: MediumPost[]): MediumPost[] {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/**
 * Garde les articles Medium de la langue courante.
 *
 * @param posts - Articles disponibles.
 * @param locale - Langue courante.
 * @returns Les articles de la langue, ou tous les articles si aucun ne correspond.
 */
export function filterMediumPosts(posts: MediumPost[], locale: Locale): MediumPost[] {
  const matching = posts.filter((post) => post.language === locale);

  return matching.length > 0 ? matching : posts;
}

/**
 * Choisit la version d'une publication pour la langue courante.
 *
 * @param publication - Publication complète.
 * @param locale - Langue courante.
 * @returns La version dans la langue, sinon en anglais, sinon la première.
 */
export function pickPublicationVersion(publication: Publication, locale: Locale): PublicationVersion {
  return (
    publication.versions.find((version) => version.language === locale) ??
    publication.versions.find((version) => version.language === 'en') ??
    publication.versions[0]
  );
}

/**
 * Retourne les années présentes, de la plus récente à la plus ancienne.
 *
 * @param items - Éléments possédant une année.
 * @returns Les années triées.
 */
export function availableYears(items: Array<{ year: string }>): string[] {
  return [...new Set(items.map((item) => item.year))].sort((a, b) => Number(b) - Number(a));
}

/**
 * Vérifie qu'une publication correspond à la recherche.
 *
 * @param publication - Publication à tester.
 * @param query - Recherche saisie.
 * @returns `true` si l'année, les auteurs, le lieu ou les titres correspondent.
 */
export function publicationMatches(publication: Publication, query: string): boolean {
  const versions = publication.versions.flatMap((version) => [
    version.title,
    ...(version.subtitle ? Object.values(version.subtitle) : []),
  ]);

  return matchesQuery(
    [publication.year, ...publication.authors, ...Object.values(publication.venue), ...versions],
    query,
  );
}

/**
 * Extrait l'année d'un article Medium.
 *
 * @param post - Article Medium.
 * @returns L'année de publication.
 */
export function mediumPostYear(post: MediumPost): string {
  return post.publishedAt.slice(0, 4);
}

/**
 * Vérifie qu'un article Medium correspond à la recherche.
 *
 * @param post - Article à tester.
 * @param query - Recherche saisie.
 * @returns `true` si le titre, l'extrait, la date ou les tags correspondent.
 */
export function mediumPostMatches(post: MediumPost, query: string): boolean {
  return matchesQuery([post.title, post.excerpt, post.publishedAt, ...post.tags], query);
}

/**
 * Formate la date d'un article Medium.
 *
 * @param value - Date ISO.
 * @param locale - Langue courante.
 * @returns La date formatée, ou la valeur brute si elle est invalide.
 */
export function formatPostDate(value: string, locale: Locale): string {
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
