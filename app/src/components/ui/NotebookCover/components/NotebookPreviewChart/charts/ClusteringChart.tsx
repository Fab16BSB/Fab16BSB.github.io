/* =========================================================================
  IMPORTS
========================================================================= */
import { clusterMarkerGroups } from '../../../notebookCover.helpers';

/* =========================================================================
  COMPOSANT : ClusteringChart
  Aperçu de trois groupes de marqueurs.
========================================================================= */
export function ClusteringChart() {
  return (
    <>
      {clusterMarkerGroups.map((group) => (
        <g key={group.shape}>
          {group.points.map((point) => {
            const key = `${group.shape}-${point.x}-${point.y}`;

            if (group.shape === 'circle') {
              return <circle key={key} cx={point.x} cy={point.y} r="2" fill={group.color} />;
            }

            if (group.shape === 'cross') {
              return (
                <g
                  key={key}
                  stroke={group.color}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                >
                  <line x1={point.x - 2.6} y1={point.y} x2={point.x + 2.6} y2={point.y} />
                  <line x1={point.x} y1={point.y - 2.6} x2={point.x} y2={point.y + 2.6} />
                </g>
              );
            }

            return (
              <polygon
                key={key}
                points={`${point.x},${point.y - 2.6} ${point.x + 2.4},${point.y + 2} ${point.x - 2.4},${point.y + 2}`}
                fill={group.color}
              />
            );
          })}
        </g>
      ))}
    </>
  );
}
