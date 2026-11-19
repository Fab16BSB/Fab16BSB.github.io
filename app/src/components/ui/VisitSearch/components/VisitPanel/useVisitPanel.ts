/* =========================================================================
  IMPORTS
========================================================================= */
import type { MouseEvent as ReactMouseEvent } from 'react';
import type { VisitPersona } from '@/types/visit.types';
import type { useVisitSearch } from '../../useVisitSearch';

/* =========================================================================
  HOOK : useVisitPanel
  État d'affichage et actions de la palette de visite.
========================================================================= */
export function useVisitPanel(search: ReturnType<typeof useVisitSearch>) {
  const {
    query,
    persona,
    mode,
    plan,
    inputRef,
    panelRef,
    close,
    setQuery,
    setPersona,
    setMode,
    goToTarget,
    reset,
    startTour,
    handleQueryKeyDown,
  } = search;

  // Demande en cours et invitation affichée sans profil sélectionné.
  const hasQuery = query.trim().length > 0;
  const showPrompt = !hasQuery && persona === 'general';

  // Un second clic sur le profil actif revient au profil complet.
  const selectPersona = (value: VisitPersona) => {
    if (value === persona) {
      setPersona('general');
    } else {
      setQuery('');
      setPersona(value);
    }
  };

  // Une recherche libre annule le profil sélectionné.
  const changeQuery = (value: string) => {
    setQuery(value);

    if (value.trim().length > 0) {
      setPersona('general');
    }
  };

  // Seul le voile ferme la palette, pas un clic dans le panneau.
  const handleOverlayClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      close();
    }
  };

  return {
    query,
    persona,
    mode,
    plan,
    inputRef,
    panelRef,
    close,
    setQuery,
    reset,
    startTour,
    handleQueryKeyDown,
    hasQuery,
    showPrompt,
    selectPersona,
    changeQuery,
    handleOverlayClick,
    goToTarget,
    setMode,
  };
}
