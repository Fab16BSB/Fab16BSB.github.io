/* =========================================================================
  CORRESPONDANCES : résultats de recherche pour une offre
  Repère les sections nommées, interroge l'index puis mesure la couverture.
========================================================================= */
import {
  normalizeNamePhrase,
  SECTION_NAME_WORDS,
} from '@/lib/visit/search/visit-search-vocabulary';
import type { VisitSectionId } from '@/types/visit.types';
import type {
  VisitSearchCorpus,
  VisitSearchMatch,
} from '@/types/visit-search.types';

/**
 * Repère les sections nommées explicitement dans la demande.
 *
 * @param query - Demande nettoyée.
 * @returns Les sections nommées.
 */
export function getStrictNamedSections(
  query: string,
): Set<VisitSectionId> {
  const padded = ` ${normalizeNamePhrase(query)} `;

  return new Set<VisitSectionId>(
    [...SECTION_NAME_WORDS.entries()]
      .filter(([, names]) =>
        names.some((name) => padded.includes(` ${name} `)),
      )
      .map(([section]) => section),
  );
}

/**
 * Interroge l'index et convertit les résultats en correspondances.
 *
 * @param index - Index plein texte du corpus.
 * @param byId - Métadonnées indexées.
 * @param sectionTagTerms - Termes propres à chaque section.
 * @param query - Demande nettoyée.
 * @returns Les correspondances brutes.
 */
export function collectRawMatches(
  index: VisitSearchCorpus['index'],
  byId: VisitSearchCorpus['byId'],
  sectionTagTerms: VisitSearchCorpus['sectionTagTerms'],
  query: string,
): VisitSearchMatch[] {
  if (query.length === 0) {
    return [];
  }

  return index
    .search(query, {
      prefix: false,
      fuzzy: false,
      boost: { title: 3, tags: 2, body: 1 },
      combineWith: 'OR',
    })
    .flatMap((match) => {
      const meta = byId.get(String(match.id));

      if (!meta) {
        return [];
      }

      const terms = Object.keys(match.match ?? {});
      const tagTerms =
        sectionTagTerms.get(meta.section) ?? new Set<string>();
      const sectionLabelOnly =
        meta.kind === 'section' ||
        (terms.length > 0 &&
          terms.every((term) => tagTerms.has(term)));
      const themeOnly =
        meta.kind === 'item' &&
        terms.length > 0 &&
        terms.every((term) => !meta.ownTerms.has(term));

      return [
        {
          id: String(match.id),
          score: match.score,
          terms,
          meta,
          sectionLabelOnly,
          themeOnly,
        },
      ];
    });
}

/**
 * Calcule la part des mots de la demande réellement retrouvés.
 *
 * @param matches - Correspondances brutes.
 * @param queryTokens - Mots normalisés de la demande.
 * @returns La couverture entre 0 et 1.
 */
export function getCoverage(
  matches: VisitSearchMatch[],
  queryTokens: string[],
): number {
  const matchedTerms = new Set(
    matches.flatMap((match) => match.terms),
  );
  const matchedCount = queryTokens.filter((term) =>
    matchedTerms.has(term),
  ).length;

  return queryTokens.length > 0 ? matchedCount / queryTokens.length : 0;
}

/**
 * Indique si la demande ne correspond qu'à des thèmes génériques.
 *
 * @param matches - Correspondances brutes.
 * @returns `true` quand aucun contenu ne porte les mots de la demande.
 */
export function getThemeOnlyMatch(matches: VisitSearchMatch[]): boolean {
  const themeOnlyTerms = new Set(
    matches
      .filter((match) => match.themeOnly)
      .flatMap((match) => match.terms),
  );
  const ownMatchTerms = new Set(
    matches
      .filter((match) => !match.themeOnly && !match.sectionLabelOnly)
      .flatMap((match) => match.terms),
  );

  return (
    themeOnlyTerms.size > 0 &&
    [...themeOnlyTerms].every((term) => !ownMatchTerms.has(term))
  );
}
