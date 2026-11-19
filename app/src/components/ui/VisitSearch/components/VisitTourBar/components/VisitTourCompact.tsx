/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import { VisitTourFooter } from './VisitTourFooter';
import { VisitTourIntro } from './VisitTourIntro';
import { VisitTourProgress } from './VisitTourProgress';
import { VISIT_TOUR_STEPS_ID, VisitTourSteps } from './VisitTourSteps';
import type { IconName } from '@/types/ui.types';
import type { VisitTourState, VisitTourTarget } from '@/types/visit.types';
import styles from '../VisitTourBar.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitTourCompactProps = {
  tour: VisitTourState;
  expanded: boolean;
  current: VisitTourTarget;
  progress: number;
  isLast: boolean;
  sectionIcon: IconName;
  stepCounter: string;
  onToggleExpanded: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSelectStep: (index: number) => void;
  onQuit: () => void;
  onReplay: () => void;
};

/* =========================================================================
  COMPOSANT : VisitTourCompact
  Barre compacte sur tablette et mobile, avec liste dépliable.
========================================================================= */
export function VisitTourCompact({
  tour,
  expanded,
  current,
  progress,
  isLast,
  sectionIcon,
  stepCounter,
  onToggleExpanded,
  onNext,
  onPrevious,
  onSelectStep,
  onQuit,
  onReplay,
}: VisitTourCompactProps) {
  const { t } = useI18n();

  return (
    <div className={styles.dock}>
      {/* Liste des étapes dépliée au-dessus de la barre compacte. */}
      {expanded ? (
        <section
          className={styles.popover}
          aria-label={t('visit.tour.listTitle')}
        >
          <VisitTourIntro done={tour.done} />
          <VisitTourSteps tour={tour} onSelectStep={onSelectStep} />
        </section>
      ) : null}

      {/* Barre compacte : progression, cible courante et actions. */}
      <aside className={styles.drawer} aria-label={t('visit.tour.title')}>
        <VisitTourProgress progress={progress} />

        {/* Compteur, cible en cours, accès à la liste et fermeture. */}
        <header className={styles.compactHead}>
          <span className={styles.stepPill}>{stepCounter}</span>

          {/* Section et libellé de la cible courante. */}
          <div className={styles.currentBlock}>
            <span className={styles.currentIcon}>
              <Icon name={sectionIcon} size={16} />
            </span>
            <span className={styles.currentText}>
              <span className={styles.compactSection}>
                {t(current.labelKey)}
              </span>
              {current.label ? (
                <span className={styles.currentLabel}>
                  {current.label}
                </span>
              ) : null}
            </span>
          </div>

          {/* Déplie ou replie la liste complète des étapes. */}
          <button
            type="button"
            className={styles.stepsToggle}
            aria-expanded={expanded}
            aria-controls={VISIT_TOUR_STEPS_ID}
            onClick={onToggleExpanded}
          >
            <Icon name="layers" size={14} />
            {t('visit.tour.stepsCount', {
              count: tour.targets.length,
            })}
          </button>
          <button
            type="button"
            className={styles.close}
            onClick={onQuit}
            aria-label={t('visit.tour.close')}
          >
            <Icon name="close" size={16} />
          </button>
        </header>

        <VisitTourFooter
          tour={tour}
          isLast={isLast}
          onNext={onNext}
          onPrevious={onPrevious}
          onReplay={onReplay}
        />
      </aside>
    </div>
  );
}
