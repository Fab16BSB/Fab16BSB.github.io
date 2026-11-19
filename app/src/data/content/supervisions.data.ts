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
 * @property {string[]} [tags] - Technologies et méthodes de l'encadrement.
 */
export const supervisions: Supervision[] = [

  /** ▸ Alternance · Aéroport de Paris */
  {
    id: 'alternance-aeroport',
    kind: 'apprenticeship',
    mode: 'onsite',
    start: 2024,
    end: 2025,
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
      fr: 'Accompagnement d\'un alternant en tant que tuteur académique pendant sa deuxième année d\'ATER : suivi des missions, aide à la rédaction du rapport, visite en entreprise, préparation de la soutenance, conseils techniques et évaluation.',
      en: 'Supported an apprentice as an academic tutor during the second ATER year: mission follow-up, help with the report, company visit, defense preparation, technical advice and evaluation.',
      es: 'Acompañamiento de un estudiante en alternancia como tutor académico durante el segundo año de ATER: seguimiento de las misiones, ayuda con el informe, visita a la empresa, preparación de la defensa, consejos técnicos y evaluación.',
    },
    tags: ['Alternance', 'Tutorat', 'Suivi pédagogique'],
  },

  /** ▸ Stages · entreprises partenaires (IUT) */
  {
    id: 'stages-tutorat-iut',
    kind: 'internship',
    mode: 'onsite',
    start: 2025,
    end: 2025,
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
      fr: 'Suivi pédagogique de deux stagiaires en entreprise pendant leur stage de six mois : aide à la rédaction du rapport, visite en entreprise, préparation de la soutenance, recommandations techniques et évaluation.',
      en: 'Academic follow-up of two interns during their six-month company internship: help with the report, company visit, defense preparation, technical recommendations and evaluation.',
      es: 'Seguimiento académico de dos estudiantes en prácticas durante su estancia de seis meses en empresa: ayuda con el informe, visita a la empresa, preparación de la defensa, recomendaciones técnicas y evaluación.',
    },
    tags: ['Stage', 'Tutorat', 'Suivi pédagogique', 'Évaluation'],
  },

  /** ▸ Stage · IMT Albi (à distance) */
  {
    id: 'stage-imt-albi',
    kind: 'internship',
    mode: 'remote',
    start: 2025,
    end: 2025,
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
      fr: 'Encadrement d\'un stage de quatre mois sur l\'élaboration d\'un RAG avec ChromaDB, LangChain, Python et un petit LLM via Ollama. Aide à la rédaction du rapport, visite en entreprise, préparation de la soutenance et recommandations techniques.',
      en: 'Supervised a four-month internship on building a RAG pipeline with ChromaDB, LangChain, Python and a small LLM via Ollama. Helped with the report, company visit, defense preparation and technical recommendations.',
      es: 'Supervisión de una estancia de cuatro meses sobre la elaboración de un RAG con ChromaDB, LangChain, Python y un pequeño LLM mediante Ollama. Ayuda con el informe, visita a la empresa, preparación de la defensa y recomendaciones técnicas.',
    },
    tags: ['RAG', 'LLM', 'ChromaDB', 'LangChain', 'Ollama', 'Python'],
  },

  /** ▸ Stage · LIASD — Université Paris 8 */
  {
    id: 'stage-liasd',
    kind: 'internship',
    mode: 'onsite',
    start: 2024,
    end: 2024,
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
      fr: 'Encadrement d\'un stage de six mois sur la classification de texte : constitution du jeu de données, nettoyage, suppression des stop words, lemmatisation, tokenisation, entraînement d\'un LSTM avec Keras et évaluation. Aide à la rédaction du rapport, visite en entreprise, préparation de la soutenance et recommandations techniques.',
      en: 'Supervised a six-month internship on text classification: dataset construction, cleaning, stop-word removal, lemmatization, tokenization, LSTM training with Keras and evaluation. Helped with the report, company visit, defense preparation and technical recommendations.',
      es: 'Supervisión de una estancia de seis meses sobre clasificación de texto: construcción del conjunto de datos, limpieza, eliminación de stop words, lematización, tokenización, entrenamiento de un LSTM con Keras y evaluación. Ayuda con el informe, visita a la empresa, preparación de la defensa y recomendaciones técnicas.',
    },
    tags: ['NLP', 'Classification de texte', 'LSTM', 'Keras', 'Python', 'Prétraitement', 'Stop words', 'Lemmatisation', 'Tokenisation'],
  },
];
