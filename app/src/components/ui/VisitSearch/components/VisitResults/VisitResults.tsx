/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import type { VisitPlan } from '@/types/visit.types';
import { VisitStep } from '../VisitStep/VisitStep';
import { VisitVerdict } from '../VisitVerdict/VisitVerdict';
import { getVisitMinutes } from '../../visitSearch.helpers';
import styles from './VisitResults.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitResultsProps = {
  plan: VisitPlan;
  hasQuery: boolean;
  showPrompt: boolean;
  onSelect: (target: string, fallback?: string) => void;
};

/* =========================================================================
  COMPOSANT : VisitResults
  Parcours proposé, verdict de correspondance et invitation à choisir.
========================================================================= */
export function VisitResults({
  plan,
  hasQuery,
  showPrompt,
  onSelect,
}: VisitResultsProps) {
  const { t } = useI18n();

  // Une demande sans contenu correspondant n'affiche aucune étape.
  const hasStops = plan.stops.length > 0;
  const itemCount = plan.stops.reduce(
    (total, stop) => total + stop.highlights.length,
    0,
  );

  return (
    <div className={styles.results}>
      {showPrompt ? (
        // Invitation à choisir un profil ou à lancer une recherche.
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Icon name="compass" size={24} />
          </span>
          <p className={styles.emptyTitle}>{t('visit.emptyTitle')}</p>
          <p className={styles.emptyHint}>{t('visit.emptyHint')}</p>
        </div>
      ) : (
        <>
          {plan.verdict ? <VisitVerdict verdict={plan.verdict} /> : null}

          {/* Demande sans aucun contenu correspondant. */}
          {hasQuery && !hasStops ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>
                <Icon name="compass" size={24} />
              </span>
              <p className={styles.emptyTitle}>
                {t('visit.noMatchTitle')}
              </p>
              <p className={styles.emptyHint}>
                {t('visit.noMatchHint')}
              </p>
            </div>
          ) : null}

          {hasStops ? (
            <>
              {/* Résumé du parcours, du volume et de la durée estimée. */}
              <div className={styles.summary} aria-live="polite">
                <strong>
                  {hasQuery ? t('visit.results') : t('visit.suggested')}
                </strong>
                <span className={styles.summaryMeta}>
                  <Icon name="clock" size={13} />
                  {t('visit.summary', {
                    count: plan.stops.length,
                    items: itemCount,
                    minutes: getVisitMinutes(plan.duration),
                  })}
                </span>
              </div>

              {/* Étapes du parcours. */}
              <ol className={styles.list}>
                {plan.stops.map((stop, index) => (
                  <li key={stop.id}>
                    <VisitStep
                      stop={stop}
                      index={index}
                      onSelect={onSelect}
                    />
                  </li>
                ))}
              </ol>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
