/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useEffect, useState } from 'react';
import { useLockBodyScroll } from '@/hooks/ui/useLockBodyScroll';

/* =========================================================================
  HOOK : useHeader
  Gère l'état du header : apparition au scroll et menu mobile.
========================================================================= */
export function useHeader() {

  // Indique si la page est défilée.
  const [scrolled, setScrolled] = useState(false);

  // État d'ouverture du menu mobile.
  const [open, setOpen] = useState(false);

  // Bloque le défilement quand le menu est ouvert.
  useLockBodyScroll(open);

  // Ferme le menu mobile.
  const close = useCallback(() => setOpen(false), []);

  // Ouvre ou ferme le menu mobile.
  const toggle = useCallback(() => setOpen((current) => !current), []);

  // Met à jour l'état `scrolled` au défilement et au redimensionnement.
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 10);

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return { scrolled, open, close, toggle };
}
