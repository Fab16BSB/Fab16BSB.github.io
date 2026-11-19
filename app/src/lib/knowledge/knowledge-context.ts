/* =========================================================================
  HELPERS : contexte explicite du graphe
  Relie les formations et expériences à leurs contenus, dans les deux sens.
========================================================================= */
import type {
  KnowledgeContentNode,
  KnowledgeGraph,
  KnowledgeRecommendation,
  KnowledgeRecommendationOptions,
} from '@/types/knowledge.types';
import { KNOWLEDGE_RANKING, getKnowledgeSuggestionWeight } from './knowledge.config';
import { isContentNode } from './knowledge-index';

/* =========================================================================
  HELPERS
========================================================================= */

/** Relie un contenu aux formations et expériences qu'il déclare. */
export function rankContextRecommendations(
  graph: KnowledgeGraph,
  source: KnowledgeContentNode,
  options: KnowledgeRecommendationOptions,
): KnowledgeRecommendation[] {
  const acceptedKinds = options.kinds ? new Set(options.kinds) : null;
  const minScore = options.minScore ?? KNOWLEDGE_RANKING.minScore;
  if (KNOWLEDGE_RANKING.structuralScore < minScore) return [];

  const linkedIds = new Set<string>();

  if (source.kind === 'experience' && source.educationId) {
    linkedIds.add(`education:${source.educationId}`);
  }

  for (const educationId of source.educationIds ?? []) {
    linkedIds.add(`education:${educationId}`);
  }

  for (const experienceId of source.experienceIds ?? []) {
    linkedIds.add(`experience:${experienceId}`);
  }

  // Vue inverse : une formation ou une expérience pointe vers ses contenus.
  if (source.kind === 'education' || source.kind === 'experience') {
    for (const node of graph.nodes) {
      if (!isContentNode(node)) continue;

      if (node.experienceIds?.some((id) => id === source.sourceId)) {
        linkedIds.add(node.id);
      }
      if (node.educationIds?.some((id) => id === source.sourceId)) {
        linkedIds.add(node.id);
      }
      if (node.kind === 'experience' && node.educationId === source.sourceId) {
        linkedIds.add(node.id);
      }
    }
  }

  const nodesById = new Map(graph.nodes.map((node) => [node.id, node]));

  return [...linkedIds]
    .map((nodeId) => nodesById.get(nodeId))
    .filter(
      (node): node is KnowledgeContentNode =>
        Boolean(node && isContentNode(node)),
    )
    .filter((node) => !acceptedKinds || acceptedKinds.has(node.kind))
    .filter((node) => getKnowledgeSuggestionWeight(source.kind, node.kind) > 0)
    .map((node) => ({
      node,
      score: Math.min(
        1,
        KNOWLEDGE_RANKING.structuralScore *
          getKnowledgeSuggestionWeight(source.kind, node.kind),
      ),
      sharedThemes: node.kind === 'education' ? (['education'] as const) : [],
      sharedTerms: [],
      samePeriod: true,
      context: true,
    }));
}
