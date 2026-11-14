/* =========================================================================
  IMPORTS
========================================================================= */
import type { Accent } from '@/types/common.types';
import type { NotebookTask } from '@/types/project.types';
import { NotebookPreviewChart } from './components/NotebookPreviewChart/NotebookPreviewChart';
import { useNotebookCover } from './useNotebookCover';
import styles from './NotebookCover.module.css';

/* =========================================================================
  TYPES
========================================================================= */
type NotebookCoverProps = {
  dataset: string;
  task: NotebookTask;
  accent: Accent;
};

/* =========================================================================
  COMPOSANT : NotebookCover
  Couverture de notebook : aurora, fenêtre de notebook et tâche.
========================================================================= */
export function NotebookCover({ dataset, task, accent }: NotebookCoverProps) {
  const { id, accentStyle, fileName, taskLabel, datasetLabel } = useNotebookCover(
    task,
    accent,
  );

  return (
    <span
      className={styles.root}
      style={accentStyle}
      data-notebook-part="cover"
      aria-hidden="true"
    >
      {/* Halos animés en arrière-plan. */}
      <span className={styles.aurora}>
        <span className={styles.blobAccent} />
        <span className={styles.blobLight} />
        <span className={styles.blobDeep} />
      </span>

      {/* Halo circulaire derrière la fenêtre. */}
      <span className={styles.halo} data-notebook-part="halo" />

      {/* Fenêtre d'aperçu du notebook. */}
      <span className={styles.preview} data-notebook-part="preview">
        <span className={styles.previewBar}>
          <span className={styles.windowDots}>
            <span />
            <span />
            <span />
          </span>
          <span className={styles.previewTitle}>{fileName}</span>
        </span>

        <span className={styles.previewBody}>

          {/* Lignes de code stylisées. */}
          <span className={styles.codeLines}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>

          {/* Mini graphique de la tâche. */}
          <span className={styles.previewChart}>
            <NotebookPreviewChart task={task} id={id} />
          </span>
        </span>
      </span>

      {/* Balayage lumineux au survol. */}
      <span className={styles.shine} data-notebook-part="shine" />

      {/* Voile pour garder le texte lisible. */}
      <span className={styles.scrim} />

      {/* Tâche d'apprentissage. */}
      <span className={styles.task}>{taskLabel}</span>

      {/* Jeu de données. */}
      <span className={styles.info}>
        <span className={styles.eyebrow}>{datasetLabel}</span>
        <span className={styles.dataset}>{dataset}</span>
      </span>
    </span>
  );
}
