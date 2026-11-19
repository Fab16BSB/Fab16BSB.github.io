/* =========================================================================
  HELPERS : articles Medium — fonctions pures
  Détection des traductions d'un même article et index par langue.
========================================================================= */
import type { Locale } from '@/types/common.types';
import type { MediumPost } from '@/types/medium.types';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Nombre de tags communs qui identifient deux traductions d'un article. */
export const TRANSLATION_TAG_COUNT = 4;

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Compte les tags communs à deux articles Medium.
 *
 * @param left - Tags du premier article.
 * @param right - Tags du second article.
 * @returns Le nombre de tags identiques, sans tenir compte de la casse.
 */
export function sharedArticleTagCount(
  left: string[],
  right: string[],
): number {
  const rightTags = new Set(
    right.map((tag) => tag.toLowerCase()),
  );

  return left.filter((tag) => rightTags.has(tag.toLowerCase())).length;
}

/**
 * Indique si deux jeux de tags décrivent le même article.
 *
 * @param left - Tags du premier article.
 * @param right - Tags du second article.
 * @returns `true` si assez de tags sont partagés.
 */
export function areArticleTranslations(
  left: string[],
  right: string[],
): boolean {
  return sharedArticleTagCount(left, right) >= TRANSLATION_TAG_COUNT;
}

/**
 * Indexe les traductions Medium d'un même article.
 *
 * @param posts - Articles Medium du portfolio.
 * @returns Une table `id d'article → traductions par langue`.
 */
export function buildArticleTranslationIndex(
  posts: MediumPost[],
): Map<string, Map<Locale, MediumPost>> {
  const index = new Map<string, Map<Locale, MediumPost>>();

  for (const post of posts) {
    const translations = new Map<Locale, MediumPost>();

    for (const candidate of posts) {
      const isSamePost = candidate.id === post.id;
      const isTranslation = areArticleTranslations(
        post.tags,
        candidate.tags,
      );

      if (!isSamePost && !isTranslation) continue;
      if (candidate.language !== 'unknown') {
        translations.set(candidate.language, candidate);
      }
    }

    index.set(post.id, translations);
  }

  return index;
}
