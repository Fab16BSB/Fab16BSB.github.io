/* =========================================================================
  HELPERS : texte de recherche — fonctions pures
  Normalisation des accents et de la ponctuation.
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
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae');
}

/**
 * Normalise un texte pour l'indexation et la requête.
 *
 * La ponctuation est remplacée par des espaces pour que le tokenizer du moteur
 * sépare correctement « d'anomalies » ou « C++ ».
 *
 * @param value - Texte à normaliser.
 * @returns Le texte en minuscules, sans accents ni ponctuation.
 */
export function normalizeSearchText(value: string): string {
  return normalize(value).replace(/[^a-z0-9]+/g, ' ').trim();
}
