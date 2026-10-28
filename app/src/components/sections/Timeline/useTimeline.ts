/* =========================================================================
  IMPORTS
========================================================================= */
import { useState } from 'react';

/* =========================================================================
  TYPES & INTERFACES
========================================================================= */
export type TimelineTab = 'education' | 'experience';

/* =========================================================================
  HOOK : useTimeline
  Gère l'onglet actif du parcours.
========================================================================= */
export function useTimeline(initial: TimelineTab = 'experience') {

  // Onglet actif.
  const [tab, setTab] = useState<TimelineTab>(initial);

  return { tab, setTab };
}
