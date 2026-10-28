import type { SocialLink } from '@/types/social.types';
import { links } from './links.data';

/**
 * Réseaux personnels.
 * Affichés dans À propos, le menu mobile, le footer et les publications.
 *
 * Élément de type `SocialLink`.
 *
 * @property {SocialId} id - Identifiant du réseau.
 * @property {string} label - Libellé affiché.
 * @property {string} url - URL du profil.
 * @property {SocialId} icon - Icône utilisée.
 */
export const socials: SocialLink[] = [
  { id: 'linkedin', label: 'LinkedIn', url: links.social.linkedin, icon: 'linkedin' },
  { id: 'github', label: 'GitHub', url: links.social.github, icon: 'github' },
  { id: 'medium', label: 'Medium', url: links.social.medium, icon: 'medium' },
  { id: 'kaggle', label: 'Kaggle', url: links.social.kaggle, icon: 'kaggle' },
  { id: 'youtube', label: 'YouTube', url: links.social.youtubeChannel, icon: 'youtube' },
];

/**
 * Réseaux de la communauté Override.
 * Affichés dans la colonne « Communauté » du footer.
 *
 * Même structure que `socials` : `id`, `label`, `url`, `icon`.
 */
export const community: SocialLink[] = [
  { id: 'discord', label: 'Discord', url: links.social.discord, icon: 'discord' },
  { id: 'override', label: 'Override Community', url: links.social.overrideGithub, icon: 'github' },
  { id: 'override', label: 'Override Medium', url: links.social.overrideMedium, icon: 'medium' },
];
