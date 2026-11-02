/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useMemo, useState } from 'react';
import mediumPostsRaw from '@/data/medium-posts.json';
import { publicationSummaries } from '@/data/publication-summaries.data';
import { publications } from '@/data/publications.data';
import { getSearchIndex, searchDocuments } from '@/lib/search-engine';
import { mediumPostSearchFields, publicationSearchFields } from '@/lib/search-fields';
import { rankSearchResults } from '@/lib/search-rank';
import { useSemanticSearch } from '@/search/useSemanticSearch';
import type { Locale } from '@/types/common.types';
import type { MediumPost } from '@/types/medium.types';
import type { PublicationLanguage, Publication } from '@/types/publication.types';
import {
  availableYears,
  filterMediumPosts,
  mediumPostYear,
  sortMediumPosts,
  sortPublications,
} from './publications.helpers';

/* =========================================================================
  HOOK : usePublications
  Gère les onglets, les filtres et la langue choisie pour chaque publication.
========================================================================= */

const mediumPosts = mediumPostsRaw as MediumPost[];

export type PublicationTab = 'scientific' | 'medium';

export function usePublications(locale: Locale) {

  // Onglet actif.
  const [tab, setTabState] = useState<PublicationTab>('scientific');

  // Recherche saisie.
  const [query, setQuery] = useState('');

  // Année sélectionnée.
  const [year, setYear] = useState('all');

  // Langue choisie par publication ; la locale courante sert de défaut.
  const [languages, setLanguages] = useState<Record<string, PublicationLanguage>>({});

  // Publications scientifiques triées.
  const allScientific = useMemo(() => sortPublications(publications), []);

  // Articles Medium de la langue courante, triés.
  const allMedium = useMemo(
    () => sortMediumPosts(filterMediumPosts(mediumPosts, locale)),
    [locale],
  );

  // Années disponibles dans chaque onglet.
  const scientificYears = useMemo(() => availableYears(allScientific), [allScientific]);
  const mediumYears = useMemo(
    () => availableYears(allMedium.map((post) => ({ year: mediumPostYear(post) }))),
    [allMedium],
  );

  // Une année absente de l'onglet courant retombe sur « toutes ».
  const years = tab === 'scientific' ? scientificYears : mediumYears;
  const activeYear = years.includes(year) ? year : 'all';

  // Scores sémantiques de la requête courante, si l'option est active.
  const { semanticScores } = useSemanticSearch('publications', query);

  // Index plein texte des publications scientifiques.
  const scientificIndex = useMemo(
    () =>
      getSearchIndex(
        `publications:scientific:${locale}`,
        locale,
        publications.map((publication) => ({
          id: `publications:${publication.id}`,
          ...publicationSearchFields(
            publication,
            locale,
            publicationSummaries[publication.id],
          ),
        })),
      ),
    [locale],
  );

  // Index plein texte des articles Medium de la langue courante.
  const mediumIndex = useMemo(
    () =>
      getSearchIndex(
        `publications:medium:${locale}`,
        locale,
        allMedium.map((post) => ({
          id: `publications:${post.id}`,
          ...mediumPostSearchFields(post, locale),
        })),
      ),
    [allMedium, locale],
  );

  // Identifiants autorisés pour limiter les candidats sémantiques.
  const scientificIds = useMemo(
    () => new Set(publications.map((publication) => `publications:${publication.id}`)),
    [],
  );
  const mediumIds = useMemo(
    () => new Set(allMedium.map((post) => `publications:${post.id}`)),
    [allMedium],
  );

  // Correspondances lexicales puis fusion avec les scores sémantiques.
  const scientificMatches = useMemo(
    () => searchDocuments(scientificIndex, query),
    [query, scientificIndex],
  );
  const mediumMatches = useMemo(
    () => searchDocuments(mediumIndex, query),
    [mediumIndex, query],
  );
  const orderedScientific = useMemo(
    () =>
      rankSearchResults({
        lexical: scientificMatches,
        semantic: semanticScores,
        allowedIds: scientificIds,
      }),
    [scientificIds, scientificMatches, semanticScores],
  );
  const orderedMedium = useMemo(
    () =>
      rankSearchResults({
        lexical: mediumMatches,
        semantic: semanticScores,
        allowedIds: mediumIds,
      }),
    [mediumIds, mediumMatches, semanticScores],
  );

  // Publications filtrées par année, puis classées par pertinence.
  const scientific = useMemo(() => {
    const base = allScientific.filter(
      (publication) => activeYear === 'all' || publication.year === activeYear,
    );
    let result = base;

    if (query.trim().length > 0) {
      const order = new Map(orderedScientific.map((id, rank) => [id, rank]));

      result = base
        .map((publication) => ({
          publication,
          rank: order.get(`publications:${publication.id}`),
        }))
        .filter(
          (entry): entry is { publication: Publication; rank: number } =>
            entry.rank !== undefined,
        )
        .sort((left, right) => left.rank - right.rank)
        .map((entry) => entry.publication);
    }

    return result;
  }, [activeYear, allScientific, orderedScientific, query]);

  // Articles Medium filtrés par année, puis classés par pertinence.
  const medium = useMemo(() => {
    const base = allMedium.filter(
      (post) => activeYear === 'all' || mediumPostYear(post) === activeYear,
    );
    let result = base;

    if (query.trim().length > 0) {
      const order = new Map(orderedMedium.map((id, rank) => [id, rank]));

      result = base
        .map((post) => ({ post, rank: order.get(`publications:${post.id}`) }))
        .filter(
          (entry): entry is { post: MediumPost; rank: number } => entry.rank !== undefined,
        )
        .sort((left, right) => left.rank - right.rank)
        .map((entry) => entry.post);
    }

    return result;
  }, [activeYear, allMedium, orderedMedium, query]);

  // Le changement d'onglet remet l'année à zéro puisque les listes diffèrent.
  const setTab = useCallback((next: PublicationTab) => {
    setTabState(next);
    setYear('all');
  }, []);

  // La langue choisie est conservée ; seuls la recherche et l'année sont remises à zéro.
  const resetFilters = useCallback(() => {
    setQuery('');
    setYear('all');
  }, []);

  // Mémorise la version linguistique choisie pour une publication.
  const chooseLanguage = useCallback((id: string, language: PublicationLanguage) => {
    setLanguages((current) => ({ ...current, [id]: language }));
  }, []);

  return {
    tab,
    setTab,
    query,
    setQuery,
    year: activeYear,
    setYear,
    years,
    scientific,
    medium,
    scientificTotal: allScientific.length,
    mediumTotal: allMedium.length,
    languages,
    chooseLanguage,
    resetFilters,
  };
}
