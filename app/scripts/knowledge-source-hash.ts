/* =========================================================================
  HELPERS : hash des sources — fonctions pures
  Hash des champs qui changent le texte encodé d'un contenu.
========================================================================= */

/* =========================================================================
  IMPORTS
========================================================================= */
import { createHash } from 'node:crypto';
import type { Localized } from '../src/types/common.types';

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Calcule le hash du texte et des tags d'un contenu.
 *
 * `conceptIds` et les arêtes du graphe n'en font pas partie : ils ne modifient
 * pas les embeddings.
 *
 * @param node - Texte localisé et tags du contenu.
 * @returns Le hash SHA-256 hexadécimal.
 */
export function hashKnowledgeSource(node: {
  text: Localized;
  tags: string[];
}): string {
  return createHash('sha256')
    .update(
      [
        node.text.fr,
        node.text.en,
        node.text.es,
        node.tags.join('|'),
      ].join('\n'),
      'utf8',
    )
    .digest('hex');
}
