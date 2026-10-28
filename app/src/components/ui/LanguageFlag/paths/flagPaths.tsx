/* =========================================================================
  IMPORTS
========================================================================= */
import type { ReactNode } from 'react';
import type { Locale } from '@/types/common.types';

/* =========================================================================
  TRACÉS : drapeaux
========================================================================= */
export const flagPaths: Record<Locale, ReactNode> = {
  // France.
  fr: (
    <>
      <rect width="60" height="40" fill="#0055A4" />
      <rect x="20" width="20" height="40" fill="#ffffff" />
      <rect x="40" width="20" height="40" fill="#EF4135" />
    </>
  ),

  // Royaume-Uni.
  en: (
    <>
      <rect width="60" height="40" fill="#012169" />
      <path d="M0 0 60 40M60 0 0 40" stroke="#ffffff" strokeWidth="8" />
      <path d="M0 0 60 40M60 0 0 40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v40M0 20h60" stroke="#ffffff" strokeWidth="13" />
      <path d="M30 0v40M0 20h60" stroke="#C8102E" strokeWidth="8" />
    </>
  ),

  // Espagne.
  es: (
    <>
      <rect width="60" height="40" fill="#AA151B" />
      <rect y="10" width="60" height="20" fill="#F1BF00" />
      <rect x="12" y="13.5" width="6" height="9" rx="1.5" fill="#AA151B" />
      <rect x="13.5" y="15.5" width="3" height="5" rx="0.8" fill="#F1BF00" />
    </>
  ),
};
