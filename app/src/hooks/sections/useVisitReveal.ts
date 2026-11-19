/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useRef } from 'react';
import { VISIT_REVEAL_EVENT, getVisitRevealTarget, isVisitReveal } from '@/lib/visit/visit-reveal';

/* =========================================================================
  HOOK : useVisitReveal
  Réinitialise une section quand la visite guidée cible l'un de ses préfixes.
========================================================================= */
export function useVisitReveal(
  prefixes: readonly string[],
  onReveal: (target: string) => void,
): void {

  // Handler courant en ref pour éviter de réabonner l'écouteur.
  const handlerRef = useRef(onReveal);

  // Suit la dernière callback fournie.
  useEffect(() => {
    handlerRef.current = onReveal;
  }, [onReveal]);

  // Clé primitive stable, contrairement à un tableau littéral recréé.
  const key = prefixes.join('|');

  // S'abonne aux demandes de révélation ciblant l'un des préfixes.
  useEffect(() => {
    const list = key.split('|');

    const onRevealEvent = (event: Event) => {
      const target = getVisitRevealTarget(event);

      if (target !== null && list.some((prefix) => isVisitReveal(event, prefix))) {
        handlerRef.current(target);
      }
    };

    window.addEventListener(VISIT_REVEAL_EVENT, onRevealEvent);

    return () => window.removeEventListener(VISIT_REVEAL_EVENT, onRevealEvent);
  }, [key]);
}
