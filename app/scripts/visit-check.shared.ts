/**
 * Partagé : constantes et contrôles communs aux scripts visit:*.
 *
 * Centralise les langues, l'année de référence et les vérifications de
 * sections pour que les scripts de contrôle restent alignés.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import { profile } from '../src/data/profile/profile.data';
import { buildVisitPlan } from '../src/lib/visit/plan/visit-plan';
import type { Locale } from '../src/types/common.types';
import type {
  VisitMode,
  VisitPersona,
  VisitPlan,
  VisitSectionId,
} from '../src/types/visit.types';

/* =========================================================================
  TYPES
========================================================================= */

/** Attentes de sections d'un cas de contrôle. */
export type SectionExpectation = {
  sections?: VisitSectionId[];
  excludedSections?: VisitSectionId[];
};

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Langues contrôlées par les scripts visit:*. */
export const LOCALES: Locale[] = ['fr', 'en', 'es'];

/** Année de référence fixe pour des résultats reproductibles. */
export const REFERENCE_YEAR = 2026;

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Construit un parcours avec l'année de référence des contrôles.
 *
 * @param query - Requête de visite.
 * @param persona - Profil de lecteur simulé.
 * @param mode - Mode de parcours.
 * @param locale - Langue de lecture.
 * @returns Le parcours produit par le routeur.
 */
export function buildCheckPlan(
  query: string,
  persona: VisitPersona,
  mode: VisitMode,
  locale: Locale,
): VisitPlan {
  return buildVisitPlan(query, persona, mode, locale, REFERENCE_YEAR);
}

/**
 * Indique si un parcours est routé, c'est-à-dire ni faible ni sans preuve.
 *
 * @param plan - Parcours produit par le routeur.
 * @returns `true` si le parcours est considéré comme routé.
 */
export function isRouted(plan: VisitPlan): boolean {
  return plan.verdict?.fit !== 'weak' && plan.hasMatches;
}

/**
 * Formate un statut sur la largeur de `FAIL`.
 *
 * @param ok - Succès du cas.
 * @returns `OK` complété par des espaces, ou `FAIL`.
 */
export function formatStatus(ok: boolean): string {
  return ok ? 'OK  ' : 'FAIL';
}

/**
 * Indique si un cas doit être exécuté avec la disponibilité actuelle.
 *
 * Un cas marqué `requiresAvailability` est ignoré tant que le profil n'est pas
 * explicitement disponible.
 *
 * @param item - Cas de contrôle.
 * @returns `true` si le cas doit être exécuté.
 */
export function isCaseActive(item: {
  requiresAvailability?: boolean;
}): boolean {
  return !(
    item.requiresAvailability &&
    profile.availability.status !== 'available'
  );
}

/**
 * Relève les sections manquantes et interdites d'un parcours.
 *
 * @param plan - Parcours produit par le routeur.
 * @param expected - Sections attendues et exclues.
 * @returns Les échecs détectés, vide si le parcours respecte le contrat.
 */
export function checkSections(
  plan: VisitPlan,
  expected: SectionExpectation,
): string[] {
  const sections = new Set(plan.stops.map((stop) => stop.id));
  const failures: string[] = [];

  for (const section of expected.sections ?? []) {
    if (!sections.has(section)) {
      failures.push(`section manquante : ${section}`);
    }
  }

  for (const section of expected.excludedSections ?? []) {
    if (sections.has(section)) {
      failures.push(`section interdite : ${section}`);
    }
  }

  return failures;
}
