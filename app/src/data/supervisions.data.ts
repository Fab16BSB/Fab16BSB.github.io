import type { Supervision } from '@/types/supervision.types';

/**
 * Encadrements affichés dans l'onglet « Encadrements » de la section Enseignement.
 *
 * Élément de type `Supervision`.
 *
 * @property {string} id - Identifiant stable.
 * @property {SupervisionKind} kind - Type d'encadrement.
 * @property {SupervisionMode} mode - Présentiel, distance ou hybride.
 * @property {number} [start] - Année de début.
 * @property {number | 'present'} [end] - Année de fin ou 'present'.
 * @property {Localized} topic - Sujet en FR / EN / ES.
 * @property {Localized} role - Rôle en FR / EN / ES.
 * @property {number} students - Nombre d'étudiants encadrés.
 * @property {string} institution - Établissement ou entreprise.
 * @property {Localized} description - Description en FR / EN / ES.
 */
export const supervisions: Supervision[] = [

  /** ▸ Alternance · Aéroport de Paris */
  {
    id: 'alternance-aeroport',
    kind: 'apprenticeship',
    mode: 'onsite',
    topic: {
      fr: 'Encadrement d\'un alternant',
      en: 'Apprentice supervision',
      es: 'Supervisión de un estudiante en alternancia',
    },
    role: {
      fr: 'Tuteur académique',
      en: 'Academic tutor',
      es: 'Tutor académico',
    },
    students: 1,
    institution: 'Aéroport de Paris',
    description: {
      fr: 'Accompagnement d\'un alternant en tant que tuteur académique : suivi des missions, conseils techniques et évaluation.',
      en: 'Supporting an apprentice as an academic tutor: mission follow-up, technical advice and evaluation.',
      es: 'Acompañamiento de un estudiante en alternancia como tutor académico: seguimiento de las misiones, consejos técnicos y evaluación.',
    },
  },

  /** ▸ Stages · entreprises partenaires (IUT) */
  {
    id: 'stages-tutorat-iut',
    kind: 'internship',
    mode: 'onsite',
    topic: {
      fr: 'Encadrement de 2 stagiaires',
      en: 'Supervision of 2 interns',
      es: 'Supervisión de 2 estudiantes en prácticas',
    },
    role: {
      fr: 'Professeur tuteur à l\'IUT',
      en: 'Tutor lecturer at the IUT',
      es: 'Profesor tutor en el IUT',
    },
    students: 2,
    institution: 'Entreprises partenaires',
    description: {
      fr: 'Les deux stagiaires effectuaient leur stage en entreprise ; j\'assurais leur suivi pédagogique, conseils techniques et évaluation.',
      en: 'Both interns were doing their internship in a company; I provided their academic follow-up, technical advice and evaluation.',
      es: 'Los dos estudiantes realizaban sus prácticas en empresa; yo aseguraba su seguimiento pedagógico, consejos técnicos y evaluación.',
    },
  },

  /** ▸ Stage · IMT Albi (à distance) */
  {
    id: 'stage-imt-albi',
    kind: 'internship',
    mode: 'remote',
    topic: {
      fr: 'Élaboration d\'un RAG',
      en: 'Building a RAG pipeline',
      es: 'Elaboración de un RAG',
    },
    role: {
      fr: 'Responsable de stage',
      en: 'Internship supervisor',
      es: 'Responsable de prácticas',
    },
    students: 1,
    institution: 'IMT Albi',
    description: {
      fr: 'Encadrement à distance d\'un étudiant dont le sujet de stage est l\'élaboration d\'un RAG : cadrage du sujet, suivi technique et évaluation.',
      en: 'Remote supervision of an intern whose topic is building a RAG pipeline: topic scoping, technical follow-up and evaluation.',
      es: 'Supervisión a distancia de un estudiante cuyo tema de prácticas es la elaboración de un RAG: definición del tema, seguimiento técnico y evaluación.',
    },
  },

  /** ▸ Stage · LIASD — Université Paris 8 */
  {
    id: 'stage-liasd',
    kind: 'internship',
    mode: 'onsite',
    topic: {
      fr: 'Classification de texte par machine learning',
      en: 'Machine learning text classification',
      es: 'Clasificación de texto mediante machine learning',
    },
    role: {
      fr: 'Responsable de stage',
      en: 'Internship supervisor',
      es: 'Responsable de prácticas',
    },
    students: 1,
    institution: 'LIASD — Université Paris 8',
    description: {
      fr: 'Encadrement d\'un étudiant dont le sujet de stage est la classification de texte à l\'aide de machine learning : cadrage du sujet, suivi technique et évaluation.',
      en: 'Supervision of an intern whose topic is machine learning text classification: topic scoping, technical follow-up and evaluation.',
      es: 'Supervisión de un estudiante cuyo tema de prácticas es la clasificación de texto mediante machine learning: definición del tema, seguimiento técnico y evaluación.',
    },
  },
];
