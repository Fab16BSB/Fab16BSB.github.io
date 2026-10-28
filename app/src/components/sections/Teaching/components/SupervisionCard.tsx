/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import type { Supervision } from '@/types/supervision.types';
import styles from '../Teaching.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type SupervisionCardProps = {
  supervision: Supervision;
};

/* =========================================================================
  COMPOSANT : SupervisionCard
  Carte d'un encadrement.
========================================================================= */
export function SupervisionCard({ supervision }: SupervisionCardProps) {
  const { t, loc } = useI18n();

  return (
    <article className={styles.supervisionCard}>

      {/* Sujet, rôle et établissement. */}
      <div className={styles.profileTop}>
        <span className={styles.avatar} data-kind={supervision.kind} aria-hidden="true">
          <Icon name="user" size={24} />
        </span>

        <div className={styles.profileIdentity}>
          <h3>{loc(supervision.topic)}</h3>
          <p className={styles.profileRole}>{loc(supervision.role)}</p>
          <p className={styles.profileInstitution}>{supervision.institution}</p>
        </div>
      </div>

      {/* Description de l'encadrement. */}
      <p className={styles.supervisionDescription}>{loc(supervision.description)}</p>

      {/* Type, modalité et nombre d'étudiants. */}
      <div className={styles.profileFooter}>
        <span className={styles.kindTag} data-kind={supervision.kind}>
          <Icon
            name={supervision.kind === 'tutoring' ? 'users' : 'briefcase'}
            size={12}
          />
          {t(`teaching.supervisionKinds.${supervision.kind}`)}
        </span>

        <span className={styles.modeTag} data-mode={supervision.mode}>
          <Icon
            name={
              supervision.mode === 'remote'
                ? 'wifi'
                : supervision.mode === 'hybrid'
                  ? 'external'
                  : 'map-pin'
            }
            size={12}
          />
          {t(`teaching.supervisionModes.${supervision.mode}`)}
        </span>

        <span className={styles.studentTag}>
          <Icon name="users" size={12} />
          {supervision.students}{' '}
          {supervision.students === 1 ? t('teaching.student') : t('teaching.students')}
        </span>
      </div>
    </article>
  );
}
