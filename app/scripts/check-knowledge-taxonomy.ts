/**
 * Vérifie la taxonomie du graphe et écrit un rapport de couverture.
 *
 * `npm run knowledge:taxonomy` signale les identifiants ou alias en double,
 * les concepts orphelins, les thèmes sans contenu, les tags non couverts et
 * les termes de thème jamais détectés.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { knowledgeThemes } from '../src/data/knowledge-taxonomy.data';
import { knowledgeConcepts } from '../src/lib/knowledge-concepts';
import { getKnowledgeGraph } from '../src/lib/knowledge-index';
import { KNOWLEDGE_STRUCTURAL_TAGS } from '../src/lib/knowledge-structural-tags';
import {
  includesKnowledgePhrase,
  normalizeKnowledgeText,
  padKnowledgeText,
} from '../src/lib/knowledge-normalize';

/* =========================================================================
  CONFIGURATION
========================================================================= */

/** Répertoire du script, pour résoudre le chemin du rapport. */
const scriptDir = dirname(fileURLToPath(import.meta.url));

/** Répertoire des exports générés, ignoré par Git. */
const outputDir = resolve(scriptDir, '../.cache/knowledge');

/** Fichier Markdown du rapport de couverture. */
const reportPath = resolve(outputDir, 'knowledge-taxonomy.report.md');

/** Nombre maximal de tags inconnus affichés dans le rapport. */
const MAX_UNKNOWN_TAGS = 80;

/** Natures de contenu dont les tags peuvent devenir des concepts. */
const TAG_CONTENT_KINDS = new Set([
  'project',
  'experience',
  'teaching',
  'education',
  'skill',
  'article',
  'video',
]);


/* =========================================================================
  ANALYSE
========================================================================= */

/** Contenus du graphe, hors thèmes et concepts. */
const nodes = getKnowledgeGraph().nodes.filter(
  (node) => node.kind !== 'theme' && node.kind !== 'concept',
);

/** Concepts réellement rattachés à au moins un contenu. */
const usedTerms = new Set(nodes.flatMap((node) => node.terms));

/** Thèmes réellement rattachés à au moins un contenu. */
const usedThemes = new Set(nodes.flatMap((node) => node.themes));

/** Nombre d'occurrences de chaque identifiant de concept. */
const conceptCounts = new Map<string, number>();

/** Identifiants de concepts propriétaires de chaque alias normalisé. */
const aliasOwners = new Map<string, string[]>();

// Indexe les identifiants et les alias pour détecter les doublons.
for (const concept of knowledgeConcepts) {
  conceptCounts.set(concept.id, (conceptCounts.get(concept.id) ?? 0) + 1);

  for (const alias of concept.aliases) {
    const normalized = normalizeKnowledgeText(alias);
    if (!normalized) continue;
    const owners = aliasOwners.get(normalized) ?? [];
    owners.push(concept.id);
    aliasOwners.set(normalized, owners);
  }
}

/** Identifiants de concepts déclarés plusieurs fois. */
const duplicateIds = [...conceptCounts.entries()]
  .filter(([, count]) => count > 1)
  .map(([id]) => id);

/** Alias revendiqués par plusieurs concepts. */
const duplicateAliases = [...aliasOwners.entries()]
  .filter(([, owners]) => new Set(owners).size > 1)
  .sort(([left], [right]) => left.localeCompare(right));

/** Concepts dont aucun alias n'est exploitable. */
const conceptsWithoutAliases = knowledgeConcepts.filter((concept) =>
  concept.aliases.every((alias) => !normalizeKnowledgeText(alias)),
);

/** Concepts qu'aucun contenu ne référence. */
const unusedConcepts = knowledgeConcepts.filter(
  (concept) => !usedTerms.has(concept.id),
);

/** Thèmes qu'aucun contenu ne référence. */
const unusedThemes = knowledgeThemes.filter(
  (theme) => !usedThemes.has(theme.id),
);

/** Tous les alias normalisés déjà couverts par un concept. */
const knownAliases = new Set(aliasOwners.keys());

/** Tous les termes normalisés déjà couverts par un thème. */
const themeTerms = new Set(
  knowledgeThemes.flatMap((theme) =>
    theme.terms.map(normalizeKnowledgeText).filter(Boolean),
  ),
);

/** Tags non couverts, associés aux contenus qui les portent. */
const unknownTags = new Map<string, string[]>();

// Ne considère que les tags des natures de contenu pertinentes.
for (const node of nodes) {
  if (!TAG_CONTENT_KINDS.has(node.kind)) continue;

  for (const tag of node.tags) {
    const normalized = normalizeKnowledgeText(tag);
    if (!normalized) continue;
    if (KNOWLEDGE_STRUCTURAL_TAGS.has(normalized)) continue;
    if (knownAliases.has(normalized) || themeTerms.has(normalized)) continue;

    const nodeIds = unknownTags.get(tag) ?? [];
    nodeIds.push(node.id);
    unknownTags.set(tag, nodeIds);
  }
}

/** Textes normalisés des contenus, pour vérifier les termes de thème. */
const nodeTexts = nodes.map((node) =>
  padKnowledgeText(
    normalizeKnowledgeText([node.text.fr, node.text.en, node.text.es].join(' ')),
  ),
);

/** Termes de thème absents de tous les textes du portfolio. */
const unusedThemeTerms = knowledgeThemes.flatMap((theme) =>
  theme.terms
    .filter((term) => {
      const normalized = normalizeKnowledgeText(term);
      return (
        normalized &&
        !nodeTexts.some((text) => includesKnowledgePhrase(text, normalized))
      );
    })
    .map((term) => ({ theme: theme.id, term })),
);


/* =========================================================================
  RAPPORT
========================================================================= */

/** Lignes Markdown du rapport de couverture. */
const lines: string[] = [
  '# Rapport de taxonomie',
  '',
  `- Concepts : ${knowledgeConcepts.length}`,
  `- Thèmes : ${knowledgeThemes.length}`,
  `- Concepts utilisés : ${knowledgeConcepts.length - unusedConcepts.length}`,
  `- Concepts non utilisés : ${unusedConcepts.length}`,
  `- Thèmes non utilisés : ${unusedThemes.length}`,
  `- Tags non couverts : ${unknownTags.size}`,
  `- Termes de thème jamais détectés : ${unusedThemeTerms.length}`,
  '',
];

if (duplicateIds.length > 0) {
  lines.push('## Identifiants de concepts en double', '');
  lines.push(...duplicateIds.map((id) => `- \`${id}\``));
  lines.push('');
}

if (duplicateAliases.length > 0) {
  lines.push('## Alias en conflit', '');
  for (const [alias, owners] of duplicateAliases) {
    lines.push(`- \`${alias}\` → ${[...new Set(owners)].join(', ')}`);
  }
  lines.push('');
}

if (conceptsWithoutAliases.length > 0) {
  lines.push('## Concepts sans alias', '');
  lines.push(
    ...conceptsWithoutAliases.map(
      (concept) => `- \`${concept.id}\` (${concept.label})`,
    ),
  );
  lines.push('');
}

if (unusedConcepts.length > 0) {
  lines.push('## Concepts non utilisés', '');
  lines.push(
    ...unusedConcepts.map(
      (concept) => `- \`${concept.id}\` (${concept.label})`,
    ),
  );
  lines.push('');
}

if (unusedThemes.length > 0) {
  lines.push('## Thèmes sans contenu', '');
  lines.push(
    ...unusedThemes.map((theme) => `- \`${theme.id}\` (${theme.label.fr})`),
  );
  lines.push('');
}

if (unknownTags.size > 0) {
  lines.push(
    '## Tags non promus en concepts',
    '',
    'Ces tags restent des pivots `tag:*` dans le graphe.',
    '',
  );

  /** Tags inconnus triés et limités pour le rapport. */
  const entries = [...unknownTags.entries()]
    .sort(
      ([leftTag, leftNodes], [rightTag, rightNodes]) =>
        rightNodes.length - leftNodes.length ||
        leftTag.localeCompare(rightTag),
    )
    .slice(0, MAX_UNKNOWN_TAGS);

  for (const [tag, nodeIds] of entries) {
    lines.push(
      `- \`${tag}\` — ${nodeIds.length} contenu(s) — ex. ${nodeIds.slice(0, 2).join(', ')}`,
    );
  }
  if (unknownTags.size > MAX_UNKNOWN_TAGS) {
    lines.push(`- … et ${unknownTags.size - MAX_UNKNOWN_TAGS} autre(s).`);
  }
  lines.push('');
}

if (unusedThemeTerms.length > 0) {
  lines.push('## Termes de thème jamais détectés', '');
  lines.push(
    ...unusedThemeTerms.map(
      ({ theme, term }) => `- \`${theme}\` → \`${term}\``,
    ),
  );
  lines.push('');
}

await mkdir(outputDir, { recursive: true });
await writeFile(reportPath, `${lines.join('\n')}\n`, 'utf8');


/* =========================================================================
  RÉSULTAT
========================================================================= */

/** Erreurs bloquantes qui rendent la taxonomie invalide. */
const errors = [
  ...duplicateIds.map((id) => `identifiant de concept en double : ${id}`),
  ...duplicateAliases.map(
    ([alias, owners]) => `alias en conflit : ${alias} → ${owners.join(', ')}`,
  ),
  ...conceptsWithoutAliases.map(
    (concept) => `concept sans alias : ${concept.id}`,
  ),
];

if (errors.length > 0) {
  console.error(`Taxonomie invalide (${errors.length} erreur(s)) :`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(
    `Taxonomie valide : ${knowledgeConcepts.length} concepts, ${knowledgeThemes.length} thèmes.`,
  );
}

if (unusedConcepts.length > 0) {
  console.warn(
    `${unusedConcepts.length} concept(s) sans contenu rattaché : voir le rapport.`,
  );
}
if (unknownTags.size > 0) {
  console.warn(
    `${unknownTags.size} tag(s) non couvert(s) : voir le rapport.`,
  );
}
if (unusedThemeTerms.length > 0) {
  console.warn(
    `${unusedThemeTerms.length} terme(s) de thème jamais détecté(s) : voir le rapport.`,
  );
}
console.log(`Rapport écrit : ${reportPath}`);
