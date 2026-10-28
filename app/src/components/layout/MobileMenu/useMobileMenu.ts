/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect } from 'react';

/* =========================================================================
  HOOK : useMobileMenu
  Ferme le menu mobile avec la touche Échap lorsqu'il est ouvert.
========================================================================= */
export function useMobileMenu(open: boolean, onClose: () => void) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (open) {
      // L'écoute n'existe que menu ouvert : aucun coût quand il est fermé.
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', onKeyDown);

      cleanup = () => document.removeEventListener('keydown', onKeyDown);
    }

    return cleanup;
  }, [open, onClose]);
}
