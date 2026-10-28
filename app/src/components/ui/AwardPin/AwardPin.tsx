/* =========================================================================
  IMPORTS
========================================================================= */
import { useId } from 'react';
import type { AchievementKind, AwardColor, AwardTier } from '@/types/award.types';
import { getPinPalette, type PinShapeProps } from './awardPin.helpers';
import { BadgePin } from './components/BadgePin';
import { MedalPin } from './components/MedalPin';
import { PinGradients } from './components/PinGradients';
import { PinMark } from './components/PinMark';
import { RosettePin } from './components/RosettePin';
import { TrophyPin } from './components/TrophyPin';
import styles from './AwardPin.module.css';

/* =========================================================================
  INTERFACE
========================================================================= */
type AwardPinProps = {
  kind: AchievementKind;
  tier?: AwardTier;
  color?: AwardColor;
};

/* =========================================================================
  COMPOSANT : AwardPin
  Badge visuel de distinction.
========================================================================= */
export function AwardPin({ kind, tier = 'gold', color }: AwardPinProps) {
  const id = useId().replace(/:/g, '');
  const gradient = `award-${id}`;
  const shine = `award-shine-${id}`;
  const palette = getPinPalette(kind, tier, color);
  const shapeProps: PinShapeProps = { gradient, shine, palette };

  return (
    <svg
      viewBox="0 0 120 140"
      className={styles.pin}
      aria-hidden="true"
      focusable="false"
    >
      <PinGradients {...shapeProps} />

      {kind === 'medal' && <MedalPin {...shapeProps} />}
      {kind === 'trophy' && <TrophyPin {...shapeProps} />}
      {kind === 'badge' && <BadgePin {...shapeProps} />}
      {kind === 'pin' && <PinMark {...shapeProps} />}
      {kind === 'rosette' && <RosettePin {...shapeProps} />}
    </svg>
  );
}
