/* =========================================================================
  HELPERS : extraction des signaux du graphe — fonctions pures
  Détection des thèmes et des concepts, puis création des nœuds de contenu.
========================================================================= */
import { TAG_ALIASES } from '@/data/knowledge/knowledge-concept-overrides.data';
import type { KnowledgeContentNode } from '@/types/knowledge.types';
import type { KnowledgeRawNode } from './knowledge-entities';
import { extractRawNodes } from './knowledge-entities';
import {
  conceptAliases,
  conceptLabels,
  detectThemesFromPadded,
} from './knowledge-matching';
import { KNOWLEDGE_STRUCTURAL_TAGS } from './knowledge-structural-tags';
import {
  includesKnowledgePhrase,
  isShortKnowledgeAlias,
  normalizeKnowledgeText,
  padKnowledgeText,
  slugifyKnowledgeTerm,
} from './knowledge-normalize';

/* =========================================================================
  INTERFACES
========================================================================= */

/** Résultat de l'extraction des nœuds de contenu. */
export type KnowledgeExtraction = {
  nodes: KnowledgeContentNode[];
  termLabels: Map<string, string>;
};

/** Alias d'un concept, séparés par longueur pour la détection. */
type ConceptMatcher = {
  id: string;
  longAliases: string[];
  shortAliases: string[];
};

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Concepts préparés pour la détection dans les textes et les tags. */
const conceptMatchers: ConceptMatcher[] = [...conceptAliases].map(
  ([id, { normalized }]) => ({
    id,
    longAliases: normalized.filter(
      (alias) => !isShortKnowledgeAlias(alias),
    ),
    shortAliases: normalized.filter((alias) =>
      isShortKnowledgeAlias(alias),
    ),
  }),
);

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Détecte les concepts techniques d'un contenu.
 *
 * @param paddedText - Texte normalisé entouré d'espaces.
 * @param tagSet - Tags normalisés du contenu, pour les alias courts.
 * @returns Les identifiants de concepts triés.
 */
function detectConcepts(paddedText: string, tagSet: string[]): string[] {
  const concepts = new Set<string>();

  for (const matcher of conceptMatchers) {
    const foundInText = matcher.longAliases.some((alias) =>
      includesKnowledgePhrase(paddedText, alias),
    );
    const foundInTags =
      matcher.longAliases.some((alias) => tagSet.includes(alias)) ||
      matcher.shortAliases.some((alias) => tagSet.includes(alias));
    if (foundInText || foundInTags) concepts.add(matcher.id);
  }

  return [...concepts].sort();
}

/**
 * Ajoute un terme libre pour un tag qu'aucun concept ne couvre.
 *
 * @param tags - Tags bruts du contenu.
 * @param paddedText - Texte normalisé entouré d'espaces.
 * @param termLabels - Libellés des concepts déjà connus, enrichi sur place.
 * @returns Les termes libres créés.
 */
function extractLooseTerms(
  tags: string[],
  termLabels: Map<string, string>,
): string[] {
  const terms = new Set<string>();

  for (const tag of tags) {
    const normalized = normalizeKnowledgeText(tag);
    if (!normalized || KNOWLEDGE_STRUCTURAL_TAGS.has(normalized)) continue;

    const paddedTag = padKnowledgeText(normalized);
    const covered = conceptMatchers.some(
      (matcher) =>
        matcher.longAliases.includes(normalized) ||
        matcher.shortAliases.includes(normalized) ||
        matcher.longAliases.some((alias) => includesKnowledgePhrase(paddedTag, alias)),
    );
    if (covered) continue;

    const aliased = TAG_ALIASES[normalized];
    const canonical = aliased ?? slugifyKnowledgeTerm(tag);
    const termId = `tag:${canonical}`;
    termLabels.set(termId, aliased ?? tag);
    terms.add(termId);
  }

  return [...terms].sort();
}

/**
 * Enrichit un nœud brut avec ses thèmes et ses concepts.
 *
 * @param rawNode - Contenu brut extrait des données du site.
 * @param termLabels - Libellés des termes, enrichi sur place.
 * @returns Le nœud complet.
 */
function enrichNode(
  rawNode: KnowledgeRawNode,
  termLabels: Map<string, string>,
): KnowledgeContentNode {
  const fullText = [
    rawNode.text.fr,
    rawNode.text.en,
    rawNode.text.es,
    rawNode.tags.join(' '),
  ].join(' ');
  const paddedText = padKnowledgeText(normalizeKnowledgeText(fullText));
  const themeText = padKnowledgeText(
    normalizeKnowledgeText([rawNode.text.fr, rawNode.text.en, rawNode.text.es].join(' ')),
  );
  const tagSet = rawNode.tags.map(normalizeKnowledgeText).filter(Boolean);
  const concepts = detectConcepts(paddedText, tagSet);
  const looseTerms = extractLooseTerms(rawNode.tags, termLabels);
  const declaredConcepts = (rawNode.conceptIds ?? []).filter((id) =>
    conceptLabels.has(id),
  );

  return {
    id: `${rawNode.kind}:${rawNode.sourceId}`,
    kind: rawNode.kind,
    sourceId: rawNode.sourceId,
    label: rawNode.label,
    year: rawNode.year,
    anchor: rawNode.anchor,
    ...(rawNode.educationId ? { educationId: rawNode.educationId } : {}),
    ...(rawNode.educationIds?.length ? { educationIds: rawNode.educationIds } : {}),
    ...(rawNode.experienceIds?.length ? { experienceIds: rawNode.experienceIds } : {}),
    ...(rawNode.projectIds?.length ? { projectIds: rawNode.projectIds } : {}),
    ...(declaredConcepts.length ? { declaredTerms: declaredConcepts } : {}),
    ...(rawNode.isNotebook ? { isNotebook: true } : {}),
    themes: detectThemesFromPadded(themeText),
    terms: [...new Set([...concepts, ...looseTerms, ...declaredConcepts])].sort(),
    tags: rawNode.tags,
    text: rawNode.text,
  };
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Extrait les nœuds de contenu et les libellés de termes du portfolio.
 *
 * @returns Les nœuds enrichis et la table des libellés de concepts.
 */
export function extractContentNodes(): KnowledgeExtraction {
  const termLabels = new Map(conceptLabels);
  const nodes = extractRawNodes().map((rawNode) => enrichNode(rawNode, termLabels));
  return { nodes, termLabels };
}
