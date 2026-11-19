/* =========================================================================
  API : index du graphe de connaissances
  Construit le graphe une fois et expose les accès aux nœuds.
========================================================================= */
import type {
  KnowledgeContentKind,
  KnowledgeContentNode,
  KnowledgeGraph,
  KnowledgeNode,
} from '@/types/knowledge.types';
import { extractContentNodes } from './knowledge-extract';
import { buildKnowledgeGraph } from './knowledge-graph';

/* =========================================================================
  TYPES ET CONSTANTES
========================================================================= */

type KnowledgeIndex = {
  graph: KnowledgeGraph;
};

let cachedIndex: KnowledgeIndex | null = null;

/* =========================================================================
  HELPERS
========================================================================= */

/** Indique si un nœud du graphe est un contenu. */
export function isContentNode(node: KnowledgeNode): node is KnowledgeContentNode {
  return node.kind !== 'theme' && node.kind !== 'concept';
}

/** Retourne l'identifiant global d'un contenu. */
function knowledgeNodeId(
  kind: KnowledgeContentKind,
  sourceId: string,
): string {
  return `${kind}:${sourceId}`;
}

/** Normalise l'identifiant d'un projet, avec ou sans préfixe. */
export function projectNodeId(projectId: string): string {
  return projectId.startsWith('project:')
    ? projectId
    : knowledgeNodeId('project', projectId);
}

/** Construit l'index du graphe à la première demande, puis le réutilise. */
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

/** Retourne le graphe de connaissances complet du portfolio. */
export function getKnowledgeGraph(): KnowledgeGraph {
  return getKnowledgeIndex().graph;
}
