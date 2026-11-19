/* =========================================================================
   HELPERS : signaux directs du graphe
   Relie une compétence aux contenus qui citent sa technologie.
========================================================================= */
import type {
  KnowledgeContentNode,
  KnowledgeGraph,
  KnowledgeRecommendation,
  KnowledgeRecommendationOptions,
} from '@/types/knowledge.types';
import { projects } from '@/data/content/projects.data';
import { KNOWLEDGE_RANKING, getKnowledgeSuggestionWeight } from './knowledge.config';
import { knowledgeConcepts } from './knowledge-concepts';
import { isContentNode } from './knowledge-nodes';
import {
  compareProjectsFirst,
  compareRecommendations,
} from './knowledge-sort';
import { normalizeKnowledgeText } from './knowledge-normalize';

/* =========================================================================
   CONSTANTES
========================================================================= */

/** Score attribué à un contenu qui cite directement une compétence. */
const DIRECT_SKILL_SCORE = 0.8;

/** Alias normalisés des concepts, indexés par identifiant. */
const conceptAliases = new Map(
  knowledgeConcepts.map((concept) => [
    concept.id,
    new Set(
      [concept.id, concept.label, ...concept.aliases]
        .map(normalizeKnowledgeText)
        .filter(Boolean),
    ),
  ]),
);

/** Projets dont le code est publié sur GitHub. */
const githubProjectIds = new Set(
  projects.filter((project) => project.links.github).map((project) => project.id),
);

/* =========================================================================
   HELPERS
========================================================================= */

/** Retrouve le concept technique associé à une compétence. */
function resolveSkillConcept(skill: KnowledgeContentNode) {
  const label = normalizeKnowledgeText(skill.label.fr);
  return knowledgeConcepts.find(
    (concept) =>
      concept.id === skill.sourceId ||
      concept.aliases.some((alias) => normalizeKnowledgeText(alias) === label),
  );
}

/** Vérifie qu'un contenu cite directement une compétence dans ses tags. */
function hasDirectTag(
  node: KnowledgeContentNode,
  aliases: Set<string>,
  conceptId: string,
): boolean {
  if (
    conceptId === 'git' &&
    node.kind === 'project' &&
    githubProjectIds.has(node.sourceId)
  ) {
    return true;
  }

  return node.tags.some((tag) => aliases.has(normalizeKnowledgeText(tag)));
}

/** Construit une recommandation portée par un concept partagé. */
function buildRecommendation(
  node: KnowledgeContentNode,
  conceptId: string,
  weight: number,
): KnowledgeRecommendation {
  return {
    node,
    score: Math.min(1, DIRECT_SKILL_SCORE * weight),
    sharedThemes: [],
    sharedTerms: [conceptId],
    samePeriod: false,
  };
}

/**
 * Relie une compétence aux contenus qui citent sa technologie.
 *
 * @param graph - Graphe de connaissances.
 * @param source - Compétence de départ.
 * @param concept - Concept technique associé.
 * @param aliases - Alias normalisés du concept.
 * @param acceptedKinds - Natures acceptées, ou `null`.
 * @returns Les recommandations directes.
 */
function collectCitedContents(
  graph: KnowledgeGraph,
  source: KnowledgeContentNode,
  concept: (typeof knowledgeConcepts)[number],
  aliases: Set<string>,
  acceptedKinds: Set<KnowledgeContentNode['kind']> | null,
): KnowledgeRecommendation[] {
  const recommendations: KnowledgeRecommendation[] = [];

  for (const node of graph.nodes) {
    if (!isContentNode(node) || node.kind === 'skill') continue;
    if (acceptedKinds && !acceptedKinds.has(node.kind)) continue;

    const weight = getKnowledgeSuggestionWeight(source.kind, node.kind);
    if (weight <= 0) continue;
    if (!hasDirectTag(node, aliases, concept.id)) continue;

    recommendations.push(buildRecommendation(node, concept.id, weight));
  }

  return recommendations;
}

/**
 * Relie un contenu aux compétences dont il cite la technologie.
 *
 * @param graph - Graphe de connaissances.
 * @param source - Contenu de départ.
 * @param acceptedKinds - Natures acceptées, ou `null`.
 * @returns Les recommandations directes.
 */
function collectCitedSkills(
  graph: KnowledgeGraph,
  source: KnowledgeContentNode,
  acceptedKinds: Set<KnowledgeContentNode['kind']> | null,
): KnowledgeRecommendation[] {
  const recommendations: KnowledgeRecommendation[] = [];

  for (const node of graph.nodes) {
    if (!isContentNode(node) || node.kind !== 'skill') continue;
    if (acceptedKinds && !acceptedKinds.has(node.kind)) continue;

    const weight = getKnowledgeSuggestionWeight(source.kind, node.kind);
    if (weight <= 0) continue;

    const concept = resolveSkillConcept(node);
    const aliases = concept ? conceptAliases.get(concept.id) : undefined;
    if (!concept || !aliases || !hasDirectTag(source, aliases, '')) continue;

    recommendations.push(buildRecommendation(node, concept.id, weight));
  }

  return recommendations;
}

/* =========================================================================
   API PUBLIQUE
========================================================================= */

/** Relie une compétence aux contenus qui citent sa technologie. */
export function rankDirectSkillRecommendations(
  graph: KnowledgeGraph,
  source: KnowledgeContentNode,
  options: KnowledgeRecommendationOptions,
): KnowledgeRecommendation[] {
  const acceptedKinds = options.kinds ? new Set(options.kinds) : null;
  const limit = options.limit ?? KNOWLEDGE_RANKING.limit;
  let recommendations: KnowledgeRecommendation[] = [];

  if (source.kind === 'skill') {
    const concept = resolveSkillConcept(source);
    const aliases = concept ? conceptAliases.get(concept.id) : undefined;

    if (!concept || !aliases) return [];

    recommendations = collectCitedContents(
      graph,
      source,
      concept,
      aliases,
      acceptedKinds,
    );
  } else {
    recommendations = collectCitedSkills(
      graph,
      source,
      acceptedKinds,
    );
  }

  return recommendations
    .sort(
      // Une compétence met les projets en avant ; les autres contenus suivent.
      source.kind === 'skill'
        ? compareProjectsFirst
        : compareRecommendations,
    )
    .slice(0, limit);
}
