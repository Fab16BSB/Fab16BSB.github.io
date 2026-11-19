/* =========================================================================
  HELPERS : classement sémantique — fonctions pures
  Voisins sémantiques précalculés et recommandations explicables.
========================================================================= */
import type {
  KnowledgeContentNode,
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeRecommendation,
  KnowledgeRecommendationOptions,
} from '@/types/knowledge.types';
import { KNOWLEDGE_RANKING, getKnowledgeSuggestionWeight } from './knowledge.config';
import { areArticleTranslations } from '@/lib/medium-articles';
import { isContentNode } from './knowledge-nodes';
import { getSimilarityNeighbors } from './knowledge-similarity';
import { compareRecommendations } from './knowledge-sort';

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Indique si deux contenus appartiennent à la même période.
 *
 * @param left - Premier contenu.
 * @param right - Second contenu.
 * @returns `true` si leurs années sont proches.
 */
function isSamePeriod(left: KnowledgeNode, right: KnowledgeNode): boolean {
  return (
    left.year !== undefined &&
    right.year !== undefined &&
    Math.abs(left.year - right.year) <= KNOWLEDGE_RANKING.yearWindow
  );
}

/**
 * Écarte les traductions d'un même article Medium déjà retenues.
 *
 * @param node - Contenu candidat.
 * @param keptTags - Tags des articles déjà retenus.
 * @returns `true` si l'article est un doublon.
 */
function isDuplicateArticle(
  node: KnowledgeNode,
  keptTags: string[][],
): boolean {
  if (node.kind !== 'article') return false;

  const duplicate = keptTags.some((kept) =>
    areArticleTranslations(kept, node.tags),
  );

  if (!duplicate) keptTags.push(node.tags);

  return duplicate;
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Classe les voisins sémantiques précalculés.
 *
 * Les thèmes et concepts servent uniquement à expliquer le lien : la décision
 * de recommander repose sur la similarité sémantique et la matrice de poids.
 *
 * @param graph - Graphe de connaissances.
 * @param source - Contenu de départ.
 * @param options - Limite, natures acceptées et score minimal.
 * @returns Les recommandations sémantiques triées.
 */
export function rankSimilarityRecommendations(
  graph: KnowledgeGraph,
  source: KnowledgeContentNode,
  options: KnowledgeRecommendationOptions,
): KnowledgeRecommendation[] {
  const acceptedKinds = options.kinds ? new Set(options.kinds) : null;
  const minScore = options.minScore ?? KNOWLEDGE_RANKING.semanticMinScore;
  const limit = options.limit ?? KNOWLEDGE_RANKING.limit;
  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));
  const keptArticleTags: string[][] = [];
  const recommendations: KnowledgeRecommendation[] = [];

  for (const neighbor of getSimilarityNeighbors(source.id)) {
    const node = nodesById.get(neighbor.id);
    if (!node || !isContentNode(node)) continue;
    if (acceptedKinds && !acceptedKinds.has(node.kind)) continue;

    // La matrice de suggestions peut exclure (poids 0) ou pondérer la cible.
    const weight = getKnowledgeSuggestionWeight(source.kind, node.kind);
    if (weight <= 0) continue;

    const weightedScore = Math.min(1, neighbor.score * weight);
    if (weightedScore < minScore) continue;
    if (isDuplicateArticle(node, keptArticleTags)) continue;

    const sharedThemes = source.themes.filter((theme) =>
      node.themes.includes(theme),
    );
    const sharedTerms = source.terms
      .filter((term) => node.terms.includes(term))
      .slice(0, 3);

    recommendations.push({
      node,
      score: weightedScore,
      sharedThemes,
      sharedTerms,
      samePeriod: isSamePeriod(source, node),
    });
  }

  return recommendations
    .sort(compareRecommendations)
    .slice(0, limit);
}
