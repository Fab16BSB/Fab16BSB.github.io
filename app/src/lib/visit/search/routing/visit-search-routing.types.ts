import type { Locale } from '@/types/common.types';
import type { VisitSearchSection } from '@/types/visit-search.types';
import type { VisitSectionId } from '@/types/visit.types';

/** Sections retenues avant le calcul du verdict. */
export type RoutingSelection = {
  selected: VisitSearchSection[];
  strongSelected: VisitSearchSection[];
  strongSelectedIds: Set<VisitSectionId>;
  weakRankedSections: VisitSearchSection[];
  weakIds: Set<VisitSectionId>;
  displaySelected: VisitSearchSection[];
};

/** Données nécessaires au calcul du verdict. */
export type VerdictContext = {
  selection: RoutingSelection;
  availabilityMatch: boolean;
  strictNamedSectionIds: Set<VisitSectionId>;
  coverage: number;
  themeOnlyMatch: boolean;
  query: string;
  queryTokens: string[];
  locale: Locale;
  referenceYear: number;
};
