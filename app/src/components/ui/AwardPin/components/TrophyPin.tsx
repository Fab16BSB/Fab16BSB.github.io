/* =========================================================================
  IMPORTS
========================================================================= */
import type { PinShapeProps } from '../awardPin.helpers';

/* =========================================================================
  COMPOSANT : TrophyPin
  Trophée : coupe et étoile.
========================================================================= */
export function TrophyPin({ gradient, palette }: PinShapeProps) {
  return (
    <>
      <path
        d="M40 16h40v20c0 16-8 27-20 33-12-6-20-17-20-33V16Z"
        fill={`url(#${gradient})`}
      />
      <path
        d="M40 24H28a12 12 0 0 0 12 12M80 24h12a12 12 0 0 1-12 12"
        fill="none"
        stroke={palette.light}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M56 64h8v30h-8z" fill={palette.dark} />
      <path d="M42 94h36l-4 12H46l-4-12Z" fill={palette.dark} />
      <path d="M52 100h16v4H52z" fill={palette.light} opacity="0.55" />

      <path
        d="m60 24 4.8 9.7 10.7 1.5-7.7 7.6 1.8 10.6L60 48.5l-9.6 5 1.8-10.6-7.7-7.6 10.7-1.5L60 24Z"
        fill="#ffffff"
        fillOpacity="0.92"
      />
    </>
  );
}
