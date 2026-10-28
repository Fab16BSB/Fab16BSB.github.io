import type { TeachingCourse } from '@/types/teaching.types';

/**
 * Cours dispensés à l'IUT de Montreuil et à l'Université Paris 8.
 *
 * Élément de type `TeachingCourse`.
 *
 * @property {string} id - Identifiant stable.
 * @property {number} start - Année de début.
 * @property {number} end - Année de fin.
 * @property {Localized} theme - Intitulé du cours en FR / EN / ES.
 * @property {TeachingLevel} level - Niveau (BUT, licence, master).
 * @property {string} students - Effectif affiché.
 * @property {TeachingPlace} place - Cours en présentiel ou en ligne.
 * @property {number} hours - Volume horaire total.
 * @property {TeachingDistribution[]} distribution - Répartition par type d'activité.
 *
 * `distribution` contient `type` (CM, TD, TP, SAE, CS) et `hours`.
 */
export const teaching: TeachingCourse[] = [

  /** ▸ 2024–2025 · BUT1 */
  {
    id: 'architecture-2025',
    start: 2024,
    end: 2025,
    theme: {
      fr: 'Architecture des ordinateurs',
      en: 'Computer architecture',
      es: 'Arquitectura de ordenadores',
    },
    level: 'but1',
    students: '15–30',
    place: 'onsite',
    hours: 10,
    distribution: [
      { type: 'TD', hours: 5 },
      { type: 'TP', hours: 5 },
    ],
  },

  /** ▸ 2024–2025 · BUT1 */
  {
    id: 'web-2025',
    start: 2024,
    end: 2025,
    theme: {
      fr: 'Développement web',
      en: 'Web development',
      es: 'Desarrollo web',
    },
    level: 'but1',
    students: '15',
    place: 'onsite',
    hours: 10,
    distribution: [{ type: 'TP', hours: 10 }],
  },

  /** ▸ 2023–2025 · BUT1 */
  {
    id: 'java-init-2025',
    start: 2023,
    end: 2025,
    theme: {
      fr: 'Initiation au développement (Java)',
      en: 'Introduction to development (Java)',
      es: 'Introducción al desarrollo (Java)',
    },
    level: 'but1',
    students: '15',
    place: 'onsite',
    hours: 44,
    distribution: [{ type: 'TP', hours: 44 }],
  },

  /** ▸ 2023–2025 · BUT1 */
  {
    id: 'poste-2025',
    start: 2023,
    end: 2025,
    theme: {
      fr: 'Installation de poste',
      en: 'Workstation setup',
      es: 'Instalación de estación de trabajo',
    },
    level: 'but1',
    students: '30–45',
    place: 'onsite',
    hours: 18,
    distribution: [{ type: 'SAE', hours: 18 }],
  },

  /** ▸ 2023–2025 · BUT1 */
  {
    id: 'os-2025',
    start: 2023,
    end: 2025,
    theme: {
      fr: 'Système d\'exploitation',
      en: 'Operating systems',
      es: 'Sistema operativo',
    },
    level: 'but1',
    students: '15–30',
    place: 'onsite',
    hours: 75,
    distribution: [
      { type: 'TD', hours: 29 },
      { type: 'TP', hours: 46 },
    ],
  },

  /** ▸ 2023–2025 · BUT3 */
  {
    id: 'algo-quality-2025',
    start: 2023,
    end: 2025,
    theme: {
      fr: 'Qualité d\'algorithme',
      en: 'Algorithm quality',
      es: 'Calidad de algoritmos',
    },
    level: 'but3',
    students: '38',
    place: 'onsite',
    hours: 19.5,
    distribution: [{ type: 'TP', hours: 19.5 }],
  },

  /** ▸ 2023–2025 · BUT3 */
  {
    id: 'multimedia-2025',
    start: 2023,
    end: 2025,
    theme: {
      fr: 'Programmation multimédia',
      en: 'Multimedia programming',
      es: 'Programación multimedia',
    },
    level: 'but3',
    students: '18–38',
    place: 'onsite',
    hours: 32,
    distribution: [
      { type: 'CM', hours: 11 },
      { type: 'TP', hours: 21 },
    ],
  },

  /** ▸ 2023–2025 · BUT2 */
  {
    id: 'software-archi-2024',
    start: 2023,
    end: 2025,
    theme: {
      fr: 'Architecture logicielle',
      en: 'Software architecture',
      es: 'Arquitectura de software',
    },
    level: 'but2',
    students: '50',
    place: 'onsite',
    hours: 43,
    distribution: [
      { type: 'CM', hours: 12 },
      { type: 'TP', hours: 31 },
    ],
  },

  /** ▸ 2023–2024 · BUT1 */
  {
    id: 'support-2024',
    start: 2023,
    end: 2024,
    theme: {
      fr: 'Cours de soutien',
      en: 'Support classes',
      es: 'Clases de refuerzo',
    },
    level: 'but1',
    students: '≈ 10',
    place: 'onsite',
    hours: 6,
    distribution: [{ type: 'CS', hours: 6 }],
  },

  /** ▸ 2023–2024 · BUT1 */
  {
    id: 'client-need-2024',
    start: 2023,
    end: 2024,
    theme: {
      fr: 'Implémentation d\'un besoin client',
      en: 'Implementing client requirements',
      es: 'Implementación de los requisitos de un cliente',
    },
    level: 'but1',
    students: '15',
    place: 'onsite',
    hours: 9,
    distribution: [{ type: 'SAE', hours: 9 }],
  },

  /** ▸ 2023–2024 · BUT1 */
  {
    id: 'algo-compare-2024',
    start: 2023,
    end: 2024,
    theme: {
      fr: 'Comparaison d\'approches algorithmiques',
      en: 'Comparison of algorithmic approaches',
      es: 'Comparación de enfoques algorítmicos',
    },
    level: 'but1',
    students: '15',
    place: 'onsite',
    hours: 6,
    distribution: [{ type: 'SAE', hours: 6 }],
  },

  /** ▸ 2023–2024 · BUT1 */
  {
    id: 'app-quality-2024',
    start: 2023,
    end: 2024,
    theme: {
      fr: 'Développement d\'une application + qualité de développement',
      en: 'Application development + development quality',
      es: 'Desarrollo de una aplicación + calidad del desarrollo',
    },
    level: 'but1',
    students: '15',
    place: 'onsite',
    hours: 24,
    distribution: [{ type: 'SAE', hours: 24 }],
  },

  /** ▸ 2023–2024 · BUT1 */
  {
    id: 'low-level-2024',
    start: 2023,
    end: 2024,
    theme: {
      fr: 'Programmation bas niveau',
      en: 'Low-level programming',
      es: 'Programación de bajo nivel',
    },
    level: 'but1',
    students: '≈ 30',
    place: 'onsite',
    hours: 6,
    distribution: [{ type: 'TP', hours: 6 }],
  },

  /** ▸ 2023–2024 · BUT1 */
  {
    id: 'gui-2024',
    start: 2023,
    end: 2024,
    theme: {
      fr: 'Développement d\'applications avec IHM',
      en: 'Application development with GUI',
      es: 'Desarrollo de aplicaciones con IHM',
    },
    level: 'but1',
    students: '15',
    place: 'onsite',
    hours: 14,
    distribution: [{ type: 'TP', hours: 14 }],
  },

  /** ▸ 2023–2024 · BUT1 */
  {
    id: 'oop-2024',
    start: 2023,
    end: 2024,
    theme: {
      fr: 'DOO — Développement orienté objet',
      en: 'OOP — Object-oriented programming',
      es: 'DOO — Desarrollo orientado a objetos',
    },
    level: 'but1',
    students: '≈ 30',
    place: 'onsite',
    hours: 7.5,
    distribution: [{ type: 'TP', hours: 7.5 }],
  },

  /** ▸ 2023–2024 · BUT1 */
  {
    id: 'ppp-2024',
    start: 2023,
    end: 2024,
    theme: {
      fr: 'PPP — Projet professionnel et personnel',
      en: 'PPP — Professional and personal project',
      es: 'PPP — Proyecto personal y profesional',
    },
    level: 'but1',
    students: '≈ 30',
    place: 'onsite',
    hours: 3,
    distribution: [{ type: 'TD', hours: 3 }],
  },

  /** ▸ 2022–2023 · Master 1 */
  {
    id: 'deep-learning-2023',
    start: 2022,
    end: 2023,
    theme: {
      fr: 'Deep Learning',
      en: 'Deep Learning',
      es: 'Deep Learning',
    },
    level: 'master1',
    students: '≈ 30',
    place: 'onsite',
    hours: 30,
    distribution: [{ type: 'CM', hours: 30 }],
  },

  /** ▸ 2020–2023 · Licence 2 */
  {
    id: 'oop-java-2023',
    start: 2020,
    end: 2023,
    theme: {
      fr: 'Programmation orientée objet en Java',
      en: 'Object-oriented programming in Java',
      es: 'Programación orientada a objetos con Java',
    },
    level: 'licence2',
    students: '≈ 30 / an',
    place: 'online',
    hours: 135,
    distribution: [{ type: 'TD', hours: 135 }],
  },

  /** ▸ 2019–2020 · Licence 2 */
  {
    id: 'java-2020',
    start: 2019,
    end: 2020,
    theme: {
      fr: 'Programmation Java',
      en: 'Java programming',
      es: 'Programación Java',
    },
    level: 'licence2',
    students: '≈ 30',
    place: 'onsite',
    hours: 15,
    distribution: [{ type: 'CM', hours: 15 }],
  },
];
