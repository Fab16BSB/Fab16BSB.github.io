/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useRef } from 'react';
import { useDialogFocusTrap } from '@/hooks/ui/useDialogFocusTrap';
import { useLockBodyScroll } from '@/hooks/ui/useLockBodyScroll';

/* =========================================================================
  HOOK : useProjectModal
  Gère le focus, la fermeture au clavier et le curseur de défilement.
========================================================================= */
export function useProjectModal(onClose: () => void) {

  // Boîte de dialogue.
  const dialogRef = useRef<HTMLDivElement>(null);

  // Zone défilante et curseur de défilement.
  const scrollRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);

  // Bloque le défilement de l'arrière-plan.
  useLockBodyScroll(true);

  // Piège le focus dans la modale et le restaure à la fermeture.
  useDialogFocusTrap(dialogRef, true, scrollRef);

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

  // Suit la position de défilement pour dimensionner le curseur.
  useEffect(() => {
    const scroll = scrollRef.current;
    const thumb = thumbRef.current;
    let cleanup: (() => void) | undefined;

    if (scroll && thumb) {

      // Aligne le curseur sur la portion visible du contenu.
      const syncScrollbar = () => {
        const total = scroll.scrollHeight;

        // Espace restant à parcourir.
        const max = total - scroll.clientHeight;

        // Hauteur du curseur, bornée pour rester lisible sur les contenus longs.
        const size = Math.max(12, (scroll.clientHeight / total) * 100);

        // Position du curseur dans sa piste.
        const offset = max > 0 ? (scroll.scrollTop / max) * (100 - size) : 0;
        const progress = size > 0 ? (offset / size) * 100 : 0;

        thumb.style.display = max > 0 ? 'block' : 'none';
        thumb.style.height = `${size}%`;
        thumb.style.transform = `translateY(${progress}%)`;
      };

      // Met à jour le curseur au défilement et lors des changements de taille.
      scroll.addEventListener('scroll', syncScrollbar, { passive: true });
      const observer = new ResizeObserver(syncScrollbar);
      observer.observe(scroll);
      Array.from(scroll.children).forEach((child) => observer.observe(child));

      // Position initiale du curseur.
      syncScrollbar();

      // Nettoie l'écoute et l'observateur.
      cleanup = () => {
        scroll.removeEventListener('scroll', syncScrollbar);
        observer.disconnect();
      };
    }

    return cleanup;
  }, []);

  // Références utilisées par le composant.
  return { dialogRef, scrollRef, thumbRef };
}
