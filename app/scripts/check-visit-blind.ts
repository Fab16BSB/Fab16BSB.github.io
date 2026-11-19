/**
 * Contrôle du parcours de visite : jeu aveugle.
 *
 * Exécute des requêtes réalistes, séparées des cas utilisés pour régler les
 * seuils. Un échec signale une régression de routage : on corrige le routeur,
 * jamais l'attente.
 *
 * Lancement : npm run visit:blind
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { visitBlindCases } from './fixtures/visit-blind.data';
import {
  buildCheckPlan,
  checkSections,
  formatStatus,
  isCaseActive,
  isRouted,
  LOCALES,
} from './visit-check.shared';
import type { VisitBlindCase } from './fixtures/visit-blind.data';
import type { Locale } from '../src/types/common.types';

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Exécute un cas dans une langue.
 *
 * @param item - Cas de contrôle et attente.
 * @param locale - Langue de lecture.
 * @returns Les échecs détectés, vide si le routage respecte l'attente.
 */
function checkCase(item: VisitBlindCase, locale: Locale): string[] {
  // Une requête s'évalue toujours avec le profil généraliste.
  const plan = buildCheckPlan(
    item.question[locale],
    'general',
    'express',
    locale,
  );
  const failures = checkSections(plan, item.expected);

  if (item.expected.weak && isRouted(plan)) {
    failures.push(
      `verdict ${plan.verdict?.fit ?? 'absent'} (faible attendu)`,
    );
  }

  return failures;
}

/* =========================================================================
  EXÉCUTION
========================================================================= */

const activeCases = visitBlindCases.filter(isCaseActive);
const total = activeCases.length * LOCALES.length;
let failed = 0;

for (const item of activeCases) {
  for (const locale of LOCALES) {
    const failures = checkCase(item, locale);
    const status = formatStatus(failures.length === 0);

    console.log(`${status} [${locale}] ${item.id}`);

    for (const failure of failures) {
      console.log(`     ${failure}`);
    }

    if (failures.length > 0) {
      failed += 1;
    }
  }
}

console.log(`${total - failed}/${total} cas réussis — jeu aveugle`);

if (failed > 0) {
  process.exitCode = 1;
}
