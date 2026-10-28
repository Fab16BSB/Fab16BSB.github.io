import type { Experience } from '@/types/experience.types';
import { links } from './links.data';

/**
 * Expériences professionnelles, de la plus récente à la plus ancienne.
 *
 * Élément de type `Experience`.
 *
 * @property {string} id - Identifiant stable.
 * @property {number} start - Année de début.
 * @property {number | 'present'} end - Année de fin ou 'present'.
 * @property {ExperienceType} type - Type de contrat.
 * @property {Localized} role - Intitulé du poste en FR / EN / ES.
 * @property {string} company - Nom de l'entreprise.
 * @property {string} [companyUrl] - URL de l'entreprise.
 * @property {string} [secondaryUrl] - URL secondaire, par exemple le laboratoire.
 * @property {Localized} [description] - Description longue.
 * @property {Localized[]} [points] - Points clés.
 * @property {string[]} tags - Technologies et mots-clés.
 * @property {Accent} accent - Couleur d'accent.
 * @property {boolean} [legacy] - Marque les expériences anciennes.
 */
export const experiences: Experience[] = [

  /** ▸ 2026–présent · Freelance RAG — Leasup */
  {
    id: 'freelance-leasup',
    start: 2026,
    end: 'present',
    type: 'freelance',
    role: {
      fr: 'Freelance — Assistant IA (RAG)',
      en: 'Freelance — AI Assistant (RAG)',
      es: 'Freelance — Asistente de IA (RAG)',
    },
    company: 'Leasup',
    companyUrl: links.organizations.leasup,
    description: {
      fr: 'Conception d\'un système de Retrieval-Augmented Generation (RAG) spécialisé dans l\'analyse de contrats immobiliers. Mise en place d\'un pipeline complet allant de l\'OCR (extraction de texte depuis des documents scannés) à la recherche hybride (sémantique et textuelle) via Elasticsearch. Orchestration de modèles via les API de Mistral AI et Gemini. Développement d\'une API backend et d\'une interface de chat dynamique sous React intégrée à l\'écosystème client.',
      en: 'Designed a Retrieval-Augmented Generation (RAG) system specialised in real-estate contract analysis. Built a complete pipeline from OCR (text extraction from scanned documents) to hybrid search (semantic and keyword) via Elasticsearch. Orchestrated models through the Mistral AI and Gemini APIs. Developed a backend API and a dynamic React chat interface integrated into the client ecosystem.',
      es: 'Diseño de un sistema de Retrieval-Augmented Generation (RAG) especializado en el análisis de contratos inmobiliarios. Implementación de un pipeline completo desde el OCR (extracción de texto de documentos escaneados) hasta la búsqueda híbrida (semántica y textual) mediante Elasticsearch. Orquestación de modelos mediante las API de Mistral AI y Gemini. Desarrollo de una API backend y una interfaz de chat dinámica en React integrada en el ecosistema del cliente.',
    },
    tags: ['RAG', 'Mistral AI', 'Gemini', 'Elasticsearch', 'OCR', 'React', 'API REST'],
    accent: 'cyan',
  },

  /** ▸ 2023–2025 · ATER — IUT Montreuil, Université Paris 8 */
  {
    id: 'ater-paris8',
    start: 2023,
    end: 2025,
    type: 'cdd',
    role: {
      fr: 'ATER — Attaché Temporaire d\'Enseignement et de Recherche',
      en: 'Temporary Teaching and Research Associate',
      es: 'Asociado Temporal de Enseñanza e Investigación',
    },
    company: 'IUT Montreuil — Université Paris 8',
    companyUrl: links.organizations.sit,
    points: [
      {
        fr: 'Enseignement de Python et du Deep Learning.',
        en: 'Taught Python and Deep Learning.',
        es: 'Enseñanza de Python y Deep Learning.',
      },
      {
        fr: 'Développement de SecretarIA, un chatbot qui répond aux questions à partir de plusieurs types de documents (FAQ au format CSV, PDF comme un programme national, etc.). Il retrouve les passages utiles avec LangChain et ChromaDB, fait tourner les modèles localement avec Ollama, et s\'intègre via une API Flask/Swagger, le tout déployé avec Docker.',
        en: 'Built SecretarIA, a chatbot that answers questions from several document types (CSV FAQs, PDFs such as a national curriculum, etc.). It retrieves relevant passages with LangChain and ChromaDB, runs models locally with Ollama, and is exposed through a Flask/Swagger API, all deployed with Docker.',
        es: 'Desarrollo de SecretarIA, un chatbot que responde a preguntas a partir de varios tipos de documentos (FAQ en CSV, PDF como un programa nacional, etc.). Encuentra los fragmentos relevantes con LangChain y ChromaDB, ejecuta los modelos localmente con Ollama y se integra mediante una API Flask/Swagger, todo desplegado con Docker.',
      },
    ],
    tags: ['Python', 'Deep Learning', 'LangChain', 'ChromaDB', 'Ollama', 'Flask', 'Docker'],
    accent: 'indigo',
  },

  /** ▸ 2019–2022 · Thèse CIFRE — Othello */
  {
    id: 'these-othello',
    start: 2019,
    end: 2022,
    type: 'thesis',
    role: {
      fr: 'Doctorant CIFRE — Détection d\'anomalies en temps réel dans un flux vidéo',
      en: 'CIFRE PhD student — Real-time anomaly detection in video streams',
      es: 'Doctorando CIFRE — Detección de anomalías en tiempo real en flujos de vídeo',
    },
    company: 'Othello',
    companyUrl: links.organizations.othello,
    secondaryUrl: links.organizations.lab,
    description: {
      fr: 'Développement d\'un système de détection d\'anomalies (incendies, bagarres, coups de feu) en temps réel dans des flux vidéo, conçu dans le cadre d\'un appel à projets pour les Jeux olympiques de Paris 2024. Le pipeline associe la détection d\'objets clés via YOLOv7 à une analyse comportementale par un modèle VGG19 + GRU. La solution atteint une précision supérieure à 85 % pour un temps d\'inférence de 0,8 à 1,5 seconde, et a été récompensée par le prix de la meilleure démonstration à la conférence EGC 2022.',
      en: 'Developed a real-time anomaly detection system (fires, fights, gunshots) for video streams, designed as part of a call for projects for the Paris 2024 Olympic Games. The pipeline combines key-object detection with YOLOv7 and behavioural analysis with a VGG19 + GRU model. The solution achieves over 85% accuracy with an inference time of 0.8–1.5 seconds and won the Best Demo Award at the EGC 2022 conference.',
      es: 'Desarrollo de un sistema de detección de anomalías (incendios, peleas, disparos) en tiempo real en flujos de vídeo, concebido en el marco de una convocatoria de proyectos para los Juegos Olímpicos de París 2024. El pipeline combina la detección de objetos clave mediante YOLOv7 con un análisis conductual mediante un modelo VGG19 + GRU. La solución alcanza una precisión superior al 85 % con un tiempo de inferencia de 0,8 a 1,5 segundos y recibió el premio a la mejor demostración en la conferencia EGC 2022.',
    },
    tags: ['YOLOv7', 'VGG19', 'GRU', 'Keras', 'OpenCV', 'Computer Vision'],
    accent: 'rose',
  },

  /** ▸ 2018 · Stage Master — Quatorze-IG */
  {
    id: 'stage-quatorze',
    start: 2018,
    end: 2018,
    type: 'internship',
    role: {
      fr: 'Stage Master — Analyse automatisée de factures',
      en: 'Master internship — Automated invoice analysis',
      es: 'Prácticas de máster — Análisis automatizado de facturas',
    },
    company: 'Quatorze-IG',
    companyUrl: links.organizations.quatorze,
    description: {
      fr: 'Conception d\'un système d\'analyse automatique de factures en Python avec scikit-learn. Le pipeline couvre le feature engineering, l\'entraînement d\'un SVM et la classification supervisée.',
      en: 'Designed an automated invoice analysis system in Python with scikit-learn. The pipeline covers feature engineering, SVM training and supervised classification.',
      es: 'Diseño de un sistema de análisis automático de facturas en Python con scikit-learn. El pipeline incluye feature engineering, entrenamiento de un SVM y clasificación supervisada.',
    },
    tags: ['Python', 'scikit-learn', 'SVM', 'Machine Learning'],
    accent: 'amber',
    legacy: true,
  },

  /** ▸ 2017 · Stage Java — Directannonces */
  {
    id: 'stage-directannonces',
    start: 2017,
    end: 2017,
    type: 'internship',
    role: {
      fr: 'Stage — Développeur Java',
      en: 'Internship — Java Developer',
      es: 'Prácticas — Desarrollador Java',
    },
    company: 'Directannonces',
    companyUrl: links.organizations.directannonces,
    description: {
      fr: 'Développement d\'un outil de crawling web en Java avec HtmlUnit pour récupérer et classer des petites annonces immobilières et automobiles.',
      en: 'Developed a Java web crawler with HtmlUnit to collect and classify real-estate and automotive ads.',
      es: 'Desarrollo de una herramienta de crawling web en Java con HtmlUnit para recopilar y clasificar anuncios inmobiliarios y automovilísticos.',
    },
    tags: ['Java', 'HtmlUnit', 'Web Scraping'],
    accent: 'emerald',
    legacy: true,
  },

  /** ▸ 2016 · Stage iOS — Soldout */
  {
    id: 'stage-soldout',
    start: 2016,
    end: 2016,
    type: 'internship',
    role: {
      fr: 'Stage — Développeur iOS',
      en: 'Internship — iOS Developer',
      es: 'Prácticas — Desarrollador iOS',
    },
    company: 'Soldout',
    companyUrl: links.organizations.soldout,
    description: {
      fr: 'Développement d\'une application iOS avec Appcelerator Titanium, publiée sur l\'App Store, pour consulter, réserver et acheter des places de spectacle.',
      en: 'Developed an iOS app with Appcelerator Titanium, published on the App Store, to browse, book and buy show tickets.',
      es: 'Desarrollo de una aplicación iOS con Appcelerator Titanium, publicada en la App Store para consultar, reservar y comprar entradas de espectáculos.',
    },
    tags: ['iOS', 'Appcelerator Titanium', 'Mobile'],
    accent: 'slate',
    legacy: true,
  },
];
