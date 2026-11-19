/* =========================================================================
  HELPERS : correspondance thèmes et concepts — fonctions pures
  Préparation unique des termes, puis détection dans un texte.
========================================================================= */
import { knowledgeThemes } from '@/data/knowledge/knowledge-taxonomy.data';
import type { KnowledgeNode } from '@/types/knowledge.types';
import { knowledgeConcepts } from './knowledge-concepts';
import {
  includesKnowledgePhrase,
  normalizeKnowledgeText,
  padKnowledgeText,
} from './knowledge-normalize';

/* =========================================================================
  TYPES
========================================================================= */

/** Termes d'un thème, prêts pour la détection. */
type ThemeMatcher = {
  id: (typeof knowledgeThemes)[number]['id'];
  weight: number;
  terms: string[];
};

/** Alias d'un concept, bruts et normalisés. */
export type ConceptAliasEntry = {
  raw: string[];
  normalized: string[];
};

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Thèmes préparés avec leurs termes normalisés. */
const themeMatchers: ThemeMatcher[] = knowledgeThemes.map((theme) => ({
  id: theme.id,
  weight: theme.weight,
  terms: theme.terms.map(normalizeKnowledgeText).filter(Boolean),
}));

/** Alias des concepts, normalisés une seule fois et indexés par identifiant. */
export const conceptAliasIndex: Map<string, ConceptAliasEntry> = new Map(
  knowledgeConcepts.map((concept) => [
    concept.id,
    {
      raw: concept.aliases,
      normalized: concept.aliases
        .map(normalizeKnowledgeText)
        .filter(Boolean),
    },
  ]),
);

/** Vocabulaire déclaré d'un concept, pour l'expansion lexicale. */
export const conceptVocabulary: Map<string, string[]> = new Map(
  knowledgeConcepts.map((concept) => [concept.id, concept.aliases]),
);

/** Libellés des concepts, pour les nœuds pivots. */
export const conceptLabels: Map<string, string> = new Map(
  knowledgeConcepts.map((concept) => [concept.id, concept.label]),
);

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Détecte les thèmes présents dans un texte normalisé.
 *
 * @param paddedText - Texte normalisé entouré d'espaces.
 * @returns Les thèmes triés par poids décroissant.
 */
export function detectThemesFromPadded(
  paddedText: string,
): KnowledgeNode['themes'] {
  return themeMatchers
    .filter((theme) =>
      theme.terms.some((term) =>
        includesKnowledgePhrase(paddedText, term),
      ),
    )
    .sort(
      (left, right) =>
        right.weight - left.weight ||
        left.id.localeCompare(right.id),
    )
    .map((theme) => theme.id);
}

/**
 * Détecte les thèmes présents dans plusieurs textes.
 *
 * @param texts - Textes à analyser.
 * @returns Les thèmes triés par poids décroissant.
 */
export function detectThemesFromTexts(
  texts: string[],
): KnowledgeNode['themes'] {
  const padded = padKnowledgeText(
    normalizeKnowledgeText(texts.filter(Boolean).join(' ')),
  );

  return detectThemesFromPadded(padded);
}
