/* =========================================================================
  CONFIGURATION : graphe de connaissances
  Seuils et poids des recommandations.
========================================================================= */
import type { KnowledgeContentKind } from '@/types/knowledge.types';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Score minimal commun à toutes les recommandations affichées. */
const RECOMMENDATION_MIN_SCORE = 0.3;

/** Réglages de calcul des recommandations. */
export const KNOWLEDGE_RANKING = {

  /** Score minimal pour proposer un contenu. */
  minScore: RECOMMENDATION_MIN_SCORE,

  /** Score minimal pour les voisins sémantiques précalculés. */
  semanticMinScore: RECOMMENDATION_MIN_SCORE,

  /** Score minimal pour matérialiser une arête `related` issue des embeddings. */
  similarityRelatedMinScore: 0.15,

  /** Score minimal pour relier un contenu sans thème ni concept. */
  noSignalSemanticMinScore: 0.3,

  /** Nombre maximal d'arêtes `related` conservées par nœud. */
  relatedPerNode: 7,

  /** Nombre de recommandations renvoyées par défaut. */
  limit: 5,

  /** Score minimal pour les recommandations affichées sur le site. */
  relatedContentMinScore: RECOMMENDATION_MIN_SCORE,

  /** Score minimal pour les contenus liés d'un projet. */
  projectContentMinScore: RECOMMENDATION_MIN_SCORE,

  /** Score minimal pour proposer un projet proche d'un autre projet. */
  projectSimilarityMinScore: RECOMMENDATION_MIN_SCORE,

  /** Écart d'années au-delà duquel deux contenus ne sont plus de la même période. */
  yearWindow: 6,

  /** Score attribué à un lien de contexte explicite (formation ou expérience). */
  structuralScore: 0.9,
};

/**
 * Poids par défaut d'une suggestion.
 * Une nature de contenu non listée dans `KNOWLEDGE_SUGGESTION_WEIGHTS` reçoit
 * ce poids. Cela rend l'ajout d'une nouvelle nature automatique.
 */
export const KNOWLEDGE_SUGGESTION_DEFAULT_WEIGHT = 1;

/* =========================================================================
  MATRICE DES SUGGESTIONS
========================================================================= */

/**
 * Poids des suggestions par nature de contenu source et cible.
 *
 * - `0` exclut la cible des suggestions de cette source ;
 * - une valeur entre 0 et 1 pondère le score ;
 * - une cible absente utilise `KNOWLEDGE_SUGGESTION_DEFAULT_WEIGHT`.
 *
 * Cette matrice ne touche pas aux arêtes du graphe : elle ne s'applique
 * qu'aux recommandations « Voir aussi ».
 */
export const KNOWLEDGE_SUGGESTION_WEIGHTS: Partial<
  Record<KnowledgeContentKind, Partial<Record<KnowledgeContentKind, number>>>
> = {
  // Un projet affiche déjà sa stack : les compétences ne sont pas répétées.
  // Les formations sont exclues des suggestions projet, les expériences restent.
  project: {
    skill: 0,
    education: 0,
    project: 1.2,
    teaching: 1.2,
    supervision: 1.25,
    experience: 1.1,
  },

  // Une compétence met en avant les projets, formations et expériences.
  // Les autres compétences ne sont pas répétées dans « Réalisations liées ».
  skill: {
    skill: 0,
    project: 1.2,
    education: 1.2,
    experience: 1.2,
  },
};

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Retourne le poids d'une suggestion entre deux natures de contenu.
 *
 * @param sourceKind - Nature du contenu qui recommande.
 * @param targetKind - Nature du contenu recommandé.
 * @returns Le poids à appliquer, ou le poids par défaut.
 */
export function getKnowledgeSuggestionWeight(
  sourceKind: KnowledgeContentKind,
  targetKind: KnowledgeContentKind,
): number {
  return (
    KNOWLEDGE_SUGGESTION_WEIGHTS[sourceKind]?.[targetKind] ??
    KNOWLEDGE_SUGGESTION_DEFAULT_WEIGHT
  );
}
