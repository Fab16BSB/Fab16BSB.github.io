/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { projects } from '@/data/projects.data';
import { getSearchIndex, searchDocuments } from '@/lib/search-engine';
import { projectSearchFields } from '@/lib/search-fields';
import { rankSearchResults } from '@/lib/search-rank';
import { useSemanticSearch } from '@/search/useSemanticSearch';
import type { Locale } from '@/types/common.types';
import type { Project, ProjectCategory } from '@/types/project.types';
import {
  countProjects,
  filterProjects,
  getProjectYears,
} from './projects.helpers';

/* =========================================================================
  HOOK : useProjects
  Gère les filtres, la pagination progressive et la modale de projet.
========================================================================= */

export type ProjectFilter = ProjectCategory | 'all';

/** Nombre de projets affichés avant « voir plus ». */
const INITIAL_VISIBLE = 6;

export function useProjects(locale: Locale) {
  // Catégorie active.
  const [active, setActiveState] = useState<ProjectFilter>('all');

  // Recherche saisie.
  const [query, setQuery] = useState('');

  // Année sélectionnée.
  const [year, setYear] = useState('all');

  // Indique si la liste complète est affichée.
  const [expanded, setExpanded] = useState(false);

  // Projet ouvert dans la modale, ou `null`.
  const [selected, setSelected] = useState<Project | null>(null);

  // Tout changement de filtre replie la liste.
  useEffect(() => {
    setExpanded(false);
  }, [active, year, query]);

  // Années disponibles, de la plus récente à la plus ancienne.
  const years = useMemo(() => getProjectYears(projects), []);

  // Une année absente de la catégorie courante retombe sur « toutes ».
  const activeYear = years.includes(year) ? year : 'all';

  // Index plein texte des projets, construit une fois par langue.
  const index = useMemo(
    () =>
      getSearchIndex(
        `projects:${locale}`,
        locale,
        projects.map((project) => ({
          id: `projects:${project.id}`,
          ...projectSearchFields(project, locale),
        })),
      ),
    [locale],
  );

  // Scores sémantiques de la requête courante, si l'option est active.
  const { semanticScores } = useSemanticSearch('projects', query);

  // Identifiants des projets, pour limiter les candidats sémantiques.
  const allowedIds = useMemo(
    () => new Set(projects.map((project) => `projects:${project.id}`)),
    [],
  );

  // Correspondances lexicales puis fusion avec les scores sémantiques.
  const matches = useMemo(() => searchDocuments(index, query), [index, query]);
  const orderedIds = useMemo(
    () => rankSearchResults({ lexical: matches, semantic: semanticScores, allowedIds }),
    [allowedIds, matches, semanticScores],
  );

  // Projets filtrés, puis classés par pertinence ou par année décroissante.
  const filtered = useMemo(() => {
    const base = filterProjects(projects, active).filter(
      (project) => activeYear === 'all' || project.year === activeYear,
    );
    let result: Project[] = [];

    if (query.trim().length === 0) {
      result = [...base].sort((left, right) => Number(right.year) - Number(left.year));
    } else {
      const order = new Map(orderedIds.map((id, rank) => [id, rank]));

      result = base
        .map((project) => ({ project, rank: order.get(`projects:${project.id}`) }))
        .filter((entry): entry is { project: Project; rank: number } => entry.rank !== undefined)
        .sort((left, right) => left.rank - right.rank)
        .map((entry) => entry.project);
    }

    return result;
  }, [active, activeYear, orderedIds, query]);

  // Compteurs des onglets, calculés sur la liste complète.
  const counts = useMemo(
    () => ({
      all: projects.length,
      personal: countProjects(projects, 'personal'),
      professional: countProjects(projects, 'professional'),
      academic: countProjects(projects, 'academic'),
    }),
    [],
  );

  // La pagination ne s'applique qu'à la vue complète.
  const visible = active === 'all' && !expanded ? filtered.slice(0, INITIAL_VISIBLE) : filtered;
  const hasMore = active === 'all' && filtered.length > INITIAL_VISIBLE;

  // Change de catégorie et réinitialise l'année.
  const setActive = useCallback((next: ProjectFilter) => {
    setActiveState(next);
    setYear('all');
  }, []);

  // Réinitialise la recherche et l'année, sans toucher à la catégorie.
  const resetFilters = useCallback(() => {
    setQuery('');
    setYear('all');
  }, []);

  // Ouvre la modale sur un projet.
  const openProject = useCallback((project: Project) => setSelected(project), []);

  // Ferme la modale.
  const closeProject = useCallback(() => setSelected(null), []);

  return {
    active,
    setActive,
    query,
    setQuery,
    year: activeYear,
    setYear,
    years,
    filtered,
    visible,
    counts,
    selected,
    openProject,
    closeProject,
    expanded,
    setExpanded,
    hasMore,
    resetFilters,
    hasFilters: query !== '' || activeYear !== 'all',
  };
}
