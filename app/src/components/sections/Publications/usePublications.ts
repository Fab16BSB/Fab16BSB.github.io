/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useMemo, useState } from 'react';
import mediumPostsRaw from '@/data/medium-posts.json';
import { publications } from '@/data/publications.data';
import type { Locale } from '@/types/common.types';
import type { MediumPost } from '@/types/medium.types';
import type { PublicationLanguage } from '@/types/publication.types';
import {
  availableYears,
  filterMediumPosts,
  mediumPostMatches,
  mediumPostYear,
  publicationMatches,
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

  // Publications filtrées par année et recherche.
  const scientific = useMemo(
    () =>
      allScientific.filter(
        (publication) =>
          (activeYear === 'all' || publication.year === activeYear) &&
          publicationMatches(publication, query),
      ),
    [allScientific, activeYear, query],
  );

  // Articles Medium filtrés par année et recherche.
  const medium = useMemo(
    () =>
      allMedium.filter(
        (post) =>
          (activeYear === 'all' || mediumPostYear(post) === activeYear) &&
          mediumPostMatches(post, query),
      ),
    [allMedium, activeYear, query],
  );

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
