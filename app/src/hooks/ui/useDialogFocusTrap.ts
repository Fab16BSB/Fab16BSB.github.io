/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, type RefObject } from 'react';

/* =========================================================================
  HOOK : useDialogFocusTrap
  Place le focus dans un dialogue, boucle avec Tab et le restaure à la sortie.
========================================================================= */
export function useDialogFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active = true,
  initialFocusRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (active) {
      // Élément focusé avant l'ouverture.
      const previous = document.activeElement as HTMLElement | null;

      // Focus initial, ou premier élément focusable du dialogue.
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const container = containerRef.current;
        const first = container?.querySelector<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        first?.focus();
      }

      // Garde le focus dans le dialogue avec Tab et Shift+Tab.
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') {
          return;
        }

        const container = containerRef.current;
        const focusable = container
          ? Array.from(
              container.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
              ),
            ).filter((element) => element.offsetParent !== null)
          : [];

        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      };

      document.addEventListener('keydown', onKeyDown);

      cleanup = () => {
        document.removeEventListener('keydown', onKeyDown);
        previous?.focus();
      };
    }

    return cleanup;
  }, [active, containerRef, initialFocusRef]);
}
