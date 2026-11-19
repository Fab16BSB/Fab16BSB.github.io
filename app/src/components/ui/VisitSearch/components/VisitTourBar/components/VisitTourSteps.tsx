/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import type { VisitTourState } from '@/types/visit.types';
import styles from '../VisitTourBar.module.css';

/* =========================================================================
  CONSTANTES
========================================================================= */
export const VISIT_TOUR_STEPS_ID = 'visit-tour-steps';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitTourStepsProps = {
  tour: VisitTourState;
  onSelectStep: (index: number) => void;
};

/* =========================================================================
  COMPOSANT : VisitTourSteps
  Liste des étapes, avec coche pour celles déjà parcourues.
========================================================================= */
export function VisitTourSteps({ tour, onSelectStep }: VisitTourStepsProps) {
  const { t } = useI18n();

  return (
    <ol id={VISIT_TOUR_STEPS_ID} className={styles.steps}>
      {tour.targets.map((target, index) => {
        const active = index === tour.index && !tour.done;
        const completed = tour.done || index < tour.index;

        return (
          <li key={`${target.stopId}-${target.target}-${index}`}>
            {/* Étape cliquable pour rejoindre directement la cible. */}
            <button
              type="button"
              className={styles.stepButton}
              data-active={active}
              data-completed={completed}
              aria-current={active ? 'step' : undefined}
              onClick={() => onSelectStep(index)}
            >
              <span className={styles.stepIndex}>
                {completed ? <Icon name="check" size={12} /> : index + 1}
              </span>
              <span className={styles.stepText}>
                <span className={styles.stepSection}>
                  {t(target.labelKey)}
                </span>
                {target.label ? (
                  <span className={styles.stepLabel}>{target.label}</span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
