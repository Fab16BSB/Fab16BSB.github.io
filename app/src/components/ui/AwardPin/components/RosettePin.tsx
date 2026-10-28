/* =========================================================================
  IMPORTS
========================================================================= */
import type { PinShapeProps } from '../awardPin.helpers';

/* =========================================================================
  COMPOSANT : RosettePin
  Rosette : rubans, pourtour plissé et éclat central.
========================================================================= */
export function RosettePin({ gradient, palette }: PinShapeProps) {
  return (
    <>
      {/* Rubans qui pendent sous la rosette. */}
      <path d="M50 96 34 128l14-4 6 14 10-42Z" fill={palette.ribbon} opacity="0.92" />
      <path d="M70 96 86 128l-14-4-6 14-10-42Z" fill={palette.ribbon2} opacity="0.92" />

      {/* Pourtour plissé de la cocarde. */}
      <path
        d="M60 22 68.8 31.16 81 27.63 84.04 39.96 96.37 43 92.84 55.2 102 64 92.84 72.8 96.37 85 84.04 88.04 81 100.37 68.8 96.84 60 106 51.2 96.84 39 100.37 35.96 88.04 23.63 85 27.16 72.8 18 64 27.16 55.2 23.63 43 35.96 39.96 39 27.63 51.2 31.16Z"
        fill={palette.dark}
      />
      <path
        d="M60 22 68.8 31.16 81 27.63 84.04 39.96 96.37 43 92.84 55.2 102 64 92.84 72.8 96.37 85 84.04 88.04 81 100.37 68.8 96.84 60 106 51.2 96.84 39 100.37 35.96 88.04 23.63 85 27.16 72.8 18 64 27.16 55.2 23.63 43 35.96 39.96 39 27.63 51.2 31.16Z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      {/* Médaillon central. */}
      <circle cx="60" cy="64" r="30" fill={`url(#${gradient})`} />
      <circle
        cx="60"
        cy="64"
        r="24"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />

      {/* Éclat à quatre branches, propre à la rosette. */}
      <path
        d="M60 44c1.6 13 6.5 17.4 20 20-13.5 2.6-18.4 7-20 20-1.6-13-6.5-17.4-20-20 13.5-2.6 18.4-7 20-20Z"
        fill="#ffffff"
        fillOpacity="0.92"
      />
    </>
  );
}
