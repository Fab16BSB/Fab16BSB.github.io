/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/hooks/ui/usePrefersReducedMotion';
import { requestVisitReveal } from '@/lib/visit/visit-reveal';
import type { VisitSpotlightRect } from '@/types/visit.types';

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Retourne l'élément visible correspondant à une cible.
 *
 * Une cible peut être une ancre de section (`#skills`) ou un attribut
 * `data-visit-target` posé sur une carte.
 *
 * @param target - Cible recherchée.
 * @returns L'élément visible, ou `null`.
 */
function findTarget(target: string): HTMLElement | null {
  let result: HTMLElement | null = null;

  if (target.startsWith('#')) {
    result = document.querySelector<HTMLElement>(target);
  } else {
    const nodes = [
      ...document.querySelectorAll<HTMLElement>(
        `[data-visit-target="${target}"]`,
      ),
    ];
    result =
      nodes.find((node) => node.offsetParent !== null) ??
      nodes[0] ??
      null;
  }

  return result;
}

/* =========================================================================
  HOOK : useVisitNavigation
  Mise en évidence, défilement et projecteur autour d'une cible.
========================================================================= */
export function useVisitNavigation() {
  const reducedMotion = usePrefersReducedMotion();

  // Rectangle du projecteur autour de l'élément courant.
  const [spotlight, setSpotlight] = useState<VisitSpotlightRect | null>(null);

  // Cible actuellement mise en évidence.
  const activeTargetRef = useRef<HTMLElement | null>(null);

  // Cible focusée et son tabindex d'origine, pour le restaurer ensuite.
  const focusRef = useRef<{
    element: HTMLElement;
    tabIndex: string | null;
  } | null>(null);

  // Timeout et frame du dernier défilement.
  const scheduleRef = useRef<{ timeout?: number; frame?: number }>({});

  // Met en évidence la cible courante et retire la précédente.
  const markTarget = useCallback((element: HTMLElement) => {
    activeTargetRef.current?.removeAttribute('data-visit-active');
    element.setAttribute('data-visit-active', 'true');
    activeTargetRef.current = element;
  }, []);

  // Recalcule le projecteur autour de la cible visible.
  const updateSpotlight = useCallback(() => {
    const element = activeTargetRef.current;

    if (element?.hasAttribute('data-visit-target')) {
      const rect = element.getBoundingClientRect();
      setSpotlight({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setSpotlight(null);
    }
  }, []);

  // Restaure le tabindex d'origine de la cible focusée.
  const restoreFocus = useCallback(() => {
    const current = focusRef.current;

    if (current) {
      if (current.tabIndex === null) {
        current.element.removeAttribute('tabindex');
      } else {
        current.element.setAttribute('tabindex', current.tabIndex);
      }

      focusRef.current = null;
    }
  }, []);

  // Donne le focus à une cible en mémorisant son tabindex.
  const focusTarget = useCallback(
    (element: HTMLElement) => {
      restoreFocus();
      focusRef.current = {
        element,
        tabIndex: element.getAttribute('tabindex'),
      };
      element.tabIndex = -1;
      element.focus({ preventScroll: true });
    },
    [restoreFocus],
  );

  // Retire la mise en évidence, le projecteur et le focus temporaire.
  const clearHighlight = useCallback(() => {
    restoreFocus();
    activeTargetRef.current?.removeAttribute('data-visit-active');
    activeTargetRef.current = null;
    setSpotlight(null);
  }, [restoreFocus]);

  // Fait défiler jusqu'à une cible, avec repli sur la section.
  const scrollToTarget = useCallback(
    (target: string, fallback?: string) => {
      const run = () => {
        const element =
          findTarget(target) ??
          (fallback ? findTarget(fallback) : null);

        if (element) {
          const isSection = element.matches('section[id]');
          markTarget(element);
          updateSpotlight();

          scheduleRef.current.frame = window.requestAnimationFrame(() => {
            element.scrollIntoView({
              behavior: reducedMotion ? 'auto' : 'smooth',
              block: isSection ? 'start' : 'center',
            });

            if (isSection) {
              const heading = element.querySelector<HTMLElement>('h1, h2');

              if (heading) {
                focusTarget(heading);
              }
            } else {
              focusTarget(element);
            }
          });
        }
      };

      // Annule l'éventuel défilement précédent avant d'en lancer un autre.
      if (scheduleRef.current.timeout !== undefined) {
        window.clearTimeout(scheduleRef.current.timeout);
      }

      if (scheduleRef.current.frame !== undefined) {
        window.cancelAnimationFrame(scheduleRef.current.frame);
      }

      // Laisse aux sections le temps de réinitialiser leurs filtres.
      requestVisitReveal(target);
      scheduleRef.current.timeout = window.setTimeout(run, 80);
    },
    [focusTarget, markTarget, reducedMotion, updateSpotlight],
  );

  // Nettoie le défilement et le focus temporaire au démontage.
  useEffect(
    () => () => {
      if (scheduleRef.current.timeout !== undefined) {
        window.clearTimeout(scheduleRef.current.timeout);
      }

      if (scheduleRef.current.frame !== undefined) {
        window.cancelAnimationFrame(scheduleRef.current.frame);
      }

      restoreFocus();
    },
    [restoreFocus],
  );

  return {
    spotlight,
    updateSpotlight,
    clearHighlight,
    scrollToTarget,
  };
}
