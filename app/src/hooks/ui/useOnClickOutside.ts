/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, type RefObject } from 'react';

/* =========================================================================
  HOOK : useOnClickOutside
  Déclenche une action lors d'un clic extérieur à un élément.
========================================================================= */
export function useOnClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void,
  enabled = true,
) {
  // Écoute les clics extérieurs et Échap quand le hook est actif.
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (enabled) {
      const onPointerDown = (event: MouseEvent | TouchEvent) => {
        const element = ref.current;

        // Un clic dans l'élément référencé ne doit pas fermer le panneau.
        if (element && !element.contains(event.target as Node)) {
          handler();
        }
      };

      // Échap ferme aussi : le comportement est attendu au clavier.
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          handler();
        }
      };

      document.addEventListener('mousedown', onPointerDown);
      document.addEventListener('touchstart', onPointerDown);
      document.addEventListener('keydown', onKeyDown);

      cleanup = () => {
        document.removeEventListener('mousedown', onPointerDown);
        document.removeEventListener('touchstart', onPointerDown);
        document.removeEventListener('keydown', onKeyDown);
      };
    }

    return cleanup;
  }, [ref, handler, enabled]);
}
