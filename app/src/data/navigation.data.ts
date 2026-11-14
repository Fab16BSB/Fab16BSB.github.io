import type { NavItem } from '@/types/navigation.types';

// Une icône distincte par rubrique, reprise dans toutes les navigations.
export const navItems: NavItem[] = [
  { id: 'about', href: '#about', labelKey: 'nav.about', icon: 'user' },
  { id: 'timeline', href: '#timeline', labelKey: 'nav.timeline', icon: 'route' },
  { id: 'skills', href: '#skills', labelKey: 'nav.skills', icon: 'sparkles' },
  { id: 'projects', href: '#projects', labelKey: 'nav.projects', icon: 'code' },
  { id: 'publications', href: '#publications', labelKey: 'nav.publications', icon: 'book' },
  { id: 'videos', href: '#videos', labelKey: 'nav.videos', icon: 'play' },
  { id: 'teaching', href: '#teaching', labelKey: 'nav.teaching', icon: 'graduation' },
  { id: 'awards', href: '#awards', labelKey: 'nav.awards', icon: 'trophy' },
];
