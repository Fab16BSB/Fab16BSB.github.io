/* =========================================================================
  IMPORTS
========================================================================= */
import { createPortal } from 'react-dom';
import type { VisitSpotlightRect } from '@/types/visit.types';
import styles from './VisitSpotlight.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitSpotlightProps = {
  rect: VisitSpotlightRect;
};

/* =========================================================================
  COMPOSANT : VisitSpotlight
  Projecteur autour de l'élément courant de la visite guidée.
========================================================================= */
export function VisitSpotlight({ rect }: VisitSpotlightProps) {
  return createPortal(
    <div
      className={styles.spotlight}
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      }}
      aria-hidden="true"
    />,
    document.body,
  );
}
