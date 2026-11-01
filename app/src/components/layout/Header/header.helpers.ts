/* =========================================================================
  HELPERS : Header — calculs purs
========================================================================= */

/**
 * Calcule la progression du défilement de la page.
 *
 * @param scrollTop Position verticale actuelle, en pixels.
 * @param scrollHeight Hauteur totale du document, en pixels.
 * @param clientHeight Hauteur visible de la fenêtre, en pixels.
 * @returns Une valeur entre 0 (haut de page) et 1 (bas de page).
 */
export function getScrollProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number,
): number {
  let progress = 0;
  const scrollable = scrollHeight - clientHeight;

  if (scrollable > 0) {
    progress = Math.min(1, Math.max(0, scrollTop / scrollable));
  }

  return progress;
}
