/* =========================================================================
  IMPORTS
========================================================================= */
import { useId } from 'react';
import { Icon } from '@/components/ui/Icon/Icon';
import { useI18n } from '@/i18n/useI18n';
import type { Project } from '@/types/project.types';
import { RelatedProjectCard } from './RelatedProjectCard';
import { useRelatedProjects } from './useRelatedProjects';
import styles from './RelatedProjects.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type RelatedProjectsProps = {
  projectId: string;
  onOpenProject: (project: Project) => void;
};

/* =========================================================================
  COMPOSANT : RelatedProjects
  Bloc « Voir aussi » de la modale de projet.

  Affiche les projets proches d'un projet, issus du graphe de connaissances.
  La section disparaît complètement lorsqu'aucune recommandation ne dépasse
  le seuil de pertinence.
========================================================================= */
export function RelatedProjects({ projectId, onOpenProject }: RelatedProjectsProps) {
  const { t } = useI18n();

  // Identifiant stable pour relier le titre de section à son contenu.
  const titleId = useId();

  // Recommandations calculées par le hook, une seule fois par projet.
  const recommendations = useRelatedProjects(projectId);

  // Aucun projet pertinent : le bloc reste visible avec un message explicite.
  if (recommendations.length === 0) {
    return (
      <section className={styles.section} aria-labelledby={titleId}>
        <div className={styles.header}>
          <h4 className={styles.title} id={titleId}>
            {t('projects.related.title')}
          </h4>
          <p className={styles.subtitle}>{t('projects.related.subtitle')}</p>
        </div>
        <div className={styles.empty}>
          <span className={styles.emptyIcon} aria-hidden="true">
            <Icon name="layers" size={18} />
          </span>
          <div className={styles.emptyBody}>
            <p className={styles.emptyTitle}>{t('projects.related.emptyTitle')}</p>
            <p className={styles.emptyText}>{t('projects.related.empty')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-labelledby={titleId}>

      {/* En-tête du bloc et rappel du critère commun. */}
      <div className={styles.header}>
        <h4 className={styles.title} id={titleId}>
          {t('projects.related.title')}
        </h4>
        <p className={styles.subtitle}>{t('projects.related.subtitle')}</p>
      </div>

      {/* Une carte par projet, alignées sur la même grille. */}
      <div className={styles.grid}>
        {recommendations.map((recommendation) => (
          <RelatedProjectCard
            key={recommendation.project.id}
            recommendation={recommendation}
            onOpen={onOpenProject}
          />
        ))}
      </div>
    </section>
  );
}
