/* =========================================================================
  HELPERS : nœuds du graphe de connaissances — fonctions pures
  Distinction entre contenus, thèmes et concepts.
========================================================================= */
import type {
  KnowledgeContentNode,
  KnowledgeNode,
} from '@/types/knowledge.types';

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Indique si un nœud du graphe est un contenu.
 *
 * @param node - Nœud du graphe.
 * @returns `true` si le nœud n'est ni un thème ni un concept.
 */
export function isContentNode(
  node: KnowledgeNode,
): node is KnowledgeContentNode {
  return node.kind !== 'theme' && node.kind !== 'concept';
}
