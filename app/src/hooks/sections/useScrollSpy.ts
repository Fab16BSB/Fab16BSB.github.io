/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useState } from 'react';

/* =========================================================================
  HOOK : useScrollSpy
  Détermine la section active à partir des éléments observés.
========================================================================= */
export function useScrollSpy(ids: string[], rootMargin = '-28% 0px -58% 0px') {
  // Section active, `null` si aucune n'est visible.
  const [active, setActive] = useState<string | null>(null);

  // Clé stable : le tableau d'ids est recréé à chaque rendu.
  const key = ids.join('|');

  useEffect(() => {
    // Les ids sont relus depuis `key` pour ne pas dépendre du tableau.
    const elements = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    let cleanup: (() => void) | undefined;

    if (elements.length > 0) {
      // Ratio de visibilité de chaque section.
      const visible = new Map<string, number>();

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
          }

          // La section la plus visible l'emporte.
          const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
          setActive(best && best[1] > 0 ? best[0] : null);
        },
        // La marge ignore le header et privilégie le contenu central.
        { rootMargin, threshold: [0, 0.05, 0.15, 0.3, 0.5, 0.75] },
      );

      elements.forEach((element) => observer.observe(element));

      cleanup = () => observer.disconnect();
    }

    return cleanup;
  }, [key, rootMargin]);

  return active;
}
