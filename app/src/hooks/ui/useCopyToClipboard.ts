/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '@/lib/logger';

/* =========================================================================
  HOOK : useCopyToClipboard
  Copie une valeur dans le presse-papiers avec retour visuel.
========================================================================= */
export function useCopyToClipboard(resetDelay = 2200) {

  // Indique si la copie vient de réussir.
  const [copied, setCopied] = useState(false);

  // Identifiant du délai de réinitialisation.
  const timer = useRef<number | undefined>(undefined);

  // Annule le délai en cours au démontage.
  useEffect(() => {
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
    };
  }, []);

  // Copie le texte et affiche un retour visuel temporaire.
  const copy = useCallback(
    async (value: string) => {
      let success = false;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else {
          // Repli pour les navigateurs sans API Clipboard ou hors contexte sécurisé.
          const area = document.createElement('textarea');
          area.value = value;
          area.style.position = 'fixed';
          area.style.opacity = '0';
          document.body.appendChild(area);
          area.select();
          document.execCommand('copy');
          document.body.removeChild(area);
        }

        setCopied(true);
        success = true;

        // Un nouveau clic relance le délai au lieu de laisser expirer l'ancien.
        if (timer.current) {
          window.clearTimeout(timer.current);
        }

        timer.current = window.setTimeout(() => setCopied(false), resetDelay);
      } catch (error) {
        logger.warn('Copie dans le presse-papiers impossible', error);
        setCopied(false);
      }

      return success;
    },
    [resetDelay],
  );

  return { copied, copy };
}
