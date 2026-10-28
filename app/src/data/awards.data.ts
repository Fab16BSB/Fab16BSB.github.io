import type { Award } from '@/types/award.types';

/**
 * Palmarès et responsabilités, triés par année de fin, du plus récent au plus
 * ancien. L'ordre du tableau est l'ordre d'affichage.
 *
 * Élément de type `Award`.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} year - Année ou plage d'années.
 * @property {AchievementKind} kind - Type de distinction.
 * @property {AwardTier} [tier] - Niveau de la distinction.
 * @property {AwardColor} [color] - Couleur du pin (`accent`, `indigo`, `cyan`, `amber`, `rose`, `emerald`, `slate`).
 * @property {string} [event] - Événement ou structure.
 * @property {Localized} title - Intitulé en FR / EN / ES.
 */
export const awards: Award[] = [

  /** ▸ 2024–2025 · IUT Montreuil — organisation d\'un forum des métiers */
  {
    id: 'forum-metiers',
    year: '2024 — 2025',
    kind: 'rosette',
    event: 'IUT Montreuil',
    title: {
      fr: 'Organisation d\'un forum des métiers',
      en: 'Organization of a career fair',
      es: 'Organización de una feria de empleo',
    },
  },

  /** ▸ 2024–2025 · IUT Montreuil — co-responsable de l\'alternance */
  {
    id: 'co-responsable-alternance',
    year: '2024 — 2025',
    kind: 'trophy',
    event: 'IUT Montreuil',
    title: {
      fr: 'Co-responsable de l\'alternance',
      en: 'Co-head of apprenticeship programs',
      es: 'Coorresponsable de la formación en alternancia',
    },
  },

  /** ▸ 2024–2025 · IUT Montreuil — sélection des candidats */
  {
    id: 'selection-candidats',
    year: '2024 — 2025',
    kind: 'pin',
    event: 'IUT Montreuil',
    title: {
      fr: 'Sélection des candidats',
      en: 'Candidate selection',
      es: 'Selección de candidatos',
    },
  },

  /** ▸ 2023–2025 · IUT Montreuil — jury de l\'alternance */
  {
    id: 'jury-alternance',
    year: '2023 — 2025',
    kind: 'badge',
    event: 'IUT Montreuil',
    title: {
      fr: 'Jury de l\'alternance',
      en: 'Apprenticeship jury',
      es: 'Jurado de la formación en alternancia',
    },
  },

  /** ▸ 2022 · EGC — prix de la meilleure démonstration */
  {
    id: 'egc-2022',
    year: '2022',
    kind: 'medal',
    tier: 'gold',
    event: 'EGC',
    title: {
      fr: 'Prix de la meilleure démonstration',
      en: 'Best Demo Award',
      es: 'Premio a la mejor demostración',
    },
  },
];
