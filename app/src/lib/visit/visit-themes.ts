/* =========================================================================
   HELPERS : thèmes de domaine du parcours — fonctions pures
   Un profil ne fournit que des thèmes ; les contenus sont classés par
   correspondance réelle avec ces thèmes.
========================================================================= */
import { detectThemesFromTexts } from '@/lib/knowledge/knowledge-matching';
import type { KnowledgeThemeId } from '@/types/knowledge.types';

/**
 * Détecte les thèmes présents dans un ensemble de textes.
 *
 * @param texts - Textes à analyser.
 * @returns Les thèmes détectés, du plus fort au plus faible.
 */
export function detectThemes(texts: string[]): KnowledgeThemeId[] {
  return detectThemesFromTexts(texts);
}

/**
 * Calcule la correspondance entre des thèmes de contenu et ceux du profil.
 *
 * Les thèmes placés en tête du profil comptent davantage.
 *
 * @param itemThemes - Thèmes détectés sur le contenu.
 * @param profileThemes - Thèmes du profil, dans l'ordre de priorité.
 * @returns Un score de correspondance.
 */
export function getThemeScore(
  itemThemes: KnowledgeThemeId[],
  profileThemes: KnowledgeThemeId[],
): number {
  if (profileThemes.length === 0) {
    return 0;
  }

  let score = 0;

  for (const theme of itemThemes) {
    const index = profileThemes.indexOf(theme);

    if (index >= 0) {
      score += profileThemes.length - index;
    }
  }

  return score;
}
