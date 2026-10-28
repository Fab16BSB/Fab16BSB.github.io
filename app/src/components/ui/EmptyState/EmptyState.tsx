/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import type { IconName } from '@/types/ui.types';
import styles from './EmptyState.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type EmptyStateProps = {
  icon?: IconName;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

/* =========================================================================
  COMPOSANT : EmptyState
  État vide réutilisable.
========================================================================= */
export function EmptyState({
  icon = 'search',
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={[styles.empty, className].filter(Boolean).join(' ')}
      role="status"
    >
      <span className={styles.icon} aria-hidden="true">
        {/* Icône décorative. */}
        <Icon name={icon} size={24} />
      </span>

      <div className={styles.text}>
        {/* Titre et description. */}
        <p className={styles.title}>{title}</p>
        {description && <p className={styles.description}>{description}</p>}
      </div>

      {/* Action facultative. */}
      {actionLabel && onAction && (
        <button type="button" className="button button--ghost button--small" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
