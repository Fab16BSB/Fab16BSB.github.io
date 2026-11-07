/**
 * Exporte et vérifie le graphe de connaissances du portfolio.
 *
 * `npm run knowledge:graph` génère le JSON et le rapport Markdown dans
 * `.cache/knowledge/`, ainsi que la page `/graph/` dans `public/graph/`.
 * `npm run knowledge:check` valide le graphe sans écrire de fichier et échoue
 * si une recommandation est incohérente.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getKnowledgeGraph } from '../src/lib/knowledge-index';
import { getKnowledgeRecommendations, getSimilarProjects } from '../src/lib/knowledge-recommendations';
import { extractContentNodes } from '../src/lib/knowledge-extract';
import { buildKnowledgeGraph } from '../src/lib/knowledge-graph';
import { getSimilarityIndex } from '../src/lib/knowledge-similarity';
import { KNOWLEDGE_RANKING } from '../src/lib/knowledge.config';
import { EMBEDDING_CONFIG } from '../src/lib/search.config';
import type { KnowledgeGraph, KnowledgeNode } from '../src/types/knowledge.types';

/* =========================================================================
  CONFIGURATION
========================================================================= */

/** Répertoire du script, pour résoudre les chemins. */
const scriptDir = dirname(fileURLToPath(import.meta.url));

/** Répertoire des exports générés, ignoré par Git. */
const outputDir = resolve(scriptDir, '../.cache/knowledge');

/** Export JSON complet du graphe. */
const jsonPath = resolve(outputDir, 'knowledge-graph.json');

/** Rapport Markdown lisible du graphe. */
const markdownPath = resolve(outputDir, 'knowledge-graph.md');

/** Viewer HTML autonome, servi sur /graph/. */
const publicViewerPath = resolve(scriptDir, '../public/graph/index.html');

/** Répertoire source du viewer. */
const viewerDir = resolve(scriptDir, 'graph-viewer');

/** Template HTML du viewer. */
const templatePath = resolve(viewerDir, 'template.html');

/** Partials HTML du viewer, dans l'ordre d'assemblage. */
const VIEWER_HTML_FILES = [
  'html/head.html',
  'html/header.html',
  'html/workspace.html',
];

/** Feuilles de style du viewer, dans l'ordre d'assemblage. */
const VIEWER_STYLE_FILES = [
  'styles/fonts.css',
  'styles/tokens.css',
  'styles/base.css',
  'styles/layout.css',
  'styles/header.css',
  'styles/search.css',
  'styles/stage.css',
  'styles/filters.css',
  'styles/panel.css',
  'styles/responsive.css',
];

/** Scripts du viewer, dans l'ordre d'assemblage. */
const VIEWER_SCRIPT_FILES = [
  'scripts/data.js',
  'scripts/constants.js',
  'scripts/i18n.js',
  'scripts/state.js',
  'scripts/helpers.js',
  'scripts/layout.js',
  'scripts/simulation.js',
  'scripts/render.js',
  'scripts/interactions.js',
  'scripts/panel.js',
  'scripts/filters.js',
  'scripts/preferences.js',
  'scripts/startup.js',
];

/** Mode validation : aucun fichier n'est écrit. */
const checkOnly = process.argv.includes('--check');

/** Ajoute le prérendu du portfolio, réservé à la production. */
const prerender = process.argv.includes('--prerender');

/** Nombre de recommandations détaillées par projet et compétence dans le rapport. */
const previewLimit = 6;

/* Prérendu du portfolio depuis le graphe, activé uniquement en production. */
const speculationRules = prerender
  ? [
      '<script type="speculationrules">',
      '  {',
      '    "prerender": [',
      '      {',
      '        "source": "list",',
      '        "urls": ["/"],',
      '        "eagerness": "moderate"',
      '      }',
      '    ]',
      '  }',
      '</script>',
    ].join('\n')
  : '';

/* =========================================================================
  HELPERS : viewer
========================================================================= */

/**
 * Lit et concatène des fichiers du viewer.
 *
 * @param files - Chemins relatifs au dossier `graph-viewer`.
 * @returns Le contenu concaténé, séparé par une ligne vide.
 */
async function readViewerFiles(files: string[]): Promise<string> {
  const contents = await Promise.all(
    files.map((file) => readFile(resolve(viewerDir, file), 'utf8')),
  );

  return contents.map((content) => content.trim()).join('\n\n');
}

/* =========================================================================
  HELPERS : affichage
========================================================================= */

/**
 * Retourne le libellé français d'un nœud.
 *
 * @param node - Nœud du graphe.
 * @returns Le libellé affiché dans le rapport.
 */
function labelOf(node: KnowledgeNode): string {
  return node.label.fr;
}

/**
 * Décrit les thèmes et concepts partagés par une recommandation.
 *
 * @param recommendation - Recommandation à décrire.
 * @param byId - Index des nœuds par identifiant.
 * @returns Une phrase courte en français.
 */
function describeReasons(
  recommendation: ReturnType<typeof getKnowledgeRecommendations>[number],
  byId: Map<string, KnowledgeNode>,
): string {
  const themes = recommendation.sharedThemes
    .map((theme) => byId.get(`theme:${theme}`)?.label.fr ?? theme)
    .slice(0, 2);
  const terms = recommendation.sharedTerms
    .map((term) => byId.get(`concept:${term}`)?.label.fr ?? term)
    .slice(0, 3);

  const parts = [
    recommendation.context ? 'contexte' : '',
    themes.length > 0 ? `thèmes : ${themes.join(', ')}` : '',
    terms.length > 0 ? `technologies : ${terms.join(', ')}` : '',
    recommendation.samePeriod ? 'période proche' : '',
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' · ') : 'proximité sémantique';
}

/**
 * Construit le rapport Markdown lisible du graphe.
 *
 * @param graph - Graphe de connaissances.
 * @returns Le contenu Markdown.
 */
function buildMarkdown(graph: KnowledgeGraph): string {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  const contentNodes = graph.nodes.filter(
    (node) => node.kind !== 'theme' && node.kind !== 'concept',
  );
  const projects = contentNodes.filter((node) => node.kind === 'project');
  const themes = graph.nodes.filter((node) => node.kind === 'theme');
  const kindCounts = new Map<string, number>();
  for (const node of contentNodes) {
    kindCounts.set(node.kind, (kindCounts.get(node.kind) ?? 0) + 1);
  }
  const relatedEdges = graph.edges.filter((edge) => edge.relation === 'related');

  /** Lignes Markdown du rapport. */
  const lines: string[] = [
    '# Graphe de connaissances du portfolio',
    '',
    `- ${contentNodes.length} contenus, ${themes.length} thèmes, ${graph.nodes.length - contentNodes.length - themes.length} concepts.`,
    `- ${graph.edges.length} arêtes, dont ${relatedEdges.length} relations de similarité.`,
    `- Contenus : ${[...kindCounts.entries()].map(([kind, count]) => `${count} ${kind}`).join(', ')}.`,
    '',
    '## Recommandations « voir aussi » par projet',
    '',
  ];

  for (const project of projects) {
    const recommendations = getKnowledgeRecommendations(project.id, { limit: previewLimit });
    const similar = getSimilarProjects(project.sourceId, 3);

    lines.push(`### ${labelOf(project)} (\`${project.id}\`)`, '');
    lines.push(
      `Thèmes : ${project.themes.map((theme) => byId.get(`theme:${theme}`)?.label.fr ?? theme).join(', ') || 'aucun'}.`,
      '',
    );

    if (recommendations.length === 0) {
      lines.push('- Aucune recommandation.', '');
      continue;
    }

    for (const recommendation of recommendations) {
      lines.push(
        `- \`${recommendation.node.kind}\` ${labelOf(recommendation.node)} — ${recommendation.score.toFixed(2)} — ${describeReasons(recommendation, byId)}`,
      );
    }

    if (similar.length > 0) {
      lines.push(
        '',
        `Projets proches : ${similar.map((item) => labelOf(item.node)).join(', ')}.`,
      );
    }
    lines.push('');
  }

  lines.push('## Recommandations « voir aussi » par compétence', '');

  for (const skill of contentNodes.filter((node) => node.kind === 'skill')) {
    const recommendations = getKnowledgeRecommendations(skill.id, {
      limit: previewLimit,
    });

    lines.push(`### ${labelOf(skill)} (\`${skill.id}\`)`, '');

    if (recommendations.length === 0) {
      lines.push('- Aucune recommandation.', '');
      continue;
    }

    for (const recommendation of recommendations) {
      lines.push(
        `- \`${recommendation.node.kind}\` ${labelOf(recommendation.node)} — ${recommendation.score.toFixed(2)} — ${describeReasons(recommendation, byId)}`,
      );
    }
    lines.push('');
  }

  lines.push('## Contextes déclarés', '');

  const contextEdges = graph.edges.filter((edge) => edge.relation === 'context');

  if (contextEdges.length === 0) {
    lines.push('- Aucun contexte déclaré.', '');
  } else {
    for (const edge of contextEdges) {
      const source = byId.get(edge.from);
      const target = byId.get(edge.to);
      if (!source || !target) continue;

      const sourceIsContext =
        source.kind === 'education' || source.kind === 'experience';
      const content = sourceIsContext ? target : source;
      const context = sourceIsContext ? source : target;

      lines.push(
        `- \`${content.kind}\` ${labelOf(content)} → \`${context.kind}\` ${labelOf(context)}`,
      );
    }
    lines.push('');
  }

  lines.push('## Thèmes et contenus rattachés', '');
  for (const theme of themes) {
    const tag = `theme:${theme.sourceId}`;
    const members = graph.edges
      .filter((edge) => edge.relation === 'has-theme' && edge.to === tag)
      .map((edge) => byId.get(edge.from))
      .filter((node): node is KnowledgeNode => Boolean(node))
      .slice(0, 10);
    lines.push(
      `- **${labelOf(theme)}** : ${members.map(labelOf).join(', ') || 'aucun contenu'}.`,
    );
  }
  lines.push('');

  return lines.join('\n');
}

/* =========================================================================
  VÉRIFICATIONS
========================================================================= */

/**
 * Hash du texte source d'un contenu, identique au script de similarité.
 *
 * @param node - Contenu du portfolio.
 * @returns Le hash SHA-256 hexadécimal.
 */
function hashNode(node: KnowledgeNode): string {
  return createHash('sha256')
    .update(
      [node.text.fr, node.text.en, node.text.es, node.tags.join('|')].join('\n'),
      'utf8',
    )
    .digest('hex');
}

/**
 * Signale un index sémantique absent, périmé ou calculé avec un autre modèle.
 *
 * Un avertissement ne bloque pas le déploiement : les recommandations restent
 * limitées aux voisins sémantiques disponibles.
 *
 * @returns La liste des avertissements.
 */
function collectSimilarityWarnings(): string[] {
  const index = getSimilarityIndex();
  const nodes = extractContentNodes().nodes;
  const warnings: string[] = [];

  if (
    index.model.name !== EMBEDDING_CONFIG.model ||
    index.model.revision !== EMBEDDING_CONFIG.revision
  ) {
    warnings.push(
      'l’index sémantique a été calculé avec un autre modèle ; relancer npm run knowledge:similarity.',
    );
  }

  const missing = nodes.filter((node) => !index.documents[node.id]);
  if (missing.length > 0) {
    warnings.push(
      `${missing.length} contenu(s) sans voisins sémantiques ; relancer npm run knowledge:similarity.`,
    );
  }

  const stale = nodes.filter(
    (node) => index.documents[node.id] && index.sources[node.id] !== hashNode(node),
  );
  if (stale.length > 0) {
    warnings.push(
      `${stale.length} contenu(s) modifié(s) depuis le calcul sémantique ; relancer npm run knowledge:similarity.`,
    );
  }

  return warnings;
}

/**
 * Signale les projets sans projet suffisamment proche.
 *
 * Un projet unique peut légitimement ne pas avoir de voisin : le bloc
 * « voir aussi » affiche alors un message de repli plutôt qu'un lien artificiel.
 *
 * @param graph - Graphe de connaissances.
 * @returns La liste des avertissements.
 */
function collectProjectWarnings(graph: KnowledgeGraph): string[] {
  return graph.nodes
    .filter((node) => node.kind === 'project')
    .filter((node) => getSimilarProjects(node.sourceId, 1).length === 0)
    .map(
      (node) =>
        `Aucun projet similaire pour ${node.id} : un message de repli sera affiché.`,
    );
}

/**
 * Contrôle la cohérence du graphe et des recommandations.
 *
 * @param graph - Graphe à valider.
 * @returns La liste des problèmes détectés.
 */
function collectProblems(graph: KnowledgeGraph): string[] {
  const problems: string[] = [];
  const ids = new Set(graph.nodes.map((node) => node.id));
  const contentNodes = graph.nodes.filter(
    (node) => node.kind !== 'theme' && node.kind !== 'concept',
  );

  for (const edge of graph.edges) {
    if (!ids.has(edge.from) || !ids.has(edge.to)) {
      problems.push(`Arête orpheline : ${edge.id}`);
    }
    if (edge.from === edge.to) {
      problems.push(`Arête réflexive : ${edge.id}`);
    }
    if (edge.relation === 'related' && (edge.score === undefined || edge.score < 0 || edge.score > 1)) {
      problems.push(`Score de similarité hors bornes : ${edge.id}`);
    }
  }

  const degree = new Map<string, number>(graph.nodes.map((node) => [node.id, 0]));
  for (const edge of graph.edges) {
    if (degree.has(edge.from)) degree.set(edge.from, (degree.get(edge.from) ?? 0) + 1);
    if (degree.has(edge.to)) degree.set(edge.to, (degree.get(edge.to) ?? 0) + 1);
  }
  for (const node of graph.nodes) {
    if ((degree.get(node.id) ?? 0) === 0) {
      problems.push(`Nœud isolé : ${node.id} (${node.kind})`);
    }
  }

  for (const node of contentNodes) {
    const recommendations = getKnowledgeRecommendations(node.id, { limit: previewLimit });
    if (recommendations.some((item) => item.node.id === node.id)) {
      problems.push(`Auto-recommandation pour ${node.id}`);
    }
  }

  const rebuilt = buildKnowledgeGraph(extractContentNodes());
  if (JSON.stringify(rebuilt) !== JSON.stringify(graph)) {
    problems.push('Le graphe reconstruit diffère : le calcul n\'est pas déterministe.');
  }

  return problems;
}

/* =========================================================================
  EXPORT
========================================================================= */

/**
 * Sérialise le graphe et ses recommandations pour un usage statique.
 *
 * @param graph - Graphe de connaissances.
 * @returns L'objet prêt à écrire en JSON.
 */
function buildPayload(graph: KnowledgeGraph) {
  const contentNodes = graph.nodes.filter(
    (node) => node.kind !== 'theme' && node.kind !== 'concept',
  );
  const recommendations = Object.fromEntries(
    contentNodes.map((node) => [
      node.id,
      getKnowledgeRecommendations(node.id, {
        limit: 5,
        minScore:
          node.kind === 'project'
            ? KNOWLEDGE_RANKING.projectContentMinScore
            : KNOWLEDGE_RANKING.relatedContentMinScore,
      }).map((item) => ({
        node: item.node.id,
        score: item.score,
        sharedThemes: item.sharedThemes,
        sharedTerms: item.sharedTerms,
        samePeriod: item.samePeriod,
        context: item.context,
      })),
    ]),
  );

  return {
    version: 1,
    source: 'npm run knowledge:graph',
    stats: {
      nodes: graph.nodes.length,
      edges: graph.edges.length,
      contents: contentNodes.length,
    },
    nodes: graph.nodes,
    edges: graph.edges,
    recommendations,
  };
}

/**
 * Point d'entrée du script : valide le graphe et écrit les exports.
 */
async function main(): Promise<void> {
  const graph = getKnowledgeGraph();
  const problems = collectProblems(graph);

  if (problems.length > 0) {
    console.error(`Graphe incohérent (${problems.length} problème(s)) :`);
    for (const problem of problems) console.error(`- ${problem}`);
    process.exitCode = 1;
    return;
  }

  const contents = graph.nodes.filter(
    (node) => node.kind !== 'theme' && node.kind !== 'concept',
  );
  const related = graph.edges.filter((edge) => edge.relation === 'related');
  console.log(
    `Graphe valide : ${contents.length} contenus, ${graph.nodes.length} nœuds, ${graph.edges.length} arêtes (${related.length} relations).`,
  );

  for (const warning of collectSimilarityWarnings()) {
    console.warn(`Attention : ${warning}`);
  }

  for (const warning of collectProjectWarnings(graph)) {
    console.warn(`Attention : ${warning}`);
  }

  if (checkOnly) return;

  const payload = buildPayload(graph);
  const markdown = buildMarkdown(graph);

  const htmlParts = await Promise.all(
    VIEWER_HTML_FILES.map(async (file) =>
      (await readFile(resolve(viewerDir, file), 'utf8')).trim(),
    ),
  );
  const [head, headerHtml, workspaceHtml] = htmlParts;
  const styles = await readViewerFiles(VIEWER_STYLE_FILES);
  const scripts = await readViewerFiles(VIEWER_SCRIPT_FILES);
  const themeInit = await readFile(
    resolve(viewerDir, 'scripts/theme-init.js'),
    'utf8',
  );
  const template = await readFile(templatePath, 'utf8');
  const embedded = JSON.stringify(payload).replace(/</g, '\\u003c');
  const viewer = template
    .replace('<!--__HEAD__-->', head)
    .replace('/*__THEME_INIT__*/', themeInit.trim())
    .replace('<!--__HEADER__-->', headerHtml)
    .replace('<!--__WORKSPACE__-->', workspaceHtml)
    .replace('/*__STYLES__*/', styles)
    .replace('/*__SCRIPTS__*/', scripts)
    .replace('<!--__SPECULATION_RULES__-->', speculationRules)
    .replace('/*__KNOWLEDGE_GRAPH_DATA__*/ null', embedded);

  await mkdir(outputDir, { recursive: true });
  await mkdir(dirname(publicViewerPath), { recursive: true });

  await writeFile(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  await writeFile(markdownPath, `${markdown}\n`, 'utf8');
  await writeFile(publicViewerPath, viewer, 'utf8');
  console.log(`Écrit : ${jsonPath}`);
  console.log(`Écrit : ${markdownPath}`);
  console.log(`Écrit : ${publicViewerPath}`);
}

await main();
