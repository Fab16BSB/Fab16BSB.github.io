/* =========================================================================
  HELPERS : recherche — fonctions pures
  Normalisation et correspondance de texte.
========================================================================= */

/**
 * Retire les accents et met le texte en minuscules.
 *
 * @param value - Texte à normaliser.
 * @returns Le texte sans accents, en minuscules.
 */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Vérifie qu'un texte contient tous les termes de la recherche.
 *
 * @param parts - Fragments de texte à comparer.
 * @param query - Recherche saisie par l'utilisateur.
 * @returns `true` si tous les termes sont présents, ou si la recherche est vide.
 */
export function matchesQuery(parts: string[], query: string): boolean {

  // Termes utiles de la recherche.
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  let result = true;

  if (terms.length > 0) {
    const haystack = normalize(parts.join(' ')); // Texte complet normalisé dans lequel chercher.
    result = terms.every((term) => haystack.includes(term));
  }

  return result;
}
