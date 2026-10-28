/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useMemo, useState } from 'react';
import { teaching } from '@/data/teaching.data';
import { supervisions } from '@/data/supervisions.data';
import type { TeachingLevel } from '@/types/teaching.types';
import { filterCourses, getLevels, getYears, totalHours } from './teaching.helpers';


/* =========================================================================
  TYPES & INTERFACES
========================================================================= */
export type TeachingTab = 'courses' | 'supervisions';

/* =========================================================================
  HOOK : useTeaching
  Gère les filtres, les totaux et l'affichage progressif de l'enseignement.
========================================================================= */
export function useTeaching() {

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

  // Cours filtrés.
  const filtered = useMemo(
    () => filterCourses(teaching, year, level, query),
    [year, level, query],
  );

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
