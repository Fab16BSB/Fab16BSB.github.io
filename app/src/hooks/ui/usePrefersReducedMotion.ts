/* =========================================================================
  IMPORTS
========================================================================= */
import { useMediaQuery } from './useMediaQuery';

/* =========================================================================
  HOOK : usePrefersReducedMotion
  Indique si l'utilisateur préfère réduire les animations.
========================================================================= */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
