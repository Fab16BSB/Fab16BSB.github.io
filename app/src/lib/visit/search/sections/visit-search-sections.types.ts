import type {
  VisitSearchMatch,
  VisitSearchMeta,
} from '@/types/visit-search.types';
import type { VisitSectionId } from '@/types/visit.types';


/** Contenu retenu pour une section, avec son score. */
export type VisitSectionEntry = {
  meta: VisitSearchMeta;
  score: number;
};

/** Correspondances brutes regroupées par section. */
export type VisitSectionMatchGroups = {
  strongEntries: Map<VisitSectionId, VisitSectionEntry[]>;
  weakMatches: Map<VisitSectionId, VisitSearchMatch[]>;
  sectionTerms: Map<VisitSectionId, Set<string>>;
};
