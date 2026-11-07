/* =========================================================================
  HELPERS : repli et symétrie des recommandations projet
  Complète les voisins sémantiques quand ils ne suffisent pas.
========================================================================= */
import type {
  KnowledgeContentNode,
  KnowledgeGraph,
  KnowledgeRecommendation,
  KnowledgeRecommendationOptions,
} from '@/types/knowledge.types';
import { KNOWLEDGE_RANKING, getKnowledgeSuggestionWeight } from './knowledge.config';
import { isContentNode } from './knowledge-index';
import { getSimilarityNeighbors } from './knowledge-similarity';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Score de base d'un projet trouvé par recouvrement de thèmes/concepts. */
const PROJECT_FALLBACK_BASE_SCORE = 0.15;

/** Bonus par thème partagé dans le repli projet. */
const PROJECT_FALLBACK_THEME_SCORE = 0.1;

/** Bonus par concept partagé dans le repli projet. */
const PROJECT_FALLBACK_TERM_SCORE = 0.08;

/* =========================================================================
  HELPERS
========================================================================= */

/** Classe les projets proches par recouvrement de thèmes et de concepts. */
export function rankProjectFallback(
  graph: KnowledgeGraph,
  projectId: string,
  limit: number,
): KnowledgeRecommendation[] {
  const source = graph.nodes.find((node) => node.id === projectId);
  if (!source || source.kind !== 'project') return [];

  const weight = getKnowledgeSuggestionWeight('project', 'project');

  return graph.nodes
    .filter(
      (node): node is KnowledgeContentNode =>
        isContentNode(node) && node.kind === 'project' && node.id !== source.id,
    )
    .map((node) => {
      const sharedThemes = source.themes.filter((theme) =>
        node.themes.includes(theme),
      );
      const sharedTerms = source.terms.filter((term) =>
        node.terms.includes(term),
      );
      const score = Math.min(
        1,
        (PROJECT_FALLBACK_BASE_SCORE +
          sharedThemes.length * PROJECT_FALLBACK_THEME_SCORE +
          sharedTerms.length * PROJECT_FALLBACK_TERM_SCORE) *
          weight,
      );

      return {
        node,
        score,
        sharedThemes,
        sharedTerms,
        samePeriod:
          source.year !== undefined &&
          node.year !== undefined &&
          Math.abs(source.year - node.year) <= KNOWLEDGE_RANKING.yearWindow,
      };
    })
    .filter(
      // Un repli doit être porté par un concept partagé, pas seulement par un thème générique.
      (entry) => entry.sharedTerms.length > 0,
    )
    .filter(
      (entry) => entry.score >= KNOWLEDGE_RANKING.projectSimilarityMinScore,
    )
    .sort(
      (left, right) =>
        right.score - left.score ||
        (right.node.year ?? 0) - (left.node.year ?? 0) ||
        left.node.id.localeCompare(right.node.id),
    )
    .slice(0, limit);
}

/** Ajoute les projets qui recommandent déjà la source. */
export function rankReciprocalProjectRecommendations(
  graph: KnowledgeGraph,
  source: KnowledgeContentNode,
  options: KnowledgeRecommendationOptions,
): KnowledgeRecommendation[] {
  if (source.kind !== 'project') return [];

  const acceptedKinds = options.kinds ? new Set(options.kinds) : null;
  if (acceptedKinds && !acceptedKinds.has('project')) return [];

  const minScore = options.minScore ?? KNOWLEDGE_RANKING.semanticMinScore;
  const weight = getKnowledgeSuggestionWeight('project', 'project');
  if (weight <= 0) return [];

  const recommendations: KnowledgeRecommendation[] = [];

  for (const node of graph.nodes) {
    if (!isContentNode(node) || node.kind !== 'project' || node.id === source.id) {
      continue;
    }

    const neighbor = getSimilarityNeighbors(node.id).find(
      (entry) => entry.id === source.id,
    );
    if (!neighbor) continue;

    const score = Math.min(1, neighbor.score * weight);
    if (score < minScore) continue;

    recommendations.push({
      node,
      score,
      sharedThemes: source.themes.filter((theme) =>
        node.themes.includes(theme),
      ),
      sharedTerms: source.terms
        .filter((term) => node.terms.includes(term))
        .slice(0, 3),
      samePeriod:
        source.year !== undefined &&
        node.year !== undefined &&
        Math.abs(source.year - node.year) <= KNOWLEDGE_RANKING.yearWindow,
    });
  }

  return recommendations;
}
