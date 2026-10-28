/* =========================================================================
  IMPORTS
========================================================================= */
import { useId } from 'react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/i18n/useI18n';
import type { Project, ProjectLinkKey } from '@/types/project.types';
import { Icon } from '@/components/ui/Icon/Icon';
import type { IconName } from '@/types/ui.types';
import { useProjectModal } from './useProjectModal';
import styles from './ProjectModal.module.css';

/* =========================================================================
  CONSTANTES
========================================================================= */
const linkIcons: Record<ProjectLinkKey, IconName> = {
  github: 'github',
  demo: 'external',
  video: 'play',
  site: 'external',
  pdf: 'download',
};

const linkOrder: ProjectLinkKey[] = ['github', 'demo', 'video', 'site', 'pdf'];

/* =========================================================================
  TYPES & INTERFACES
========================================================================= */
type ProjectModalProps = {
  project: Project;
  onClose: () => void;
};

/* =========================================================================
  COMPOSANT : ProjectModal
  Modale de détail d'un projet.
========================================================================= */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t, loc } = useI18n();
  const titleId = useId();
  const { dialogRef, scrollRef, thumbRef } = useProjectModal(onClose);

  const links = linkOrder
    .map((key) => ({ key, url: project.links[key] }))
    .filter((link): link is { key: ProjectLinkKey; url: string } => Boolean(link.url));
  const hasLinks = links.length > 0 || Boolean(project.extraLinks?.length);

  return createPortal(
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={dialogRef}
      >
        {/* Zone de défilement du contenu. */}
        <div className={styles.scroll} ref={scrollRef} tabIndex={-1}>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={t('accessibility.closeDialog')}
          >
            {/* Fermeture de la modale. */}
            <Icon name="close" size={19} />
          </button>

          <div
            className={[styles.cover, project.image ? styles.coverWithImage : '']
              .filter(Boolean)
              .join(' ')}
            aria-hidden="true"
          >
            {/* Visuel ou motif de remplacement. */}
            {project.image ? (
              <img className={styles.coverImage} src={project.image} alt="" />
            ) : (
              <>
                <span className={styles.grid} />
                <span className={styles.glyph}>{project.icon}</span>
              </>
            )}
          </div>

          {/* Contenu du projet. */}
          <div className={styles.content}>

            {/* Année, catégorie et niveau. */}
            <div className={styles.meta}>
              <span>{project.year}</span>
              <span>·</span>
              <span>{t(`projects.filters.${project.category}`)}</span>
              {project.studyLevel && (
                <span className={styles.studyLevel}>
                  {t(`projects.levels.${project.studyLevel}`)}
                </span>
              )}
            </div>

            <h3 id={titleId} className={styles.title}>
              {loc(project.title)}
            </h3>
            <p className={styles.description}>{loc(project.description)}</p>
            <p className={styles.details}>{loc(project.details)}</p>

            {/* Points clés du projet. */}
            {project.highlights && project.highlights.length > 0 && (
              <ul className={styles.highlights}>
                {project.highlights.map((highlight) => (
                  <li key={loc(highlight)}>{loc(highlight)}</li>
                ))}
              </ul>
            )}

            {/* Technologies utilisées. */}
            <div className={styles.stack}>
              {project.stack.map((item) => (
                <span className="tag" key={item}>
                  {item}
                </span>
              ))}
            </div>

            {/* Captures détaillées du projet. */}
            {project.gallery && project.gallery.length > 0 && (
              <div className={styles.galleryBlock}>
                <h4 className={styles.galleryTitle}>{t('projects.gallery')}</h4>
                <div className={styles.gallery}>
                  {project.gallery.map((item) => (
                    <figure className={styles.figure} key={item.src}>
                      <a
                        className={styles.figureLink}
                        href={item.src}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={item.src} alt={loc(item.caption)} loading="lazy" />
                      </a>
                      <figcaption>{loc(item.caption)}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {hasLinks && (
              // Liens externes du projet.
              <div className={styles.links}>
                {links.map(({ key, url }) => (
                  <a
                    key={key}
                    className="button button--ghost button--small"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={linkIcons[key]} size={15} />
                    {t(`projects.links.${key}`)}
                  </a>
                ))}
                {project.extraLinks?.map((link) => (
                  <a
                    key={link.url}
                    className="button button--ghost button--small"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={link.icon ?? 'github'} size={15} />
                    {loc(link.label)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Curseur de défilement. */}
        <span className={styles.scrollbar} aria-hidden="true">
          <span className={styles.thumb} ref={thumbRef} />
        </span>
      </div>
    </div>,
    document.body,
  );
}
