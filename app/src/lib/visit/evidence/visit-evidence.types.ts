import type { VisitHighlight } from '@/types/visit.types';

/** Contenu scoré avant la sélection finale d'une étape. */
export type VisitEvidenceEntry = {
  score: number;
  themeScore: number;
  group?: number;
  highlight: VisitHighlight;
};
