/* =========================================================================
  IMPORTS
========================================================================= */
import type { ReactNode } from 'react';
import type { KnowledgeDomainId } from '@/types/skill.types';

/* =========================================================================
  TRACÉS : domaines de connaissance
========================================================================= */
export const knowledgePaths: Record<KnowledgeDomainId, ReactNode> = {

  // Vision par ordinateur.
  vision: (
    <>
      <path d="M3 8V5.5A2.5 2.5 0 0 1 5.5 3H8M16 3h2.5A2.5 2.5 0 0 1 21 5.5V8M21 16v2.5a2.5 2.5 0 0 1-2.5 2.5H16M8 21H5.5A2.5 2.5 0 0 1 3 18.5V16" />
      <path d="M6.5 12S8.7 8.5 12 8.5s5.5 3.5 5.5 3.5-2.2 3.5-5.5 3.5S6.5 12 6.5 12Z" />
      <circle cx="12" cy="12" r="1.6" />
    </>
  ),

  // Traitement du langage.
  nlp: (
    <>
      <path d="M4.5 4.5h8A3.5 3.5 0 0 1 16 8v3a3.5 3.5 0 0 1-3.5 3.5H9L5 17.5v-3.3A3.5 3.5 0 0 1 3 11V8a3.5 3.5 0 0 1 1.5-3.5Z" />
      <path d="M6.8 8.3h5.8M6.8 10.8h3.4" />
      <circle cx="18.7" cy="5.4" r="1.9" />
      <path d="M18.7 3.5V2.2M18.7 8.6V7.3M16.8 5.4h-1.3M22 5.4h-1.3" />
    </>
  ),

  // Machine learning.
  ml: (
    <>
      <circle cx="3.2" cy="7.2" r="1.5" />
      <circle cx="3.2" cy="12" r="1.5" />
      <circle cx="3.2" cy="16.8" r="1.5" />
      <circle cx="12" cy="5.5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="18.5" r="1.5" />
      <circle cx="20.8" cy="9" r="1.5" />
      <circle cx="20.8" cy="15" r="1.5" />
      <path d="M4.7 7.2 10.5 5.5M4.7 7.2 10.5 12M4.7 12h5.8M4.7 16.8 10.5 12M4.7 16.8 10.5 18.5M13.5 5.5 19.3 9M13.5 12 19.3 9M13.5 12 19.3 15M13.5 18.5 19.3 15" />
    </>
  ),
};
