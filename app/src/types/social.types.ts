/** Identifiant d'un réseau social ou de la communauté Override. */
export type SocialId =
  | 'github'
  | 'linkedin'
  | 'medium'
  | 'kaggle'
  | 'youtube'
  | 'discord'
  | 'override';

/**
 * Lien social affiché dans le site.
 *
 * @property {string} id - Identifiant unique du lien (le réseau est porté par `icon`).
 * @property {string} label - Libellé affiché.
 * @property {string} url - URL du profil.
 * @property {SocialId} icon - Icône utilisée.
 */
export type SocialLink = {
  id: string;
  label: string;
  url: string;
  icon: SocialId;
};
