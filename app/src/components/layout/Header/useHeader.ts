/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useEffect, useState } from 'react';
import { useScrollSpy } from '@/hooks/sections/useScrollSpy';
import { useLockBodyScroll } from '@/hooks/ui/useLockBodyScroll';
import { navItems } from '@/data/navigation.data';
import { getScrollProgress } from './header.helpers';

/* =========================================================================
  HOOK : useHeader
  Gère l'état du header : scroll, section active et menu mobile.
========================================================================= */
export function useHeader() {

  // Indique si la page est défilée.
  const [scrolled, setScrolled] = useState(false);

  // État d'ouverture du menu mobile.
  const [open, setOpen] = useState(false);

  // Section actuellement visible.
  const active = useScrollSpy(navItems.map((item) => item.id));

  // Bloque le défilement quand le menu est ouvert.
  useLockBodyScroll(open);

  // Ferme le menu mobile.
  const close = useCallback(() => setOpen(false), []);

  // Ouvre ou ferme le menu mobile.
  const toggle = useCallback(() => setOpen((current) => !current), []);

  // Met à jour l'état `scrolled` et la progression du défilement.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      const root = document.documentElement;
      const progress = getScrollProgress(
        window.scrollY,
        root.scrollHeight,
        window.innerHeight,
      );

      setScrolled(window.scrollY > 10);
      // Variable CSS mise à jour sans rendu React, pour rester fluide au défilement.
      root.style.setProperty('--scroll-progress', progress.toFixed(4));
    };

    const onScroll = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return { scrolled, active, open, close, toggle };
}
