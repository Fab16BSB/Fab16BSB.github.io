/* =========================================================================
  IMPORTS
========================================================================= */
import type { PinShapeProps } from '../awardPin.helpers';

/* =========================================================================
  COMPOSANT : BadgePin
  Badge : écusson et étoile.
========================================================================= */
export function BadgePin({ gradient, palette }: PinShapeProps) {
  return (
    <>
      <path
        d="M60 10 100 24v36c0 30-18 50-40 60-22-10-40-30-40-60V24L60 10Z"
        fill={`url(#${gradient})`}
      />
      <path
        d="M60 10 100 24v36c0 30-18 50-40 60-22-10-40-30-40-60V24L60 10Z"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="2"
      />
      <path d="M45 96l-6 28 21-10 21 10-6-28" fill={palette.dark} opacity="0.9" />

      <path
        d="m60 34 6.5 13.2 14.6 2.1-10.6 10.3 2.5 14.5L60 67.4l-13 6.7 2.5-14.5-10.6-10.3 14.6-2.1L60 34Z"
        fill="#ffffff"
        fillOpacity="0.92"
      />
    </>
  );
}
