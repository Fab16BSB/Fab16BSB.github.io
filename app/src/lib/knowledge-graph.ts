/* =========================================================================
  HELPERS : construction du graphe — fonctions pures
  Nœuds de contenu, pivots thématiques, concepts et arêtes de similarité.
========================================================================= */
import { knowledgeThemes } from '@/data/knowledge-taxonomy.data';
import type {
  KnowledgeContentNode,
  KnowledgeEdge,
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeThemeId,
} from '@/types/knowledge.types';
import { KNOWLEDGE_RANKING } from './knowledge.config';
import type { KnowledgeExtraction } from './knowledge-extract';
import { normalizeKnowledgeText } from './knowledge-normalize';
import { getSimilarityNeighbors } from './knowledge-similarity';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Thème toujours rattaché à une nature de contenu donnée. */
const KIND_THEMES: Partial<Record<KnowledgeContentNode['kind'], KnowledgeThemeId>> = {
  publication: 'research',
  teaching: 'teaching',
  supervision: 'teaching',
  education: 'education',
};

/** Natures de contenu autorisées à porter le thème Enseignement. */
const TEACHING_KINDS = new Set<KnowledgeContentNode['kind']>([
  'teaching',
  'supervision',
  'experience',
  'award',
]);

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Construit un libellé identique dans les trois langues.
 *
 * @param value - Libellé invariant.
 * @returns Le libellé traduit.
 */
function sameLabel(value: string): KnowledgeNode['label'] {
  return { fr: value, en: value, es: value };
}

/**
 * Crée les nœuds pivots réellement utilisés par au moins un contenu.
 *
 * @param themeIds - Thèmes rattachés à un contenu.
 * @param termIds - Concepts rattachés à un contenu.
 * @param termLabels - Libellés de tous les concepts détectés.
 * @returns Les nœuds de taxonomie connectés.
 */
function buildPivotNodes(
  themeIds: Set<string>,
  termIds: Set<string>,
  termLabels: Map<string, string>,
): KnowledgeNode[] {
  const themeNodes: KnowledgeNode[] = knowledgeThemes
    .filter((theme) => themeIds.has(theme.id))
    .map((theme) => ({
      id: `theme:${theme.id}`,
      kind: 'theme',
      sourceId: theme.id,
      label: theme.label,
      themes: [theme.id],
      terms: [],
      tags: [],
      text: sameLabel(theme.label.fr),
    }));

  const conceptNodes: KnowledgeNode[] = [...termLabels.entries()]
    .filter(([termId]) => termIds.has(termId))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([termId, label]) => ({
      id: `concept:${termId}`,
      kind: 'concept',
      sourceId: termId,
      label: sameLabel(label),
      themes: [],
      terms: [termId],
      tags: [],
      text: sameLabel(label),
    }));

  return [...themeNodes, ...conceptNodes];
}

/**
 * Crée les arêtes d'appartenance d'un contenu à ses thèmes et concepts.
 *
 * @param node - Contenu source.
 * @returns Les arêtes `has-theme` et `uses-term`.
 */
function buildMembershipEdges(node: KnowledgeNode): KnowledgeEdge[] {
  return [
    ...node.themes.map<KnowledgeEdge>((theme) => ({
      id: `has-theme:${node.id}|${theme}`,
      from: node.id,
      to: `theme:${theme}`,
      relation: 'has-theme',
    })),
    ...node.terms.map<KnowledgeEdge>((term) => ({
      id: `uses-term:${node.id}|${term}`,
      from: node.id,
      to: `concept:${term}`,
      relation: 'uses-term',
    })),
  ];
}

/**
 * Construit les arêtes `related` à partir des voisins sémantiques.
 *
 * Le graphe ne crée plus de lien direct à partir de thèmes ou de technologies
 * génériques : les signaux partagés passent par les pivots `theme:` et
 * `concept:`. Les arêtes `related` restent donc purement sémantiques.
 *
 * @param nodes - Nœuds de contenu.
 * @returns Les arêtes de similarité triées.
 */
function buildRelatedEdges(nodes: KnowledgeContentNode[]): KnowledgeEdge[] {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const edges = new Map<string, KnowledgeEdge>();

  for (const node of nodes) {
    // Récupère les meilleurs voisins selon la limite configurée.
    const neighbors = getSimilarityNeighbors(node.id).slice(
      0,
      KNOWLEDGE_RANKING.relatedPerNode,
    );

    for (const neighbor of neighbors) {
      const target = nodesById.get(neighbor.id);
      if (!target) continue;
      if (neighbor.score < KNOWLEDGE_RANKING.similarityRelatedMinScore) continue;

      const ids = [node.id, neighbor.id].sort();
      const id = `related:${ids[0]}|${ids[1]}`;
      if (edges.has(id)) continue;

      // Extrait les thèmes et termes partagés entre les deux nœuds.
      const sharedThemes = node.themes.filter((theme) =>
        target.themes.includes(theme),
      );
      const sharedTerms = node.terms
        .filter((term) => target.terms.includes(term))
        .slice(0, 3);

      const sourceHasSignals = node.themes.length > 0 || node.terms.length > 0;
      const targetHasSignals =
        target.themes.length > 0 || target.terms.length > 0;

      if (!sourceHasSignals || !targetHasSignals) {
        if (neighbor.score < KNOWLEDGE_RANKING.noSignalSemanticMinScore) {
          continue;
        }
      } else if (sharedThemes.length === 0 && sharedTerms.length === 0) {
        continue;
      }

      edges.set(id, {
        id,
        from: ids[0],
        to: ids[1],
        relation: 'related',
        score: neighbor.score,
        themes: sharedThemes,
        terms: sharedTerms,
      });
    }
  }

  return [...edges.values()].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
}

/**
 * Construit les arêtes de contexte explicites.
 *
 * - expérience → formation via `educationId` ;
 * - projet ou compétence → formation/expérience via `educationIds` et
 *   `experienceIds`.
 *
 * Ces liens ne dépendent pas de la similarité sémantique.
 *
 * @param nodes - Nœuds de contenu.
 * @returns Les arêtes `context` uniques, triées par identifiant.
 */
function buildContextEdges(nodes: KnowledgeContentNode[]): KnowledgeEdge[] {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = new Map<string, KnowledgeEdge>();

  const add = (from: string, to: string) => {
    if (!nodeIds.has(from) || !nodeIds.has(to)) return;
    const ids = [from, to].sort();
    const id = `context:${ids[0]}|${ids[1]}`;
    if (edges.has(id)) return;
    edges.set(id, {
      id,
      from: ids[0],
      to: ids[1],
      relation: 'context',
    });
  };

  for (const node of nodes) {
    if (node.kind === 'experience' && node.educationId) {
      add(node.id, `education:${node.educationId}`);
    }

    for (const educationId of node.educationIds ?? []) {
      add(node.id, `education:${educationId}`);
    }

    for (const experienceId of node.experienceIds ?? []) {
      add(node.id, `experience:${experienceId}`);
    }
  }

  return [...edges.values()].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
}

/**
 * Fusionne des arêtes en conservant la première occurrence de chaque identifiant.
 *
 * Les arêtes sémantiques passent en premier : elles portent les raisons les plus
 * précises. Un lien structurel déjà couvert n'est donc pas dupliqué.
 *
 * @param edges - Arêtes à fusionner.
 * @returns Les arêtes uniques triées par identifiant.
 */
function mergeRelatedEdges(edges: KnowledgeEdge[]): KnowledgeEdge[] {
  const unique = new Map<string, KnowledgeEdge>();

  for (const edge of edges) {
    if (!unique.has(edge.id)) unique.set(edge.id, edge);
  }

  return [...unique.values()].sort((left, right) =>
    left.id.localeCompare(right.id),
  );
}

/**
 * Indique si un projet mentionne explicitement l'alternance.
 *
 * @param node - Nœud de contenu.
 * @returns `true` si le texte ou un tag mentionne l'alternance.
 */
function mentionsAlternance(node: KnowledgeContentNode): boolean {
  if (node.tags.some((tag) => normalizeKnowledgeText(tag) === 'alternance')) {
    return true;
  }

  return Object.values(node.text).some((text) =>
    normalizeKnowledgeText(text).includes('alternance'),
  );
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Assemble le graphe complet du portfolio.
 *
 * @param extraction - Nœuds de contenu et libellés de concepts.
 * @returns Le graphe, prêt pour les recommandations et l'export.
 */
export function buildKnowledgeGraph(extraction: KnowledgeExtraction): KnowledgeGraph {
  const knownThemeIds = new Set(knowledgeThemes.map((theme) => theme.id));

  const contentNodes = extraction.nodes.map((node) => {
    const themes = new Set<KnowledgeThemeId>(
      node.themes.filter((theme) => knownThemeIds.has(theme)),
    );

    const kindTheme = KIND_THEMES[node.kind];
    if (kindTheme) themes.add(kindTheme);

    // Rattache les stages et thèses CIFRE au thème de la formation.
    if (node.kind === 'experience' && node.educationId) {
      themes.add('education');
    }

    // Rattache les projets académiques au thème de la formation.
    if (
      node.kind === 'project' &&
      node.tags.some((tag) => tag.toLowerCase() === 'academic')
    ) {
      themes.add('education');
    }

    // Filtre ou conserve le thème pédagogique selon le type et le contexte.
    const keepsTeaching =
      TEACHING_KINDS.has(node.kind) ||
      (node.kind === 'project' && mentionsAlternance(node));
    if (!keepsTeaching) themes.delete('teaching');

    // Retourne le nœud enrichi avec ses thèmes et termes filtrés.
    return {
      ...node,
      themes: [...themes],
      terms: node.terms.filter((term) => extraction.termLabels.has(term)),
    };
  });

  const pivotNodes = buildPivotNodes(
    new Set(contentNodes.flatMap((node) => node.themes)),
    new Set(contentNodes.flatMap((node) => node.terms)),
    extraction.termLabels,
  );
  const edges = contentNodes.flatMap(buildMembershipEdges);
  const relatedEdges = mergeRelatedEdges(buildRelatedEdges(contentNodes));
  const contextEdges = buildContextEdges(contentNodes);

  return {
    nodes: [...contentNodes, ...pivotNodes],
    edges: [...edges, ...relatedEdges, ...contextEdges],
  };
}
