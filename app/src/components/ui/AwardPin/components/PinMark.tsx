/* =========================================================================
  IMPORTS
========================================================================= */
import type { PinShapeProps } from '../awardPin.helpers';

/* =========================================================================
  COMPOSANT : PinMark
  Pin : disque et étoile.
========================================================================= */
export function PinMark({ gradient, palette }: PinShapeProps) {
  return (
    <>
      <circle cx="60" cy="64" r="40" fill={palette.dark} />
      <circle cx="60" cy="64" r="34" fill={`url(#${gradient})`} />
      <circle
        cx="60"
        cy="64"
        r="26"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.4"
        strokeWidth="1.5"
      />

      <path
        d="m60 44 6.2 12.6 13.9 2-10 9.8 2.4 13.8L60 76.5l-12.5 5.7 2.4-13.8-10-9.8 13.9-2L60 44Z"
        fill="#ffffff"
        fillOpacity="0.92"
      />
    </>
  );
}
