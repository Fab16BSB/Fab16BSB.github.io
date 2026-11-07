/* =========================================================================
  HELPERS : recommandations de projets — fonctions pures
  Adapte le graphe de connaissances aux cartes de projet du site.
========================================================================= */
import { knowledgeThemes } from '@/data/knowledge-taxonomy.data';
import { projects } from '@/data/projects.data';
import type { Localized } from '@/types/common.types';
import type { KnowledgeRelatedProject } from '@/types/knowledge.types';
import { getKnowledgeGraph } from './knowledge-index';
import { getSimilarProjects } from './knowledge-recommendations';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Index des projets par identifiant. */
const projectById = new Map(projects.map((project) => [project.id, project]));

/** Libellés des thèmes, indexés par identifiant. */
const themeLabels = new Map(
  knowledgeThemes.map((theme) => [theme.id, theme.label]),
);

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Retourne les projets proches d'un projet, prêts pour l'affichage.
 *
 * @param projectId - Identifiant du projet.
 * @param limit - Nombre maximal de recommandations.
 * @returns Les projets recommandés avec leurs raisons traduisibles.
 */
export function getRelatedProjects(
  projectId: string,
  limit = 3,
): KnowledgeRelatedProject[] {
  const graph = getKnowledgeGraph();
  const conceptLabels = new Map(
    graph.nodes
      .filter((node) => node.kind === 'concept')
      .map((node) => [node.sourceId, node.label.fr]),
  );

  return getSimilarProjects(projectId, limit)
    .map((recommendation) => {
      const project = projectById.get(recommendation.node.sourceId);
      if (!project) return null;

      const labels = recommendation.sharedThemes
        .map((theme) => themeLabels.get(theme))
        .filter((label): label is Localized => Boolean(label))
        .slice(0, 2);

      return {
        project,
        score: recommendation.score,
        themeLabels: labels,
        termLabels: recommendation.sharedTerms
          .map((term) => conceptLabels.get(term) ?? term)
          .slice(0, 3),
      };
    })
    .filter((entry): entry is KnowledgeRelatedProject => entry !== null);
}
