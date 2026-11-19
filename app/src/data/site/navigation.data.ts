import { SECTION, sectionAnchor } from '@/data/site/sections.data';
import { visitSections } from '@/data/visit/visit-sections.data';
import type { NavItem } from '@/types/navigation.types';

// Rubriques de navigation : projection des sections de visite marquées `inNav`.
// Une icône distincte par rubrique, reprise dans toutes les navigations.
export const navItems: NavItem[] = visitSections
  .filter((section) => SECTION[section.id].inNav)
  .map((section) => ({
    id: section.id,
    href: sectionAnchor(section.id),
    labelKey: section.labelKey,
    icon: section.icon,
  }));
