/* =========================================================================
  IMPORTS
========================================================================= */
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import type { IconName } from '@/types/ui.types';
import type {
  VisitFit,
  VisitVerdict as VisitVerdictData,
} from '@/types/visit.types';
import styles from './VisitVerdict.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type VisitVerdictProps = {
  verdict: VisitVerdictData;
};

/* =========================================================================
  CONSTANTES
========================================================================= */
/** Icône associée au niveau de correspondance. */
const VERDICT_ICON: Record<VisitFit, IconName> = {
  strong: 'check',
  partial: 'info',
  weak: 'close',
};

/* =========================================================================
  COMPOSANT : VisitVerdict
  Bandeau de correspondance avec ses preuves et ses écarts.
========================================================================= */
export function VisitVerdict({ verdict }: VisitVerdictProps) {
  const { t } = useI18n();

  return (
    <section
      className={styles.verdict}
      data-fit={verdict.fit}
      aria-live="polite"
    >
      {/* Niveau de correspondance. */}
      <div className={styles.verdictHead}>
        <span className={styles.verdictIcon}>
          <Icon name={VERDICT_ICON[verdict.fit]} size={16} />
        </span>
        <p className={styles.verdictTitle}>
          {t(`visit.fit.${verdict.fit}`)}
        </p>
      </div>

      {/* Preuves relevées dans le profil. */}
      {verdict.evidence.length > 0 ? (
        <div className={styles.verdictGroup}>
          <span className={styles.verdictLabel}>
            {t('visit.fit.evidence')}
          </span>
          <ul className={styles.verdictTags}>
            {verdict.evidence.map((item) => (
              <li key={item} className={styles.verdictTag}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Écarts entre l'offre et le profil. */}
      {verdict.gaps.length > 0 ? (
        <div className={styles.verdictGroup}>
          <span className={styles.verdictLabel}>
            {t('visit.fit.gaps')}
          </span>
          <ul className={styles.verdictTags}>
            {verdict.gaps.map((gap) => (
              <li
                key={gap.key + (gap.params?.term ?? '')}
                className={styles.verdictTag}
                data-tone="gap"
              >
                {t(gap.key, gap.params)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
