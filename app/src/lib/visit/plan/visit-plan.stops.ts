/* =========================================================================
   PARCOURS : construction des étapes — fonctions pures
   La présentation du profil ouvre la marche, puis les sections sélectionnées.
========================================================================= */
import { getVisitHighlights } from '@/lib/visit/evidence/visit-evidence';
import { getContentLimit } from '@/lib/visit/visit-mode';
import { sectionsById } from '@/lib/visit/search/visit-search-vocabulary';
import type { Locale } from '@/types/common.types';
import type {
  VisitMode,
  VisitPersonaDefinition,
  VisitSectionDefinition,
  VisitSectionId,
  VisitStop,
} from '@/types/visit.types';


/**
 * Construit une étape à partir de sa définition.
 *
 * @param definition - Définition statique de la section.
 * @param locale - Langue de lecture.
 * @param referenceYear - Année de référence pour les compétences.
 * @param mode - Mode essentiel ou approfondi.
 * @param persona - Profil de lecture.
 * @returns L'étape prête à afficher.
 */
function buildStop(
  definition: VisitSectionDefinition,
  locale: Locale,
  referenceYear: number,
  mode: VisitMode,
  persona: VisitPersonaDefinition,
): VisitStop {
  return {
    id: definition.id,
    anchor: definition.anchor,
    icon: definition.icon,
    labelKey: definition.labelKey,
    description: definition.description[locale],
    duration: definition.duration,
    // Le parcours profil ne calcule pas de score : la recherche fournit le sien.
    score: 0,
    highlights: getVisitHighlights(
      definition.id,
      locale,
      getContentLimit(definition.id, mode),
      referenceYear,
      persona,
    ),
    isComplement: false,
  };
}

/**
 * Construit les étapes ordonnées du parcours.
 *
 * @param sortedIds - Sections de contenu triées.
 * @param locale - Langue de lecture.
 * @param referenceYear - Année de référence pour les compétences.
 * @param mode - Mode essentiel ou approfondi.
 * @param persona - Profil de lecture.
 * @returns Les étapes prêtes à afficher.
 */
export function buildStops(
  sortedIds: VisitSectionId[],
  locale: Locale,
  referenceYear: number,
  mode: VisitMode,
  persona: VisitPersonaDefinition,
): VisitStop[] {
  const stops: VisitStop[] = [];
  const about = sectionsById.get('about');

  if (about) {
    stops.push(
      buildStop(
        about,
        locale,
        referenceYear,
        mode,
        persona,
      ),
    );
  }

  for (const id of sortedIds) {
    const definition = sectionsById.get(id);

    if (definition) {
      stops.push(
        buildStop(
          definition,
          locale,
          referenceYear,
          mode,
          persona,
        ),
      );
    }
  }

  return stops;
}
