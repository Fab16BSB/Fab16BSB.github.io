/* =========================================================================
  IMPORTS
========================================================================= */
import type { IconName } from '@/types/ui.types';
import { Icon } from '@/components/ui/Icon/Icon';
import styles from './SectionHeading.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: IconName;
  align?: 'left' | 'center';
  wide?: boolean;
  titleId?: string;
};

/* =========================================================================
  COMPOSANT : SectionHeading
  Titre de section.
========================================================================= */
export function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
  align = 'left',
  wide = false,
  titleId,
}: SectionHeadingProps) {
  return (
    <div
      className={[styles.head, align === 'center' ? styles.center : '', wide ? styles.wide : '']
        .filter(Boolean)
        .join(' ')}
      data-reveal
    >
      {/* Sur-titre, avec l'icône de la rubrique. */}
      <span className="eyebrow">
        {icon && <Icon name={icon} size={20} />}
        {eyebrow}
      </span>
      {/* Titre de section. */}
      <h2 className="section-title" id={titleId}>
        {title}
      </h2>
      {/* Description facultative. */}
      {description && (
        <p className={['section-lede', wide ? styles.wideLede : ''].filter(Boolean).join(' ')}>
          {description}
        </p>
      )}
    </div>
  );
}
