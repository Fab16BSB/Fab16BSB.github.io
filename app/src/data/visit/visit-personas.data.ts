import type { VisitPersonaDefinition } from '@/types/visit.types';

/* =========================================================================
   DONNÉES : profils de lecture du parcours
   Choix proposés sous le champ de recherche du header.
========================================================================= */

/**
 * Profils de lecture, du plus général au plus ciblé.
 *
 * L'ordre des sections et les thèmes de domaine sont les seuls réglages
 * propres à un profil. Les contenus sont ensuite classés par correspondance
 * avec ces thèmes, la demande et l'ancienneté réelle.
 */
export const visitPersonas: VisitPersonaDefinition[] = [

  // Généraliste
  {
    id: 'general',
    labelKey: 'visit.personas.general',
    icon: 'layers',
    contextSections: [],
    sectionOrder: [
      'about',
      'timeline',
      'projects',
      'skills',
      'publications',
      'teaching',
      'videos',
      'awards',
    ],
    themes: [],
    projectThemes: [],
    skillThemes: [],
    timelineThemes: [],
    teachingThemes: [],
  },

  // Data
  {
    id: 'data',
    labelKey: 'visit.personas.data',
    icon: 'sparkles',
    contextSections: [],
    sectionOrder: [
      'about',
      'projects',
      'skills',
      'publications',
      'timeline',
      'teaching',
    ],
    themes: ['machine-learning', 'data', 'nlp', 'vision'],
    projectThemes: ['machine-learning', 'data', 'nlp', 'vision'],
    skillThemes: ['machine-learning', 'data', 'nlp', 'vision'],
    timelineThemes: [
      'machine-learning',
      'nlp',
      'vision',
    ],
    teachingThemes: ['machine-learning', 'data', 'nlp', 'vision'],
  },

  // Industrie
  {
    id: 'industry',
    labelKey: 'visit.personas.industry',
    icon: 'briefcase',
    contextSections: [],
    sectionOrder: ['about', 'projects', 'skills', 'timeline'],
    themes: [
      'backend',
      'systems',
      'software-engineering',
      'web',
      'programming',
    ],
    projectThemes: ['backend', 'systems', 'software-engineering', 'web'],
    skillThemes: [
      'backend',
      'systems',
      'software-engineering',
      'web',
      'programming',
    ],
    timelineThemes: [
      'backend',
      'systems',
      'software-engineering',
      'web',
      'programming',
    ],
    teachingThemes: [],
    projectCategories: ['professional', 'personal'],
  },

  // Recherche
  {
    id: 'research',
    labelKey: 'visit.personas.research',
    icon: 'book',
    contextSections: ['publications', 'awards'],
    sectionOrder: [
      'about',
      'publications',
      'projects',
      'awards',
      'timeline',
      'skills',
    ],
    themes: [
      'research',
      'vision',
      'nlp',
      'machine-learning',
      'education',
    ],
    projectThemes: ['research'],
    skillThemes: ['vision', 'nlp', 'machine-learning'],
    timelineThemes: ['research', 'vision', 'nlp'],
    teachingThemes: [],
    awardThemes: ['research'],
  },

  // Enseignement
  {
    id: 'teaching',
    labelKey: 'visit.personas.teaching',
    icon: 'graduation',
    contextSections: ['teaching', 'videos', 'awards'],
    sectionOrder: [
      'about',
      'teaching',
      'videos',
      'awards',
      'timeline',
      'projects',
      'skills',
    ],
    themes: ['teaching', 'education', 'programming'],
    projectThemes: ['teaching'],
    skillThemes: ['teaching', 'education', 'programming'],
    timelineThemes: ['teaching', 'education'],
    teachingThemes: ['teaching', 'education', 'programming'],
    awardThemes: ['teaching'],
    teachingOrder: 'courses-first',
    minTeachingHours: 12,
  },
];
