/* =========================================================================
  IMPORTS
========================================================================= */
import styles from '../VisitTourBar.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitTourProgressProps = {
  progress: number;
};

/* =========================================================================
  COMPOSANT : VisitTourProgress
  Progression de la visite, en pourcentage des cibles parcourues.
========================================================================= */
export function VisitTourProgress({ progress }: VisitTourProgressProps) {
  return (
    <div className={styles.progress} aria-hidden="true">
      <span style={{ width: `${progress}%` }} />
    </div>
  );
}
