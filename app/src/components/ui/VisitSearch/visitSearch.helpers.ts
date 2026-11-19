/* =========================================================================
   HELPERS : formatage du parcours — fonctions pures
   Durées et libellés courts de la palette de visite.
========================================================================= */

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Durée répartie en minutes et secondes. */
export type VisitDurationParts = {
  minutes: number;
  seconds: number;
};

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Répartit une durée totale en minutes et secondes.
 *
 * @param totalSeconds - Durée en secondes.
 * @returns Les minutes entières et les secondes restantes.
 */
export function splitVisitDuration(totalSeconds: number): VisitDurationParts {
  const result: VisitDurationParts = {
    minutes: Math.floor(totalSeconds / 60),
    seconds: totalSeconds % 60,
  };

  return result;
}

/**
 * Arrondit une durée en minutes lisibles.
 *
 * @param totalSeconds - Durée en secondes.
 * @returns Au moins une minute, arrondie au plus proche.
 */
export function getVisitMinutes(totalSeconds: number): number {
  const result = Math.max(1, Math.round(totalSeconds / 60));

  return result;
}
