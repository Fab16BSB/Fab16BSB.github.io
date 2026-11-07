/* =========================================================================
  IMPORTS
========================================================================= */
import { useId } from 'react';
import type { ReactNode } from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { KnowledgeContentKind } from '@/types/knowledge.types';
import { RelatedContentItem } from './RelatedContentItem';
import { useRelatedContent } from './useRelatedContent';
import styles from './RelatedContent.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type RelatedContentProps = {
  nodeId: string;
  limit?: number;
  minScore?: number;
  kinds?: KnowledgeContentKind[];
  excludeKinds?: KnowledgeContentKind[];
  titleKey?: string;
  subtitleKey?: string;
  embedded?: boolean;
  showHeader?: boolean;
  emptyState?: ReactNode;
  onOpenProject?: (projectId: string) => void;
  onNavigate?: (href: string) => void;
  className?: string;
};

/* =========================================================================
  COMPOSANT : RelatedContent
  Liste de contenus proches d'un nœud du graphe de connaissances.
========================================================================= */
export function RelatedContent({
  nodeId,
  limit = 4,
  minScore,
  kinds,
  excludeKinds,
  titleKey = 'knowledge.related.title',
  subtitleKey = 'knowledge.related.subtitle',
  embedded = false,
  showHeader = true,
  emptyState,
  onOpenProject,
  onNavigate,
  className,
}: RelatedContentProps) {
  const { t } = useI18n();
  const titleId = useId();
  const { items } = useRelatedContent(nodeId, { limit, minScore, kinds, excludeKinds });

  // État de repli uniquement quand le parent fournit un contenu dédié.
  const empty = items.length === 0 && Boolean(emptyState);
  let result: ReactNode = null;

  if (items.length > 0 || empty) {
    result = (
      <section
        className={[
          styles.section,
          embedded ? styles.embedded : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-labelledby={showHeader ? titleId : undefined}
      >
        {/* En-tête optionnel. */}
        {showHeader && (
          <div className={styles.header}>
            <h4 className={styles.title} id={titleId}>
              {t(titleKey)}
            </h4>
            {subtitleKey && <p className={styles.subtitle}>{t(subtitleKey)}</p>}
          </div>
        )}

        {/* Cartes des contenus recommandés, ou état vide fourni par le parent. */}
        {items.length > 0 ? (
          <div className={styles.grid}>
            {items.map((item) => (
              <RelatedContentItem
                key={item.node.id}
                item={item}
                onOpenProject={onOpenProject}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          emptyState
        )}
      </section>
    );
  }

  return result;
}
