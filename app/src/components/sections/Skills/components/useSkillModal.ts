/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useRef } from 'react';
import { useLockBodyScroll } from '@/hooks/ui/useLockBodyScroll';

/* =========================================================================
  HOOK : useSkillModal
  Gère le focus, la fermeture au clavier et le blocage du défilement.
========================================================================= */
export function useSkillModal(onClose: () => void) {
  // Référence du dialogue pour le focus initial et le piège à tabulation.
  const dialogRef = useRef<HTMLDivElement>(null);

  // Bloque le défilement de la page derrière la modale.
  useLockBodyScroll(true);

  // Installe le focus initial, la fermeture par Échap et la boucle de tabulation.
  useEffect(() => {

    // Mémorise le focus courant pour le restaurer à la fermeture.
    const previous = document.activeElement as HTMLElement | null;

    // Le dialogue reçoit le focus pour que la navigation clavier démarre dedans.
    dialogRef.current?.focus();

    // Ferme avec Échap et garde le focus dans le dialogue avec Tab.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Tab') {
        const dialog = dialogRef.current;
        const focusable = dialog
          ? Array.from(
              dialog.querySelectorAll<HTMLElement>(
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
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);

      // Rend le focus à l'élément qui l'avait avant l'ouverture.
      previous?.focus();
    };
  }, [onClose]);

  return { dialogRef };
}
