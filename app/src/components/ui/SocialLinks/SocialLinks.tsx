/* =========================================================================
  IMPORTS
========================================================================= */
import type { SocialLink } from '@/types/social.types';
import { Icon } from '@/components/ui/Icon/Icon';
import styles from './SocialLinks.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type SocialLinksProps = {
  links: SocialLink[];
  labels?: boolean;
  variant?: 'default' | 'contact';
};

/* =========================================================================
  COMPOSANT : SocialLinks
  Liste de liens sociaux.
========================================================================= */
export function SocialLinks({
  links,
  labels = false,
  variant = 'default',
}: SocialLinksProps) {
  // La variante contact rend les icônes blanches et fait pulser LinkedIn.
  const listClassName = [
    styles.list,
    variant === 'contact' ? styles.contact : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <ul className={listClassName}>

      {/* Liens sociaux. */}
      {links.map((link) => (
        <li key={`${link.label}-${link.url}`}>

          {/* Lien social ; infobulle si le libellé est masqué. */}
          <a
            className={[styles.link, labels ? styles.withLabel : ''].filter(Boolean).join(' ')}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            data-tooltip={labels ? undefined : link.label}
            data-network={link.icon}
            data-social-link
          >

            {/* Icône du réseau. */}
            <Icon name={link.icon} size={18} />

            {/* Libellé affiché si demandé. */}
            {labels && <span>{link.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
