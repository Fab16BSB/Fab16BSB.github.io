/**
 * Garde-fous sémantiques du graphe de connaissances.
 *
 * Ces assertions figent les rattachements déjà validés manuellement. Elles
 * empêchent une évolution de la taxonomie de réintroduire les faux liens
 * historiques (Vite, « languages », « video », « these », « network »…).
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { education } from '../src/data/education.data';
import { experiences } from '../src/data/experience.data';
import { getKnowledgeGraph } from '../src/lib/knowledge-index';
import type { KnowledgeContentNode, KnowledgeNode, KnowledgeThemeId } from '../src/types/knowledge.types';

/* =========================================================================
  CONFIGURATION
========================================================================= */

/** Graphe de connaissances chargé une fois au démarrage. */
const graph = getKnowledgeGraph();

/** Index des nœuds par identifiant global. */
const byId = new Map(graph.nodes.map((node) => [node.id, node]));

/** Problèmes détectés pendant les vérifications. */
const problems: string[] = [];

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Restreint un nœud à un contenu.
 *
 * @param node - Nœud du graphe.
 * @returns `true` si le nœud n'est ni un thème ni un concept.
 */
function isContentNode(node: KnowledgeNode): node is KnowledgeContentNode {
  return node.kind !== 'theme' && node.kind !== 'concept';
}

/**
 * Vérifie les thèmes attendus et interdits d'un nœud.
 *
 * @param nodeId - Identifiant global du contenu.
 * @param expected - Thèmes à inclure et à exclure.
 */
function expectThemes(
  nodeId: string,
  expected: { includes?: KnowledgeThemeId[]; excludes?: KnowledgeThemeId[] },
): void {
  const node = byId.get(nodeId);
  if (!node) {
    problems.push(`Nœud introuvable : ${nodeId}`);
    return;
  }

  for (const theme of expected.includes ?? []) {
    if (!node.themes.includes(theme)) {
      problems.push(`${nodeId} devrait être dans « ${theme} ».`);
    }
  }
  for (const theme of expected.excludes ?? []) {
    if (node.themes.includes(theme)) {
      problems.push(`${nodeId} ne devrait pas être dans « ${theme} ».`);
    }
  }
}

/**
 * Vérifie qu'aucun contenu d'une nature donnée ne porte un thème interdit.
 *
 * @param kind - Nature de contenu.
 * @param theme - Thème interdit.
 */
function expectNoKindTheme(kind: KnowledgeNode['kind'], theme: KnowledgeThemeId): void {
  for (const node of graph.nodes) {
    if (node.kind === kind && node.themes.includes(theme)) {
      problems.push(`${node.id} (${kind}) ne devrait pas être dans « ${theme} ».`);
    }
  }
}

/**
 * Vérifie qu'aucun contenu d'une nature donnée ne porte un terme technique interdit.
 *
 * @param kind - Nature de contenu.
 * @param term - Terme interdit.
 */
function expectNoKindTerm(kind: KnowledgeNode['kind'], term: string): void {
  for (const node of graph.nodes) {
    if (node.kind === kind && node.terms.includes(term)) {
      problems.push(`${node.id} (${kind}) ne devrait pas porter le tag « ${term} ».`);
    }
  }
}

/* =========================================================================
  PUBLICATIONS ET ARTICLES
========================================================================= */
expectThemes('publication:aiccsa-2023', { excludes: ['web', 'systems'] });
expectThemes('publication:thesis-2023', { excludes: ['web', 'systems'] });
expectThemes('publication:arxiv-2410-15909', { excludes: ['systems'] });
expectThemes('publication:arxiv-2411-04707', { excludes: ['systems'] });
expectThemes('article:https://medium.com/p/257850cd83e8', {
  excludes: ['research', 'systems'],
});

for (const node of graph.nodes) {
  if (node.kind === 'publication' && !node.themes.includes('research')) {
    problems.push(`${node.id} (publication) devrait être dans « research ».`);
  }
}

/* =========================================================================
  COMPÉTENCES, VIDÉOS ET FORMATIONS
========================================================================= */
for (const nodeId of ['skill:css', 'skill:html', 'skill:javascript']) {
  expectThemes(nodeId, { excludes: ['nlp'] });
}

expectThemes('video:uye9Z8fGWSs', { excludes: ['vision', 'backend'] });
expectThemes('video:EGHUEPMI4c8', { includes: ['vision', 'research'] });
expectThemes('video:GjQaSi18B08', { excludes: ['vision'] });
expectThemes('skill:opencv', { includes: ['vision'] });
expectThemes('skill:java', { includes: ['programming'] });
expectThemes('skill:python', { includes: ['programming'] });
expectThemes('experience:stage-soldout', { includes: ['programming'] });
expectThemes('award:jury-alternance', { includes: ['teaching'] });

if (byId.has('theme:other')) {
  problems.push('Le thème « À classer » ne doit plus exister.');
}

if (byId.has('theme:academic-life')) {
  problems.push('Le thème « Vie académique » ne doit plus exister.');
}

/** Vidéo dont les liens sémantiques doivent être conservés. */
const discordVideoId = 'video:uye9Z8fGWSs';

/** Arêtes qui touchent la vidéo Discord. */
const discordEdges = graph.edges.filter(
  (edge) => edge.from === discordVideoId || edge.to === discordVideoId,
);
if (discordEdges.length === 0) {
  problems.push(`${discordVideoId} doit rester relié par ses voisins sémantiques.`);
}

for (const node of graph.nodes) {
  if (node.kind === 'education') {
    if (!node.themes.includes('education')) {
      problems.push(`${node.id} (education) devrait être dans « education ».`);
    }
    if (node.themes.includes('teaching')) {
      problems.push(`${node.id} (education) ne devrait pas être dans « teaching ».`);
    }
  }
}

/* =========================================================================
  PROJETS, RECHERCHE ET ENSEIGNEMENT
========================================================================= */
expectThemes('project:scheduler-finder', {
  includes: ['teaching'],
  excludes: ['data', 'education'],
});
expectThemes('project:kermtech', { excludes: ['teaching'], includes: ['education'] });
expectThemes('project:progenimages', { excludes: ['teaching'] });
expectThemes('project:searchengine', { includes: ['search'], excludes: ['nlp'] });
expectThemes('project:som', { excludes: ['systems'] });

for (const node of graph.nodes) {
  if (
    node.kind === 'project' &&
    node.tags.some((tag) => tag.toLowerCase() === 'academic') &&
    !node.themes.includes('education')
  ) {
    problems.push(`${node.id} (projet académique) devrait être dans « education ».`);
  }
}

expectThemes('experience:ater-paris8', {
  includes: ['machine-learning', 'nlp', 'search', 'backend', 'teaching'],
  excludes: ['software-engineering'],
});

// Chaque stage et la thèse CIFRE déclarent la formation suivie.
/** Identifiants des formations connues. */
const educationIds = new Set(education.map((item) => item.id));

for (const experience of experiences) {
  const experienceNodeId = `experience:${experience.id}`;
  const requiresEducation =
    experience.type === 'internship' || experience.type === 'thesis';

  if (requiresEducation && !experience.educationId) {
    problems.push(`${experienceNodeId} devrait préciser educationId.`);
    continue;
  }

  if (!experience.educationId) continue;

  if (!educationIds.has(experience.educationId)) {
    problems.push(
      `${experienceNodeId} référence une formation inconnue : ${experience.educationId}.`,
    );
    continue;
  }

  const educationNodeId = `education:${experience.educationId}`;
  const edgeId = `context:${[experienceNodeId, educationNodeId].sort().join('|')}`;
  if (!graph.edges.some((edge) => edge.id === edgeId)) {
    problems.push(`${experienceNodeId} devrait être relié à ${educationNodeId}.`);
  }

  const node = byId.get(experienceNodeId);
  if (node && !node.themes.includes('education')) {
    problems.push(`${experienceNodeId} devrait être dans « education ».`);
  }
}

// Les contextes déclarés sur les projets et compétences doivent produire une arête.
for (const node of graph.nodes.filter(isContentNode)) {
  for (const educationId of node.educationIds ?? []) {
    const targetId = `education:${educationId}`;
    const edgeId = `context:${[node.id, targetId].sort().join('|')}`;
    if (!graph.edges.some((edge) => edge.id === edgeId)) {
      problems.push(`${node.id} devrait être relié à ${targetId}.`);
    }
  }

  for (const experienceId of node.experienceIds ?? []) {
    const targetId = `experience:${experienceId}`;
    const edgeId = `context:${[node.id, targetId].sort().join('|')}`;
    if (!graph.edges.some((edge) => edge.id === edgeId)) {
      problems.push(`${node.id} devrait être relié à ${targetId}.`);
    }
  }
}

/* =========================================================================
  TAGS STRUCTURELS ET FUITES CONNUES
========================================================================= */
for (const term of ['tag:language', 'tag:librarie', 'tag:database', 'tag:tool']) {
  expectNoKindTerm('skill', term);
}

/* =========================================================================
  RÉSULTAT
========================================================================= */
if (problems.length > 0) {
  console.error(`Garde-fous sémantiques en échec (${problems.length}) :`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exitCode = 1;
} else {
  console.log(`Garde-fous sémantiques valides : ${graph.nodes.length} nœuds vérifiés.`);
}
