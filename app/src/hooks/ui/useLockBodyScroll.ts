/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect } from 'react';

/* =========================================================================
  HOOK : useLockBodyScroll
  Bloque le défilement du body lorsqu'une modale est ouverte.
========================================================================= */
export function useLockBodyScroll(locked: boolean) {

  // Bloque puis restaure le défilement du body.
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (locked) {
      // La valeur précédente est restaurée telle quelle : une autre couche
      // (modale, menu) a pu modifier l'overflow avant ce hook.
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      cleanup = () => {
        document.body.style.overflow = previous;
      };
    }

    return cleanup;
  }, [locked]);
}
