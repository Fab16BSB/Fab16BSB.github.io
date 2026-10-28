/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties, ReactNode } from 'react';
import type { Accent } from '@/types/common.types';
import styles from '../Timeline.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type TimelineItemProps = {
  accent: Accent;
  index: number;
  date: string;
  badge?: ReactNode;
  children: ReactNode;
};

/* =========================================================================
  COMPOSANT : TimelineItem
  Coquille commune d'une étape : date, rail, point et carte.
========================================================================= */
export function TimelineItem({ accent, index, date, badge, children }: TimelineItemProps) {
  return (
    <li
      className={styles.item}
      style={
        {
          '--item-accent': `var(--color-${accent})`,
          '--reveal-delay': `${index * 60}ms`,
        } as CSSProperties
      }
      data-reveal
    >
      <div className={styles.itemDate}>{date}</div>

      <div className={styles.itemRail}>
        <span className={styles.dot} aria-hidden="true" />
      </div>

      <article className={styles.card}>

        {/* Date visible uniquement sur mobile. */}
        <div className={styles.cardTop}>
          <span className={styles.mobileDate}>{date}</span>
          {badge}
        </div>

        {children}
      </article>
    </li>
  );
}
