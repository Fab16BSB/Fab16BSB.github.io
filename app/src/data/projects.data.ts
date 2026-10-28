import type { Project } from '@/types/project.types';
import { links } from './links.data';

/**
 * Projets affichés dans la section Projects.
 *
 * Élément de type `Project`.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} year - Année affichée.
 * @property {ProjectCategory} category - Projet académique, personnel ou professionnel.
 * @property {Localized} title - Titre en FR / EN / ES.
 * @property {Localized} description - Description courte en FR / EN / ES.
 * @property {Localized} details - Description détaillée en FR / EN / ES.
 * @property {Localized[]} [highlights] - Points clés en FR / EN / ES.
 * @property {string[]} stack - Technologies utilisées.
 * @property {Object} links - Liens du projet.
 * @property {string} [links.github] - Dépôt GitHub.
 * @property {string} [links.demo] - Démonstration.
 * @property {string} [links.video] - Vidéo.
 * @property {string} [links.site] - Site en ligne.
 * @property {string} [links.pdf] - Document PDF.
 * @property {ProjectExtraLink[]} [extraLinks] - Liens supplémentaires (`label`, `url`, `icon`).
 * @property {string} [image] - Visuel de la carte (URL /images/projects/...).
 * @property {ProjectGalleryImage[]} [gallery] - Captures détaillées (`src`, `caption`).
 * @property {'active' | 'archived'} [status] - Statut du projet.
 * @property {ProjectStudyLevel} [studyLevel] - Niveau d'études associé.
 * @property {Accent} accent - Couleur d'accent.
 * @property {string} icon - Texte affiché si le visuel manque.
 */
export const projects: Project[] = [

  /** ▸ Professionnel · 2025 · Scheduler Finder */
  {
    id: 'scheduler-finder',
    year: '2025',
    category: 'professional',
    title: {
      fr: 'Scheduler Finder',
      en: 'Scheduler Finder',
      es: 'Scheduler Finder',
    },
    description: {
      fr: 'Application interne qui génère automatiquement les plannings de soutenances de fin d\'année (stages et alternance).',
      en: 'Internal application that automatically generates end-of-year defense schedules (internships and apprenticeship programs).',
      es: 'Aplicación interna que genera automáticamente los calendarios de defensas de fin de año (prácticas y alternancia).',
    },
    details: {
      fr: 'Projet réalisé en tant que co-responsable de l\'alternance, pour répondre à un besoin interne de l\'IUT de Montreuil. Objectif : automatiser la génération des plannings de soutenances de fin d\'année (stages et alternance).',
      en: 'Built as co-head of apprenticeship programs to meet an internal need at IUT Montreuil. Goal: automate the generation of end-of-year defense schedules (internships and apprenticeship programs).',
      es: 'Proyecto realizado como co-responsable de la formación en alternancia para responder a una necesidad interna del IUT de Montreuil. Objetivo: automatizar la generación de los calendarios de defensas de fin de año (prácticas y alternancia).',
    },
    highlights: [
      {
        fr: 'Gestion des salles disponibles, des étudiants et de leurs tuteurs référents.',
        en: 'Manages available rooms, students and their supervising professors.',
        es: 'Gestión de las salas disponibles, los estudiantes y sus tutores.',
      },
      {
        fr: 'Prise en compte des contraintes de dates, d\'horaires, de durées et de pauses.',
        en: 'Takes date, time, duration and break constraints into account.',
        es: 'Tiene en cuenta las restricciones de fechas, horarios, duraciones y pausas.',
      },
      {
        fr: 'Conception et développement de l\'algorithme de constitution des jurys et de répartition des soutenances.',
        en: 'Designed and developed the algorithm that builds juries and distributes defenses.',
        es: 'Diseño y desarrollo del algoritmo de constitución de jurados y reparto de defensas.',
      },
      {
        fr: 'Équilibrage du nombre de soutenances par jury et présence du professeur référent de chaque étudiant.',
        en: 'Balances the number of defenses per jury and ensures each student\'s supervising professor is present.',
        es: 'Equilibrio del número de defensas por jurado y presencia del profesor tutor de cada estudiante.',
      },
      {
        fr: 'Ajout de professeurs neutres, réduction des déplacements des jurys et des temps morts.',
        en: 'Adds neutral professors while reducing jury travel and idle time.',
        es: 'Incorporación de profesores neutrales y reducción de los desplazamientos de los jurados y de los tiempos muertos.',
      },
      {
        fr: 'Tests et validation des résultats sur des données réelles.',
        en: 'Tested and validated the results on real data.',
        es: 'Pruebas y validación de los resultados con datos reales.',
      },
    ],
    stack: ['Optimisation', 'Planification', 'Application web'],
    links: {},
    image: '/images/projects/scheduler-finder.webp',
    gallery: [
      {
        src: '/images/projects/scheduler-finder-salles.webp',
        caption: {
          fr: 'Gestion des salles disponibles',
          en: 'Available room management',
          es: 'Gestión de las salas disponibles',
        },
      },
      {
        src: '/images/projects/scheduler-finder-professeurs.webp',
        caption: {
          fr: 'Liste des professeurs',
          en: 'Professor list',
          es: 'Lista de profesores',
        },
      },
      {
        src: '/images/projects/scheduler-finder-etudiants.webp',
        caption: {
          fr: 'Étudiants et tuteurs référents',
          en: 'Students and supervising professors',
          es: 'Estudiantes y tutores',
        },
      },
      {
        src: '/images/projects/scheduler-finder-contraintes.webp',
        caption: {
          fr: 'Contraintes de dates, durées et pauses',
          en: 'Date, duration and break constraints',
          es: 'Restricciones de fechas, duraciones y pausas',
        },
      },
      {
        src: '/images/projects/scheduler-finder-soutenances.webp',
        caption: {
          fr: 'Planning global des soutenances',
          en: 'Global defense schedule',
          es: 'Calendario global de defensas',
        },
      },
      {
        src: '/images/projects/scheduler-finder-vue-par-salle.webp',
        caption: {
          fr: 'Vue par salle',
          en: 'View by room',
          es: 'Vista por sala',
        },
      },
    ],
    status: 'active',
    accent: 'indigo',
    icon: 'SCH',
  },

  /** ▸ Personnel · 2023 · ProgEnImages */
  {
    id: 'progenimages',
    year: '2023',
    category: 'personal',
    title: {
      fr: 'ProgEnImages',
      en: 'ProgEnImages',
      es: 'ProgEnImages',
    },
    description: {
      fr: 'Glossaire visuel qui explique les concepts informatiques avec une image par notion.',
      en: 'Visual glossary that explains computer science concepts with one image per idea.',
      es: 'Glosario visual que explica conceptos informáticos con una imagen por noción.',
    },
    details: {
      fr: 'Chaque notion de programmation ou d\'informatique est associée à une illustration et à une explication courte, pour apprendre plus vite et de façon plus visuelle.',
      en: 'Each programming or computer science concept is paired with an illustration and a short explanation to learn faster and more visually.',
      es: 'Cada concepto de programación o informática se asocia a una ilustración y una explicación breve para aprender más rápido y de forma visual.',
    },
    stack: ['TypeScript', 'Web', 'Pédagogie'],
    links: {
      site: 'https://override-community.github.io/ProgEnImages/',
      github: 'https://github.com/override-community/ProgEnImages',
    },
    image: '/images/projects/progEnImage.webp',
    accent: 'cyan',
    icon: 'PEI',
  },

  /** ▸ Thèse · 2022 · Détection d\'anomalies en temps réel */
  {
    id: 'these',
    year: '2022',
    category: 'academic',
    studyLevel: 'doctorate',
    title: {
      fr: 'Détection d\'anomalies en temps réel',
      en: 'Real-time anomaly detection',
      es: 'Detección de anomalías en tiempo real',
    },
    description: {
      fr: 'Système de détection d\'anomalies en temps réel dans des flux vidéo (incendies, bagarres, coups de feu), développé dans le cadre d\'une thèse CIFRE pour les Jeux olympiques de Paris 2024.',
      en: 'Real-time anomaly detection system for video streams (fires, fights, gunshots), developed as part of a CIFRE PhD for the Paris 2024 Olympic Games.',
      es: 'Sistema de detección de anomalías en tiempo real en flujos de vídeo (incendios, peleas, disparos), desarrollado en el marco de un doctorado CIFRE para los Juegos Olímpicos de París 2024.',
    },
    details: {
      fr: 'Le système associe YOLOv7 pour repérer les objets clés à un modèle VGG19 + GRU pour analyser leurs actions. Il atteint plus de 85 % de précision avec une inférence de 0,8 à 1,5 seconde. Code et données confidentiels ; démonstration vidéo et manuscrit disponibles.',
      en: 'The system combines YOLOv7 for key-object detection with a VGG19 + GRU model for action analysis. It reaches over 85% accuracy with 0.8–1.5 second inference. Code and data are confidential; a video demo and the manuscript are available.',
      es: 'El sistema combina YOLOv7 para detectar objetos clave con un modelo VGG19 + GRU para analizar sus acciones. Alcanza más del 85 % de precisión con una inferencia de 0,8 a 1,5 segundos. El código y los datos son confidenciales; hay una demo en vídeo y el manuscrito disponibles.',
    },
    stack: ['YOLOv7', 'VGG19', 'GRU', 'Keras', 'OpenCV', 'Computer Vision'],
    links: {
      github: links.thesis.repo,
      video: links.social.youtubeDemo,
      pdf: links.thesis.pdf,
    },
    image: '/images/projects/anomaly-detection.webp',
    status: 'archived',
    accent: 'rose',
    icon: 'TH',
  },

  /** ▸ Master 2 · 2019 · Story Bot */
  {
    id: 'story-bot',
    year: '2019',
    category: 'academic',
    studyLevel: 'master2',
    title: {
      fr: 'Story Bot',
      en: 'Story Bot',
      es: 'Story Bot',
    },
    description: {
      fr: 'Chatbot de compréhension de récit : on lui donne un texte et on peut lui poser des questions simples dessus.',
      en: 'Narrative comprehension chatbot: give it a story and ask simple questions about it.',
      es: 'Chatbot de comprensión narrativa: se le da un texto y se le pueden hacer preguntas sencillas sobre él.',
    },
    details: {
      fr: 'Projet réalisé en équipe de trois dans le cadre du Master : le modèle lit un récit puis répond à des questions en s\'appuyant uniquement sur le texte fourni (dataset bAbI de Facebook AI Research).',
      en: 'Team project built during the Master\'s degree: the model reads a story and answers questions using only the provided text (Facebook AI Research bAbI dataset).',
      es: 'Proyecto realizado en equipo de tres durante el máster: el modelo lee un relato y responde preguntas basándose únicamente en el texto proporcionado (dataset bAbI de Facebook AI Research).',
    },
    stack: ['Python', 'NLP', 'bAbI', 'Question Answering'],
    links: { github: 'https://github.com/Fab16BSB/story_bot' },
    image: '/images/projects/story-bot.webp',
    accent: 'indigo',
    icon: 'BOT',
  },

  /** ▸ Master 1 · 2018 · Classification d\'images */
  {
    id: 'image-classification',
    year: '2018',
    category: 'academic',
    studyLevel: 'master1',
    title: {
      fr: 'Classification d\'images',
      en: 'Image classification',
      es: 'Clasificación de imágenes',
    },
    description: {
      fr: 'Classification d\'images avec deep learning dans un notebook Jupyter.',
      en: 'Image classification with deep learning in a Jupyter notebook.',
      es: 'Clasificación de imágenes con deep learning en un notebook Jupyter.',
    },
    details: {
      fr: 'Expérimentations de classification d\'images avec Keras et TensorFlow.',
      en: 'Image classification experiments with Keras and TensorFlow.',
      es: 'Experimentos de clasificación de imágenes con Keras y TensorFlow.',
    },
    stack: ['Python', 'Jupyter', 'Keras', 'TensorFlow'],
    links: { github: 'https://github.com/Fab16BSB/image_classification' },
    image: '/images/projects/image-classification.webp',
    accent: 'rose',
    icon: 'IMG',
  },

  /** ▸ BUT3 · 2017 · SOM en Java et C */
  {
    id: 'som',
    year: '2017',
    category: 'academic',
    studyLevel: 'but3',
    title: {
      fr: 'SOM — Java & C',
      en: 'SOM — Java & C',
      es: 'SOM — Java & C',
    },
    description: {
      fr: 'Implémentations d\'un réseau de neurones auto-organisé (SOM) en Java et en C.',
      en: 'Self-organizing map (SOM) implementations in Java and C.',
      es: 'Implementaciones de una red neuronal autoorganizada (SOM) en Java y C.',
    },
    details: {
      fr: 'Deux versions du même réseau SOM entraîné sur le jeu de données Iris : une implémentation Java et une implémentation bas niveau en C pour explorer l\'apprentissage non supervisé.',
      en: 'Two versions of the same SOM network trained on the Iris dataset: a Java implementation and a low-level C implementation to explore unsupervised learning.',
      es: 'Dos versiones de la misma red SOM entrenada con el conjunto de datos Iris: una implementación Java y una implementación de bajo nivel en C para explorar el aprendizaje no supervisado.',
    },
    stack: ['Java', 'C', 'Machine Learning', 'SOM'],
    links: { github: 'https://github.com/Fab16BSB/SOM_JAVA' },
    extraLinks: [
      {
        label: { fr: 'Code C', en: 'C code', es: 'Código C' },
        url: 'https://github.com/Fab16BSB/SOM_C',
        icon: 'github',
      },
    ],
    image: '/images/projects/som.webp',
    accent: 'indigo',
    icon: 'SOM',
  },

  /** ▸ BUT2 · 2016 · Infiltration (Unity) */
  {
    id: 'infiltration',
    year: '2016',
    category: 'academic',
    studyLevel: 'but2',
    title: {
      fr: 'Infiltration',
      en: 'Infiltration',
      es: 'Infiltration',
    },
    description: {
      fr: 'Jeu d\'infiltration en C# avec Unity.',
      en: 'Infiltration game built in C# with Unity.',
      es: 'Juego de infiltración en C# con Unity.',
    },
    details: {
      fr: 'Projet académique de jeu d\'infiltration : level design, déplacements, ennemis et mécaniques de furtivité.',
      en: 'Academic infiltration game project: level design, movement, enemies and stealth mechanics.',
      es: 'Proyecto académico de juego de infiltración: diseño de niveles, movimiento, enemigos y mecánicas de sigilo.',
    },
    stack: ['C#', 'Unity', 'Game Design'],
    links: { github: 'https://github.com/Fab16BSB/Infiltration' },
    image: '/images/projects/infiltration.webp',
    accent: 'emerald',
    icon: 'INF',
  },

  /** ▸ BUT2 · 2016 · Visualiseur Huffman */
  {
    id: 'huffman',
    year: '2016',
    category: 'academic',
    studyLevel: 'but2',
    title: {
      fr: 'Visualiseur Huffman',
      en: 'Huffman Visualizer',
      es: 'Visualizador Huffman',
    },
    description: {
      fr: 'Visualisation de l\'algorithme de compression de Huffman en Java.',
      en: 'Huffman compression algorithm visualization in Java.',
      es: 'Visualización del algoritmo de compresión de Huffman en Java.',
    },
    details: {
      fr: 'Outil pédagogique pour construire et visualiser un arbre de Huffman.',
      en: 'Educational tool to build and visualize a Huffman tree.',
      es: 'Herramienta educativa para construir y visualizar un árbol de Huffman.',
    },
    stack: ['Java', 'Algorithmique', 'Visualisation'],
    links: { github: 'https://github.com/Fab16BSB/Huffman_Visualizer' },
    image: '/images/projects/huffman.webp',
    accent: 'amber',
    icon: 'HUF',
  },

  /** ▸ BUT2 · 2016 · Moteur de recherche */
  {
    id: 'searchengine',
    year: '2016',
    category: 'academic',
    studyLevel: 'but2',
    title: {
      fr: 'Moteur de recherche',
      en: 'Search engine',
      es: 'Motor de búsqueda',
    },
    description: {
      fr: 'Moteur de recherche en Java sur des avis d\'hôtels, avec recherche booléenne, pondérée et vectorielle.',
      en: 'Java search engine over hotel reviews, with boolean, weighted and vector search.',
      es: 'Motor de búsqueda en Java sobre reseñas de hoteles, con búsqueda booleana, ponderada y vectorial.',
    },
    details: {
      fr: 'Projet académique autour de l\'indexation, du parsing et de la recherche d\'information.',
      en: 'Academic project around indexing, parsing and information retrieval.',
      es: 'Proyecto académico sobre indexación, parsing y recuperación de información.',
    },
    stack: ['Java', 'Indexation', 'Recherche d\'information'],
    links: { github: 'https://github.com/Fab16BSB/SearchEngine' },
    image: '/images/projects/searchengine.webp',
    accent: 'emerald',
    icon: 'SRCH',
  },

  /** ▸ BUT1 · 2015 · Plagiat Inc (Java) */
  {
    id: 'plagiat-inc',
    year: '2015',
    category: 'academic',
    studyLevel: 'but1',
    title: {
      fr: 'Plagiat Inc',
      en: 'Plagiat Inc',
      es: 'Plagiat Inc',
    },
    description: {
      fr: 'Jeu de stratégie en Java inspiré de Plague Inc.',
      en: 'Java strategy game inspired by Plague Inc.',
      es: 'Juego de estrategia en Java inspirado en Plague Inc.',
    },
    details: {
      fr: 'Projet académique de jeu de stratégie avec gestion de ressources et progression.',
      en: 'Academic strategy game project with resource management and progression.',
      es: 'Proyecto académico de juego de estrategia con gestión de recursos y progresión.',
    },
    stack: ['Java', 'Swing', 'Game Design'],
    links: { github: 'https://github.com/Fab16BSB/Plagiat_Inc' },
    image: '/images/projects/plagiat-inc.webp',
    accent: 'amber',
    icon: 'PLA',
  },

  /** ▸ BUT1 · 2014 · Ker(M)Tech */
  {
    id: 'kermtech',
    year: '2014',
    category: 'academic',
    studyLevel: 'but1',
    title: {
      fr: 'Ker(M)Tech',
      en: 'Ker(M)Tech',
      es: 'Ker(M)Tech',
    },
    description: {
      fr: 'Premier site web statique de vulgarisation scientifique présentant des articles sur la nanomédecine et l\'aide à la décision.',
      en: 'First static science outreach website presenting articles on nanomedicine and decision support.',
      es: 'Primer sitio web estático de divulgación científica que presenta artículos sobre nanomedicina y ayuda a la decisión.',
    },
    details: {
      fr: 'Projet de groupe en HTML, CSS et JavaScript : rédaction d\'articles sourcés, navigation entre les pages et mise en page desktop. Le site est disponible uniquement en français et n\'est pas responsive.',
      en: 'Group project in HTML, CSS and JavaScript: sourced articles, page navigation and desktop layout. The site is French-only and not responsive.',
      es: 'Proyecto grupal en HTML, CSS y JavaScript: redacción de artículos con fuentes, navegación entre páginas y diseño para escritorio. El sitio solo está en francés y no es responsive.',
    },
    stack: ['HTML', 'CSS', 'JavaScript', 'Web'],
    links: {
      site: 'https://fab16bsb.github.io/KerMTech/',
      github: 'https://github.com/Fab16BSB/KerMTech',
    },
    image: '/images/projects/kermtech.webp',
    accent: 'cyan',
    icon: 'KMT',
  },
];
