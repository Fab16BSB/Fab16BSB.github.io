/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import type { VisitTourState } from '@/types/visit.types';
import styles from '../VisitTourBar.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitTourFooterProps = {
  tour: VisitTourState;
  isLast: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onReplay: () => void;
};

/* =========================================================================
  COMPOSANT : VisitTourFooter
  Navigation dans la visite, ou relance quand elle est terminée.
========================================================================= */
export function VisitTourFooter({
  tour,
  isLast,
  onNext,
  onPrevious,
  onReplay,
}: VisitTourFooterProps) {
  const { t } = useI18n();

  return (
    <footer
      className={[styles.foot, tour.done ? styles.doneFoot : '']
        .filter(Boolean)
        .join(' ')}
    >
      {tour.done ? (
        // Visite terminée : seule la relance reste utile.
        <button
          type="button"
          className="button button--primary button--small"
          onClick={onReplay}
        >
          {t('visit.tour.replay')}
        </button>
      ) : (
        <>
          {/* Retour à l'étape précédente, désactivé sur la première. */}
          <button
            type="button"
            className="button button--ghost button--small"
            onClick={onPrevious}
            disabled={tour.index === 0}
          >
            <Icon
              name="arrow-right"
              size={15}
              className={styles.arrowBack}
            />
            {t('visit.tour.previous')}
          </button>
          {/* Avance d'une étape, ou termine la visite sur la dernière. */}
          <button
            type="button"
            className="button button--primary button--small"
            onClick={onNext}
          >
            {isLast ? t('visit.tour.finish') : t('visit.tour.next')}
            <Icon name="arrow-right" size={15} />
          </button>
        </>
      )}
    </footer>
  );
}
