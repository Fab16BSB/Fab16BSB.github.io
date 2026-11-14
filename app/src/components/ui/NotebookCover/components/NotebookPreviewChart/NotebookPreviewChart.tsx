/* =========================================================================
  IMPORTS
========================================================================= */
import type { NotebookTask } from '@/types/project.types';
import { AnomalyChart } from './charts/AnomalyChart';
import { ClassificationChart } from './charts/ClassificationChart';
import { ClusteringChart } from './charts/ClusteringChart';
import { RegressionChart } from './charts/RegressionChart';

/* =========================================================================
  TYPES
========================================================================= */
type NotebookPreviewChartProps = {
  task: NotebookTask;
  id: string;
};

/* =========================================================================
  COMPOSANT : NotebookPreviewChart
  Mini graphique affiché dans la fenêtre du notebook.
========================================================================= */
export function NotebookPreviewChart({ task, id }: NotebookPreviewChartProps) {
  return (
    <svg viewBox="0 0 100 64" role="presentation" focusable="false">
      {task === 'anomaly' && <AnomalyChart />}
      {task === 'classification' && <ClassificationChart id={id} />}
      {task === 'clustering' && <ClusteringChart />}
      {task === 'regression' && <RegressionChart id={id} />}
    </svg>
  );
}
