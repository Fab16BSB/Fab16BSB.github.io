/**
 * Élément de navigation principale.
 *
 * @property {string} id - Identifiant de la section.
 * @property {string} href - Ancre cible.
 * @property {string} labelKey - Clé de traduction du libellé.
 */
export type NavItem = {
  id: string;
  href: string;
  labelKey: string;
};
