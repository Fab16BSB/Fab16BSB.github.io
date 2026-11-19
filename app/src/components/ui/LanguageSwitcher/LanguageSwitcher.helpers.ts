/* =========================================================================
  HELPERS : LanguageSwitcher — fonctions pures
  Calcul de la langue à focaliser selon la touche pressée.
========================================================================= */

/**
 * Retourne l'index de l'option à focaliser après une touche de navigation.
 *
 * @param key - Touche pressée.
 * @param currentIndex - Index de l'option focalisée, ou -1 si aucune.
 * @param count - Nombre d'options disponibles.
 * @returns L'index cible, ou `null` si la touche ne déplace pas le focus.
 */
export function getOptionFocusIndex(
  key: string,
  currentIndex: number,
  count: number,
): number | null {
  let nextIndex: number | null = null;

  if (currentIndex >= 0 && count > 0) {
    if (key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % count;
    } else if (key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + count) % count;
    } else if (key === 'Home') {
      nextIndex = 0;
    } else if (key === 'End') {
      nextIndex = count - 1;
    }
  }

  return nextIndex;
}
