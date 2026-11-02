/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useRef } from 'react';
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

  // Donne le focus à l'action principale dès l'ouverture.
  useEffect(() => {
    if (promptOpen) {
      confirmRef.current?.focus();
    }
  }, [promptOpen]);

  return {
    promptOpen,
    capability,
    confirmSemantic,
    cancelSemantic,
    dialogRef,
    confirmRef,
  };
}
