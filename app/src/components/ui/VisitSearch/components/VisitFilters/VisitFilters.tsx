/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import { visitPersonas } from '@/data/visit/visit-personas.data';
import { useI18n } from '@/i18n/useI18n';
import type { VisitMode, VisitPersona } from '@/types/visit.types';
import styles from './VisitFilters.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitFiltersProps = {
  persona: VisitPersona;
  mode: VisitMode;
  onPersonaChange: (persona: VisitPersona) => void;
  onModeChange: (mode: VisitMode) => void;
};

/* =========================================================================
  COMPOSANT : VisitFilters
  Choix du profil de lecture et de la longueur du parcours.
========================================================================= */
export function VisitFilters({
  persona,
  mode,
  onPersonaChange,
  onModeChange,
}: VisitFiltersProps) {
  const { t } = useI18n();
  const personaOptions = visitPersonas.filter(
    (item) => item.id !== 'general',
  );

  return (
    <div className={styles.controls}>
      {/* Profils de lecture. */}
      <div
        className={styles.personas}
        role="group"
        aria-label={t('visit.personasLabel')}
      >
        {personaOptions.map((item) => (
          <button
            key={item.id}
            type="button"
            className={styles.persona}
            data-active={item.id === persona}
            aria-pressed={item.id === persona}
            onClick={() => onPersonaChange(item.id)}
          >
            <Icon name={item.icon} size={13} />
            {t(item.labelKey)}
          </button>
        ))}
      </div>

      {/* Longueur du parcours. */}
      <div
        className={styles.modes}
        role="group"
        aria-label={t('visit.modeLabel')}
      >
        {(['express', 'full'] as VisitMode[]).map((value) => (
          <button
            key={value}
            type="button"
            className={styles.mode}
            data-active={value === mode}
            aria-pressed={value === mode}
            onClick={() => onModeChange(value)}
          >
            {t(`visit.modes.${value}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
