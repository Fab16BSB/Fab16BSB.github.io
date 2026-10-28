/* =========================================================================
  IMPORTS
========================================================================= */
import type { LanguageOption } from '@/types/i18n.types';

/* =========================================================================
  DONNÉES
========================================================================= */
/** Langues proposées par le sélecteur, dans l'ordre d'affichage. */
export const languageOptions: LanguageOption[] = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'es', label: 'Español', short: 'ES' },
];
