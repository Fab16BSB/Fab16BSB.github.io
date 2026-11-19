/* =========================================================================
  IMPORTS
========================================================================= */
import { useRef } from 'react';
import { useDialogFocusTrap } from '@/hooks/ui/useDialogFocusTrap';
import { useLockBodyScroll } from '@/hooks/ui/useLockBodyScroll';
import { useOnClickOutside } from '@/hooks/ui/useOnClickOutside';
import { useSearchSettings } from '@/search/useSearchSettings';

/* =========================================================================
  HOOK : useSemanticDialog
  Gère l'ouverture, le focus et la fermeture de la confirmation.
========================================================================= */
export function useSemanticDialog() {
  const { promptOpen, capability, confirmSemantic, cancelSemantic } = useSearchSettings();

  // Références du panneau et de l'action principale.
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Ferme au clic extérieur et avec Échap.
  useOnClickOutside(dialogRef, cancelSemantic, promptOpen);

  // Bloque le défilement de la page derrière la modale.
  useLockBodyScroll(promptOpen);

  // Piège le focus dans la modale et le restaure à la fermeture.
  useDialogFocusTrap(dialogRef, promptOpen, confirmRef);

  return {
    promptOpen,
    capability,
    confirmSemantic,
    cancelSemantic,
    dialogRef,
    confirmRef,
  };
}
