/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useState } from 'react';

/* =========================================================================
  HOOK : useActiveSection
  Suit la section actuellement visible dans la page.
========================================================================= */
export function useActiveSection(ids: string[], offset = 0.35) {

  // Section active.
  const [active, setActive] = useState(ids[0] ?? '');

  // Clé stable : le tableau d'ids est recréé à chaque rendu.
  const key = ids.join('|');

  useEffect(() => {
    const update = () => {

      // Le seuil place la ligne de lecture sous une partie de l'écran.
      const line = window.scrollY + window.innerHeight * offset;
      let current = ids[0] ?? '';

      for (const id of ids) {
        const element = document.getElementById(id);

        if (!element) {
          continue;
        }

        const top = element.getBoundingClientRect().top + window.scrollY;

        if (top <= line) {
          current = id;
        }
      }

      setActive(current);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });

    // La hauteur de l'écran change la ligne de lecture.
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [key, offset]);

  return active;
}
