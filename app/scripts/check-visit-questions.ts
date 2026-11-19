/**
 * Contrôle du parcours de visite : offres de référence.
 *
 * Exécute un jeu réaliste de recruteurs en FR / EN / ES, vérifie les attentes
 * de sections, de preuves, de verdict, d'écarts et d'ancienneté, puis contrôle
 * la cohérence entre les langues.
 *
 * Lancement : npm run visit:test
 * Rapport :   npm run visit:report
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { visitQuestions } from './fixtures/visit-questions.data';
import {
  buildCheckPlan,
  checkSections,
  formatStatus,
  isCaseActive,
  LOCALES,
  REFERENCE_YEAR,
} from './visit-check.shared';
import { getSkillTenure } from '../src/lib/skill-tenure';
import type { VisitQuestion } from './fixtures/visit-questions.data';
import type { Locale } from '../src/types/common.types';
import type { VisitPlan } from '../src/types/visit.types';

/* =========================================================================
  TYPES
========================================================================= */

/** Résultat d'une question dans une langue. */
type QuestionResult = {
  questionId: string;
  question: string;
  locale: Locale;
  status: 'OK' | 'FAIL';
  route: string;
  failures: string[];
  plan: VisitPlan;
};

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Répertoire du script. */
const scriptDir = dirname(fileURLToPath(import.meta.url));

/** Rapport Markdown demandé par --report. */
const wantsReport = process.argv.includes('--report');

/**
 * Part du meilleur score sous laquelle une section est marginale.
 *
 * Sa présence dépend alors de la formulation et non du contenu : la comparer
 * entre langues produit des faux positifs de stemming ou de synonymie.
 */
const SIGNIFICANT_SECTION_RATIO = 0.25;

/* =========================================================================
  HELPERS
========================================================================= */

/* ─────────────────────────────────────────────────────────────────────────
   FORMATAGE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Résume un parcours sous la forme section {compétence}.
 *
 * @param plan - Parcours à résumer.
 * @returns Les étapes séparées par une flèche.
 */
function formatRoute(plan: VisitPlan): string {
  return plan.stops
    .map((stop) => {
      const skills = stop.highlights
        .filter((highlight) => highlight.skillId)
        .map((highlight) => highlight.skillId)
        .join(', ');
      const skillLabel = skills ? ` {${skills}}` : '';

      return `${stop.id}${skillLabel}`;
    })
    .join(' → ');
}

/* ─────────────────────────────────────────────────────────────────────────
   CONTRÔLE D'UNE QUESTION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Vérifie une question dans une langue.
 *
 * @param item - Question et attentes.
 * @param locale - Langue testée.
 * @returns Le résultat détaillé.
 */
function checkQuestion(
  item: VisitQuestion,
  locale: Locale,
): QuestionResult {
  // Une requête s'évalue toujours avec le profil généraliste.
  const plan = buildCheckPlan(
    item.question[locale],
    'general',
    'express',
    locale,
  );
  const highlights = plan.stops.flatMap((stop) => stop.highlights);
  const failures = checkSections(plan, item.expected);

  for (const skill of item.expected.skills ?? []) {
    if (!highlights.some((highlight) => highlight.skillId === skill)) {
      failures.push(`compétence manquante : ${skill}`);
    }
  }

  for (const target of item.expected.targets ?? []) {
    if (!highlights.some((highlight) => highlight.target === target)) {
      failures.push(`preuve manquante : ${target}`);
    }
  }

  for (const target of item.expected.excludedTargets ?? []) {
    if (highlights.some((highlight) => highlight.target === target)) {
      failures.push(`preuve interdite : ${target}`);
    }
  }

  if (item.expected.fit !== undefined) {
    if (plan.verdict?.fit !== item.expected.fit) {
      failures.push(
        `verdict ${plan.verdict?.fit ?? 'absent'} (attendu ${item.expected.fit})`,
      );
    }
  }

  if (
    item.expected.hasMatches !== undefined &&
    plan.hasMatches !== item.expected.hasMatches
  ) {
    failures.push(
      `correspondances ${plan.hasMatches ? 'présentes' : 'absentes'} (attendu ${item.expected.hasMatches ? 'présentes' : 'absentes'})`,
    );
  }

  if (item.expected.gaps) {
    const actual = [...(plan.verdict?.gaps.map((gap) => gap.key) ?? [])].sort();
    const expected = [...item.expected.gaps].sort();

    if (actual.join('|') !== expected.join('|')) {
      failures.push(
        `écarts ${actual.join(', ') || 'aucun'} (attendu ${expected.join(', ')})`,
      );
    }
  }

  const evidenceTargets = plan.verdict?.evidenceTargets ?? [];

  for (const target of item.expected.evidenceTargets ?? []) {
    if (!evidenceTargets.includes(target)) {
      failures.push(`preuve manquante : ${target}`);
    }
  }

  for (const target of item.expected.excludedEvidenceTargets ?? []) {
    if (evidenceTargets.includes(target)) {
      failures.push(`preuve interdite : ${target}`);
    }
  }

  if (
    item.expected.evidenceAnyPrefixes &&
    item.expected.evidenceAnyPrefixes.length > 0 &&
    !evidenceTargets.some((target) =>
      item.expected.evidenceAnyPrefixes?.some((prefix) =>
        target.startsWith(prefix),
      ),
    )
  ) {
    failures.push(
      `aucune preuve avec les préfixes : ${item.expected.evidenceAnyPrefixes.join(', ')}`,
    );
  }

  for (const expectation of item.expected.tenure ?? []) {
    const tenure = getSkillTenure(
      expectation.skillId,
      REFERENCE_YEAR,
    );

    if (!tenure) {
      failures.push(`ancienneté introuvable : ${expectation.skillId}`);
    } else {
      for (const [key, expected] of Object.entries(expectation)) {
        if (key === 'skillId') {
          continue;
        }

        const actual = tenure[key as keyof typeof tenure];

        if (actual !== expected) {
          failures.push(
            `${expectation.skillId}.${key} = ${String(actual)} (attendu ${String(expected)})`,
          );
        }
      }
    }
  }

  if (
    item.expected.minSteps !== undefined &&
    plan.stops.length < item.expected.minSteps
  ) {
    failures.push(
      `trop peu d’étapes : ${plan.stops.length} < ${item.expected.minSteps}`,
    );
  }

  if (
    item.expected.maxSteps !== undefined &&
    plan.stops.length > item.expected.maxSteps
  ) {
    failures.push(
      `trop d’étapes : ${plan.stops.length} > ${item.expected.maxSteps}`,
    );
  }

  const route = formatRoute(plan);
  const result: QuestionResult = {
    questionId: item.id,
    question: item.question[locale],
    locale,
    status: failures.length === 0 ? 'OK' : 'FAIL',
    route,
    failures,
    plan,
  };

  return result;
}

/**
 * Vérifie le mode complet d'une question dans une langue.
 *
 * Le complet doit prolonger l'essentiel, ne jamais perdre de contenu et
 * n'ajouter que des sections portées par un contenu réel.
 *
 * @param item - Question et attentes.
 * @param locale - Langue testée.
 * @returns Le résultat détaillé du mode complet.
 */
function checkFullQuestion(
  item: VisitQuestion,
  locale: Locale,
): QuestionResult {
  const plan = buildCheckPlan(
    item.question[locale],
    'general',
    'full',
    locale,
  );
  // Une requête s'évalue toujours avec le profil généraliste.
  const essential = buildCheckPlan(
    item.question[locale],
    'general',
    'express',
    locale,
  );
  const failures: string[] = [];
  const essentialIds = essential.stops.map((stop) => stop.id);
  const fullIds = plan.stops.map((stop) => stop.id);

  if (
    fullIds.slice(0, essentialIds.length).join('|') !==
    essentialIds.join('|')
  ) {
    failures.push('le complet ne prolonge pas l’essentiel');
  }

  for (const stop of essential.stops) {
    const fullStop = plan.stops.find((entry) => entry.id === stop.id);

    if (!fullStop) {
      failures.push(`section perdue en complet : ${stop.id}`);
    } else if (fullStop.highlights.length < stop.highlights.length) {
      failures.push(`contenus perdus en complet : ${stop.id}`);
    }
  }

  const essentialSet = new Set(essentialIds);

  for (const stop of plan.stops) {
    if (!essentialSet.has(stop.id) && stop.isComplement) {
      failures.push(`étape ajoutée sans contenu réel : ${stop.id}`);
    }
  }

  // Le verdict reste identique entre les deux modes.
  if (plan.verdict?.fit !== essential.verdict?.fit) {
    failures.push(
      `verdict ${plan.verdict?.fit ?? 'absent'} ` +
        `(essentiel ${essential.verdict?.fit ?? 'absent'})`,
    );
  }

  if (
    JSON.stringify(plan.verdict?.gaps ?? []) !==
    JSON.stringify(essential.verdict?.gaps ?? [])
  ) {
    failures.push('écarts différents entre essentiel et complet');
  }

  if (
    JSON.stringify(plan.verdict?.evidence ?? []) !==
    JSON.stringify(essential.verdict?.evidence ?? [])
  ) {
    failures.push('preuves différentes entre essentiel et complet');
  }

  if (item.expected.full?.empty === true && plan.stops.length > 0) {
    failures.push(
      `visite proposée en complet : ${plan.stops.length} étape(s)`,
    );
  }

  for (const section of item.expected.full?.sections ?? []) {
    if (!fullIds.includes(section)) {
      failures.push(`section manquante en complet : ${section}`);
    }
  }

  for (const section of item.expected.full?.excludedSections ?? []) {
    if (fullIds.includes(section)) {
      failures.push(`section interdite en complet : ${section}`);
    }
  }

  return {
    questionId: item.id,
    question: item.question[locale],
    locale,
    status: failures.length === 0 ? 'OK' : 'FAIL',
    route: formatRoute(plan),
    failures,
    plan,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   COHÉRENCE ENTRE LANGUES
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Liste les sections d'un parcours avec leur score.
 *
 * @param plan - Parcours évalué.
 * @returns Les scores par identifiant de section.
 */
function getSectionScores(plan: VisitPlan): Map<string, number> {
  return new Map(
    plan.stops.map((stop) => [stop.id, stop.score] as const),
  );
}

/**
 * Indique si les sections divergent de façon structurante entre les langues.
 *
 * Une section absente dans une langue n'est retenue comme écart que si son
 * score dépasse un quart du meilleur score du parcours. En dessous, sa présence
 * relève d'un accrochage de vocabulaire, pas d'une différence de contenu.
 *
 * @param group - Résultats d'une même offre dans les trois langues.
 * @returns `true` si un écart de section mérite d'être signalé.
 */
function hasStructuralSectionGap(group: QuestionResult[]): boolean {
  const scores = group.map((result) => getSectionScores(result.plan));
  const present = scores.map((map) => new Set(map.keys()));
  const best = Math.max(
    0,
    ...scores.flatMap((map) => [...map.values()]),
  );
  const sections = new Set(scores.flatMap((map) => [...map.keys()]));

  return [...sections].some((section) => {
    const count = present.filter((set) => set.has(section)).length;

    if (count === 0 || count === present.length) {
      return false;
    }

    const maxScore = Math.max(
      0,
      ...scores.map((map) => map.get(section) ?? 0),
    );

    return maxScore >= best * SIGNIFICANT_SECTION_RATIO;
  });
}

/**
 * Vérifie que les trois langues donnent le même verdict, le même ensemble de
 * sections et les mêmes écarts nommés.
 *
 * @param results - Résultats de toutes les questions et langues.
 * @returns Les incohérences détectées.
 */
function checkCrossLanguage(results: QuestionResult[]): string[] {
  const grouped = new Map<string, QuestionResult[]>();

  for (const result of results) {
    const list = grouped.get(result.questionId) ?? [];
    list.push(result);
    grouped.set(result.questionId, list);
  }

  const failures: string[] = [];

  for (const [questionId, group] of grouped) {
    const fits = new Set(
      group.map((result) => result.plan.verdict?.fit ?? 'none'),
    );
    const sections = new Set(
      group.map((result) =>
        result.plan.stops
          .map((stop) => stop.id)
          .sort()
          .join(','),
      ),
    );
    const gaps = new Set(
      group.map((result) =>
        (result.plan.verdict?.gaps ?? [])
          .map((gap) => gap.key)
          .filter((key) => key !== 'visit.gaps.coverage')
          .sort()
          .join(','),
      ),
    );
    const matches = new Set(
      group.map((result) => String(result.plan.hasMatches)),
    );

    if (
      fits.size > 1 ||
      (sections.size > 1 && hasStructuralSectionGap(group)) ||
      gaps.size > 1 ||
      matches.size > 1
    ) {
      failures.push(
        `${questionId} : verdicts ${[...fits].join('/')}, sections ${[...sections].join(' vs ')}, écarts ${[...gaps].join(' vs ')}, correspondances ${[...matches].join('/')}`,
      );
    }
  }

  return failures;
}

/* ─────────────────────────────────────────────────────────────────────────
   RAPPORT
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Décrit le verdict d'un parcours.
 *
 * @param plan - Parcours évalué.
 * @returns Verdict, preuves et écarts, ou un tiret sans verdict.
 */
function formatVerdict(plan: VisitPlan): string {
  if (!plan.verdict) {
    return '—';
  }

  const evidence = plan.verdict.evidence.join(' · ') || 'aucune';
  const gaps =
    plan.verdict.gaps.map((gap) => gap.key).join(' · ') || 'aucun';

  return `${plan.verdict.fit} — preuves : ${evidence} ; écarts : ${gaps}`;
}

/**
 * Écrit le rapport Markdown.
 *
 * @param results - Résultats de toutes les questions.
 * @param crossLanguageFailures - Incohérences entre les langues.
 */
async function writeReport(
  results: QuestionResult[],
  crossLanguageFailures: string[],
  fullResults: QuestionResult[],
): Promise<void> {
  const path = resolve(
    scriptDir,
    '../.cache/visit/visit-questions.report.md',
  );
  const ok = results.filter((result) => result.status === 'OK').length;
  const fullOk = fullResults.filter(
    (result) => result.status === 'OK',
  ).length;
  const lines = [
    '# Rapport du parcours de visite',
    '',
    `Année de référence : ${REFERENCE_YEAR}`,
    '',
    `Résultat essentiel : ${ok}/${results.length} cas réussis.`,
    `Résultat complet : ${fullOk}/${fullResults.length} cas réussis.`,
    '',
    '## Mode essentiel',
    '',
    '| Question | Langue | Verdict | Statut | Parcours | Échecs |',
    '|---|---|---|---|---|---|',
    ...results.map(
      (result) =>
        `| ${result.questionId} | ${result.locale} | ${result.plan.verdict?.fit ?? '—'} | ${result.status} | ${result.route.replaceAll('|', '/')} | ${result.failures.join('<br>') || '—'} |`,
    ),
    '',
    '## Mode complet',
    '',
    '| Question | Langue | Verdict | Statut | Parcours | Échecs |',
    '|---|---|---|---|---|---|',
    ...fullResults.map(
      (result) =>
        `| ${result.questionId} | ${result.locale} | ${result.plan.verdict?.fit ?? '—'} | ${result.status} | ${result.route.replaceAll('|', '/')} | ${result.failures.join('<br>') || '—'} |`,
    ),
    '',
    '## Cohérence entre langues (essentiel)',
    '',
    ...(crossLanguageFailures.length > 0
      ? crossLanguageFailures.map((failure) => `- ${failure}`)
      : ['Aucune incohérence de verdict, de sections ou d’écarts nommés.']),
    '',
    '## Détail par question',
    '',
    ...results.flatMap((result) => [
      `### ${result.questionId} — ${result.locale}`,
      '',
      `**Question :** ${result.question}`,
      '',
      `**Parcours :** ${result.route}`,
      '',
      `**Verdict :** ${formatVerdict(result.plan)}`,
      '',
      `**Statut :** ${result.status}`,
      '',
      result.failures.length > 0
        ? `**Échecs :**\n\n${result.failures.map((failure) => `- ${failure}`).join('\n')}`
        : '**Échecs :** aucun',
      '',
    ]),
  ];

  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${lines.join('\n')}\n`, 'utf8');
  console.log(`Rapport écrit : ${path}`);
}

/* =========================================================================
  EXÉCUTION
========================================================================= */

const activeQuestions = visitQuestions.filter(isCaseActive);
const results = activeQuestions.flatMap((item) =>
  LOCALES.map((locale) => checkQuestion(item, locale)),
);
const fullResults = activeQuestions.flatMap((item) =>
  LOCALES.map((locale) => checkFullQuestion(item, locale)),
);
const failures = results.filter((result) => result.status === 'FAIL');
const fullFailures = fullResults.filter(
  (result) => result.status === 'FAIL',
);
const crossLanguageFailures = checkCrossLanguage(results);

for (const result of results) {
  const prefix = formatStatus(result.status === 'OK');
  console.log(
    `${prefix} [${result.locale}] ${result.questionId} — ${result.route}`,
  );

  for (const failure of result.failures) {
    console.log(`     ${failure}`);
  }
}

console.log('\nMode complet :');

for (const result of fullResults) {
  const prefix = formatStatus(result.status === 'OK');
  console.log(
    `${prefix} [${result.locale}] ${result.questionId} — ${result.route}`,
  );

  for (const failure of result.failures) {
    console.log(`     ${failure}`);
  }
}

if (crossLanguageFailures.length > 0) {
  console.log('\nIncohérences entre langues :');

  for (const failure of crossLanguageFailures) {
    console.log(`     ${failure}`);
  }
}

const ok = results.length - failures.length;
const fullOk = fullResults.length - fullFailures.length;
console.log(
  `\nEssentiel : ${ok}/${results.length} cas réussis — ` +
    `complet : ${fullOk}/${fullResults.length} cas réussis ` +
    `(${activeQuestions.length} questions × ${LOCALES.length} langues)`,
);

if (wantsReport) {
  await writeReport(results, crossLanguageFailures, fullResults);
}

if (
  failures.length > 0 ||
  fullFailures.length > 0 ||
  crossLanguageFailures.length > 0
) {
  process.exitCode = 1;
}
