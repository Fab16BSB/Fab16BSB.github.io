/* =========================================================================
  IMPORTS
========================================================================= */
import { createPortal } from 'react-dom';
import type { VisitTourState } from '@/types/visit.types';
import { VisitTourCompact } from './components/VisitTourCompact';
import { VisitTourFullDrawer } from './components/VisitTourFullDrawer';
import { useVisitTourBar } from './useVisitTourBar';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitTourBarProps = {
  tour: VisitTourState;
  onNext: () => void;
  onPrevious: () => void;
  onSelectStep: (index: number) => void;
  onQuit: () => void;
  onReplay: () => void;
};

/* =========================================================================
  COMPOSANT : VisitTourBar
  Barre de visite compacte sur tablette et mobile, volet complet sur desktop.
========================================================================= */
export function VisitTourBar({
  tour,
  onNext,
  onPrevious,
  onSelectStep,
  onQuit,
  onReplay,
}: VisitTourBarProps) {
  const {
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
  } = useVisitTourBar({ tour, onNext, onPrevious, onSelectStep });

  // Une seule variante est montée selon la largeur d'écran.
  return createPortal(
    compact ? (
      <VisitTourCompact
        tour={tour}
        expanded={expanded}
        current={current}
        progress={progress}
        isLast={isLast}
        sectionIcon={sectionIcon}
        stepCounter={stepCounter}
        onToggleExpanded={toggleExpanded}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSelectStep={handleSelectStep}
        onQuit={onQuit}
        onReplay={onReplay}
      />
    ) : (
      <VisitTourFullDrawer
        tour={tour}
        progress={progress}
        isLast={isLast}
        stepCounter={stepCounter}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSelectStep={handleSelectStep}
        onQuit={onQuit}
        onReplay={onReplay}
      />
    ),
    document.body,
  );
}
