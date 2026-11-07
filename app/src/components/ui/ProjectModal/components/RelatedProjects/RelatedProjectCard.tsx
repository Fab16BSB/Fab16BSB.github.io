/* =========================================================================
  IMPORTS
========================================================================= */
import { useI18n } from '@/i18n/useI18n';
import type { KnowledgeRelatedProject } from '@/types/knowledge.types';
import type { Project } from '@/types/project.types';
import styles from './RelatedProjects.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type RelatedProjectCardProps = {
  recommendation: KnowledgeRelatedProject;
  onOpen: (project: Project) => void;
};

/* =========================================================================
  COMPOSANT : RelatedProjectCard
  Carte cliquable d'un projet recommandé.
  Ouvre le projet dans la même modale et affiche les critères qui le
  rapprochent du projet courant.
========================================================================= */
export function RelatedProjectCard({ recommendation, onOpen }: RelatedProjectCardProps) {
  const { t, loc } = useI18n();
  const { project } = recommendation;

  // Score arrondi pour l'affichage compact à droite de la barre.
  const percent = Math.round(recommendation.score * 100);

  return (
    <button
      type="button"
      className={styles.card}
      onClick={() => onOpen(project)}
      aria-label={t('projects.related.open', { title: loc(project.title) })}
    >
      {/* Titre et métadonnées du projet recommandé. */}
      <span className={styles.name}>{loc(project.title)}</span>

      <span className={styles.meta}>
        {project.year} · {t(`projects.filters.${project.category}`)}
      </span>

      {/* Critères partagés : thème d'abord, technologies ensuite. */}
      <span className={styles.reasons}>
        {recommendation.themeLabels.length > 0 && (
          <span className={styles.why}>
            <span className={styles.criterion}>{t('projects.related.theme')}</span>
            <span className={styles.values}>
              {recommendation.themeLabels.map(loc).join(' · ')}
            </span>
          </span>
        )}
        {recommendation.termLabels.length > 0 && (
          <span className={styles.why}>
            <span className={styles.criterion}>{t('projects.related.tech')}</span>
            <span className={styles.values}>
              {recommendation.termLabels.join(' · ')}
            </span>
          </span>
        )}
      </span>

      {/* Score de proximité et barre de progression. */}
      <span className={styles.score}>
        <span className={styles.bar} aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </span>
        <span className={styles.percent}>{percent}%</span>
      </span>
    </button>
  );
}
