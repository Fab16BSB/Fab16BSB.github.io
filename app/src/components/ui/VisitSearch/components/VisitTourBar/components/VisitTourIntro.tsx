/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import styles from '../VisitTourBar.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitTourIntroProps = {
  done: boolean;
};

/* =========================================================================
  COMPOSANT : VisitTourIntro
  Rappel du rôle de la liste et consigne de lecture.
========================================================================= */
export function VisitTourIntro({ done }: VisitTourIntroProps) {
  const { t } = useI18n();

  return (
    <div className={styles.intro}>
      <span className={styles.listLabel}>{t('visit.tour.listTitle')}</span>
      <p className={styles.hint}>
        {done ? t('visit.tour.doneHint') : t('visit.tour.hint')}
      </p>
    </div>
  );
}
