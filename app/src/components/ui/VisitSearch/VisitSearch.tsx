/* =========================================================================
  IMPORTS
========================================================================= */
import { VisitInvite } from './components/VisitInvite/VisitInvite';
import { VisitPanel } from './components/VisitPanel/VisitPanel';
import { VisitSpotlight } from './components/VisitSpotlight/VisitSpotlight';
import { VisitTourBar } from './components/VisitTourBar/VisitTourBar';
import { useVisitSearch } from './useVisitSearch';

/* =========================================================================
  COMPOSANT : VisitSearch
  Invitation du header, palette de visite et visite guidée.
========================================================================= */
export function VisitSearch() {
  const search = useVisitSearch();

  return (
    <>
      {/* Invitation permanente du header. */}
      <VisitInvite
        ref={search.triggerRef}
        onOpen={search.openPanel}
        expanded={search.open}
      />

      {/* Palette de visite ouverte. */}
      {search.open ? <VisitPanel search={search} /> : null}

      {/* Projecteur autour de la cible mise en évidence. */}
      {search.tour && search.spotlight ? (
        <VisitSpotlight rect={search.spotlight} />
      ) : null}

      {/* Barre de visite guidée active. */}
      {search.tour ? (
        <VisitTourBar
          tour={search.tour}
          onNext={search.nextTour}
          onPrevious={search.previousTour}
          onSelectStep={search.goToTourStep}
          onQuit={search.quitTour}
          onReplay={search.replayTour}
        />
      ) : null}
    </>
  );
}
