/* =========================================================================
  IMPORTS
========================================================================= */
import type { PinShapeProps } from '../awardPin.helpers';

/* =========================================================================
  COMPOSANT : PinGradients
  Dégradés partagés par toutes les formes de pin.
========================================================================= */
export function PinGradients({ gradient, shine, palette }: PinShapeProps) {
  return (
    <defs>
      {/* Couleur du pin, du clair au foncé. */}
      <linearGradient id={gradient} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={palette.light} />
        <stop offset="1" stopColor={palette.dark} />
      </linearGradient>

      {/* Reflet diagonal. */}
      <linearGradient id={shine} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.6" />
        <stop offset="0.45" stopColor="#ffffff" stopOpacity="0.04" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.3" />
      </linearGradient>
    </defs>
  );
}
