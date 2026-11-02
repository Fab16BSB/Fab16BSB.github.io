/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useMemo, useState } from 'react';
import { teaching } from '@/data/teaching.data';
import { supervisions } from '@/data/supervisions.data';
import { getSearchIndex, searchDocuments } from '@/lib/search-engine';
import { teachingCourseSearchFields } from '@/lib/search-fields';
import { rankSearchResults } from '@/lib/search-rank';
import { useSemanticSearch } from '@/search/useSemanticSearch';
import type { Locale } from '@/types/common.types';
import type { TeachingCourse, TeachingLevel } from '@/types/teaching.types';
import { filterCourses, getLevels, getYears, totalHours } from './teaching.helpers';


/* =========================================================================
  TYPES & INTERFACES
========================================================================= */
export type TeachingTab = 'courses' | 'supervisions';

/* =========================================================================
  HOOK : useTeaching
  Gère les filtres, les totaux et l'affichage progressif de l'enseignement.
========================================================================= */
export function useTeaching(locale: Locale) {

  // Onglet actif.
  const [tab, setTab] = useState<TeachingTab>('courses');

  // Année sélectionnée.
  const [year, setYear] = useState<number | 'all'>('all');

  // Niveau sélectionné.
  const [level, setLevel] = useState<TeachingLevel | 'all'>('all');

  // Recherche saisie.
  const [query, setQuery] = useState('');

  // Indique si la liste complète est affichée.
  const [expanded, setExpanded] = useState(false);

  // Un nouveau filtre replie la liste.
  useEffect(() => {
    setExpanded(false);
  }, [year, level, query, tab]);

  // Index plein texte des cours, construit une fois par langue.
  const index = useMemo(
    () =>
      getSearchIndex(
        `teaching:${locale}`,
        locale,
        teaching.map((course) => ({
          id: `teaching:${course.id}`,
          ...teachingCourseSearchFields(course, locale),
        })),
      ),
    [locale],
  );

  // Scores sémantiques de la requête courante, si l'option est active.
  const { semanticScores } = useSemanticSearch('teaching', query);

  // Identifiants des cours, pour limiter les candidats sémantiques.
  const allowedIds = useMemo(
    () => new Set(teaching.map((course) => `teaching:${course.id}`)),
    [],
  );

  // Correspondances lexicales puis fusion avec les scores sémantiques.
  const matches = useMemo(() => searchDocuments(index, query), [index, query]);
  const orderedIds = useMemo(
    () => rankSearchResults({ lexical: matches, semantic: semanticScores, allowedIds }),
    [allowedIds, matches, semanticScores],
  );

  // Cours filtrés par année et niveau, puis classés par pertinence.
  const filtered = useMemo(() => {
    const base = filterCourses(teaching, year, level);
    let result = base;

    if (query.trim().length > 0) {
      const order = new Map(orderedIds.map((id, rank) => [id, rank]));

      result = base
        .map((course) => ({ course, rank: order.get(`teaching:${course.id}`) }))
        .filter(
          (entry): entry is { course: TeachingCourse; rank: number } =>
            entry.rank !== undefined,
        )
        .sort((left, right) => left.rank - right.rank)
        .map((entry) => entry.course);
    }

    return result;
  }, [level, orderedIds, query, year]);

  // Années et niveaux disponibles.
  const years = useMemo(() => getYears(teaching), []);
  const levels = useMemo(() => getLevels(teaching), []);

  // Le total suit les filtres ; `allHours` reste la référence globale.
  const filteredHours = useMemo(() => totalHours(filtered), [filtered]);
  const allHours = useMemo(() => totalHours(teaching), []);

  // La pagination ne s'applique qu'à la liste des cours.
  const visible = expanded ? filtered : filtered.slice(0, 8);

  // Remet les filtres de cours à zéro.
  const reset = () => {
    setYear('all');
    setLevel('all');
    setQuery('');
  };

  return {
    tab,
    setTab,
    year,
    setYear,
    level,
    setLevel,
    query,
    setQuery,
    filtered,
    visible,
    years,
    levels,
    filteredHours,
    allHours,
    expanded,
    setExpanded,
    reset,
    supervisions,
    hasFilters: year !== 'all' || level !== 'all' || query !== '',
  };
}
