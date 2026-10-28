/* =========================================================================
  IMPORTS
========================================================================= */
import type { PinShapeProps } from '../awardPin.helpers';

/* =========================================================================
  COMPOSANT : MedalPin
  Médaille : rubans, disque et étoile.
========================================================================= */
export function MedalPin({ gradient, shine, palette }: PinShapeProps) {
  return (
    <>
      <path d="M36 4h20l8 48H44L36 4Z" fill={palette.ribbon} opacity="0.92" />
      <path d="M84 4H64l-8 48h20L84 4Z" fill={palette.ribbon2} opacity="0.92" />
      <path d="M44 38h32l-4 24H48l-4-24Z" fill={palette.ribbon} opacity="0.55" />

      <circle cx="60" cy="94" r="38" fill={palette.dark} />
      <circle cx="60" cy="94" r="32" fill={`url(#${gradient})`} />
      <circle
        cx="60"
        cy="94"
        r="25"
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />

      <path
        d="m60 76 5.8 11.8 13 1.9-9.4 9.2 2.2 13-11.6-6.1-11.6 6.1 2.2-13-9.4-9.2 13-1.9L60 76Z"
        fill="#ffffff"
        fillOpacity="0.92"
      />
      <circle cx="60" cy="94" r="38" fill={`url(#${shine})`} opacity="0.45" />
    </>
  );
}
