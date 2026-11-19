/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import { formatTenureCompact } from '@/lib/tenure-format';
import type { VisitStop } from '@/types/visit.types';
import { splitVisitDuration } from '../../visitSearch.helpers';
import styles from './VisitStep.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitStepProps = {
  stop: VisitStop;
  index: number;
  onSelect: (target: string, fallback?: string) => void;
};

/* =========================================================================
  COMPOSANT : VisitStep
  Étape du parcours, avec ses contenus cliquables.
========================================================================= */
export function VisitStep({ stop, index, onSelect }: VisitStepProps) {
  const { t } = useI18n();
  const duration = splitVisitDuration(stop.duration);
  const durationLabel =
    duration.minutes > 0
      ? duration.seconds > 0
        ? t('visit.durationMixed', {
            minutes: duration.minutes,
            seconds: duration.seconds,
          })
        : t('visit.durationMinutes', { minutes: duration.minutes })
      : t('visit.duration', { seconds: duration.seconds });

  return (
    <article className={styles.step}>
      {/* En-tête de l'étape : numéro, section, durée et ouverture. */}
      <div className={styles.stepTop}>
        <span
          className={styles.stepIndex}
          data-first={index === 0}
          aria-hidden="true"
        >
          {index + 1}
        </span>

        <button
          type="button"
          className={styles.stepHeader}
          onClick={() => onSelect(stop.anchor)}
          title={t('visit.openSection')}
        >
          <span className={styles.stepMain}>
            <span className={styles.stepTitleRow}>
              <Icon name={stop.icon} size={15} className={styles.stepIcon} />
              <span className={styles.stepLabel}>{t(stop.labelKey)}</span>

              {/* Nombre d'éléments listés, hors étape de présentation. */}
              {stop.id !== 'about' && stop.highlights.length > 0 ? (
                <span className={styles.stepCount}>
                  <span className="sr-only">
                    {t('visit.itemCount', {
                      count: stop.highlights.length,
                    })}
                  </span>
                  <span aria-hidden="true">{stop.highlights.length}</span>
                </span>
              ) : null}

              <span className={styles.stepDuration}>
                <Icon name="clock" size={12} />
                {durationLabel}
              </span>
            </span>

            <span className={styles.stepDescription}>{stop.description}</span>

            {stop.isComplement ? (
              <span className={styles.complement}>
                {t('visit.complement')}
              </span>
            ) : null}
          </span>

          <Icon
            name="arrow-right"
            size={16}
            className={styles.stepArrow}
          />
        </button>
      </div>

      {stop.highlights.length > 0 ? (
        // Éléments concrets à regarder, cliquables s'ils ciblent un contenu.
        <span className={styles.highlights}>
          {stop.highlights.map((highlight) => {
            // Contenu commun aux éléments cliquables et aux simples repères.
            const content = (
              <>
                <span className={styles.highlightDot} aria-hidden="true" />
                <span className={styles.highlightText}>
                  <span className={styles.highlightLabel}>
                    {highlight.label}
                  </span>
                  {/* Ancienneté prioritaire, sinon précision libre. */}
                  {highlight.tenure ? (
                    <span className={styles.highlightDetailTenure}>
                      {formatTenureCompact(highlight.tenure, t)}
                    </span>
                  ) : highlight.detail ? (
                    <span className={styles.highlightDetail}>
                      {highlight.detail}
                    </span>
                  ) : null}
                </span>
                {highlight.target ? (
                  <Icon
                    name="chevron-right"
                    size={12}
                    className={styles.highlightArrow}
                  />
                ) : null}
              </>
            );

            return highlight.target ? (
              // Contenu ciblé : ouvre l'élément dans sa section.
              <button
                key={`${highlight.label}-${highlight.target}`}
                type="button"
                className={styles.highlightButton}
                onClick={() => onSelect(highlight.target!, stop.anchor)}
                title={t('visit.openItem', { name: highlight.label })}
              >
                {content}
              </button>
            ) : (
              // Simple repère, sans navigation.
              <span
                key={`${highlight.label}-${highlight.detail ?? ''}`}
                className={styles.highlight}
              >
                {content}
              </span>
            );
          })}
        </span>
      ) : null}
    </article>
  );
}
