/* =========================================================================
  IMPORTS
========================================================================= */
import { useState } from 'react';
import { useVisitReveal } from '@/hooks/sections/useVisitReveal';
import { visitTargetPrefix } from '@/lib/visit/visit-targets';

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

  // Préfixes des cartes ciblables par la visite.
  const educationPrefix = visitTargetPrefix('education');
  const experiencePrefix = visitTargetPrefix('experience');

  // Une visite guidée peut demander une expérience ou une formation précise.
  useVisitReveal([experiencePrefix, educationPrefix], (target) => {
    const isEducation = target.startsWith(educationPrefix);
    setTab(isEducation ? 'education' : 'experience');
  });

  return { tab, setTab };
}
