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
