/* =========================================================================
  TYPES
========================================================================= */
type ClassificationChartProps = {
  id: string;
};

/* =========================================================================
  COMPOSANT : ClassificationChart
  Aperçu d'une frontière de classification.
========================================================================= */
export function ClassificationChart({ id }: ClassificationChartProps) {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-preview-class`} cx="28%" cy="74%" r="78%">
          <stop offset="0%" style={{ stopColor: 'var(--notebook-accent)', stopOpacity: 0.32 }} />
          <stop offset="100%" style={{ stopColor: 'var(--notebook-accent)', stopOpacity: 0 }} />
        </radialGradient>
        <radialGradient id={`${id}-preview-class-soft`} cx="76%" cy="24%" r="74%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 0.14 }} />
          <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Deux champs diffus, sans séparation rectiligne. */}
      <rect x="8" y="6" width="84" height="52" rx="3" fill={`url(#${id}-preview-class-soft)`} />
      <rect x="8" y="6" width="84" height="52" rx="3" fill={`url(#${id}-preview-class)`} />

      {/* Frontière courbe, volontairement diagonale. */}
      <path
        d="M10 16 C 30 26, 46 28, 60 38 S 80 46, 92 52"
        fill="none"
        stroke="rgba(255, 255, 255, 0.6)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Classes entremêlées autour de la frontière. */}
      <g fill="var(--notebook-accent)">
        <circle cx="18" cy="34" r="1.7" />
        <circle cx="28" cy="48" r="1.7" />
        <circle cx="38" cy="40" r="1.7" />
        <circle cx="48" cy="54" r="1.7" />
        <circle cx="58" cy="30" r="1.7" />
        <circle cx="66" cy="50" r="1.7" />
        <circle cx="78" cy="42" r="1.7" />
      </g>
      <g fill="rgba(255, 255, 255, 0.85)">
        <circle cx="20" cy="14" r="1.7" />
        <circle cx="32" cy="20" r="1.7" />
        <circle cx="44" cy="14" r="1.7" />
        <circle cx="54" cy="24" r="1.7" />
        <circle cx="64" cy="16" r="1.7" />
        <circle cx="74" cy="28" r="1.7" />
        <circle cx="86" cy="22" r="1.7" />
      </g>
    </>
  );
}
