/* =========================================================================
  IMPORTS
========================================================================= */
import type { AchievementKind, AwardColor, AwardTier } from '@/types/award.types';

/* =========================================================================
  TYPES
========================================================================= */
/** Couleurs d'un pin. */
export type PinPalette = {
  light: string;
  dark: string;
  ribbon?: string;
  ribbon2?: string;
};

/** Props communes aux formes de pin. */
export type PinShapeProps = {
  gradient: string;
  shine: string;
  palette: PinPalette;
};

/* =========================================================================
  CONSTANTES
========================================================================= */
const tierPalettes: Record<AwardTier, PinPalette> = {
  gold: { light: '#fde68a', dark: '#d97706', ribbon: '#b45309', ribbon2: '#f59e0b' },
  silver: { light: '#f8fafc', dark: '#94a3b8', ribbon: '#64748b', ribbon2: '#cbd5e1' },
  bronze: { light: '#fcd34d', dark: '#b45309', ribbon: '#92400e', ribbon2: '#d97706' },
  special: { light: '#c4b5fd', dark: '#0891b2', ribbon: '#6d5efc', ribbon2: '#22d3ee' },
};

// Couleurs nommées, avec la variable CSS utilisée par le halo.
const colorPalettes: Record<AwardColor, PinPalette & { accent: string }> = {
  accent: {
    light: '#c4b5fd',
    dark: '#6d5efc',
    ribbon: '#5b4bd6',
    ribbon2: '#8b7cff',
    accent: 'var(--accent)',
  },
  indigo: {
    light: '#a5b4fc',
    dark: '#4338ca',
    ribbon: '#3730a3',
    ribbon2: '#6366f1',
    accent: 'var(--color-indigo)',
  },
  cyan: {
    light: '#67e8f9',
    dark: '#0891b2',
    ribbon: '#0e7490',
    ribbon2: '#22d3ee',
    accent: 'var(--color-cyan)',
  },
  amber: {
    light: '#fde68a',
    dark: '#b45309',
    ribbon: '#92400e',
    ribbon2: '#f59e0b',
    accent: 'var(--color-amber)',
  },
  rose: {
    light: '#fda4af',
    dark: '#be123c',
    ribbon: '#9f1239',
    ribbon2: '#fb7185',
    accent: 'var(--color-rose)',
  },
  emerald: {
    light: '#6ee7b7',
    dark: '#047857',
    ribbon: '#065f46',
    ribbon2: '#10b981',
    accent: 'var(--color-emerald)',
  },
  slate: {
    light: '#e2e8f0',
    dark: '#475569',
    ribbon: '#334155',
    ribbon2: '#94a3b8',
    accent: 'var(--color-slate)',
  },
};

// Couleur par défaut de chaque type de distinction.
const kindColors: Record<Exclude<AchievementKind, 'medal'>, AwardColor> = {
  trophy: 'accent',
  badge: 'cyan',
  pin: 'rose',
  rosette: 'emerald',
};

/* =========================================================================
  FONCTIONS
========================================================================= */
/**
 * Retourne la palette d'un pin.
 *
 * @param kind - Type de distinction.
 * @param tier - Niveau de la médaille.
 * @param color - Couleur explicite, prioritaire sur celle du type.
 * @returns La palette de couleurs à appliquer.
 */
export function getPinPalette(
  kind: AchievementKind,
  tier: AwardTier,
  color?: AwardColor,
): PinPalette {
  let palette: PinPalette;

  if (color) {
    palette = colorPalettes[color];
  } else if (kind === 'medal') {
    palette = tierPalettes[tier];
  } else {
    palette = colorPalettes[kindColors[kind]];
  }

  return palette;
}

/**
 * Retourne la variable CSS du halo assorti à une couleur.
 *
 * @param color - Couleur choisie pour la distinction.
 * @returns La variable CSS de couleur.
 */
export function getPinAccent(color: AwardColor): string {
  return colorPalettes[color].accent;
}
