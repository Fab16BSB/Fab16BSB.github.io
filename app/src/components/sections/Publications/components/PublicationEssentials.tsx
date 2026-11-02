/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import type { Locale } from '@/types/common.types';
import type { PublicationPoints } from '@/types/publication.types';
import { usePublicationEssentials } from './usePublicationEssentials';
import styles from '../Publications.module.css';

/* =========================================================================
  CONSTANTES
========================================================================= */
const pointKeys = ['context', 'problem', 'solution'] as const;

/* =========================================================================
  INTERFACE
========================================================================= */
type PublicationEssentialsProps = {
  id: string;
  locale: Locale;
  points: PublicationPoints;
  keywords: string[];
  abstract: string;
  rights?: string;
};

/* =========================================================================
  COMPOSANT : PublicationEssentials
  Encart « L'essentiel » / « Abstract » d'une publication scientifique.
========================================================================= */
export function PublicationEssentials({
  id,
  locale,
  points,
  keywords,
  abstract,
  rights,
}: PublicationEssentialsProps) {
  const { tFor } = useI18n();
  const { activeTab, tabs, select, onKeyDown, tabRefs, tabId, panelId } = usePublicationEssentials(
    id,
    locale,
  );

  return (
    <div className={styles.summary}>
      <div
        className={styles.panelTabs}
        role="tablist"
        aria-label={tFor(locale, 'publications.panel')}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[tab.id] = element;
            }}
            type="button"
            role="tab"
            id={tabId(tab.id)}
            aria-selected={activeTab === tab.id}
            aria-controls={panelId(tab.id)}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={[styles.panelTab, activeTab === tab.id ? styles.panelTabActive : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => select(tab.id)}
            onKeyDown={onKeyDown}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Points accessibles. */}
      <div
        className={styles.panelBody}
        role="tabpanel"
        id={panelId('essentials')}
        aria-labelledby={tabId('essentials')}
        hidden={activeTab !== 'essentials'}
        tabIndex={0}
      >
        <ul className={styles.summaryList}>
          {pointKeys.map((key) => (
            <li key={key}>
              <strong className={styles.summaryTerm}>
                {tFor(locale, `publications.points.${key}`)}
              </strong>{' '}
              {points[key]}
            </li>
          ))}
        </ul>
      </div>

      {/* Abstract original de la version affichée. */}
      <div
        className={styles.panelBody}
        role="tabpanel"
        id={panelId('abstract')}
        aria-labelledby={tabId('abstract')}
        hidden={activeTab !== 'abstract'}
        tabIndex={0}
      >
        <p className={styles.abstract}>{abstract}</p>
        {rights && <p className={styles.abstractCredit}>{rights}</p>}
      </div>

      {/* Mots-clés, communs aux deux onglets. */}
      <div className={styles.keywords}>
        <span className={styles.keywordsLabel}>{tFor(locale, 'publications.keywords')}</span>
        <ul className={styles.keywordsList} role="list">
          {keywords.map((keyword) => (
            <li key={keyword}>{keyword}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
