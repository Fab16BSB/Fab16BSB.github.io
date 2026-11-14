/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties, RefObject } from 'react';
import { navItems } from '@/data/navigation.data';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import styles from './SectionTimeline.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type SectionTimelineProps = {
  active: string | null;
  progressRef: RefObject<HTMLElement | null>;
};

/* =========================================================================
  COMPOSANT : SectionTimeline
  Frise de progression entre les sections, fixée en bas de page.
========================================================================= */
export function SectionTimeline({ active, progressRef }: SectionTimelineProps) {
  const { t } = useI18n();
  const activeIndex = navItems.findIndex((item) => item.id === active);

  return (
    <nav
      ref={progressRef}
      className={styles.bar}
      style={{ '--node-count': navItems.length } as CSSProperties}
      aria-label={t('accessibility.sectionNavigation')}
    >
      <div className={styles.inner}>

        {/* Piste et remplissage, purement décoratifs. */}
        <span className={styles.track} aria-hidden="true" />

        <ol className={styles.list}>
          {navItems.map((item, index) => {

            // Un nœud est passé, actif ou à venir selon la ligne de lecture.
            const state =
              index === activeIndex ? styles.active : index < activeIndex ? styles.passed : '';

            return (
              <li key={item.id} className={styles.item}>
                <a
                  className={[styles.node, state].filter(Boolean).join(' ')}
                  href={item.href}
                  aria-current={index === activeIndex ? 'location' : undefined}
                  aria-label={t(item.labelKey)}
                >
                  <span className={styles.dot}>
                    <Icon name={item.icon} size={16} />
                  </span>
                  <span className={styles.label} aria-hidden="true">
                    {t(item.labelKey)}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
