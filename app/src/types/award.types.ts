import type { Localized } from './common.types';

/** Niveau d'une distinction. */
export type AwardTier = 'gold' | 'silver' | 'bronze' | 'special';

/** Type de distinction ou de responsabilité. */
export type AchievementKind = 'medal' | 'trophy' | 'badge' | 'pin' | 'rosette';

/** Palette de couleur applicable à n'importe quelle distinction. */
export type AwardColor =
  | 'accent'
  | 'indigo'
  | 'cyan'
  | 'amber'
  | 'rose'
  | 'emerald'
  | 'slate';

/**
 * Distinction ou responsabilité affichée dans le palmarès.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} year - Année ou plage d'années.
 * @property {AchievementKind} kind - Type de distinction.
 * @property {AwardTier} [tier] - Niveau de la distinction.
 * @property {AwardColor} [color] - Couleur du pin, sinon couleur du type.
 * @property {string} [event] - Événement ou structure.
 * @property {Localized} title - Intitulé.
 */
export type Award = {
  id: string;
  year: string;
  kind: AchievementKind;
  tier?: AwardTier;
  color?: AwardColor;
  event?: string;
  title: Localized;
};
