/* =========================================================================
  IMPORTS
========================================================================= */
import { sectionsById } from '@/lib/visit/search/visit-search-vocabulary';
import type { IconName } from '@/types/ui.types';
import type { VisitTourState, VisitTourTarget } from '@/types/visit.types';

/* =========================================================================
  TYPES
========================================================================= */

/** Cible courante et repères d'avancement de la visite. */
export type VisitTourProgress = {
  current: VisitTourTarget;
  position: number;
  progress: number;
  isLast: boolean;
  sectionIcon: IconName;
};

/* =========================================================================
  HELPERS : barre de visite — fonctions pures
  Avancement, dernière étape et icône de la cible courante.
========================================================================= */

/**
 * Décrit la cible courante et l'avancement de la visite.
 *
 * @param tour - État de la visite guidée.
 * @returns La cible courante, sa position et l'icône de sa section.
 */
export function getVisitTourProgress(tour: VisitTourState): VisitTourProgress {
  const current = tour.targets[tour.index];
  const total = tour.targets.length;
  const position = Math.min(tour.index + 1, total);
  const progress = total > 0 ? (position / total) * 100 : 0;
  const sectionIcon =
    sectionsById.get(current.stopId)?.icon ?? 'route';

  const result: VisitTourProgress = {
    current,
    position,
    progress,
    isLast: position >= total,
    sectionIcon,
  };

  return result;
}
