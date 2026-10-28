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
  size?: number;
  className?: string;
  labels?: boolean;
};

/* =========================================================================
  COMPOSANT : SocialLinks
  Liste de liens sociaux.
========================================================================= */
export function SocialLinks({ links, size = 18, className, labels = false }: SocialLinksProps) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(' ')}>

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
          >

            {/* Icône du réseau. */}
            <Icon name={link.icon} size={size} />

            {/* Libellé affiché si demandé. */}
            {labels && <span>{link.label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
