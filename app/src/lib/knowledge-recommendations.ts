/* =========================================================================
  API : recommandations du graphe de connaissances
  Fusionne les signaux structurels et sémantiques pour un contenu donné.
========================================================================= */
import type {
  KnowledgeRecommendation,
  KnowledgeRecommendationOptions,
} from '@/types/knowledge.types';
import { KNOWLEDGE_RANKING } from './knowledge.config';
import { rankContextRecommendations } from './knowledge-context';
import {
  rankProjectFallback,
  rankReciprocalProjectRecommendations,
} from './knowledge-fallback';
import { getKnowledgeIndex, isContentNode, projectNodeId } from './knowledge-index';
import { rankSimilarityRecommendations } from './knowledge-rank';
import { rankDirectSkillRecommendations } from './knowledge-signals';

/* =========================================================================
  HELPERS
========================================================================= */

/** Fusionne plusieurs listes sans doublon, dans l'ordre de priorité. */
function mergeKnowledgeRecommendations(
  groups: KnowledgeRecommendation[][],
  limit: number,
): KnowledgeRecommendation[] {
  const seen = new Set<string>();
  const merged: KnowledgeRecommendation[] = [];

  for (const group of groups) {
    for (const recommendation of group) {
      if (seen.has(recommendation.node.id)) continue;
      seen.add(recommendation.node.id);
      merged.push(recommendation);
    }
  }

  return sortKnowledgeRecommendations(merged).slice(0, limit);
}

/** Trie des recommandations par score, puis par année et identifiant. */
function sortKnowledgeRecommendations(
  recommendations: KnowledgeRecommendation[],
): KnowledgeRecommendation[] {
  return [...recommendations].sort(
    (left, right) =>
      right.score - left.score ||
      (right.node.year ?? 0) - (left.node.year ?? 0) ||
      left.node.id.localeCompare(right.node.id),
  );
}

/** Place les projets en tête des recommandations d'une compétence. */
function prioritizeProjects(
  recommendations: KnowledgeRecommendation[],
): KnowledgeRecommendation[] {
  return [...recommendations].sort(
    (left, right) =>
      (left.node.kind === 'project' ? 0 : 1) -
        (right.node.kind === 'project' ? 0 : 1) ||
      right.score - left.score ||
      (right.node.year ?? 0) - (left.node.year ?? 0) ||
      left.node.id.localeCompare(right.node.id),
  );
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/** Retourne les contenus proches d'un nœud du graphe. */
export function getKnowledgeRecommendations(
  nodeId: string,
  options: KnowledgeRecommendationOptions = {},
): KnowledgeRecommendation[] {
  const { graph } = getKnowledgeIndex();
  const source = graph.nodes.find((node) => node.id === nodeId);
  if (!source || !isContentNode(source)) return [];

  const limit = options.limit ?? KNOWLEDGE_RANKING.limit;
  const contextRecommendations = rankContextRecommendations(
    graph,
    source,
    options,
  );

  // Une compétence met d'abord en avant les contenus qui citent sa technologie.
  if (source.kind === 'skill') {
    const direct = rankDirectSkillRecommendations(graph, source, options);
    if (contextRecommendations.length + direct.length >= limit) {
      return prioritizeProjects(
        mergeKnowledgeRecommendations(
          [contextRecommendations, direct],
          limit,
        ),
      );
    }

    const ranked = rankSimilarityRecommendations(graph, source, options);
    return prioritizeProjects(
      mergeKnowledgeRecommendations(
        [contextRecommendations, direct, ranked],
        limit,
      ),
    );
  }

  // Les liens de contexte et la similarité passent devant les compétences.
  const ranked = rankSimilarityRecommendations(graph, source, options);
  const direct = rankDirectSkillRecommendations(graph, source, options);
  const reciprocalProjects = rankReciprocalProjectRecommendations(
    graph,
    source,
    options,
  );

  // Un projet reçoit aussi les projets qui partagent ses thèmes et concepts.
  const fallbackProjects =
    source.kind === 'project' &&
    (!options.kinds || options.kinds.includes('project'))
      ? rankProjectFallback(graph, source.id, limit)
      : [];

  return mergeKnowledgeRecommendations(
    [
      contextRecommendations,
      ranked,
      direct,
      reciprocalProjects,
      fallbackProjects,
    ],
    limit,
  );
}

/** Recommande les projets proches d'un projet, par thème et technologies. */
export function getSimilarProjects(
  projectId: string,
  limit = 4,
): KnowledgeRecommendation[] {
  return getKnowledgeRecommendations(projectNodeId(projectId), {
    kinds: ['project'],
    limit,
    minScore: KNOWLEDGE_RANKING.projectSimilarityMinScore,
  });
}
