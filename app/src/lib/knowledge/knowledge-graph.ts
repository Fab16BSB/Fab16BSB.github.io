/* =========================================================================
  HELPERS : construction du graphe — fonctions pures
  Nœuds de contenu, pivots thématiques, concepts et arêtes de similarité.
========================================================================= */
import { knowledgeDomains } from '@/data/knowledge/knowledge-domains.data';
import { knowledgeThemes } from '@/data/knowledge/knowledge-taxonomy.data';
import type {
  KnowledgeContentNode,
  KnowledgeEdge,
  KnowledgeGraph,
  KnowledgeNode,
  KnowledgeThemeId,
} from '@/types/knowledge.types';
import { KNOWLEDGE_RANKING } from './knowledge.config';
import type { KnowledgeExtraction } from './knowledge-extract';
import { localizedSame } from './knowledge-labels';
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
      text: localizedSame(theme.label.fr),
    }));

  const conceptNodes: KnowledgeNode[] = [...termLabels.entries()]
    .filter(([termId]) => termIds.has(termId))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([termId, label]) => ({
      id: `concept:${termId}`,
      kind: 'concept',
      sourceId: termId,
      label: localizedSame(label),
      themes: [],
      terms: [termId],
      tags: [],
      text: localizedSame(label),
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
 * Crée les arêtes `related` entre concepts explicitement liés.
 *
 * Les relations sont déclarées par `related` sur les concepts de domaine.
 * Une seule déclaration suffit : l'arête est non dirigée et dédupliquée.
 *
 * @param termIds - Concepts réellement présents dans le graphe.
 * @returns Les arêtes concept-concept, triées par identifiant.
 */
function buildConceptRelatedEdges(
  termIds: Set<string>,
): KnowledgeEdge[] {
  const edges = new Map<string, KnowledgeEdge>();

  for (const domain of knowledgeDomains) {
    for (const item of domain.items) {
      for (const relatedId of item.related ?? []) {
        if (!termIds.has(item.id) || !termIds.has(relatedId)) {
          continue;
        }

        const ids = [`concept:${item.id}`, `concept:${relatedId}`].sort();
        const id = `related:${ids[0]}|${ids[1]}`;

        if (!edges.has(id)) {
          edges.set(id, {
            id,
            from: ids[0],
            to: ids[1],
            relation: 'related',
            score: 0.6,
          });
        }
      }
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

    for (const projectId of node.projectIds ?? []) {
      add(node.id, `project:${projectId}`);
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

/**
 * Détermine les thèmes d'un nœud de contenu.
 *
 * @param node - Nœud extrait des données.
 * @param knownThemeIds - Thèmes valides de la taxonomie.
 * @returns Les thèmes dédoublonnés du nœud.
 */
function resolveContentThemes(
  node: KnowledgeContentNode,
  knownThemeIds: Set<string>,
): KnowledgeThemeId[] {
  const themes = new Set<KnowledgeThemeId>(
    node.themes.filter((theme) => knownThemeIds.has(theme)),
  );
  const kindTheme = KIND_THEMES[node.kind];

  if (kindTheme) {
    themes.add(kindTheme);
  }

  // Rattache les stages et thèses CIFRE au thème de la formation.
  if (node.kind === 'experience' && node.educationId) {
    themes.add('education');
  }

  const isAcademicProject =
    node.kind === 'project' &&
    node.tags.some((tag) => tag.toLowerCase() === 'academic');

  // Rattache les projets académiques au thème de la formation.
  if (isAcademicProject) {
    themes.add('education');
  }

  // Un projet professionnel ou personnel n'est pas une formation,
  // même s'il mentionne un IUT ou des soutenances.
  if (node.kind === 'project' && !isAcademicProject) {
    themes.delete('education');
  }

  // Filtre ou conserve le thème pédagogique selon le type et le contexte.
  const keepsTeaching =
    TEACHING_KINDS.has(node.kind) ||
    (node.kind === 'project' && mentionsAlternance(node));

  if (!keepsTeaching) {
    themes.delete('teaching');
  }

  return [...themes];
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

  const contentNodes = extraction.nodes.map((node) => ({
    ...node,
    themes: resolveContentThemes(node, knownThemeIds),
    terms: node.terms.filter((term) => extraction.termLabels.has(term)),
  }));

  const themeIds = new Set(
    contentNodes.flatMap((node) => node.themes),
  );
  const termIds = new Set(
    contentNodes.flatMap((node) => node.terms),
  );
  const pivotNodes = buildPivotNodes(
    themeIds,
    termIds,
    extraction.termLabels,
  );
  const edges = contentNodes.flatMap(buildMembershipEdges);
  const relatedEdges = mergeRelatedEdges(buildRelatedEdges(contentNodes));
  const conceptRelatedEdges = buildConceptRelatedEdges(termIds);
  const contextEdges = buildContextEdges(contentNodes);

  return {
    nodes: [...contentNodes, ...pivotNodes],
    edges: [
      ...edges,
      ...relatedEdges,
      ...conceptRelatedEdges,
      ...contextEdges,
    ],
  };
}
