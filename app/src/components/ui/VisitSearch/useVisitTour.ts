/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useEffect, useState } from 'react';
import { buildVisitTourTargets } from '@/lib/visit/plan/visit-tour';
import type { VisitPlan, VisitTourState } from '@/types/visit.types';
import { useVisitNavigation } from './useVisitNavigation';

/* =========================================================================
  HOOK : useVisitTour
  Machine à états de la visite guidée et suivi de la cible courante.
========================================================================= */
export function useVisitTour(plan: VisitPlan) {
  const {
    spotlight,
    updateSpotlight,
    clearHighlight,
    scrollToTarget,
  } = useVisitNavigation();

  // Visite guidée en cours.
  const [tour, setTour] = useState<VisitTourState | null>(null);

  // Lance la visite sur les cibles du parcours courant.
  const startTour = useCallback(() => {
    const targets = buildVisitTourTargets(plan);

    if (targets.length > 0) {
      setTour({ targets, index: 0, done: false });
      scrollToTarget(targets[0].target, targets[0].section);
    }
  }, [plan, scrollToTarget]);

  // Passe à la cible suivante.
  const nextTour = useCallback(() => {
    if (tour) {
      const nextIndex = tour.index + 1;

      if (nextIndex >= tour.targets.length) {
        setTour({ ...tour, done: true });
      } else {
        const target = tour.targets[nextIndex];
        setTour({ ...tour, index: nextIndex, done: false });
        scrollToTarget(target.target, target.section);
      }
    }
  }, [tour, scrollToTarget]);

  // Revient à la cible précédente.
  const previousTour = useCallback(() => {
    if (tour && tour.index > 0) {
      const previousIndex = tour.index - 1;
      const target = tour.targets[previousIndex];
      setTour({ ...tour, index: previousIndex, done: false });
      scrollToTarget(target.target, target.section);
    }
  }, [tour, scrollToTarget]);

  // Rejoint directement une étape de la liste.
  const goToTourStep = useCallback(
    (index: number) => {
      if (tour) {
        const clamped = Math.max(
          0,
          Math.min(index, tour.targets.length - 1),
        );
        const target = tour.targets[clamped];

        if (target) {
          setTour({ ...tour, index: clamped, done: false });
          scrollToTarget(target.target, target.section);
        }
      }
    },
    [tour, scrollToTarget],
  );

  // Quitte la visite et retire la mise en évidence.
  const quitTour = useCallback(() => {
    clearHighlight();
    setTour(null);
  }, [clearHighlight]);

  // Relance la visite depuis la première cible.
  const replayTour = useCallback(() => {
    if (tour) {
      const first = tour.targets[0];
      setTour({ ...tour, index: 0, done: false });
      scrollToTarget(first.target, first.section);
    }
  }, [tour, scrollToTarget]);

  // Suit la cible pendant le défilement et le redimensionnement.
  useEffect(() => {
    if (!tour) {
      updateSpotlight();
      return undefined;
    }

    const update = () => updateSpotlight();
    const timer = window.setTimeout(update, 300);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [tour, updateSpotlight]);

  // Décale légèrement le contenu quand le volet de visite est ouvert.
  useEffect(() => {
    document.body.classList.toggle('visit-tour-active', Boolean(tour));

    return () => {
      document.body.classList.remove('visit-tour-active');
    };
  }, [tour]);

  return {
    tour,
    spotlight,
    startTour,
    nextTour,
    previousTour,
    goToTourStep,
    quitTour,
    replayTour,
    scrollToTarget,
    clearHighlight,
  };
}
