/* =========================================================================
  HELPERS : tri des recommandations — fonctions pures
  Score, puis année, puis identifiant ; variante projets en tête.
========================================================================= */
import type { KnowledgeRecommendation } from '@/types/knowledge.types';

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Compare deux recommandations.
 *
 * @param left - Première recommandation.
 * @param right - Seconde recommandation.
 * @returns Un nombre négatif, nul ou positif selon l'ordre attendu.
 */
export function compareRecommendations(
  left: KnowledgeRecommendation,
  right: KnowledgeRecommendation,
): number {
  return (
    right.score - left.score ||
    (right.node.year ?? 0) - (left.node.year ?? 0) ||
    left.node.id.localeCompare(right.node.id)
  );
}

/**
 * Compare deux recommandations en plaçant les projets en tête.
 *
 * @param left - Première recommandation.
 * @param right - Seconde recommandation.
 * @returns Un nombre négatif, nul ou positif selon l'ordre attendu.
 */
export function compareProjectsFirst(
  left: KnowledgeRecommendation,
  right: KnowledgeRecommendation,
): number {
  return (
    (left.node.kind === 'project' ? 0 : 1) -
      (right.node.kind === 'project' ? 0 : 1) ||
    compareRecommendations(left, right)
  );
}
