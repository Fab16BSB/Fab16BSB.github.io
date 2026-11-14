/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { resolveSectionProgress } from './sectionProgress.helpers';

/* =========================================================================
  HOOK : useSectionProgress
  Suit la section lue et remplit la frise, sans rendu React à chaque frame.
========================================================================= */
export function useSectionProgress(
  ids: string[],
  readingLine = 0.35,
): { active: string | null; progressRef: RefObject<HTMLElement | null> } {

  // Section active, `null` tant que les sections ne sont pas mesurées.
  const [active, setActive] = useState<string | null>(null);

  // Élément de la frise qui reçoit la variable CSS de progression.
  const progressRef = useRef<HTMLElement | null>(null);

  // Clé stable pour ne pas relancer l'effet à chaque rendu.
  const key = ids.join('|');

  useEffect(() => {
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    let frame = 0;
    let resizeObserver: ResizeObserver | undefined;

    const update = () => {
      frame = 0;

      // La ligne de lecture place le repère sous une partie de l'écran.
      const line = window.innerHeight * readingLine;
      const tops = elements.map((element) => element.getBoundingClientRect().top);

      // En bas de page, la dernière section est atteinte même si elle est courte.
      const root = document.documentElement;
      const atBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 2;
      const state = resolveSectionProgress(tops, atBottom ? Number.POSITIVE_INFINITY : line);
      const current = elements[state.activeIndex]?.id ?? null;

      setActive((previous) => (previous === current ? previous : current));
      progressRef.current?.style.setProperty(
        '--timeline-progress',
        state.progress.toFixed(4),
      );
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    if (elements.length > 0) {
      update();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);

      // Un changement de langue ou d'onglet modifie la hauteur des sections.
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(onScroll);
        resizeObserver.observe(document.body);
      }
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      resizeObserver?.disconnect();
    };
  }, [key, readingLine]);

  return { active, progressRef };
}
