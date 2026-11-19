/* =========================================================================
  HELPERS : visite guidée — fonctions pures
  Transforme un parcours en cibles concrètes, section ou élément.
========================================================================= */
import type { VisitPlan, VisitTourTarget } from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTE
   ───────────────────────────────────────────────────────────────────────── */

/** Nombre maximal d'éléments retenus par étape. */
const MAX_ITEMS_PER_STOP = 2;

/* ─────────────────────────────────────────────────────────────────────────
   CIBLES
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Construit les cibles de la visite guidée.
 *
 * Chaque étape propose ses deux premiers contenus cliquables. À défaut,
 * la section elle-même devient la cible.
 *
 * @param plan - Parcours calculé.
 * @returns Les cibles ordonnées.
 */
export function buildVisitTourTargets(
  plan: VisitPlan,
): VisitTourTarget[] {
  const result = plan.stops.flatMap((stop): VisitTourTarget[] => {
    const highlights = stop.highlights
      .filter((highlight) => highlight.target)
      .slice(0, MAX_ITEMS_PER_STOP);

    if (highlights.length === 0) {
      return [
        {
          stopId: stop.id,
          labelKey: stop.labelKey,
          label: null,
          target: stop.anchor,
          section: stop.anchor,
        },
      ];
    }

    return highlights.map((highlight): VisitTourTarget => ({
      stopId: stop.id,
      labelKey: stop.labelKey,
      label: highlight.label,
      target: highlight.target!,
      section: stop.anchor,
    }));
  });

  return result;
}
