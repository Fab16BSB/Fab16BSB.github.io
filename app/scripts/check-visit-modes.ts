/**
 * Vérification : modes essentiel et complet.
 *
 * Le mode complet doit contenir l'essentiel, sans jamais être plus pauvre.
 *
 * Lancement : npm run visit:modes
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import assert from 'node:assert/strict';
import { visitPersonas } from '../src/data/visit/visit-personas.data';
import { VISIT_CONFIG } from '../src/lib/visit/visit.config';
import { visitQuestions } from './fixtures/visit-questions.data';
import { buildCheckPlan, LOCALES } from './visit-check.shared';

/* ─────────────────────────────────────────────────────────────────────────
   VÉRIFICATIONS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Compte les sections de contenu d'un parcours.
 *
 * @param stopIds - Identifiants des étapes.
 * @returns Le nombre de sections hors présentation.
 */
function countContentSections(stopIds: string[]): number {
  return stopIds.filter((id) => id !== 'about').length;
}

/** Nombre maximal de sections en mode essentiel. */
const MAX_EXPRESS_SECTIONS = VISIT_CONFIG.modes.express.maxSections;

let checked = 0;

for (const persona of visitPersonas) {
  for (const item of visitQuestions) {
    for (const locale of LOCALES) {
      const express = buildCheckPlan(
        item.question[locale],
        persona.id,
        'express',
        locale,
      );
      const full = buildCheckPlan(
        item.question[locale],
        persona.id,
        'full',
        locale,
      );
      const label = `${persona.id} ${item.id} ${locale}`;
      const expressIds = express.stops.map((stop) => stop.id);
      const fullStops = new Map(
        full.stops.map((stop) => [stop.id, stop]),
      );

      for (const stop of express.stops) {
        const fullStop = fullStops.get(stop.id);

        assert.ok(
          fullStop !== undefined,
          `${label} : section ${stop.id} absente du mode complet`,
        );
        assert.ok(
          fullStop.highlights.length >= stop.highlights.length,
          `${label} : ${stop.id} plus pauvre en complet ` +
            `(${fullStop.highlights.length} < ${stop.highlights.length})`,
        );
      }

      if (MAX_EXPRESS_SECTIONS !== null) {
        assert.ok(
          countContentSections(expressIds) <= MAX_EXPRESS_SECTIONS,
          `${label} : l'essentiel dépasse ${MAX_EXPRESS_SECTIONS} sections`,
        );
      }

      const fullCount = countContentSections(
        full.stops.map((stop) => stop.id),
      );

      if (
        MAX_EXPRESS_SECTIONS !== null &&
        fullCount > MAX_EXPRESS_SECTIONS
      ) {
        assert.ok(
          fullCount > countContentSections(expressIds),
          `${label} : le complet n'ajoute aucune section`,
        );
      }

      checked += 1;
    }
  }
}

console.log(
  `Modes : invariants vérifiés sur ${checked} parcours ` +
    `(${visitPersonas.length} profils × ${visitQuestions.length} offres ` +
    `× ${LOCALES.length} langues)`,
);
