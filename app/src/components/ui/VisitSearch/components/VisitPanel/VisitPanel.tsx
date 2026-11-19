/* =========================================================================
  IMPORTS
========================================================================= */
import { createPortal } from 'react-dom';
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import { VisitFilters } from '../VisitFilters/VisitFilters';
import { VisitResults } from '../VisitResults/VisitResults';
import type { useVisitSearch } from '../../useVisitSearch';
import { useVisitPanel } from './useVisitPanel';
import styles from './VisitPanel.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitPanelProps = {
  search: ReturnType<typeof useVisitSearch>;
};

/* =========================================================================
  COMPOSANT : VisitPanel
  Palette de visite : demande libre, filtres et parcours proposé.
========================================================================= */
export function VisitPanel({ search }: VisitPanelProps) {
  const { t } = useI18n();
  const {
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
  } = useVisitPanel(search);

  return createPortal(
    // Fond cliquable qui referme la palette.
    <div className={styles.overlay} onClick={handleOverlayClick}>

      {/* Panneau modal qui détient le focus tant qu'il est ouvert. */}
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="visit-title"
        aria-describedby="visit-subtitle"
      >
        {/* En-tête de la palette. */}
        <header className={styles.head}>
          <span className={styles.headIcon}>
            <Icon name="compass" size={21} />
          </span>
          <div className={styles.headText}>
            <h2 id="visit-title" className={styles.title}>
              {t('visit.title')}
            </h2>
            <p id="visit-subtitle" className={styles.subtitle}>
              {t('visit.subtitle')}
            </p>
          </div>

          {/* Ferme la palette sans lancer la visite. */}
          <button
            type="button"
            className={styles.close}
            onClick={close}
            aria-label={t('common.close')}
          >
            <Icon name="close" size={17} />
          </button>
        </header>

        {/* Demande libre. */}
        <div className={styles.searchRow}>
          <Icon name="search" size={19} className={styles.searchIcon} />
          <label className="sr-only" htmlFor="visit-query">
            {t('visit.inputLabel')}
          </label>
          <input
            ref={inputRef}
            id="visit-query"
            className={styles.input}
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            onKeyDown={handleQueryKeyDown}
            placeholder={t('visit.placeholder')}
            autoComplete="off"
            spellCheck={false}
          />
          {hasQuery ? (
            // Efface la demande courante.
            <button
              type="button"
              className={styles.clear}
              onClick={() => setQuery('')}
              aria-label={t('visit.clear')}
            >
              <Icon name="close" size={13} />
            </button>
          ) : null}
          {/* Rappel du raccourci clavier d'ouverture. */}
          <kbd className={styles.kbd}>Ctrl K</kbd>
        </div>

        {/* Profils de lecture et longueur du parcours. */}
        <VisitFilters
          persona={persona}
          mode={mode}
          onPersonaChange={selectPersona}
          onModeChange={setMode}
        />

        {/* Parcours proposé pour la demande courante. */}
        <VisitResults
          plan={plan}
          hasQuery={hasQuery}
          showPrompt={showPrompt}
          onSelect={goToTarget}
        />

        {/* Confidentialité et actions de pied de palette. */}
        <footer className={styles.foot}>
          <p className={styles.privacy}>
            <Icon name="info" size={13} />
            {t('visit.privacy')}
          </p>
          <div className={styles.footActions}>
            {/* Remise à zéro de la demande et des filtres. */}
            <button
              type="button"
              className={styles.reset}
              onClick={reset}
            >
              {t('visit.reset')}
            </button>
            {/* Lance la visite guidée sur le parcours affiché. */}
            <button
              type="button"
              className="button button--primary button--small"
              onClick={startTour}
              disabled={showPrompt}
            >
              <Icon name="route" size={15} />
              {t('visit.tour.start')}
            </button>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
