/* =========================================================================
  IMPORTS
========================================================================= */
import styles from './SectionHeading.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
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
      {/* Sur-titre. */}
      <span className="eyebrow">{eyebrow}</span>
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
