/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { TabItem } from '@/types/ui.types';

/* =========================================================================
  HOOK : useTabs
  Gère le défilement horizontal et la navigation clavier des onglets.
========================================================================= */
export function useTabs(items: TabItem[], active: string, onChange: (id: string) => void) {
  // Références des boutons.
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  // Conteneur de la barre.
  const containerRef = useRef<HTMLDivElement>(null);

  // Indique si la barre déborde.
  const [scrollable, setScrollable] = useState(false);

  // Surveille la largeur de la barre.
  useEffect(() => {

    // Barre d'onglets.
    const element = containerRef.current;

    // Nettoyage de l'observateur.
    let cleanup: (() => void) | undefined;

    if (element) {

      // Met à jour l'état de débordement.
      const update = () => setScrollable(element.scrollWidth > element.clientWidth + 1);

      update();

      // La largeur peut changer sans nouvel onglet.
      const observer = new ResizeObserver(update);
      observer.observe(element);

      cleanup = () => observer.disconnect();
    }

    return cleanup;
  }, [items.length]);

  // Recentre l'onglet actif.
  useEffect(() => {
    if (scrollable) {

      // Index de l'onglet actif.
      const index = items.findIndex((item) => item.id === active);

      refs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [active, scrollable, items.length]);

  // Gère les flèches, Home et End.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {

    // Touche gérée.
    const handled =
      event.key === 'ArrowRight' ||
      event.key === 'ArrowLeft' ||
      event.key === 'Home' ||
      event.key === 'End';

    if (handled) {
      event.preventDefault();

      // Index suivant.
      let next = index;

      if (event.key === 'ArrowRight') {
        next = (index + 1) % items.length;
      } else if (event.key === 'ArrowLeft') {
        next = (index - 1 + items.length) % items.length;
      } else if (event.key === 'Home') {
        next = 0;
      } else if (event.key === 'End') {
        next = items.length - 1;
      }

      onChange(items[next].id);
      refs.current[next]?.focus();
    }
  };

  // État et action du groupe d'onglets.
  return { refs, containerRef, scrollable, onKeyDown };
}
