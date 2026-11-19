/* =========================================================================
  HELPERS : révélation d'une cible de visite
  Demande à une section de réinitialiser ses filtres avant le défilement.
========================================================================= */

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Événement écouté par les sections filtrables. */
export const VISIT_REVEAL_EVENT = 'visit:reveal';

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Détail de l'événement de révélation. */
export type VisitRevealDetail = {
  target: string;
};

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Demande la révélation d'une cible.
 *
 * @param target - Attribut `data-visit-target` recherché.
 */
export function requestVisitReveal(target: string): void {
  window.dispatchEvent(
    new CustomEvent<VisitRevealDetail>(VISIT_REVEAL_EVENT, {
      detail: { target },
    }),
  );
}

/**
 * Retourne la cible visée par un événement de révélation.
 *
 * @param event - Événement reçu.
 * @returns La cible, ou `null` si l'événement n'en porte pas.
 */
export function getVisitRevealTarget(event: Event): string | null {
  const detail = (event as CustomEvent<VisitRevealDetail>).detail;
  const result = detail?.target ?? null;

  return result;
}

/**
 * Indique si l'événement concerne une cible d'un préfixe donné.
 *
 * @param event - Événement reçu.
 * @param prefix - Préfixe attendu, construit par `visitTargetPrefix`.
 * @returns `true` si la cible correspond.
 */
export function isVisitReveal(event: Event, prefix: string): boolean {
  const target = getVisitRevealTarget(event);
  const result = target?.startsWith(prefix) ?? false;

  return result;
}
