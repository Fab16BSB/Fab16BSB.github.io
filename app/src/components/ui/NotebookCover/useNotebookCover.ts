/* =========================================================================
  IMPORTS
========================================================================= */
import { useId } from 'react';
import type { CSSProperties } from 'react';
import { useI18n } from '@/i18n/useI18n';
import type { Accent } from '@/types/common.types';
import type { NotebookTask } from '@/types/project.types';
import { getTaskFileName } from './notebookCover.helpers';

/* =========================================================================
  HOOK : useNotebookCover
  Prépare l'identifiant SVG, le style d'accent et les libellés de la couverture.
========================================================================= */
export function useNotebookCover(task: NotebookTask, accent: Accent) {
  const { t } = useI18n();

  // Préfixe unique des dégradés SVG de cette couverture.
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9_-]/g, '');

  // Couleur d'accent exposée aux styles de la couverture.
  const accentStyle = { '--notebook-accent': `var(--color-${accent})` } as CSSProperties;

  return {
    id,
    accentStyle,
    fileName: getTaskFileName(task),
    taskLabel: t(`projects.notebookTasks.${task}`),
    datasetLabel: t('projects.notebookDataset'),
  };
}
