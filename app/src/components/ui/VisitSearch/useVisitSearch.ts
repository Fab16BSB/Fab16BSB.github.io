/* =========================================================================
  IMPORTS
========================================================================= */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useDialogFocusTrap } from '@/hooks/ui/useDialogFocusTrap';
import { useLockBodyScroll } from '@/hooks/ui/useLockBodyScroll';
import { useI18n } from '@/i18n/useI18n';
import { appendContactStop } from '@/lib/visit/plan/visit-plan.contact';
import { buildVisitPlan } from '@/lib/visit/plan/visit-plan';
import { isVisitTarget } from '@/lib/visit/visit-targets';
import type { VisitMode, VisitPersona } from '@/types/visit.types';
import { useVisitTour } from './useVisitTour';

/* =========================================================================
  HOOK : useVisitSearch
  État de la palette, raccourcis clavier et accès aux cibles.
========================================================================= */
export function useVisitSearch() {
  const { locale } = useI18n();

  // Palette ouverte et demande en cours.
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Profil de lecture et longueur du parcours.
  const [persona, setPersona] = useState<VisitPersona>('general');
  const [mode, setMode] = useState<VisitMode>('express');

  // Références du champ, du bouton d'ouverture et du panneau.
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Frame du focus différé, annulée au démontage.
  const focusFrameRef = useRef<number | undefined>(undefined);

  // Donne le focus après le rendu, en annulant le précédent.
  const focusLater = useCallback((element: HTMLElement | null) => {
    if (focusFrameRef.current !== undefined) {
      window.cancelAnimationFrame(focusFrameRef.current);
    }

    focusFrameRef.current = window.requestAnimationFrame(() => {
      element?.focus();
    });
  }, []);

  // Parcours recalculé à chaque frappe, toujours terminé par le contact.
  const plan = useMemo(
    () =>
      appendContactStop(
        buildVisitPlan(query, persona, mode, locale),
        locale,
      ),
    [query, persona, mode, locale],
  );

  // Visite guidée et navigation dans la page.
  const {
    tour,
    spotlight,
    startTour: beginTour,
    nextTour,
    previousTour,
    goToTourStep,
    quitTour,
    replayTour,
    scrollToTarget,
    clearHighlight,
  } = useVisitTour(plan);

  // Bloque le défilement de la page derrière la palette.
  useLockBodyScroll(open);

  // Ouvre la palette depuis le header.
  const openPanel = useCallback(() => setOpen(true), []);

  // Ferme la palette et rend le focus au bouton d'ouverture.
  const close = useCallback(() => {
    setOpen(false);
    focusLater(triggerRef.current);
  }, [focusLater]);

  // Ferme la palette puis rejoint une section ou un élément.
  const goToTarget = useCallback(
    (target: string, fallback?: string) => {
      setOpen(false);
      quitTour();

      const section =
        fallback ?? (target.startsWith('#') ? target : undefined);

      if (section) {
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${window.location.search}${section}`,
        );
      }

      scrollToTarget(target, fallback);
    },
    [quitTour, scrollToTarget],
  );

  // Lance la visite guidée depuis la palette.
  const startTour = useCallback(() => {
    setOpen(false);
    beginTour();
  }, [beginTour]);

  // Valide la demande et rejoint la première étape de contenu.
  const handleQueryKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const firstContent = plan.stops.find((stop) => stop.id !== 'about');
        const target = firstContent ?? plan.stops[0];

        if (target) {
          goToTarget(target.anchor);
        }
      }
    },
    [goToTarget, plan.stops],
  );

  // Remet la palette dans son état initial.
  const reset = useCallback(() => {
    setQuery('');
    setPersona('general');
    setMode('express');
    quitTour();
    focusLater(inputRef.current);
  }, [focusLater, quitTour]);

  // Donne le focus au champ et garde la navigation dans la palette.
  useDialogFocusTrap(panelRef, open, inputRef);

  // Ouvre la palette depuis un lien profond `#visit` ou `#visit=...`.
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const deepLink = params.get('visit');

    if (deepLink !== null) {
      setOpen(true);

      if (deepLink.length > 0) {
        setQuery(deepLink);
      }

      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, []);

  // Rejoint la carte visée par un lien profond `?target=project-these`.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('target');

    if (target === null || !isVisitTarget(target)) {
      return undefined;
    }

    // Laisse les sections s'abonner aux demandes de révélation.
    const timer = window.setTimeout(() => {
      scrollToTarget(target, window.location.hash || undefined);
    }, 0);

    return () => window.clearTimeout(timer);
  }, [scrollToTarget]);

  // Retire la mise en évidence au démontage.
  useEffect(() => () => clearHighlight(), [clearHighlight]);

  // Annule le focus différé au démontage.
  useEffect(
    () => () => {
      if (focusFrameRef.current !== undefined) {
        window.cancelAnimationFrame(focusFrameRef.current);
      }
    },
    [],
  );

  // Raccourcis : Ctrl/Cmd+K, barre oblique et Échap.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable === true;

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();

        if (open) {
          close();
        } else {
          openPanel();
        }
      } else if (event.key === '/' && !typing) {
        event.preventDefault();
        openPanel();
      } else if (event.key === 'Escape' && open) {
        close();
      } else if (event.key === 'Escape' && tour) {
        quitTour();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, tour, close, openPanel, quitTour]);

  return {
    open,
    query,
    persona,
    mode,
    plan,
    tour,
    spotlight,
    inputRef,
    triggerRef,
    panelRef,
    setQuery,
    setPersona,
    setMode,
    openPanel,
    close,
    goToTarget,
    startTour,
    nextTour,
    previousTour,
    goToTourStep,
    quitTour,
    replayTour,
    reset,
    handleQueryKeyDown,
  };
}
