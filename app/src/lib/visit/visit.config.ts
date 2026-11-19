/* =========================================================================
  CONFIGURATION : parcours de visite
  Seuils ajustables sans toucher au moteur.
========================================================================= */

import type {
  VisitMode,
  VisitSectionId,
  VisitSectionPolicy,
} from '@/types/visit.types';

/* =========================================================================
  TYPES
========================================================================= */

/** Réglages d'un mode de parcours. */
export type VisitModeLimits = {
  maxSections: number | null;
  items: Record<VisitSectionId, number> | null;
  timelineShared: number | null;
  contextSections: VisitSectionPolicy;
};

/* =========================================================================
  SEUILS
========================================================================= */

export const VISIT_CONFIG = {

  /** Part du meilleur score de section conservée. */
  sectionFloorRatio: 0.05,

  /** Bonus de poids de la section compétences, seule section favorisée. */
  skillsSectionWeight: 1.15,

  /**
   * Contenus montrés selon le mode de parcours.
   *
   * `maxSections` à `null` signifie « toutes les sections au-dessus du seuil ».
   * `timelineShared` s'applique quand la demande couvre aussi l'enseignement
   * ou la recherche : le parcours sert alors de preuve d'expérience.
   * `contextSections` décide si une section hors noyau doit être nommée ou
   * seulement avoir un contenu réel.
   */
  modes: {
    express: {
      maxSections: 4,
      timelineShared: 5,
      items: {
        about: 1,
        timeline: 2,
        projects: 3,
        skills: 5,
        publications: 2,
        teaching: 3,
        videos: 2,
        awards: 2,
        contact: 1,
      },
      contextSections: 'named',
    },
    full: {
      maxSections: null,
      timelineShared: null,
      items: {
        about: 1,
        timeline: 10,
        projects: 10,
        skills: 10,
        publications: 10,
        teaching: 10,
        videos: 10,
        awards: 10,
        contact: 1,
      },
      contextSections: 'matched',
    },
  } as Record<VisitMode, VisitModeLimits>,

  /** Poids d'une correspondance limitée au libellé d'une section. */
  sectionLabelWeight: 0.45,

  /** Sections proposées quand la demande porte sur la disponibilité. */
  availabilitySections: ['about', 'timeline'] as const,

  /** Seuil secondaire quand le thème principal n'est pas partagé. */
  graphSecondaryMin: 0.6,

  /** Nombre maximal de preuves affichées dans le verdict. */
  maxEvidence: 3,

  /** Nombre maximal d'écarts affichés dans le verdict. */
  maxGaps: 2,

  /** Score minimal pour un verdict fort. */
  fitStrong: 0.75,

  /** Score minimal pour un verdict partiel. */
  fitPartial: 0.5,

  /** Couverture minimale avant d'afficher un écart générique. */
  coverageMin: 0.6,

  /** Poids du score de couverture dans le verdict. */
  fitRequiredWeight: 0.65,

  /** Poids de la couverture de la demande dans le verdict. */
  fitCoverageWeight: 0.35,

  /** Points par année de récence. */
  recencyYearWeight: 2,

  /** Bonus d'une expérience encore en cours. */
  currentExperienceBonus: 5,

  /** Points par tag d'un contenu. */
  evidenceTagWeight: 1.5,

  /** Points par thème partagé dans le score d'un contenu. */
  evidenceThemeWeight: 4,

  /** Score de base d'une formation. */
  educationBaseScore: 10,

  /** Bonus d'une formation liée à la recherche ou à l'enseignement. */
  educationThemeBonus: 12,

  /** Score de base d'un cours. */
  courseBaseScore: 2,

  /** Bonus d'un cours quand le profil privilégie les cours. */
  courseFirstBonus: 25,

  /** Bonus d'un encadrement quand le profil privilégie les cours. */
  supervisionBonus: 6,

  /** Poids de l'usage d'une compétence dans le score d'une section. */
  skillUsageWeight: 0.4,

  /** Bonus maximal apporté par la cohérence du graphe. */
  graphBoostWeight: 0.5,

  /** Poids d'un thème partagé dans le score d'une section. */
  searchThemeWeight: 0.08,

  /** Poids des deuxième et troisième contenus d'une section. */
  searchSecondWeight: 0.5,
  searchThirdWeight: 0.3,

  /** Recouvrement minimal pour compléter une preuve. */
  evidenceContentOverlap: 2,

  /** Volume horaire minimal d'un cours indexé. */
  minCourseHours: 12,

  /** Année des sources encore en cours. */
  presentYear: 9999,

  /** Poids de l'ancienneté d'une compétence. */
  skillSpanWeight: 2,
  skillProfessionalWeight: 1.5,
  skillCurrentBonus: 3,
  skillSourceWeight: 1.5,
  skillThemeWeight: 2,

} as const;
