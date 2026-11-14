/* =========================================================================
  TYPES
========================================================================= */
type RegressionChartProps = {
  id: string;
};

/* =========================================================================
  COMPOSANT : RegressionChart
  Aperçu d'une régression linéaire.
========================================================================= */
export function RegressionChart({ id }: RegressionChartProps) {
  return (
    <>
      <defs>
        <linearGradient id={`${id}-preview-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: 'var(--notebook-accent)', stopOpacity: 0.34 }} />
          <stop offset="100%" style={{ stopColor: 'var(--notebook-accent)', stopOpacity: 0 }} />
        </linearGradient>
        <linearGradient id={`${id}-preview-line`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" style={{ stopColor: 'var(--notebook-accent)' }} />
          <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.92 }} />
        </linearGradient>
      </defs>

      {/* Axes. */}
      <g stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.8">
        <line x1="8" y1="5" x2="8" y2="58" />
        <line x1="8" y1="58" x2="95" y2="58" />
      </g>

      {/* Aire et tendance. */}
      <path d="M10 52 L93 12 L93 58 L10 58 Z" fill={`url(#${id}-preview-area)`} />
      <path
        d="M10 52 C 32 45, 50 33, 68 22 S 87 14, 93 12"
        fill="none"
        stroke={`url(#${id}-preview-line)`}
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Points. */}
      <g fill="rgba(255, 255, 255, 0.9)">
        <circle cx="22" cy="46" r="1.7" />
        <circle cx="42" cy="37" r="1.7" />
        <circle cx="62" cy="26" r="1.7" />
        <circle cx="84" cy="16" r="1.7" />
      </g>
    </>
  );
}
