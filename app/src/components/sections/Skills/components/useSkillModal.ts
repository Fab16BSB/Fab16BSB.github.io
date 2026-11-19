/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useRef } from 'react';
import { useDialogFocusTrap } from '@/hooks/ui/useDialogFocusTrap';
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

  // Piège le focus dans la modale et le restaure à la fermeture.
  useDialogFocusTrap(dialogRef, true, dialogRef);

  // Ferme la modale avec Échap.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return { dialogRef };
}
