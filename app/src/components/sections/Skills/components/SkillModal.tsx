/* =========================================================================
  IMPORTS
========================================================================= */
import { useId } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon/Icon';
import { RelatedContent } from '@/components/ui/RelatedContent/RelatedContent';
import { useI18n } from '@/i18n/useI18n';
import type { Skill } from '@/types/skill.types';
import { SkillEmptyState } from './SkillEmptyState';
import { useSkillModal } from './useSkillModal';
import styles from './SkillModal.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type SkillModalProps = {
  skill: Skill;
  onClose: () => void;
  onOpenProject: (projectId: string) => void;
};

/* =========================================================================
  COMPOSANT : SkillModal
  Réalisations et contenus liés à une compétence.
========================================================================= */
export function SkillModal({ skill, onClose, onOpenProject }: SkillModalProps) {
  const { t } = useI18n();
  const titleId = useId();
  const { dialogRef } = useSkillModal(onClose);

  // Ferme la modale avant de rejoindre une section ou un contenu.
  const navigate = (href: string) => {
    onClose();
    window.location.hash = href;
  };

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {/* Boîte de dialogue ; le fond se ferme au clic. */}
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
        tabIndex={-1}
      >
        {/* Fermeture de la modale. */}
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={t('accessibility.closeDialog')}
        >
          <Icon name="close" size={19} />
        </button>

        <div className={styles.body}>

          {/* En-tête de la compétence. */}
          <p className={styles.kicker}>{t('knowledge.kinds.skill')}</p>
          <h3 className={styles.title} id={titleId}>
            {skill.name}
          </h3>
          <p className={styles.subtitle}>{t('skills.related.subtitle')}</p>

          {/* Réalisations et contenus liés. */}
          <RelatedContent
            nodeId={`skill:${skill.id}`}
            limit={6}
            showHeader={false}
            embedded
            emptyState={<SkillEmptyState onExploreProjects={() => navigate('#projects')} />}
            onOpenProject={onOpenProject}
            onNavigate={navigate}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
