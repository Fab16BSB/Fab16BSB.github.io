/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useRef, useState } from 'react';
import { useOnClickOutside } from '@/hooks/ui/useOnClickOutside';

/* =========================================================================
  HOOK : useLanguageSwitcher
  Gère l'ouverture du sélecteur de langue.
========================================================================= */
export function useLanguageSwitcher() {
  // État d'ouverture du menu.
  const [open, setOpen] = useState(false);

  // Référence du sélecteur, pour les clics extérieurs.
  const ref = useRef<HTMLDivElement>(null);

  // Ferme le menu.
  const close = useCallback(() => setOpen(false), []);

  // Ouvre ou ferme le menu.
  const toggle = useCallback(() => setOpen((current) => !current), []);

  // Ferme aussi au clic extérieur ou avec Échap.
  useOnClickOutside(ref, close, open);

  return { open, toggle, close, ref };
}
