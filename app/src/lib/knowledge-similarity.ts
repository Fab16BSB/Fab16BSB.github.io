/* =========================================================================
  HELPERS : index de similarité sémantique — données précalculées
  Lecture du fichier produit par scripts/build-knowledge-similarity.ts.
========================================================================= */
import similarityRaw from '@/data/knowledge-similarity.json';
import type {
  KnowledgeSimilarityIndex,
  KnowledgeSimilarityNeighbor,
} from '@/types/knowledge.types';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Index chargé une fois au démarrage. */
const similarityIndex = similarityRaw as unknown as KnowledgeSimilarityIndex;

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Retourne les voisins sémantiques précalculés d'un contenu.
 *
 * @param nodeId - Identifiant global du contenu.
 * @returns Les voisins triés, ou un tableau vide si le contenu est absent.
 */
export function getSimilarityNeighbors(nodeId: string): KnowledgeSimilarityNeighbor[] {
  return (similarityIndex.documents[nodeId]?.neighbors ?? []).map(
    ([id, score]) => ({ id, score }),
  );
}

/**
 * Retourne l'index complet, utilisé par les contrôles de fraîcheur.
 *
 * @returns L'index de similarité chargé.
 */
export function getSimilarityIndex(): KnowledgeSimilarityIndex {
  return similarityIndex;
}
