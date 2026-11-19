/* =========================================================================
  HELPERS : libellés du graphe de connaissances — fonctions pures
  Libellé identique dans les trois langues.
========================================================================= */
import type { Localized } from '@/types/common.types';

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Réplique un libellé dans les trois langues.
 *
 * @param value - Libellé à répliquer.
 * @returns Le libellé localisé.
 */
export function localizedSame(value: string): Localized {
  return { fr: value, en: value, es: value };
}
