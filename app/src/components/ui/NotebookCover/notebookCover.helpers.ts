/* =========================================================================
  IMPORTS
========================================================================= */
import type { NotebookTask } from '@/types/project.types';

/* =========================================================================
  TYPES
========================================================================= */
export type ClusterMarkerShape = 'circle' | 'cross' | 'triangle';

export type ClusterMarkerGroup = {
  shape: ClusterMarkerShape;
  color: string;
  points: Array<{ x: number; y: number }>;
};

export type SpherePoint = {
  x: number;
  y: number;
};

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Nom de fichier affiché dans la fenêtre du notebook. */
const taskFiles: Record<NotebookTask, string> = {
  regression: 'regression.ipynb',
  classification: 'classification.ipynb',
  clustering: 'clustering.ipynb',
  anomaly: 'anomaly-detection.ipynb',
};

/** Décalages communs aux trois groupes de marqueurs. */
const markerPattern = [
  { x: -8, y: -4 },
  { x: 0, y: -8 },
  { x: 8, y: -4 },
  { x: -5, y: 5 },
  { x: 5, y: 5 },
];

/** Trois groupes de marqueurs, chacun avec sa forme et sa couleur. */
export const clusterMarkerGroups: ClusterMarkerGroup[] = [
  {
    shape: 'circle',
    color: 'var(--notebook-accent)',
    points: markerPattern.map((offset) => ({ x: 26 + offset.x, y: 20 + offset.y })),
  },
  {
    shape: 'cross',
    color: '#22d3ee',
    points: markerPattern.map((offset) => ({ x: 74 + offset.x, y: 20 + offset.y })),
  },
  {
    shape: 'triangle',
    color: '#fbbf24',
    points: markerPattern.map((offset) => ({ x: 50 + offset.x, y: 46 + offset.y })),
  },
];

/** Centre de la sphère de points de l'aperçu des anomalies. */
export const anomalySphereCenter: SpherePoint = { x: 50, y: 32 };

/** Anneaux de la sphère de points, du plus petit au plus grand. */
const anomalySphereRings = [
  { radius: 8, count: 8, offset: 0 },
  { radius: 15, count: 12, offset: Math.PI / 12 },
  { radius: 22, count: 16, offset: 0 },
];

/** Points aberrants éloignés de la sphère. */
export const anomalyOutliers: SpherePoint[] = [
  { x: 84, y: 12 },
  { x: 86, y: 46 },
  { x: 16, y: 16 },
];

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Retourne le nom de fichier associé à une tâche.
 *
 * @param task - Tâche d'apprentissage.
 * @returns Le nom de fichier affiché dans la fenêtre.
 */
export function getTaskFileName(task: NotebookTask): string {
  return taskFiles[task];
}

/**
 * Construit les points régulièrement espacés de la sphère.
 *
 * @returns Les points des trois anneaux concentriques.
 */
function buildSpherePoints(): SpherePoint[] {
  return anomalySphereRings.flatMap((ring) =>
    Array.from({ length: ring.count }, (_, index) => {
      const angle = ring.offset + (2 * Math.PI * index) / ring.count;

      return {
        x: anomalySphereCenter.x + Math.cos(angle) * ring.radius,
        y: anomalySphereCenter.y + Math.sin(angle) * ring.radius,
      };
    }),
  );
}

/** Points régulièrement espacés de la sphère d'anomalies. */
export const anomalySpherePoints = buildSpherePoints();
