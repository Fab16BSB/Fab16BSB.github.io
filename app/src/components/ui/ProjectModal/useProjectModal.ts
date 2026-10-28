/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useRef } from 'react';
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

  // Gère Échap, le piège à focus et la restauration du focus.
  useEffect(() => {

    // Élément focusé avant l'ouverture.
    const previous = document.activeElement as HTMLElement | null;

    // Place le focus sur la zone défilante pour garder les flèches actives.
    scrollRef.current?.focus();

    // Gère les touches de la modale.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'Tab') {
        // Boîte de dialogue courante.
        const dialog = dialogRef.current;

        // Éléments focusables visibles.
        const focusable = dialog
          ? Array.from(
              dialog.querySelectorAll<HTMLElement>(
                'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
              ),
            ).filter((element) => element.offsetParent !== null)
          : [];

        if (focusable.length > 0) {
          // Premier et dernier éléments focusables.
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

    // Écoute les touches pendant l'ouverture.
    document.addEventListener('keydown', onKeyDown);

    // Nettoie l'écoute et restaure le focus.
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previous?.focus();
    };
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
