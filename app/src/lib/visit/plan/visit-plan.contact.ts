/* =========================================================================
   HELPERS : étape de contact — fonctions pures
   Tout parcours non vide se termine par les réseaux de la section Contact.
========================================================================= */
import { sectionsById } from '@/lib/visit/search/visit-search-vocabulary';
import type { Locale } from '@/types/common.types';
import type { VisitPlan, VisitStop } from '@/types/visit.types';

/**
 * Construit l'étape de contact à partir de sa définition.
 *
 * @param locale - Langue de lecture.
 * @returns L'étape de contact, ou `null` si la section est absente.
 */
function buildContactStop(locale: Locale): VisitStop | null {
  const definition = sectionsById.get('contact');

  if (!definition) {
    return null;
  }

  return {
    id: 'contact',
    anchor: definition.anchor,
    icon: definition.icon,
    labelKey: definition.labelKey,
    description: definition.description[locale],
    duration: definition.duration,
    score: 0,
    highlights: [],
    isComplement: false,
  };
}

/**
 * Ajoute l'étape de contact à la fin d'un parcours non vide.
 *
 * @param plan - Parcours calculé.
 * @param locale - Langue de lecture.
 * @returns Le parcours terminé par le contact.
 */
export function appendContactStop(
  plan: VisitPlan,
  locale: Locale,
): VisitPlan {
  const contact = buildContactStop(locale);

  if (
    !contact ||
    plan.stops.length === 0 ||
    plan.stops.some((stop) => stop.id === 'contact')
  ) {
    return plan;
  }

  const stops = [...plan.stops, contact];
  const duration = stops.reduce(
    (total, stop) => total + stop.duration,
    0,
  );

  return { ...plan, stops, duration };
}
