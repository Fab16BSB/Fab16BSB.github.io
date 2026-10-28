/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useState } from 'react';

/* =========================================================================
  HOOK : useMediaQuery
  Suit le résultat d'une media query CSS.
========================================================================= */
export function useMediaQuery(query: string): boolean {

  // Résultat courant de la media query.
  const [matches, setMatches] = useState(() => {

    // Initialisation synchrone : évite un premier rendu avec la mauvaise valeur.
    const initial =
      typeof window === 'undefined' ? false : window.matchMedia(query).matches;

    return initial;
  });

  // S'abonne aux changements de la media query.
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);

    // Synchronise l'état si la query a changé depuis l'initialisation.
    onChange();
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
