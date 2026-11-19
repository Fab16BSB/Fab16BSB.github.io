/* =========================================================================
   MODES : nombre de sections et de contenus affichés
   Les valeurs vivent dans `visit.config.ts` ; ce module les applique.
========================================================================= */
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import type {
  VisitMode,
  VisitSectionId,
  VisitSectionPolicy,
} from '@/types/visit.types';

/**
 * Nombre maximal de sections de contenu.
 *
 * @param mode - Mode essentiel ou approfondi.
 * @returns La limite, ou `null` pour toutes les sections retenues.
 */
export function getMaxContentSections(mode: VisitMode): number | null {
  return VISIT_CONFIG.modes[mode].maxSections;
}

/**
 * Politique d'accès aux sections hors noyau.
 *
 * @param mode - Mode essentiel ou approfondi.
 * @returns `named` si la section doit être nommée, `matched` si un contenu suffit.
 */
export function getSectionPolicy(mode: VisitMode): VisitSectionPolicy {
  return VISIT_CONFIG.modes[mode].contextSections;
}

/**
 * Nombre de contenus affichés dans une section.
 *
 * @param section - Section concernée.
 * @param mode - Mode essentiel ou approfondi.
 * @param sharesTimeline - La demande couvre aussi l'enseignement ou la recherche.
 * @returns La limite de contenus, `Infinity` pour tout afficher.
 */
export function getContentLimit(
  section: VisitSectionId,
  mode: VisitMode,
  sharesTimeline = false,
): number {
  const config = VISIT_CONFIG.modes[mode];

  if (config.items === null) {
    return Number.POSITIVE_INFINITY;
  }

  if (section === 'timeline' && sharesTimeline) {
    return config.timelineShared ?? config.items[section];
  }

  return config.items[section];
}
