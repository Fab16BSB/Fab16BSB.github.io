/* =========================================================================
  CORRESPONDANCES : regroupement des résultats par section
  Applique le scoring et écarte une section Vidéos déjà couverte ailleurs.
========================================================================= */
import { getSectionThemes } from '@/lib/visit/search/corpus/visit-search-corpus';
import { scoreStrongMatch } from '@/lib/visit/search/sections/visit-search-sections.scoring';
import type { VisitOfferGraphSignals } from '@/lib/visit/visit-graph';
import type {
  VisitSectionMatchGroups,
  VisitSectionEntry,
} from '@/lib/visit/search/sections/visit-search-sections.types';
import type { VisitSearchMatch } from '@/types/visit-search.types';
import type {
  VisitPersonaDefinition,
  VisitSectionId,
} from '@/types/visit.types';

/**
 * Rassemble les correspondances d'une recherche par section.
 *
 * @param rawMatches - Correspondances de la recherche.
 * @param persona - Profil de lecture.
 * @param referenceYear - Année de référence.
 * @param offerGraph - Signaux du graphe pour l'offre.
 * @param allowedSections - Sections autorisées par le profil.
 * @returns Les contenus forts, faibles et les termes par section.
 */
export function collectSectionMatches(
  rawMatches: VisitSearchMatch[],
  persona: VisitPersonaDefinition,
  referenceYear: number,
  offerGraph: VisitOfferGraphSignals,
  allowedSections: Set<VisitSectionId>,
): VisitSectionMatchGroups {
  const strongEntries = new Map<VisitSectionId, VisitSectionEntry[]>();
  const weakMatches = new Map<VisitSectionId, VisitSearchMatch[]>();
  const sectionTerms = new Map<VisitSectionId, Set<string>>();

  for (const match of rawMatches) {
    const { meta, sectionLabelOnly } = match;

    if (meta.section === 'about' || !allowedSections.has(meta.section)) {
      continue;
    }

    const termsForSection =
      sectionTerms.get(meta.section) ?? new Set<string>();

    for (const term of match.terms) {
      termsForSection.add(term);
    }

    sectionTerms.set(meta.section, termsForSection);

    if (sectionLabelOnly) {
      const list = weakMatches.get(meta.section) ?? [];
      list.push(match);
      weakMatches.set(meta.section, list);
      continue;
    }

    const themes = getSectionThemes(persona, meta.section);
    const score = scoreStrongMatch(
      match,
      themes,
      persona,
      referenceYear,
      offerGraph,
    );

    if (score === null) {
      continue;
    }

    const list = strongEntries.get(meta.section) ?? [];
    list.push({ meta, score });
    strongEntries.set(meta.section, list);
  }

  return { strongEntries, weakMatches, sectionTerms };
}

/**
 * Indique si une vidéo ne partage que des mots déjà couverts par un contenu
 * plus précis.
 *
 * Une vidéo « détection d'anomalies vidéo » ne doit pas faire croire à une
 * demande de vidéos quand un projet porte déjà ces termes.
 *
 * @param rawMatches - Correspondances brutes.
 * @param sectionTerms - Termes trouvés par section.
 * @param allowedSections - Sections autorisées par le profil.
 * @returns `true` si la section Vidéos est déjà couverte ailleurs.
 */
export function isVideoSectionCovered(
  rawMatches: VisitSearchMatch[],
  sectionTerms: Map<VisitSectionId, Set<string>>,
  allowedSections: Set<VisitSectionId>,
): boolean {
  const videoTerms = sectionTerms.get('videos');

  return (
    videoTerms !== undefined &&
    videoTerms.size > 0 &&
    rawMatches.some(
      (match) =>
        !match.sectionLabelOnly &&
        match.meta.section !== 'videos' &&
        allowedSections.has(match.meta.section) &&
        [...videoTerms].every((term) => match.terms.includes(term)),
    )
  );
}
