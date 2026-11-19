/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useMemo, useRef, useState } from 'react';
import { teaching } from '@/data/content/teaching.data';
import { supervisions } from '@/data/content/supervisions.data';
import { useVisitReveal } from '@/hooks/sections/useVisitReveal';
import { getSearchIndex, searchDocuments } from '@/lib/search/search-engine';
import { teachingCourseSearchFields } from '@/lib/search/search-fields';
import { rankSearchResults } from '@/lib/search/search-rank';
import { visitTargetPrefix } from '@/lib/visit/visit-targets';
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

  // Évite de replier la liste juste après une demande de visite.
  const skipCollapseRef = useRef(false);

  // Minuteur de fin de révélation, annulé au démontage.
  const collapseTimerRef = useRef<number | undefined>(undefined);

  // Annule le minuteur de révélation au démontage.
  useEffect(
    () => () => window.clearTimeout(collapseTimerRef.current),
    [],
  );

  // Un nouveau filtre replie la liste, sauf pendant une révélation.
  useEffect(() => {
    if (skipCollapseRef.current) {
      skipCollapseRef.current = false;
    } else {
      setExpanded(false);
    }
  }, [year, level, query, tab]);

  // Remet les filtres de cours à zéro.
  const reset = () => {
    setYear('all');
    setLevel('all');
    setQuery('');
  };

  // Préfixes des cartes ciblables par la visite.
  const coursePrefix = visitTargetPrefix('course');
  const supervisionPrefix = visitTargetPrefix('supervision');

  // Une visite guidée peut demander un cours ou un encadrement précis.
  useVisitReveal([coursePrefix, supervisionPrefix], (target) => {
    const isSupervision = target.startsWith(supervisionPrefix);

    skipCollapseRef.current = true;
    setTab(isSupervision ? 'supervisions' : 'courses');

    if (!isSupervision) {
      reset();
    }

    setExpanded(true);
    window.clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = window.setTimeout(() => {
      skipCollapseRef.current = false;
    }, 200);
  });

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

  // Total global, indépendant des filtres.
  const allHours = useMemo(() => totalHours(teaching), []);

  // La pagination ne s'applique qu'à la liste des cours.
  const visible = expanded ? filtered : filtered.slice(0, 8);

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
    allHours,
    expanded,
    setExpanded,
    reset,
    supervisions,
    hasFilters: year !== 'all' || level !== 'all' || query !== '',
  };
}
