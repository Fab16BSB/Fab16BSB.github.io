import type { IconName } from '@/types/ui.types';

/**
 * Élément de navigation principale.
 *
 * @property {string} id - Identifiant de la section.
 * @property {string} href - Ancre cible.
 * @property {string} labelKey - Clé de traduction du libellé.
 * @property {IconName} icon - Icône associée à la rubrique.
 */
export type NavItem = {
  id: string;
  href: string;
  labelKey: string;
  icon: IconName;
};

/**
 * Position de la ligne de lecture dans la frise des sections.
 *
 * @property {number} activeIndex - Index de la section actuellement lue.
 * @property {number} fraction - Part parcourue dans le segment courant, entre 0 et 1.
 * @property {number} progress - Progression globale de la piste, entre 0 et 1.
 */
export type SectionProgressState = {
  activeIndex: number;
  fraction: number;
  progress: number;
};
