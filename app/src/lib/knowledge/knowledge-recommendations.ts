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
import { areArticleTranslations } from '@/lib/medium-articles';
import { getKnowledgeIndex, projectNodeId } from './knowledge-index';
import { isContentNode } from './knowledge-nodes';
import { rankSimilarityRecommendations } from './knowledge-rank';
import {
  compareProjectsFirst,
  compareRecommendations,
} from './knowledge-sort';
import { rankDirectSkillRecommendations } from './knowledge-signals';

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Indique si un article est déjà représenté par une de ses traductions.
 *
 * @param node - Contenu candidat.
 * @param merged - Recommandations déjà retenues.
 * @returns `true` si une traduction est déjà présente.
 */
function isArticleTranslationDuplicate(
  node: KnowledgeRecommendation['node'],
  merged: KnowledgeRecommendation[],
): boolean {
  return (
    node.kind === 'article' &&
    merged.some(
      (item) =>
        item.node.kind === 'article' &&
        areArticleTranslations(item.node.tags, node.tags),
    )
  );
}

/**
 * Fusionne plusieurs listes sans doublon, en gardant le meilleur score.
 *
 * @param groups - Listes de recommandations par ordre de priorité.
 * @param limit - Nombre maximal de recommandations.
 * @returns Les recommandations fusionnées et triées.
 */
function mergeKnowledgeRecommendations(
  groups: KnowledgeRecommendation[][],
  limit: number,
): KnowledgeRecommendation[] {
  const byId = new Map<string, KnowledgeRecommendation>();
  const merged: KnowledgeRecommendation[] = [];

  for (const group of groups) {
    for (const recommendation of group) {
      const existing = byId.get(recommendation.node.id);

      if (existing) {
        if (recommendation.score > existing.score) {
          // Le premier objet garde ses métadonnées (dont `context`).
          byId.set(recommendation.node.id, {
            ...existing,
            score: recommendation.score,
          });
        }

        continue;
      }

      if (isArticleTranslationDuplicate(recommendation.node, merged)) {
        continue;
      }

      byId.set(recommendation.node.id, recommendation);
      merged.push(recommendation);
    }
  }

  return [...byId.values()].sort(compareRecommendations).slice(0, limit);
}

/**
 * Place les projets en tête des recommandations d'une compétence.
 *
 * @param recommendations - Recommandations à réordonner.
 * @returns Une nouvelle liste triée.
 */
function prioritizeProjects(
  recommendations: KnowledgeRecommendation[],
): KnowledgeRecommendation[] {
  return [...recommendations].sort(compareProjectsFirst);
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Retourne les contenus proches d'un nœud du graphe.
 *
 * @param nodeId - Identifiant global du contenu de départ.
 * @param options - Filtres de nature, score minimal et limite.
 * @returns Les recommandations classées.
 */
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

/**
 * Recommande les projets proches d'un projet, par thème et technologies.
 *
 * @param projectId - Identifiant du projet, avec ou sans préfixe.
 * @param limit - Nombre maximal de recommandations.
 * @returns Les projets proches classés.
 */
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
