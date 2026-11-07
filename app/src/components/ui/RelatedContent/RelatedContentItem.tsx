/* =========================================================================
  IMPORTS
========================================================================= */
import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import type { KnowledgeRelatedContent } from '@/types/knowledge.types';
import { kindIcon, relatedHref } from './relatedContent.helpers';
import styles from './RelatedContent.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type RelatedContentItemProps = {
  item: KnowledgeRelatedContent;
  onOpenProject?: (projectId: string) => void;
  onNavigate?: (href: string) => void;
};

/* =========================================================================
  COMPOSANT : RelatedContentItem
  Carte d'un contenu recommandé.
========================================================================= */
export function RelatedContentItem({
  item,
  onOpenProject,
  onNavigate,
}: RelatedContentItemProps) {
  const { t, loc } = useI18n();
  const { node, recommendation, themeLabels, termLabels } = item;
  const href = relatedHref(node);
  const percent = Math.round(recommendation.score * 100);
  const kindLabel = t(`knowledge.kinds.${node.kind}`);
  const className = styles.card;
  let control: ReactNode;

  const content = (
    <>
      {/* Nature du contenu, titre et année. */}
      <span className={styles.kind}>
        <Icon name={kindIcon(node.kind)} size={13} />
        <span>{kindLabel}</span>
      </span>
      <span className={styles.name}>{loc(node.label)}</span>
      {node.year && <span className={styles.meta}>{node.year}</span>}

      {/* Raisons de la recommandation. */}
      <span className={styles.reasons}>
        {recommendation.context ? (
          <span className={styles.why}>
            <span className={styles.criterion}>{t('knowledge.related.context')}</span>
            <span className={styles.values}>{kindLabel}</span>
          </span>
        ) : (
          <>
            {themeLabels.length > 0 && (
              <span className={styles.why}>
                <span className={styles.criterion}>{t('projects.related.theme')}</span>
                <span className={styles.values}>{themeLabels.map(loc).join(' · ')}</span>
              </span>
            )}
            {termLabels.length > 0 && (
              <span className={styles.why}>
                <span className={styles.criterion}>{t('projects.related.tech')}</span>
                <span className={styles.values}>{termLabels.map(loc).join(' · ')}</span>
              </span>
            )}
            {themeLabels.length === 0 && termLabels.length === 0 && (
              <span className={styles.why}>
                <span className={styles.criterion}>
                  {t('knowledge.related.semantic')}
                </span>
              </span>
            )}
          </>
        )}
      </span>

      {/* Score de pertinence et barre visuelle. */}
      <span className={styles.score}>
        <span className={styles.bar} aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </span>
        <span className={styles.percent}>{percent}%</span>
      </span>
    </>
  );

  // Un projet ouvre sa modale quand le parent le permet.
  if (node.kind === 'project' && onOpenProject) {
    control = (
      <button
        type="button"
        className={className}
        onClick={() => onOpenProject(node.sourceId)}
        aria-label={t('projects.related.open', { title: loc(node.label) })}
      >
        {content}
      </button>
    );
  } else {
    control = (
      <a
        className={className}
        href={href}
        onClick={(event) => {
          if (onNavigate) {
            event.preventDefault();
            onNavigate(href);
          }
        }}
      >
        {content}
      </a>
    );
  }

  return control;
}
