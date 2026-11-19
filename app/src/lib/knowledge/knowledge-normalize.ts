/* =========================================================================
  CONSTANTES
========================================================================= */

/** Longueur maximale d'un alias réservé à la comparaison de tags. */
const SHORT_ALIAS_LENGTH = 2;

/* =========================================================================
  HELPERS : normalisation du graphe de connaissances — fonctions pures
  Comparaison insensible aux accents, à la casse et à la ponctuation.
========================================================================= */

/**
 * Réduit un mot à une forme stable pour rapprocher singuliers et pluriels.
 *
 * @param token - Mot normalisé.
 * @returns Le mot sans `s` final, sauf pour les mots courts et les `ss`.
 */
function stemKnowledgeToken(token: string): string {
  if (token.length > 4 && token.endsWith('s') && !token.endsWith('ss')) {
    return token.slice(0, -1);
  }
  return token;
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Normalise un texte pour la détection de termes.
 *
 * @param value - Texte brut, dans n'importe quelle langue du site.
 * @returns Le texte en minuscules, sans accent et réduit à des mots.
 */
export function normalizeKnowledgeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\u2019']/g, ' ')
    .replace(/[^a-z0-9+#]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(stemKnowledgeToken)
    .join(' ')
    .trim();
}

/**
 * Entoure le texte normalisé d'espaces pour comparer des expressions entières.
 *
 * @param value - Texte normalisé.
 * @returns Le texte prêt pour `includes`.
 */
export function padKnowledgeText(value: string): string {
  return ` ${value} `;
}

/**
 * Indique si une expression apparaît comme une suite de mots complète.
 *
 * @param paddedText - Texte normalisé déjà entouré d'espaces.
 * @param normalizedPhrase - Expression normalisée à chercher.
 * @returns `true` si l'expression est présente comme mots entiers.
 */
export function includesKnowledgePhrase(
  paddedText: string,
  normalizedPhrase: string,
): boolean {
  if (!normalizedPhrase) return false;
  return paddedText.includes(` ${normalizedPhrase} `);
}

/**
 * Indique si un alias est trop court pour une détection dans du texte libre.
 *
 * @param normalizedAlias - Alias normalisé.
 * @returns `true` si l'alias ne doit être comparé qu'aux tags structurés.
 */
export function isShortKnowledgeAlias(normalizedAlias: string): boolean {
  return normalizedAlias.length <= SHORT_ALIAS_LENGTH;
}

/**
 * Produit un identifiant stable à partir d'un libellé libre.
 *
 * @param value - Libellé brut.
 * @returns Un identifiant en minuscules séparé par des tirets.
 */
export function slugifyKnowledgeTerm(value: string): string {
  return (
    normalizeKnowledgeText(value)
      .replace(/[^a-z0-9+#]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'terme'
  );
}
