/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/ui/usePrefersReducedMotion';

/* =========================================================================
  HOOK : useReveal
  Anime l'apparition des éléments au défilement.
========================================================================= */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  // Conteneur dont les enfants `[data-reveal]` sont observés.
  const containerRef = useRef<T | null>(null);

  // Respecte la préférence système de réduction des animations.
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    let cleanup: (() => void) | undefined;

    if (container) {
      const revealAll = () => {
        container.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
          element.classList.add('is-visible');
        });
      };

      // Mouvement réduit : tout est affiché, mais le DOM reste observé.
      if (reducedMotion) {
        revealAll();
        const mutation = new MutationObserver(revealAll);
        mutation.observe(container, { childList: true, subtree: true });

        cleanup = () => mutation.disconnect();
      } else {
        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Une fois révélé, l'élément n'a plus besoin d'être observé.
                observer.unobserve(entry.target);
              }
            }
          },
          { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
        );

        // Évite de réenregistrer un élément à chaque mutation du DOM.
        const observed = new WeakSet<Element>();
        const observeNew = () => {
          container.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
            if (!observed.has(element) && !element.classList.contains('is-visible')) {
              observed.add(element);
              observer.observe(element);
            }
          });
        };

        observeNew();

        // Les sections ajoutées après le montage doivent aussi être observées.
        const mutation = new MutationObserver(observeNew);
        mutation.observe(container, { childList: true, subtree: true });

        cleanup = () => {
          observer.disconnect();
          mutation.disconnect();
        };
      }
    }

    return cleanup;
  }, [reducedMotion]);

  return containerRef;
}
