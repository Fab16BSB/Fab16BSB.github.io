/* =========================================================================
  IMPORTS
========================================================================= */
import { useId } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { Icon } from '@/components/ui/Icon/Icon';
import styles from '../Teaching.module.css';

/* =========================================================================
  CONSTANTES
========================================================================= */
const distributionCodes = ['CM', 'TD', 'TP', 'SAE', 'CS'] as const;

/* =========================================================================
  COMPOSANT : DistributionHelp
  Légende des codes de répartition horaire.
========================================================================= */
export function DistributionHelp() {
  const { t } = useI18n();
  const tooltipId = useId();

  return (
    <span className={styles.help}>

      {/* Bouton d'aide accessible. */}
      <button
        type="button"
        className={styles.helpButton}
        aria-label={t('teaching.distributionHelp.title')}
        aria-describedby={tooltipId}
      >
        <Icon name="info" size={17} />
      </button>

      {/* Légende affichée au survol ou au focus. */}
      <span className={styles.tooltip} id={tooltipId} role="tooltip">
        <span className={styles.tooltipTitle}>{t('teaching.distributionHelp.title')}</span>
        {distributionCodes.map((code) => (
          <span className={styles.tooltipRow} key={code}>
            <span className={styles.tooltipCode} data-type={code}>
              {code}
            </span>
            <span>{t(`teaching.distributionHelp.${code}`)}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
