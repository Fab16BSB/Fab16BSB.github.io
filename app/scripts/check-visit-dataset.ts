/**
 * Contrôle du parcours de visite : jeu synthétique.
 *
 * Génère des offres par templates et mesure, par contexte étiqueté, la
 * proportion de parcours routés vers la section attendue. Jeu de charge : il
 * vérifie que les templates restent couverts, pas la qualité du routage.
 *
 * Lancement : npm run visit:dataset
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { profile } from '../src/data/profile/profile.data';
import {
  generateVisitContextDataset,
  type VisitContextCase,
  type VisitContextLabel,
} from './fixtures/visit-context-dataset';
import { buildCheckPlan, isRouted } from './visit-check.shared';
import type { Localized } from '../src/types/common.types';
import type {
  VisitPlan,
  VisitSectionId,
} from '../src/types/visit.types';

/* =========================================================================
  TYPES
========================================================================= */

/** Contexte étiqueté, hors abstention. */
type NamedContext = Exclude<VisitContextLabel, 'none'>;

/** Compteurs d'un contexte. */
type ContextMetrics = {
  total: number;
  routed: number;
  hit: number;
};

/** État agrégé du contrôle. */
type DatasetState = {
  metrics: Map<NamedContext, ContextMetrics>;
  failures: string[];
  exact: number;
  routed: number;
  abstentions: number;
  rejectedAbstentions: number;
};

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Section attendue pour chaque contexte. */
const CONTEXT_SECTIONS: Record<NamedContext, VisitSectionId> = {
  teaching: 'teaching',
  research: 'publications',
  videos: 'videos',
  awards: 'awards',
  availability: 'timeline',
};

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Résout le texte de disponibilité à retrouver dans la présentation.
 *
 * @returns Le texte localisé, ou null quand la disponibilité est masquée.
 */
function getAvailabilityTexts(): Localized | null {
  const status = profile.availability.status;

  return status === 'hidden' ? null : profile.availability.text[status];
}

/**
 * Formate un pourcentage à une décimale.
 *
 * @param value - Nombre de cas favorables.
 * @param total - Nombre total de cas.
 * @returns Le pourcentage formaté.
 */
function percentage(value: number, total: number): string {
  return ((value / total) * 100).toFixed(1);
}

/**
 * Compte un contexte attendu et relève la section manquante.
 *
 * La disponibilité est vérifiée dans le détail de la présentation, les autres
 * contextes dans les étapes du parcours.
 *
 * @param state - État agrégé du contrôle.
 * @param item - Offre étiquetée.
 * @param context - Contexte attendu.
 * @param plan - Parcours produit par le routeur.
 * @param routed - Parcours routé, ni faible ni sans preuve.
 * @param availabilityTexts - Texte de disponibilité, ou null si masquée.
 * @returns true si le contexte est couvert par le parcours.
 */
function countContext(
  state: DatasetState,
  item: VisitContextCase,
  context: NamedContext,
  plan: VisitPlan,
  routed: boolean,
  availabilityTexts: Localized | null,
): boolean {
  const metrics = state.metrics.get(context) ?? {
    total: 0,
    routed: 0,
    hit: 0,
  };
  const sectionIds = plan.stops.map((stop) => stop.id);
  const availabilityVisible =
    context === 'availability' &&
    availabilityTexts !== null &&
    plan.stops[0]?.highlights[0]?.detail === availabilityTexts[item.locale];
  const hit =
    routed &&
    (sectionIds.includes(CONTEXT_SECTIONS[context]) || availabilityVisible);

  metrics.total += 1;

  if (routed) {
    metrics.routed += 1;
  }

  if (hit) {
    metrics.hit += 1;
  } else {
    state.failures.push(
      `${item.id} : ${context} absent (${sectionIds.join(',')})`,
    );
  }

  state.metrics.set(context, metrics);

  return hit;
}

/**
 * Affiche une proportion.
 *
 * @param label - Libellé de la mesure.
 * @param value - Nombre de cas favorables.
 * @param total - Nombre total de cas.
 */
function printRate(label: string, value: number, total: number): void {
  console.log(`${label} : ${value}/${total} (${percentage(value, total)} %)`);
}

/* =========================================================================
  EXÉCUTION
========================================================================= */

const dataset = generateVisitContextDataset();
const availabilityTexts = getAvailabilityTexts();
const availabilityHidden = availabilityTexts === null;
const state: DatasetState = {
  metrics: new Map<NamedContext, ContextMetrics>(),
  failures: [],
  exact: 0,
  routed: 0,
  abstentions: 0,
  rejectedAbstentions: 0,
};

for (const item of dataset) {
  const plan = buildCheckPlan(item.text, 'general', 'express', item.locale);
  const routed = isRouted(plan);
  const isNone = item.labels.includes('none');
  const checkableLabels = item.labels.filter(
    (label) =>
      label !== 'none' &&
      !(label === 'availability' && availabilityHidden),
  );
  let caseOk = isNone ? !routed : checkableLabels.length === 0 || routed;

  if (routed) {
    state.routed += 1;
  }

  if (isNone) {
    state.abstentions += 1;

    if (!routed) {
      state.rejectedAbstentions += 1;
    } else {
      state.failures.push(
        `${item.id} : ${item.labels.join(',')} ` +
          `routé ${plan.verdict?.fit ?? 'sans verdict'}`,
      );
    }
  }

  for (const label of item.labels) {
    if (label === 'none') {
      continue;
    }

    if (label === 'availability' && availabilityHidden) {
      continue;
    }

    const context = label as NamedContext;

    if (
      !countContext(
        state,
        item,
        context,
        plan,
        routed,
        availabilityTexts,
      )
    ) {
      caseOk = false;
    }
  }

  if (caseOk) {
    state.exact += 1;
  }
}

/* =========================================================================
  RÉSULTATS
========================================================================= */

console.log(`Jeu de données : ${dataset.length} offres`);
printRate('Routes non faibles', state.routed, dataset.length);
printRate('Cas exacts', state.exact, dataset.length);
console.log(
  `Abstentions correctes : ${state.rejectedAbstentions}/${state.abstentions}`,
);

for (const [context, metrics] of state.metrics) {
  console.log(
    `- ${context} : ${metrics.hit}/${metrics.total} ` +
      `(${percentage(metrics.hit, metrics.total)} %) ` +
      `| routés ${metrics.routed}`,
  );
}

if (availabilityHidden) {
  console.log("Disponibilité masquée : cas d'availability ignorés.");
}

if (state.failures.length > 0) {
  console.log(`\nPremiers écarts (${state.failures.length}) :`);
  console.log(state.failures.slice(0, 10).join('\n'));
}
