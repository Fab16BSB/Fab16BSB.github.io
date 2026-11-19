/* =========================================================================
   PREUVES : contenus concrets d'une étape
   Le profil et la récence choisissent les contenus ; aucun ordre de fichier.
========================================================================= */
import { profile } from '@/data/profile/profile.data';
import { getAwardHighlights } from './visit-evidence.awards';
import { getProjectHighlights } from './visit-evidence.projects';
import { getPublicationHighlights } from './visit-evidence.publications';
import { getTeachingHighlights } from './visit-evidence.teaching';
import { getTimelineHighlights } from './visit-evidence.timeline';
import { getVideoHighlights } from './visit-evidence.videos';
import { getSkillHighlights } from './visit-skills';
import type { Locale } from '@/types/common.types';
import type {
  VisitHighlight,
  VisitPersonaDefinition,
  VisitSectionId,
} from '@/types/visit.types';

/**
 * Retourne des contenus concrets à regarder dans une section.
 *
 * @param section - Section du parcours.
 * @param locale - Langue de lecture.
 * @param limit - Nombre maximal de contenus.
 * @param referenceYear - Année de référence pour l'ancienneté.
 * @param persona - Profil de lecture.
 * @returns Les contenus retenus.
 */
export function getVisitHighlights(
  section: VisitSectionId,
  locale: Locale,
  limit = 2,
  referenceYear = new Date().getFullYear(),
  persona: VisitPersonaDefinition,
): VisitHighlight[] {
  if (section === 'about') {
    return [
      {
        label: profile.name,
        detail: profile.role[locale],
        target: 'about-profile',
      },
    ];
  }

  if (section === 'skills') {
    return getSkillHighlights(
      referenceYear,
      limit,
      persona.skillThemes,
    );
  }

  switch (section) {
    case 'projects':
      return getProjectHighlights(locale, limit, persona);
    case 'publications':
      return getPublicationHighlights(locale, limit, persona);
    case 'teaching':
      return getTeachingHighlights(
        locale,
        limit,
        referenceYear,
        persona,
      );
    case 'videos':
      return getVideoHighlights(limit, persona);
    case 'timeline':
      return getTimelineHighlights(
        locale,
        limit,
        referenceYear,
        persona,
      );
    case 'awards':
      return getAwardHighlights(locale, limit, persona);
    default:
      return [];
  }
}
