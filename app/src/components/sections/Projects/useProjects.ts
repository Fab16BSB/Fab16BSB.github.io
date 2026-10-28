/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { projects } from '@/data/projects.data';
import type { Project, ProjectCategory } from '@/types/project.types';
import {
  countProjects,
  filterProjects,
  getProjectYears,
  projectMatches,
} from './projects.helpers';

/* =========================================================================
  HOOK : useProjects
  Gère les filtres, la pagination progressive et la modale de projet.
========================================================================= */

export type ProjectFilter = ProjectCategory | 'all';

/** Nombre de projets affichés avant « voir plus ». */
const INITIAL_VISIBLE = 6;

export function useProjects() {
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

  // Projets filtrés, puis triés par année décroissante.
  const filtered = useMemo(
    () =>
      filterProjects(projects, active)
        .filter(
          (project) =>
            (activeYear === 'all' || project.year === activeYear) &&
            projectMatches(project, query),
        )
        .sort((a, b) => Number(b.year) - Number(a.year)),
    [active, activeYear, query],
  );

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
