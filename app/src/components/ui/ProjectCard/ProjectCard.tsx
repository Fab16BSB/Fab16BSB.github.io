/* =========================================================================
  IMPORTS
========================================================================= */
import type { CSSProperties } from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { Project } from '@/types/project.types';
import { Icon } from '@/components/ui/Icon/Icon';
import styles from './ProjectCard.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type ProjectCardProps = {
  project: Project;
  onOpen: (project: Project) => void;
};

/* =========================================================================
  COMPOSANT : ProjectCard
  Carte de projet.
========================================================================= */
export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { t, loc } = useI18n();
  const accentStyle = { '--project-accent': `var(--color-${project.accent})` } as CSSProperties;

  return (
    <button
      type="button"
      className={styles.card}
      style={accentStyle}
      onClick={() => onOpen(project)}
      data-reveal
    >
      <span
        className={[styles.cover, project.image ? styles.coverWithImage : '']
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      >
        {/* Visuel ou motif de remplacement. */}
        {project.image ? (
          <img className={styles.coverImage} src={project.image} alt="" loading="lazy" />
        ) : (
          <>
            <span className={styles.grid} />
            <span className={styles.glyph}>{project.icon}</span>
          </>
        )}
      </span>

      <span className={styles.body}>

        {/* Année, catégorie et niveau d'études. */}
        <span className={styles.meta}>
          <span>{project.year}</span>
          <span className={styles.dot} aria-hidden="true" />
          <span>{t(`projects.filters.${project.category}`)}</span>
          {project.studyLevel && (
            <>
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.studyLevel}>
                {t(`projects.levels.${project.studyLevel}`)}
              </span>
            </>
          )}
        </span>

        <span className={styles.title}>{loc(project.title)}</span>

        <span className={styles.description}>{loc(project.description)}</span>

        {/* Technologies principales, limitées à quatre. */}
        <span className={styles.stack}>
          {project.stack.slice(0, 4).map((item) => (
            <span className="tag" key={item}>
              {item}
            </span>
          ))}
          {project.stack.length > 4 && <span className="tag">+{project.stack.length - 4}</span>}
        </span>

        <span className={styles.footer}>
          {/* Ouvre la modale de détail. */}
          <span>{t('projects.details')}</span>
          <Icon name="arrow-up-right" size={17} />
        </span>
      </span>
    </button>
  );
}
