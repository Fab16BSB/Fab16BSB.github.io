/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import { VisitTourFooter } from './VisitTourFooter';
import { VisitTourIntro } from './VisitTourIntro';
import { VisitTourProgress } from './VisitTourProgress';
import { VisitTourSteps } from './VisitTourSteps';
import type { VisitTourState } from '@/types/visit.types';
import styles from '../VisitTourBar.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitTourFullDrawerProps = {
  tour: VisitTourState;
  progress: number;
  isLast: boolean;
  stepCounter: string;
  onNext: () => void;
  onPrevious: () => void;
  onSelectStep: (index: number) => void;
  onQuit: () => void;
  onReplay: () => void;
};

/* =========================================================================
  COMPOSANT : VisitTourFullDrawer
  Volet latéral complet sur desktop.
========================================================================= */
export function VisitTourFullDrawer({
  tour,
  progress,
  isLast,
  stepCounter,
  onNext,
  onPrevious,
  onSelectStep,
  onQuit,
  onReplay,
}: VisitTourFullDrawerProps) {
  const { t } = useI18n();

  return (
    <aside className={styles.drawer} aria-label={t('visit.tour.title')}>
      {/* En-tête du volet : titre, compteur et fermeture. */}
      <header className={styles.head}>
        <div className={styles.headText}>
          <span className={styles.kicker}>
            {tour.done ? t('visit.tour.done') : t('visit.tour.title')}
          </span>
          <span className={styles.step} aria-live="polite">
            {stepCounter}
          </span>
        </div>
        <button
          type="button"
          className={styles.close}
          onClick={onQuit}
          aria-label={t('visit.tour.close')}
        >
          <Icon name="close" size={16} />
        </button>
      </header>

      {/* Progression, consigne, liste des étapes et navigation. */}
      <VisitTourProgress progress={progress} />
      <VisitTourIntro done={tour.done} />
      <VisitTourSteps tour={tour} onSelectStep={onSelectStep} />
      <VisitTourFooter
        tour={tour}
        isLast={isLast}
        onNext={onNext}
        onPrevious={onPrevious}
        onReplay={onReplay}
      />
    </aside>
  );
}
