/* =========================================================================
  API : index du graphe de connaissances
  Construit le graphe une fois et expose les accès aux nœuds.
========================================================================= */
import type {
  KnowledgeContentKind,
  KnowledgeGraph,
} from '@/types/knowledge.types';
import { extractContentNodes } from './knowledge-extract';
import { buildKnowledgeGraph } from './knowledge-graph';

/* =========================================================================
  TYPES ET CONSTANTES
========================================================================= */

/** Index du graphe, construit une fois puis réutilisé. */
type KnowledgeIndex = {
  graph: KnowledgeGraph;
};

/** Index mémoïsé, partagé par tous les appelants. */
let cachedIndex: KnowledgeIndex | null = null;

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Construit l'identifiant global d'un contenu.
 *
 * @param kind - Nature du contenu.
 * @param sourceId - Identifiant de la source.
 * @returns L'identifiant préfixé.
 */
function knowledgeNodeId(
  kind: KnowledgeContentKind,
  sourceId: string,
): string {
  return `${kind}:${sourceId}`;
}

/**
 * Normalise l'identifiant d'un projet, avec ou sans préfixe.
 *
 * @param projectId - Identifiant brut ou déjà préfixé.
 * @returns L'identifiant `project:<id>`.
 */
export function projectNodeId(projectId: string): string {
  return projectId.startsWith('project:')
    ? projectId
    : knowledgeNodeId('project', projectId);
}

/**
 * Construit l'index du graphe à la première demande, puis le réutilise.
 *
 * @returns L'index mémoïsé.
 */
export function getKnowledgeIndex(): KnowledgeIndex {
  if (!cachedIndex) {
    cachedIndex = {
      graph: buildKnowledgeGraph(extractContentNodes()),
    };
  }
  return cachedIndex;
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Retourne le graphe de connaissances complet du portfolio.
 *
 * @returns Le graphe construit.
 */
export function getKnowledgeGraph(): KnowledgeGraph {
  return getKnowledgeIndex().graph;
}
