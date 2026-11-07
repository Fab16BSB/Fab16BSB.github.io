/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import styles from './SkillModal.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type SkillEmptyStateProps = {
  onExploreProjects: () => void;
};

/* =========================================================================
  COMPOSANT : SkillEmptyState
  État vide affiché quand une compétence n'a aucune réalisation liée.
========================================================================= */
export function SkillEmptyState({ onExploreProjects }: SkillEmptyStateProps) {
  const { t } = useI18n();

  return (
    <div className={styles.empty}>

      {/* Icône décorative. */}
      <span className={styles.emptyIcon} aria-hidden="true">
        <Icon name="sparkles" size={20} />
      </span>

      {/* Message et aide contextuelle. */}
      <div className={styles.emptyBody}>
        <p className={styles.emptyTitle}>{t('skills.related.empty')}</p>
        <p className={styles.emptyText}>{t('skills.related.emptyHint')}</p>
      </div>

      {/* Action vers la section projets. */}
      <button type="button" className={styles.emptyAction} onClick={onExploreProjects}>
        {t('skills.related.emptyAction')}
        <Icon name="arrow-right" size={15} />
      </button>
    </div>
  );
}
