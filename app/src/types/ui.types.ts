/** Nom d'une icône disponible dans le composant `Icon`. */
export type IconName =
  | 'arrow-right'
  | 'arrow-down'
  | 'arrow-up-right'
  | 'external'
  | 'download'
  | 'sun'
  | 'moon'
  | 'menu'
  | 'close'
  | 'copy'
  | 'check'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'trophy'
  | 'sparkles'
  | 'map-pin'
  | 'graduation'
  | 'briefcase'
  | 'code'
  | 'book'
  | 'users'
  | 'user'
  | 'clock'
  | 'filter'
  | 'search'
  | 'calendar'
  | 'info'
  | 'wifi'
  | 'quote'
  | 'play'
  | 'layers'
  | 'github'
  | 'linkedin'
  | 'medium'
  | 'kaggle'
  | 'youtube'
  | 'discord'
  | 'override';

/**
 * Option affichée dans un composant `Select`.
 *
 * @property {string} value - Valeur utilisée par le formulaire.
 * @property {string} label - Libellé affiché.
 */
export type SelectOption = {
  value: string;
  label: string;
};

/**
 * Élément d'un groupe d'onglets.
 *
 * @property {string} id - Identifiant de l'onglet.
 * @property {string} label - Libellé affiché.
 * @property {number} [count] - Nombre affiché à côté du libellé.
 */
export type TabItem = {
  id: string;
  label: string;
  count?: number;
};
