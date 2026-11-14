/* =========================================================================
  IMPORTS
========================================================================= */
import {
  anomalyOutliers,
  anomalySphereCenter,
  anomalySpherePoints,
} from '../../../notebookCover.helpers';

/* =========================================================================
  COMPOSANT : AnomalyChart
  Aperçu d'une sphère de points avec des anomalies isolées.
========================================================================= */
export function AnomalyChart() {
  return (
    <>
      {/* Sphère complète de points, sans contour. */}
      <g fill="rgba(255, 255, 255, 0.68)">
        {anomalySpherePoints.map((point) => (
          <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="1.15" />
        ))}
      </g>

      {/* Centre de la sphère, au même format que les autres points. */}
      <circle
        cx={anomalySphereCenter.x}
        cy={anomalySphereCenter.y}
        r="1.15"
        fill="rgba(255, 255, 255, 0.68)"
      />

      {/* Points aberrants éloignés. */}
      {anomalyOutliers.map((outlier) => (
        <g key={`${outlier.x}-${outlier.y}`}>
          <circle
            cx={outlier.x}
            cy={outlier.y}
            r="6"
            fill="var(--notebook-accent)"
            opacity="0.16"
          />
          <circle
            cx={outlier.x}
            cy={outlier.y}
            r="3.4"
            fill="none"
            stroke="var(--notebook-accent)"
            strokeWidth="1"
            opacity="0.9"
          />
          <circle cx={outlier.x} cy={outlier.y} r="1.4" fill="var(--notebook-accent)" />
        </g>
      ))}
    </>
  );
}
