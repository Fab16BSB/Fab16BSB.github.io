/* =========================================================================
  IMPORTS
========================================================================= */
import type { TabItem } from '@/types/ui.types';
import { useTabs } from './useTabs';
import styles from './Tabs.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type TabsProps = {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  ariaLabel?: string;
  className?: string;
  variant?: 'segmented' | 'filters';
};

/* =========================================================================
  COMPOSANT : Tabs
  Groupe d\'onglets accessible.
========================================================================= */
export function Tabs({
  items,
  active,
  onChange,
  ariaLabel,
  className,
  variant = 'segmented',
}: TabsProps) {
  const { refs, containerRef, scrollable, onKeyDown } = useTabs(items, active, onChange);

  return (
    <div
      ref={containerRef}
      className={[
        styles.tabs,
        variant === 'filters' ? styles.filters : styles.segmented,
        scrollable ? styles.scrollable : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      role="tablist"
      aria-label={ariaLabel}
    >
      {items.map((item, index) => (
        // Onglet et compteur éventuel.
        <button
          key={item.id}
          ref={(element) => {
            refs.current[index] = element;
          }}
          type="button"
          role="tab"
          aria-selected={item.id === active}
          tabIndex={item.id === active ? 0 : -1}
          className={[styles.tab, item.id === active ? styles.active : ''].filter(Boolean).join(' ')}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          {/* Libellé de l'onglet. */}
          <span>{item.label}</span>

          {/* Compteur optionnel. */}
          {typeof item.count === 'number' && <span className={styles.count}>{item.count}</span>}
        </button>
      ))}
    </div>
  );
}
