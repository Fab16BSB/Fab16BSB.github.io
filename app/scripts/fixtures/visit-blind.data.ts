/**
 * Données : jeu de contrôle du routage de visite.
 *
 * Requêtes réalistes exécutées en FR / EN / ES par `npm run visit:blind`.
 * Ce jeu est aveugle : il ne sert jamais à régler les seuils et ses attentes
 * restent souples. Un cas qui échoue ici signale une régression de routage ;
 * on corrige le routeur, pas l'attente.
 * Aucune offre n'est dupliquée depuis `visit-questions.data.ts`.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import type { Localized } from '@/types/common.types';
import type { VisitSectionId } from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   Contrat des attentes vérifiées par `check-visit-blind.ts`.
   ───────────────────────────────────────────────────────────────────────── */

/** Attentes souples : sections à retrouver ou à ne pas proposer. */
export type VisitBlindExpectation = {
  sections?: VisitSectionId[];
  excludedSections?: VisitSectionId[];
  weak?: boolean;
};

/** Une requête de contrôle et son attente. */
export type VisitBlindCase = {
  id: string;
  question: Localized;
  requiresAvailability?: boolean;
  expected: VisitBlindExpectation;
};

/* ─────────────────────────────────────────────────────────────────────────
   REQUÊTES DE CONTRÔLE
   ───────────────────────────────────────────────────────────────────────── */

/** Requêtes de contrôle, volontairement séparées de `visit-questions`. */
export const visitBlindCases: VisitBlindCase[] = [

  // Enseignement
  {
    id: 'tp-machine-learning',
    question: {
      fr: 'Animer des TP de machine learning pour des étudiants.',
      en: 'Lead machine learning practical sessions for students.',
      es: 'Impartir prácticas de machine learning para estudiantes.',
    },
    expected: {
      sections: ['teaching'],
      excludedSections: ['publications', 'videos'],
    },
  },
  {
    id: 'professeur-java',
    question: {
      fr: 'Professeur vacataire en Java pour le BUT.',
      en: 'Adjunct Java professor for the undergraduate program.',
      es: 'Profesor asociado de Java para el grado.',
    },
    expected: {
      sections: ['teaching'],
      excludedSections: ['publications'],
    },
  },
  {
    id: 'encadrement-stagiaires',
    question: {
      fr: 'Encadrement de stagiaires.',
      en: 'Supervision of interns.',
      es: 'Supervisión de estudiantes en prácticas.',
    },
    expected: {
      sections: ['teaching'],
      excludedSections: ['publications'],
    },
  },
  {
    id: 'enseignement-recherche',
    question: {
      fr: 'Enseignement et recherche.',
      en: 'Teaching and research.',
      es: 'Docencia e investigación.',
    },
    expected: {
      sections: ['teaching'],
      excludedSections: ['videos', 'awards'],
    },
  },

  // Recherche et publications
  {
    id: 'chercheur-vision',
    question: {
      fr: 'Chercheur en vision par ordinateur.',
      en: 'Computer vision researcher.',
      es: 'Investigador en visión por computador.',
    },
    expected: {
      sections: ['publications'],
      excludedSections: ['teaching', 'videos'],
    },
  },
  {
    id: 'publication-video',
    question: {
      fr: 'Publication sur la détection d’anomalies vidéo.',
      en: 'Publication on video anomaly detection.',
      es: 'Publicación sobre detección de anomalías en vídeo.',
    },
    expected: {
      sections: ['publications'],
      excludedSections: ['videos'],
    },
  },
  {
    id: 'recherche-nlp-llm',
    question: {
      fr: 'Recherche en NLP et LLM.',
      en: 'Research in NLP and LLMs.',
      es: 'Investigación en NLP y LLM.',
    },
    expected: {
      sections: ['publications'],
      excludedSections: ['teaching'],
    },
  },
  {
    id: 'publications-nlp',
    question: {
      fr: 'Publications en NLP.',
      en: 'Publications in NLP.',
      es: 'Publicaciones en NLP.',
    },
    expected: {
      sections: ['publications'],
      excludedSections: ['videos'],
    },
  },

  // Vidéos et vulgarisation
  {
    id: 'tutoriels-deep-learning',
    question: {
      fr: 'Tutoriels YouTube sur le deep learning.',
      en: 'YouTube tutorials on deep learning.',
      es: 'Tutoriales de YouTube sobre deep learning.',
    },
    expected: {
      sections: ['videos'],
      excludedSections: ['publications'],
    },
  },
  {
    id: 'vulgarisation-video',
    question: {
      fr: 'Vulgarisation scientifique en vidéo.',
      en: 'Scientific outreach through video.',
      es: 'Divulgación científica en vídeo.',
    },
    expected: {
      sections: ['videos'],
      excludedSections: ['publications'],
    },
  },
  {
    id: 'youtube-python',
    question: {
      fr: 'Chaîne YouTube Python.',
      en: 'Python YouTube channel.',
      es: 'Canal de YouTube sobre Python.',
    },
    expected: {
      sections: ['videos'],
      excludedSections: ['publications'],
    },
  },

  // IA appliquée et compétences techniques
  {
    id: 'chatbot-rag',
    question: {
      fr: 'Industrialiser un chatbot RAG.',
      en: 'Industrialise a RAG chatbot.',
      es: 'Industrializar un chatbot RAG.',
    },
    expected: {
      sections: ['skills'],
      excludedSections: ['teaching', 'videos'],
    },
  },
  {
    id: 'docker-mlflow',
    question: {
      fr: 'Déployer des modèles avec Docker et MLflow.',
      en: 'Deploy models with Docker and MLflow.',
      es: 'Desplegar modelos con Docker y MLflow.',
    },
    expected: {
      sections: ['skills'],
      excludedSections: ['teaching'],
    },
  },
  {
    id: 'pandas-sql',
    question: {
      fr: 'Analyse de données avec pandas et SQL.',
      en: 'Data analysis with pandas and SQL.',
      es: 'Análisis de datos con pandas y SQL.',
    },
    expected: {
      sections: ['skills'],
      excludedSections: ['teaching'],
    },
  },
  {
    id: 'fullstack-react',
    question: {
      fr: 'Développeur fullstack React TypeScript.',
      en: 'Full-stack React TypeScript developer.',
      es: 'Desarrollador fullstack React TypeScript.',
    },
    expected: {
      sections: ['skills'],
      excludedSections: ['teaching', 'publications'],
    },
  },
  {
    id: 'python-pytorch-vision',
    question: {
      fr: 'Python, PyTorch et computer vision.',
      en: 'Python, PyTorch and computer vision.',
      es: 'Python, PyTorch y visión por computador.',
    },
    expected: {
      sections: ['skills'],
      excludedSections: ['teaching', 'publications'],
    },
  },

  // Projet technique et distinctions
  {
    id: 'video-surveillance',
    question: {
      fr: 'Détection d’anomalies dans des vidéos de surveillance.',
      en: 'Anomaly detection in surveillance videos.',
      es: 'Detección de anomalías en vídeos de vigilancia.',
    },
    expected: {
      sections: ['projects'],
      excludedSections: ['videos', 'teaching'],
    },
  },
  {
    id: 'prix-ia',
    question: {
      fr: 'Prix et distinctions en intelligence artificielle.',
      en: 'Awards and distinctions in artificial intelligence.',
      es: 'Premios y distinciones en inteligencia artificial.',
    },
    expected: {
      excludedSections: ['teaching', 'videos'],
    },
  },

  // Disponibilité
  {
    id: 'mission-freelance',
    question: {
      fr: 'Disponible pour une mission freelance de six mois.',
      en: 'Available for a six-month freelance mission.',
      es: 'Disponible para una misión freelance de seis meses.',
    },
    requiresAvailability: true,
    expected: {
      sections: ['timeline'],
      excludedSections: ['teaching', 'publications'],
    },
  },

  // Abstentions attendues
  {
    id: 'stage-marketing',
    question: {
      fr: 'Stage en marketing digital.',
      en: 'Digital marketing internship.',
      es: 'Prácticas en marketing digital.',
    },
    expected: {
      weak: true,
    },
  },
];
