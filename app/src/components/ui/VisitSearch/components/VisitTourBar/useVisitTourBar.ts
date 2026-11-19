/* =========================================================================
  IMPORTS
========================================================================= */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { VisitTourState } from '@/types/visit.types';
import { getVisitTourProgress } from './visitTourBar.helpers';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Largeur en dessous de laquelle la barre passe en feuille basse. */
const COMPACT_QUERY = '(max-width: 1359px)';

// Abonne le composant aux passages entre feuille basse et volet latéral.
const subscribeCompact = (onChange: () => void) => {
  const query = window.matchMedia(COMPACT_QUERY);
  query.addEventListener('change', onChange);

  return () => query.removeEventListener('change', onChange);
};

// Indique si la feuille basse compacte est active.
const getCompactSnapshot = () => window.matchMedia(COMPACT_QUERY).matches;

// Valeur de repli avant la première mesure.
const getCompactServerSnapshot = () => false;

/* =========================================================================
  INTERFACE
========================================================================= */
type UseVisitTourBarParams = {
  tour: VisitTourState;
  onNext: () => void;
  onPrevious: () => void;
  onSelectStep: (index: number) => void;
};

/* =========================================================================
  HOOK : useVisitTourBar
  Variante d'affichage, dépliage de la liste et navigation dans la visite.
========================================================================= */
export function useVisitTourBar({
  tour,
  onNext,
  onPrevious,
  onSelectStep,
}: UseVisitTourBarParams) {
  const { t } = useI18n();

  const compact = useSyncExternalStore(
    subscribeCompact,
    getCompactSnapshot,
    getCompactServerSnapshot,
  );

  // Liste des étapes dépliée dans la feuille basse.
  const [expanded, setExpanded] = useState(false);

  // Referme la liste quand on repasse sur le volet latéral.
  useEffect(() => {
    if (!compact) {
      setExpanded(false);
    }
  }, [compact]);

  // Cible courante, avancement et icône de sa section.
  const { current, position, progress, isLast, sectionIcon } = useMemo(
    () => getVisitTourProgress(tour),
    [tour],
  );

  // Compteur « étape X sur Y » affiché dans l'en-tête.
  const stepCounter = t('visit.tour.step', {
    current: position,
    total: tour.targets.length,
  });

  // Déplie ou replie la liste des étapes.
  const toggleExpanded = useCallback(
    () => setExpanded((value) => !value),
    [],
  );

  // Replie la liste avant une navigation.
  const collapse = useCallback(() => setExpanded(false), []);

  // Replie la liste puis passe à l'étape suivante.
  const handleNext = useCallback(() => {
    collapse();
    onNext();
  }, [collapse, onNext]);

  // Replie la liste puis revient à l'étape précédente.
  const handlePrevious = useCallback(() => {
    collapse();
    onPrevious();
  }, [collapse, onPrevious]);

  // Replie la liste puis rejoint directement une étape.
  const handleSelectStep = useCallback(
    (index: number) => {
      collapse();
      onSelectStep(index);
    },
    [collapse, onSelectStep],
  );

  return {
    compact,
    expanded,
    toggleExpanded,
    current,
    progress,
    isLast,
    sectionIcon,
    stepCounter,
    handleNext,
    handlePrevious,
    handleSelectStep,
  };
}
