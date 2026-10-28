/* =========================================================================
  IMPORTS
========================================================================= */
import type { Locale } from '@/types/common.types';
import { flagPaths } from './paths/flagPaths';

/* =========================================================================
  INTERFACE
========================================================================= */
type LanguageFlagProps = {
  code: Locale;
  className?: string;
};

/* =========================================================================
  COMPOSANT : LanguageFlag
  Drapeau de langue.
========================================================================= */
export function LanguageFlag({ code, className }: LanguageFlagProps) {
  return (
    <svg viewBox="0 0 60 40" className={className} aria-hidden="true" focusable="false">
      {/* Drapeau de la langue courante. */}
      {flagPaths[code]}
    </svg>
  );
}
