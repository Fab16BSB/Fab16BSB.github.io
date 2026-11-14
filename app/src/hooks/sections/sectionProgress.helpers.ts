/* =========================================================================
  HELPERS : progression entre les sections — fonctions pures
========================================================================= */
import type { SectionProgressState } from '@/types/navigation.types';

/* ─────────────────────────────────────────────────────────────────────────
   LIGNE DE LECTURE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Borne une valeur dans l'intervalle [0, 1].
 *
 * @param value Valeur à borner.
 * @returns La valeur bornée.
 */
function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * Calcule la position de la ligne de lecture dans la frise des sections.
 *
 * @param tops Positions verticales des sections, en pixels, relatives au viewport.
 * @param line Hauteur de la ligne de lecture, en pixels, relative au viewport.
 * @returns L'index de la section lue, la part parcourue dans son segment et la
 * progression globale de la piste.
 */
export function resolveSectionProgress(
  tops: number[],
  line: number,
): SectionProgressState {
  let activeIndex = 0;
  let fraction = 0;

  // La dernière section dont le haut est au-dessus de la ligne est la section lue.
  if (tops.length > 1) {
    for (let index = 0; index < tops.length; index += 1) {
      if (tops[index] <= line) {
        activeIndex = index;
      }
    }

    const start = tops[activeIndex];
    const end = tops[activeIndex + 1] ?? start;

    if (activeIndex < tops.length - 1 && end > start) {
      fraction = clamp01((line - start) / (end - start));
    } else {
      // Sur la dernière section, la piste est remplie jusqu'au dernier nœud.
      fraction = 1;
    }
  }

  // La dernière section occupe déjà toute la piste ; sinon on interpole le segment.
  let progress = 0;

  if (tops.length > 1) {
    progress =
      activeIndex >= tops.length - 1
        ? 1
        : (activeIndex + fraction) / (tops.length - 1);
  }

  return { activeIndex, fraction, progress };
}
