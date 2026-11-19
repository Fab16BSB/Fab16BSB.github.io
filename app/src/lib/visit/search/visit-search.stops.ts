/* =========================================================================
  ÉTAPES : construction du parcours à partir des sections retenues
  Présentation puis sections classées, avec la limite de contenus du mode.
========================================================================= */
import { profile } from '@/data/profile/profile.data';
import { getContentLimit } from '@/lib/visit/visit-mode';
import { toHighlight } from '@/lib/visit/search/corpus/visit-search-corpus';
import { sectionsById } from '@/lib/visit/search/visit-search-vocabulary';
import type { Locale } from '@/types/common.types';
import type {
  VisitSearchSection,
} from '@/types/visit-search.types';
import type {
  VisitMode,
  VisitSectionId,
  VisitStop,
} from '@/types/visit.types';

/**
 * Construit l'étape de présentation du profil.
 *
 * @param locale - Langue de lecture.
 * @param availabilityMatch - Demande liée à la disponibilité.
 * @param availabilityText - Texte de disponibilité, ou `null`.
 * @returns L'étape, ou `null` si la section est absente.
 */
export function buildAboutStop(
  locale: Locale,
  availabilityMatch: boolean,
  availabilityText: string | null,
): VisitStop | null {
  const about = sectionsById.get('about');

  if (!about) {
    return null;
  }

  return {
    id: 'about',
    anchor: about.anchor,
    icon: about.icon,
    labelKey: about.labelKey,
    description: about.description[locale],
    duration: about.duration,
    score: 0,
    highlights: [
      {
        label: profile.name,
        detail:
          availabilityMatch && availabilityText
            ? availabilityText
            : profile.role[locale],
        target: 'about-profile',
      },
    ],
    isComplement: false,
  };
}

/**
 * Construit une étape à partir d'une section classée.
 *
 * @param entry - Section classée et ses contenus.
 * @param locale - Langue de lecture.
 * @param referenceYear - Année de référence.
 * @param mode - Mode essentiel ou approfondi.
 * @param strongSelectedIds - Sections retenues sur un contenu réel.
 * @returns L'étape, ou `null` si la section est absente.
 */
export function buildSectionStop(
  entry: VisitSearchSection,
  locale: Locale,
  referenceYear: number,
  mode: VisitMode,
  strongSelectedIds: Set<VisitSectionId>,
): VisitStop | null {
  const definition = sectionsById.get(entry.section);

  if (!definition) {
    return null;
  }

  const sharesTimeline =
    strongSelectedIds.has('publications') ||
    strongSelectedIds.has('teaching');
  const limit = getContentLimit(entry.section, mode, sharesTimeline);

  return {
    id: definition.id,
    anchor: definition.anchor,
    icon: definition.icon,
    labelKey: definition.labelKey,
    description: definition.description[locale],
    duration: definition.duration,
    score: Math.round(entry.score),
    highlights: entry.entries
      .slice(0, limit)
      .map((item) => toHighlight(item.meta, referenceYear)),
    isComplement: !entry.hasRealItem,
  };
}

/**
 * Construit les étapes du parcours à partir des sections retenues.
 *
 * @param displaySelected - Sections affichées, compléments compris.
 * @param aboutStop - Étape de présentation, ou `null`.
 * @param locale - Langue de lecture.
 * @param referenceYear - Année de référence.
 * @param mode - Mode essentiel ou approfondi.
 * @param strongSelectedIds - Sections retenues sur un contenu réel.
 * @returns Les étapes prêtes à afficher.
 */
export function buildPlanStops(
  displaySelected: VisitSearchSection[],
  aboutStop: VisitStop | null,
  locale: Locale,
  referenceYear: number,
  mode: VisitMode,
  strongSelectedIds: Set<VisitSectionId>,
): VisitStop[] {
  const stops: VisitStop[] = [];

  if (aboutStop) {
    stops.push(aboutStop);
  }

  for (const entry of displaySelected) {
    const stop = buildSectionStop(
      entry,
      locale,
      referenceYear,
      mode,
      strongSelectedIds,
    );

    if (stop) {
      stops.push(stop);
    }
  }

  return stops;
}
