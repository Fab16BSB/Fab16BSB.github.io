/**
 * Données : offres de référence du parcours de visite.
 *
 * Jeu réaliste de recruteurs, exécuté en FR / EN / ES par
 * `npm run visit:test` et détaillé par `npm run visit:report`.
 * Ce fichier sert à régler les seuils : les cas de contrôle qui ne doivent
 * pas guider le réglage vivent dans `visit-blind.data.ts`.
 * Une offre décrit un besoin réel, jamais un quiz technique.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import type { Localized } from '@/types/common.types';
import type {
  VisitFit,
  VisitSectionId,
} from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   Contrat des attentes vérifiées par `check-visit-questions.ts`.
   ───────────────────────────────────────────────────────────────────────── */

/** Attente sur l'ancienneté calculée d'une compétence. */
export type VisitQuestionTenureExpectation = {
  skillId: string;
  firstYear?: number;
  lastYear?: number;
  spanYears?: number;
  professionalYears?: number | null;
  isCurrent?: boolean;
};

/** Attentes vérifiées pour une offre. */
export type VisitQuestionExpectation = {
  fit?: VisitFit;
  hasMatches?: boolean;
  gaps?: string[];
  sections?: VisitSectionId[];
  excludedSections?: VisitSectionId[];
  targets?: string[];
  excludedTargets?: string[];
  tenure?: VisitQuestionTenureExpectation[];
  skills?: string[];
  evidenceTargets?: string[];
  excludedEvidenceTargets?: string[];
  evidenceAnyPrefixes?: string[];
  minSteps?: number;
  maxSteps?: number;
};

/** Offre de référence et résultat attendu. */
export type VisitQuestion = {
  id: string;
  question: Localized;
  requiresAvailability?: boolean;
  expected: VisitQuestionExpectation;
};

/* ─────────────────────────────────────────────────────────────────────────
   OFFRES DE RÉFÉRENCE
   ───────────────────────────────────────────────────────────────────────── */

/** Offres réalistes pour le profil de Fabien Poirier. */
export const visitQuestions: VisitQuestion[] = [

  // IA appliquée et industrialisation
  {
    id: 'consultant-rag-client',
    question: {
      fr: 'Je cherche un consultant RAG pour industrialiser un assistant documentaire chez un client.',
      en: 'I am looking for a RAG consultant to industrialise a document assistant for a client.',
      es: 'Busco un consultor RAG para industrializar un asistente documental a partir de documentos de clientes.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['timeline', 'skills'],
      excludedSections: ['teaching', 'publications', 'videos', 'awards'],
      targets: [
        'experience-freelance-leasup',
        'skill-langchain',
        'skill-chromadb',
      ],
      evidenceTargets: ['experience-freelance-leasup'],
      maxSteps: 5,
    },
  },
  {
    id: 'chatbot-documents',
    question: {
      fr: 'Nous cherchons un développeur pour créer un chatbot qui répond aux questions des clients à partir de documents internes.',
      en: 'We are looking for a developer to build a chatbot that answers customer questions from internal documents.',
      es: 'Buscamos un desarrollador para crear un chatbot que responda a las preguntas de los clientes a partir de documentos internos.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['skills', 'timeline', 'projects'],
      excludedSections: ['teaching', 'publications', 'videos', 'awards'],
      targets: ['experience-ater-paris8', 'project-story-bot', 'skill-langchain'],
      evidenceTargets: ['experience-ater-paris8', 'project-story-bot'],
      maxSteps: 5,
    },
  },
  {
    id: 'ml-engineer-production',
    question: {
      fr: 'Nous recrutons un ML Engineer pour déployer des modèles en production avec Docker, MLflow et API REST.',
      en: 'We are hiring an ML Engineer to deploy models in production with Docker, MLflow and REST APIs.',
      es: 'Buscamos un ML Engineer para desplegar modelos en producción con Docker, MLflow y API REST.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['skills', 'timeline'],
      excludedSections: ['teaching', 'publications'],
      targets: ['skill-docker', 'skill-mlflow', 'skill-api-rest'],
      evidenceTargets: ['skill-docker', 'skill-mlflow', 'skill-api-rest'],
      excludedEvidenceTargets: ['experience-ater-paris8'],
      maxSteps: 5,
    },
  },
  {
    id: 'mlops-consultant',
    question: {
      fr: 'Nous cherchons un consultant MLOps pour concevoir un pipeline de bout en bout.',
      en: 'We are looking for an MLOps consultant to design an end-to-end pipeline.',
      es: 'Buscamos un consultor MLOps para diseñar un pipeline de extremo a extremo.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['skills', 'timeline'],
      excludedSections: ['teaching', 'publications'],
      targets: ['skill-docker', 'skill-mlflow', 'skill-api-rest'],
      evidenceTargets: ['skill-docker', 'skill-mlflow'],
      excludedEvidenceTargets: ['experience-ater-paris8'],
      maxSteps: 5,
    },
  },
  {
    id: 'data-scientist-product',
    question: {
      fr: 'Nous cherchons un data scientist senior pour une équipe produit : Python, pandas et scikit-learn.',
      en: 'We are looking for a senior data scientist for a product team: Python, pandas and scikit-learn.',
      es: 'Buscamos un data scientist senior para un equipo de producto: Python, pandas y scikit-learn.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['skills', 'projects', 'timeline'],
      excludedSections: ['teaching', 'publications'],
      targets: [
        'skill-python',
        'skill-pandas',
        'project-kaggle-auto-mpg',
      ],
      maxSteps: 5,
    },
  },

  // Vision et recherche
  {
    id: 'video-anomaly-mission',
    question: {
      fr: 'Mission de détection d\'anomalies vidéo en temps réel pour un client industriel.',
      en: 'Real-time video anomaly detection mission for an industrial client.',
      es: 'Misión de detección de anomalías en vídeo en tiempo real para un cliente industrial.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['projects', 'timeline', 'skills'],
      excludedSections: ['teaching'],
      targets: [
        'project-these',
        'experience-these-othello',
        'skill-opencv',
      ],
      maxSteps: 5,
    },
  },
  {
    id: 'research-scientist-cv',
    question: {
      fr: 'Poste de research scientist en vision par ordinateur, publications exigées.',
      en: 'Research scientist position in computer vision, publications required.',
      es: 'Puesto de research scientist en visión por computador, publicaciones exigidas.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['publications', 'projects', 'timeline', 'skills'],
      excludedSections: ['teaching', 'videos'],
      targets: ['project-these', 'education-phd', 'skill-opencv'],
      evidenceAnyPrefixes: ['publication-'],
      maxSteps: 5,
    },
  },
  {
    id: 'postdoc-nlp',
    question: {
      fr: 'Postdoc en NLP et LLM avec publications et expérimentation.',
      en: 'Postdoc in NLP and LLMs with publications and experimentation.',
      es: 'Postdoc en NLP y LLM con publicaciones y experimentación.',
    },
    expected: {
      fit: 'partial',
      gaps: ['visit.gaps.publications'],
      sections: ['projects', 'skills', 'timeline'],
      excludedSections: ['teaching'],
      targets: ['project-story-bot', 'skill-huggingface'],
      evidenceTargets: ['skill-langchain'],
      maxSteps: 5,
    },
  },

  // Enseignement
  {
    id: 'nlp-trainer',
    question: {
      fr: 'Nous cherchons un formateur NLP pour développeurs juniors.',
      en: 'We are looking for an NLP trainer for junior developers.',
      es: 'Buscamos un formador NLP para desarrolladores junior.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['teaching', 'skills'],
      excludedSections: ['publications'],
      targets: ['skill-nltk', 'skill-huggingface'],
      evidenceTargets: ['skill-langchain', 'skill-huggingface'],
      evidenceAnyPrefixes: ['course-', 'supervision-'],
      maxSteps: 5,
    },
  },
  {
    id: 'teacher-researcher',
    question: {
      fr: 'Poste d\'enseignant-chercheur en IA et Deep Learning : cours, encadrement et publications.',
      en: 'Teacher-researcher position in AI and Deep Learning: courses, supervision and publications.',
      es: 'Puesto de profesor-investigador en IA y Deep Learning: cursos, supervisión y publicaciones.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['teaching', 'publications', 'timeline'],
      excludedSections: ['videos', 'awards'],
      targets: ['course-deep-learning-2023', 'education-phd'],
      evidenceAnyPrefixes: ['publication-'],
      maxSteps: 5,
    },
  },
  {
    id: 'java-teacher',
    question: {
      fr: 'Nous cherchons un enseignant en programmation Java pour le BUT.',
      en: 'We are looking for a Java programming teacher for the BUT.',
      es: 'Buscamos un docente de programación Java para el BUT.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['teaching', 'timeline'],
      excludedSections: ['publications'],
      targets: ['course-oop-java-2023', 'skill-java'],
      evidenceTargets: ['skill-java'],
      evidenceAnyPrefixes: ['course-'],
      maxSteps: 5,
    },
  },

  // Produit et analyse de données
  {
    id: 'fullstack-ai',
    question: {
      fr: 'Nous cherchons un profil full-stack IA avec Python et React pour un produit interne.',
      en: 'We are looking for a full-stack AI profile with Python and React for an internal product.',
      es: 'Buscamos un perfil full-stack IA con Python y React para un producto interno.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['projects', 'skills'],
      excludedSections: ['teaching', 'publications'],
      targets: ['project-scheduler-finder', 'skill-react', 'skill-python'],
      evidenceTargets: ['skill-react', 'skill-python'],
      maxSteps: 5,
    },
  },
  {
    id: 'data-analyst-sql',
    question: {
      fr: 'Nous cherchons un data analyst avec SQL, Python et de la visualisation.',
      en: 'We are looking for a data analyst with SQL, Python and visualisation.',
      es: 'Buscamos un data analyst con SQL, Python y visualización.',
    },
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['skills', 'projects', 'timeline'],
      excludedSections: ['teaching', 'publications'],
      targets: [
        'skill-sql',
        'skill-python',
        'skill-seaborn',
        'skill-matplotlib',
      ],
      evidenceTargets: ['skill-sql', 'skill-python'],
      excludedEvidenceTargets: ['experience-stage-directannonces'],
      maxSteps: 5,
    },
  },

  // Compétence isolée et disponibilité
  {
    id: 'latex-skills',
    question: {
      fr: 'Compétences LaTeX',
      en: 'LaTeX skills',
      es: 'Competencias LaTeX',
    },
    expected: {
      fit: 'partial',
      gaps: ['visit.gaps.projects'],
      sections: ['skills'],
      excludedSections: ['projects', 'timeline'],
      targets: ['skill-latex'],
      maxSteps: 2,
    },
  },
  {
    id: 'freelance-availability',
    question: {
      fr: 'Êtes-vous disponible pour une mission freelance de six mois ?',
      en: 'Are you available for a six-month freelance mission?',
      es: '¿Está disponible para una misión freelance de seis meses?',
    },
    requiresAvailability: true,
    expected: {
      fit: 'strong',
      gaps: [],
      sections: ['about', 'timeline'],
      excludedSections: ['teaching', 'publications'],
      targets: ['about-profile', 'experience-freelance-leasup'],
      maxSteps: 3,
    },
  },

  // Abstentions attendues
  {
    id: 'aws-banking',
    question: {
      fr: 'Mission bancaire avec AWS et GCP pour une équipe réglementaire.',
      en: 'Banking mission with AWS and GCP for a regulatory team.',
      es: 'Misión bancaria con AWS y GCP para un equipo regulatorio.',
    },
    expected: {
      fit: 'weak',
      hasMatches: false,
      gaps: ['visit.gaps.unknown', 'visit.gaps.unknown'],
      maxSteps: 5,
    },
  },
  {
    id: 'chef-cuisine',
    question: {
      fr: 'Nous cherchons un chef de cuisine pour un restaurant gastronomique.',
      en: 'We are looking for a head chef for a gourmet restaurant.',
      es: 'Buscamos un jefe de cocina para un restaurante gastronómico.',
    },
    expected: {
      fit: 'weak',
      hasMatches: false,
      gaps: ['visit.gaps.coverage'],
      maxSteps: 5,
    },
  },
];
