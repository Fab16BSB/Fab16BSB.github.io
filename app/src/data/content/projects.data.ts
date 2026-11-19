import type { Project } from '@/types/project.types';
import { links } from '@/data/profile/links.data';

/**
 * Projets affichés dans la section Projects.
 *
 * Élément de type `Project`.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} year - Année affichée.
 * @property {ProjectCategory} category - Projet académique, personnel, professionnel ou notebook Kaggle.
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

  /** ▸ Notebook Kaggle · 2026 · Fuel Efficiency Prediction */
  {
    id: 'kaggle-auto-mpg',
    year: '2026',
    category: 'notebook',
    title: {
      fr: 'Fuel Efficiency Prediction : Auto-MPG',
      en: 'Fuel Efficiency Prediction: Auto-MPG',
      es: 'Fuel Efficiency Prediction: Auto-MPG',
    },
    description: {
      fr: 'Notebook de régression qui prédit la consommation de carburant (mpg) de véhicules à partir de leurs caractéristiques.',
      en: 'Regression notebook that predicts a vehicle\'s fuel consumption (mpg) from its specifications.',
      es: 'Notebook de regresión que predice el consumo de combustible (mpg) de un vehículo a partir de sus características.',
    },
    details: {
      fr: 'Le jeu Auto-MPG décrit des véhicules par leur cylindrée, leur puissance, leur poids, leur accélération, leur année et leur origine. L\'objectif est de prédire la consommation de carburant (mpg) à partir de ces caractéristiques.',
      en: 'The Auto-MPG dataset describes vehicles by displacement, horsepower, weight, acceleration, model year and origin. The goal is to predict fuel consumption (mpg) from these features.',
      es: 'El conjunto Auto-MPG describe vehículos por su cilindrada, potencia, peso, aceleración, año y origen. El objetivo es predecir el consumo de combustible (mpg) a partir de estas características.',
    },
    highlights: [
      {
        fr: 'Nettoyage des valeurs manquantes.',
        en: 'Cleaning missing values.',
        es: 'Limpieza de valores ausentes.',
      },
      {
        fr: 'Suppression des doublons.',
        en: 'Removing duplicates.',
        es: 'Eliminación de duplicados.',
      },
      {
        fr: 'Analyse exploratoire : distributions, corrélations et valeurs aberrantes.',
        en: 'Exploratory analysis: distributions, correlations and outliers.',
        es: 'Análisis exploratorio: distribuciones, correlaciones y valores atípicos.',
      },
      {
        fr: 'Ingénierie de variables.',
        en: 'Feature engineering.',
        es: 'Ingeniería de variables.',
      },
      {
        fr: 'Découpage train / test reproductible.',
        en: 'Reproducible train / test split.',
        es: 'División reproducible entre entrenamiento y prueba.',
      },
      {
        fr: 'Comparaison de modèles (régression linéaire, SVM, arbres) sur plusieurs métriques.',
        en: 'Model comparison (linear regression, SVM, trees) across multiple metrics.',
        es: 'Comparación de modelos (regresión lineal, SVM, árboles) con varias métricas.',
      },
      {
        fr: 'Réglage des hyperparamètres.',
        en: 'Hyperparameter tuning.',
        es: 'Ajuste de hiperparámetros.',
      },
      {
        fr: 'Stacking Regressor pour la prédiction finale.',
        en: 'Stacking Regressor for the final prediction.',
        es: 'Stacking Regressor para la predicción final.',
      },
    ],
    stack: ['Python', 'Pandas', 'scikit-learn', 'Régression', 'Stacking'],
    links: {},
    extraLinks: [
      {
        label: {
          fr: 'Ouvrir le notebook',
          en: 'Open the notebook',
          es: 'Abrir el notebook',
        },
        url: 'https://www.kaggle.com/code/fpoirier/fuel-efficiency-prediction-auto-mpg-dataset',
        icon: 'kaggle',
      },
    ],
    notebook: {
      dataset: 'Auto-MPG',
      task: 'regression',
    },
    accent: 'emerald',
    icon: 'MPG',
  },

  /** ▸ Notebook Kaggle · 2025 · House Price Prediction */
  {
    id: 'kaggle-california-housing',
    year: '2025',
    category: 'notebook',
    title: {
      fr: 'House Price Prediction : California Housing',
      en: 'House Price Prediction: California Housing',
      es: 'House Price Prediction: California Housing',
    },
    description: {
      fr: 'Notebook de régression immobilière qui estime le prix médian des logements en Californie.',
      en: 'Real-estate regression notebook that estimates the median house value in California.',
      es: 'Notebook de regresión inmobiliaria que estima el precio medio de la vivienda en California.',
    },
    details: {
      fr: 'Le jeu California Housing, issu du recensement californien de 1990, décrit des quartiers par leur localisation, le revenu médian, l\'âge des logements et la population. L\'objectif est d\'estimer le prix médian des logements.',
      en: 'The California Housing dataset, from the 1990 California census, describes districts by location, median income, housing age and population. The goal is to estimate the median house value.',
      es: 'El conjunto California Housing, procedente del censo de California de 1990, describe distritos por su ubicación, la renta media, la antigüedad de las viviendas y la población. El objetivo es estimar el precio medio de la vivienda.',
    },
    highlights: [
      {
        fr: 'Analyse exploratoire des variables géographiques et démographiques.',
        en: 'Exploratory analysis of the geographic and demographic variables.',
        es: 'Análisis exploratorio de las variables geográficas y demográficas.',
      },
      {
        fr: 'Imputation des valeurs manquantes.',
        en: 'Imputation of missing values.',
        es: 'Imputación de valores ausentes.',
      },
      {
        fr: 'Standardisation des variables numériques.',
        en: 'Scaling of numerical variables.',
        es: 'Escalado de las variables numéricas.',
      },
      {
        fr: 'Encodage des variables catégorielles.',
        en: 'Encoding of categorical variables.',
        es: 'Codificación de las variables categóricas.',
      },
      {
        fr: 'Construction d\'un pipeline de prétraitement réutilisable.',
        en: 'Building a reusable preprocessing pipeline.',
        es: 'Construcción de un pipeline de preprocesamiento reutilizable.',
      },
      {
        fr: 'Comparaison de modèles à base d\'arbres (Random Forest, XGBoost).',
        en: 'Comparison of tree-based models (Random Forest, XGBoost).',
        es: 'Comparación de modelos de árboles (Random Forest, XGBoost).',
      },
      {
        fr: 'Réglage des hyperparamètres.',
        en: 'Hyperparameter tuning.',
        es: 'Ajuste de hiperparámetros.',
      },
      {
        fr: 'Évaluation sur plusieurs métriques de régression.',
        en: 'Evaluation across multiple regression metrics.',
        es: 'Evaluación con varias métricas de regresión.',
      },
    ],
    stack: ['Python', 'Pandas', 'scikit-learn', 'XGBoost', 'Random Forest'],
    links: {},
    extraLinks: [
      {
        label: {
          fr: 'Ouvrir le notebook',
          en: 'Open the notebook',
          es: 'Abrir el notebook',
        },
        url: 'https://www.kaggle.com/code/fpoirier/house-price-prediction-california-housing-dataset',
        icon: 'kaggle',
      },
    ],
    notebook: {
      dataset: 'California Housing',
      task: 'regression',
    },
    accent: 'cyan',
    icon: 'CAL',
  },

  /** ▸ Notebook Kaggle · 2025 · Customer Churn Classification */
  {
    id: 'kaggle-telco-churn',
    year: '2025',
    category: 'notebook',
    title: {
      fr: 'Customer Churn Classification : Telco Dataset',
      en: 'Customer Churn Classification: Telco Dataset',
      es: 'Customer Churn Classification: Telco Dataset',
    },
    description: {
      fr: 'Notebook de classification binaire qui prédit la résiliation de clients d\'un opérateur télécom.',
      en: 'Binary classification notebook that predicts customer churn for a telecom operator.',
      es: 'Notebook de clasificación binaria que predice la baja de clientes de un operador de telecomunicaciones.',
    },
    details: {
      fr: 'Le jeu Telco Customer Churn décrit des clients d\'un opérateur télécom par leurs services souscrits, leur contrat, leur facturation et leur profil démographique. L\'objectif est de prédire la résiliation (churn) à partir de ces informations.',
      en: 'The Telco Customer Churn dataset describes a telecom operator\'s customers through their subscribed services, contract, billing and demographic profile. The goal is to predict churn from this information.',
      es: 'El conjunto Telco Customer Churn describe a los clientes de un operador de telecomunicaciones por sus servicios contratados, su contrato, su facturación y su perfil demográfico. El objetivo es predecir la baja (churn) a partir de esta información.',
    },
    highlights: [
      {
        fr: 'Nettoyage des données.',
        en: 'Data cleaning.',
        es: 'Limpieza de datos.',
      },
      {
        fr: 'Analyse exploratoire du churn.',
        en: 'Exploratory analysis of churn.',
        es: 'Análisis exploratorio de la baja.',
      },
      {
        fr: 'Ingénierie de variables.',
        en: 'Feature engineering.',
        es: 'Ingeniería de variables.',
      },
      {
        fr: 'Encodage des variables catégorielles.',
        en: 'Encoding of categorical variables.',
        es: 'Codificación de las variables categóricas.',
      },
      {
        fr: 'Standardisation des variables numériques.',
        en: 'Scaling of numerical variables.',
        es: 'Escalado de las variables numéricas.',
      },
      {
        fr: 'Construction d\'un pipeline de prétraitement.',
        en: 'Building a preprocessing pipeline.',
        es: 'Construcción de un pipeline de preprocesamiento.',
      },
      {
        fr: 'Comparaison de modèles (régression logistique, Random Forest, XGBoost).',
        en: 'Model comparison (logistic regression, Random Forest, XGBoost).',
        es: 'Comparación de modelos (regresión logística, Random Forest, XGBoost).',
      },
      {
        fr: 'Gestion du déséquilibre des classes par pondération.',
        en: 'Handling class imbalance through class weighting.',
        es: 'Gestión del desequilibrio de clases mediante ponderación.',
      },
      {
        fr: 'Réglage des hyperparamètres.',
        en: 'Hyperparameter tuning.',
        es: 'Ajuste de hiperparámetros.',
      },
      {
        fr: 'Évaluation avec plusieurs métriques de classification.',
        en: 'Evaluation with multiple classification metrics.',
        es: 'Evaluación con varias métricas de clasificación.',
      },
    ],
    stack: ['Python', 'Pandas', 'scikit-learn', 'XGBoost', 'Classification binaire'],
    links: {},
    extraLinks: [
      {
        label: {
          fr: 'Ouvrir le notebook',
          en: 'Open the notebook',
          es: 'Abrir el notebook',
        },
        url: 'https://www.kaggle.com/code/fpoirier/customer-churn-classification-telco-dataset',
        icon: 'kaggle',
      },
    ],
    notebook: {
      dataset: 'Telco Customer Churn',
      task: 'classification',
    },
    accent: 'amber',
    icon: 'CHN',
  },

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
    experienceIds: ['ater-paris8'],
    stack: ['Optimisation', 'Planification', 'Application web', 'React', 'TypeScript'],
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
    accent: 'indigo',
    icon: 'SCH',
  },

  /** ▸ Personnel · 2023 · ProgEnImages */
  {
    id: 'progenimages',
    year: '2023',
    category: 'personal',
    title: {
      fr: 'Prog en Image',
      en: 'Prog en Image',
      es: 'Prog en Image',
    },
    description: {
      fr: 'Glossaire visuel qui explique les concepts informatiques avec une image par notion.',
      en: 'Visual glossary that explains computer science concepts with one image per idea.',
      es: 'Glosario visual que explica conceptos informáticos con una imagen por noción.',
    },
    details: {
      fr: 'Glossaire visuel pour étudiants : une sélection de notions de programmation et d\'informatique, illustrées et reliées à des exemples concrets de la vie réelle pour comprendre les termes et savoir les utiliser.',
      en: 'Visual glossary for students: a selection of programming and computer science concepts, illustrated and linked to concrete real-life examples so students can understand the terms and know how to use them.',
      es: 'Glosario visual para estudiantes: una selección de nociones de programación e informática, ilustradas y relacionadas con ejemplos concretos de la vida real para entender los términos y saber utilizarlos.',
    },
    stack: [
      'TypeScript',
      'Web',
      'Pédagogie',
      'Glossaire',
      'Vulgarisation',
      'Visualisation',
      'Apprentissage',
    ],
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
    educationIds: ['phd'],
    experienceIds: ['these-othello'],
    stack: [
      'YOLOv7',
      'VGG19',
      'GRU',
      'Keras',
      'OpenCV',
      'Computer Vision',
      'Intelligence artificielle',
      'Machine Learning',
      'Deep Learning',
    ],
    links: {
      github: links.thesis.repo,
      video: links.social.youtubeDemo,
      pdf: links.thesis.pdf,
    },
    image: '/images/projects/anomaly-detection.webp',
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
      fr: 'Projet réalisé en équipe de trois dans le cadre du Master : le modèle lit un récit puis répond à des questions en s\'appuyant uniquement sur le texte fourni (dataset bAbI de Facebook AI Research). Il utilise un vocabulaire réduit aux mots présents dans les histoires.',
      en: 'Team project built during the Master\'s degree: the model reads a story and answers questions using only the provided text (Facebook AI Research bAbI dataset). It uses a vocabulary limited to the words present in the stories.',
      es: 'Proyecto realizado en equipo de tres durante el máster: el modelo lee un relato y responde preguntas basándose únicamente en el texto proporcionado (dataset bAbI de Facebook AI Research). Utiliza un vocabulario limitado a las palabras presentes en las historias.',
    },
    educationIds: ['master'],
    stack: [
      'Python',
      'NLP',
      'bAbI',
      'Question Answering',
      'Compréhension de récit',
      'LSTM',
      'Embedding',
      'Keras',
      'TensorFlow',
      'Intelligence artificielle',
      'Machine Learning',
      'Deep Learning',
    ],
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
      fr: 'Collecte d\'images par scraping, préparation et augmentation du jeu de données, entraînement de plusieurs CNN avec Keras et TensorFlow, évaluation sur différents jeux et explicabilité par cartes de saillance.',
      en: 'Image collection via scraping, dataset preparation and augmentation, training of several CNNs with Keras and TensorFlow, evaluation on different datasets and explainability through saliency maps.',
      es: 'Recopilación de imágenes mediante scraping, preparación y aumento del conjunto de datos, entrenamiento de varios CNN con Keras y TensorFlow, evaluación en distintos conjuntos y explicabilidad mediante mapas de saliencia.',
    },
    educationIds: ['master'],
    stack: [
      'Python',
      'CNN',
      'Keras',
      'TensorFlow',
      'Jupyter',
      'Computer Vision',
      'Classification d\'images',
      'Data Augmentation',
      'Explicabilité',
      'Carte de saillance',
      'Intelligence artificielle',
      'Machine Learning',
      'Deep Learning',
    ],
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
    studyLevel: 'licence3',
    educationIds: ['licence'],
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
    stack: ['Java', 'C', 'Machine Learning', 'SOM', 'Intelligence artificielle'],
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
    studyLevel: 'dut2',
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
    educationIds: ['dut'],
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
    studyLevel: 'dut2',
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
    educationIds: ['dut'],
    stack: ['Java', 'Algorithmique', 'Visualisation', 'Compression', 'Arbre de Huffman'],
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
    studyLevel: 'dut2',
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
      fr: 'Moteur de recherche académique sur un corpus d\'avis d\'hôtels de Chicago : indexation, parsing, recherche booléenne, vectorielle et pondérée.',
      en: 'Academic search engine over a corpus of Chicago hotel reviews: indexing, parsing, boolean, vector and weighted search.',
      es: 'Motor de búsqueda académico sobre un corpus de reseñas de hoteles de Chicago: indexación, parsing, búsqueda booleana, vectorial y ponderada.',
    },
    educationIds: ['dut'],
    stack: [
      'Java',
      'Indexation',
      'Recherche d\'information',
      'Recherche booléenne',
      'Recherche vectorielle',
      'Pondération',
      'TF-IDF',
      'Avis d\'hôtels',
      'Chicago',
    ],
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
    studyLevel: 'dut1',
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
    educationIds: ['dut'],
    stack: ['Java', 'Swing', 'UML', 'MVC', 'Game Design'],
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
    studyLevel: 'dut1',
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
    educationIds: ['dut'],
    stack: [
      'HTML',
      'CSS',
      'JavaScript',
      'Web',
      'Site statique',
      'Vulgarisation scientifique',
      'Nanomédecine',
      'Aide à la décision',
    ],
    links: {
      site: 'https://fab16bsb.github.io/KerMTech/',
      github: 'https://github.com/Fab16BSB/KerMTech',
    },
    image: '/images/projects/kermtech.webp',
    accent: 'cyan',
    icon: 'KMT',
  },
];
