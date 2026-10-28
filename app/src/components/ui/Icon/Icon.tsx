/* =========================================================================
  IMPORTS
========================================================================= */
import type { SVGProps } from 'react';
import type { IconName } from '@/types/ui.types';
import { brandPaths } from './paths/brandPaths';
import { strokePaths } from './paths/strokePaths';

/* =========================================================================
  INTERFACE
========================================================================= */
type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

/* =========================================================================
  COMPOSANT : Icon
  Icône SVG du site.
========================================================================= */
export function Icon({ name, size = 20, className, ...props }: IconProps) {
  // Les icônes de marque sont remplies, les autres sont dessinées au trait.
  const isBrand = name in brandPaths;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill={isBrand ? 'currentColor' : 'none'}
      stroke={isBrand ? 'none' : 'currentColor'}
      strokeWidth={isBrand ? 0 : 1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Tracé correspondant au nom demandé. */}
      {isBrand ? brandPaths[name] : strokePaths[name]}
    </svg>
  );
}
