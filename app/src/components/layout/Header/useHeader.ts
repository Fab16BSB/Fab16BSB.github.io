/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useEffect, useState } from 'react';
import { useScrollSpy } from '@/hooks/sections/useScrollSpy';
import { useLockBodyScroll } from '@/hooks/ui/useLockBodyScroll';
import { navItems } from '@/data/navigation.data';

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

  // Met à jour l'état `scrolled` au défilement.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrolled, active, open, close, toggle };
}
