import type { KnowledgeDomain } from '@/types/skill.types';

/**
 * Domaines de connaissance affichés dans la section Compétences. Les items
 * servent aussi de source aux concepts du graphe : chaque item possède un
 * identifiant stable et des alias détectés dans les textes et les tags.
 *
 * Élément de type `KnowledgeDomain`.
 *
 * @property {KnowledgeDomainId} id - Identifiant du domaine.
 * @property {string} titleKey - Clé de traduction du titre.
 * @property {KnowledgeConcept[]} [concepts] - Concepts de haut niveau du domaine.
 * @property {KnowledgeDomainItem[]} items - Concepts rattachés au domaine.
 */
export const knowledgeDomains: KnowledgeDomain[] = [

  /** ▸ Vision · imagerie, vidéo et détection d'anomalies */
  {
    id: 'vision',
    titleKey: 'skills.knowledge.domains.vision',
    concepts: [
      {
        id: 'computer-vision',
        label: 'Computer vision',
        aliases: [
          'computer vision',
          'vision',
          'vision par ordinateur',
          'vision por computador',
          'vision por computadora',
        ],
      },
    ],
    items: [
      {
        id: 'object-detection',
        label: 'Object detection',
        labelKey: 'objectDetection',
        aliases: ['object detection', 'detection d objets', 'deteccion de objetos'],
      },
      {
        id: 'anomaly-detection',
        label: 'Anomaly detection',
        labelKey: 'anomaly',
        aliases: [
          'anomaly detection',
          'video anomaly detection',
          'detection d anomalies',
          'deteccion de anomalias',
          'anomalie',
          'anomalies',
        ],
      },
      {
        id: 'ocr',
        label: 'OCR',
        labelKey: 'ocr',
        aliases: ['ocr'],
      },
      {
        id: 'cnn',
        label: 'CNN',
        labelKey: 'cnn',
        aliases: [
          'cnn',
          'convolutional neural network',
          'convolutional neural net',
          'convolutional network',
          'convolutional',
        ],
      },
      {
        id: 'yolo',
        label: 'YOLO',
        labelKey: 'yolo',
        aliases: ['yolo', 'yolov7'],
      },
      {
        id: 'vgg',
        label: 'VGG19',
        labelKey: 'vgg',
        aliases: ['vgg', 'vgg19'],
      },
    ],
  },
  /** ▸ NLP · texte, RAG et modèles de langage */
  {
    id: 'nlp',
    titleKey: 'skills.knowledge.domains.nlp',
    items: [
      {
        id: 'nlp',
        label: 'NLP',
        labelKey: 'nlp',
        aliases: [
          'nlp',
          'natural language processing',
          'traitement du langage',
          'procesamiento de lenguaje natural',
        ],
      },
      {
        id: 'llm',
        label: 'LLM',
        labelKey: 'llm',
        aliases: [
          'llm',
          'large language model',
          'modele de langage',
          'modelo de lenguaje',
          'chatbot',
        ],
        related: ['rag'],
      },
      {
        id: 'rag',
        label: 'RAG',
        labelKey: 'rag',
        aliases: ['rag', 'retrieval augmented generation'],
      },
      {
        id: 'transformers',
        label: 'Transformers',
        labelKey: 'transformers',
        aliases: ['transformer', 'transformers'],
      },
      {
        id: 'embedding',
        label: 'Embeddings',
        labelKey: 'embeddings',
        aliases: ['embedding', 'embeddings', 'plongement'],
      },
      {
        id: 'reranking',
        label: 'Reranking',
        labelKey: 'reranking',
        aliases: ['reranking', 're ranking'],
      },
    ],
  },
  /** ▸ ML · apprentissage, modèles et évaluation */
  {
    id: 'ml',
    titleKey: 'skills.knowledge.domains.ml',
    concepts: [
      {
        id: 'ai',
        label: 'Intelligence artificielle',
        aliases: ['ai', 'intelligence artificielle', 'artificial intelligence'],
      },
      {
        id: 'machine-learning',
        label: 'Machine learning',
        aliases: ['machine learning', 'apprentissage automatique', 'aprendizaje automatico', 'ml'],
      },
      {
        id: 'deep-learning',
        label: 'Deep learning',
        aliases: ['deep learning', 'apprentissage profond', 'aprendizaje profundo', 'dl'],
      },
    ],
    items: [
      {
        id: 'regression',
        label: 'Regression',
        labelKey: 'regression',
        aliases: ['regression'],
      },
      {
        id: 'classification',
        label: 'Classification',
        labelKey: 'classification',
        aliases: ['classification'],
      },
      {
        id: 'clustering',
        label: 'Clustering',
        labelKey: 'clustering',
        aliases: ['clustering'],
      },
      {
        id: 'timeseries',
        label: 'Time series',
        labelKey: 'timeseries',
        aliases: ['time series', 'series temporelles'],
      },
      {
        id: 'feature-engineering',
        label: 'Feature engineering',
        labelKey: 'featureEngineering',
        aliases: ['feature engineering'],
      },
      {
        id: 'data-augmentation',
        label: 'Data augmentation',
        labelKey: 'dataAugmentation',
        aliases: ['data augmentation'],
      },
      {
        id: 'interpretability',
        label: 'Interpretability',
        labelKey: 'interpretability',
        aliases: ['interpretability', 'explainability', 'explicabilite'],
      },
      {
        id: 'neural-network',
        label: 'Neural network',
        labelKey: 'neuralNetwork',
        aliases: ['neural network', 'reseau de neurones'],
      },
      {
        id: 'mlp',
        label: 'MLP',
        labelKey: 'mlp',
        aliases: ['mlp', 'multi layer perceptron', 'multilayer perceptron'],
      },
      {
        id: 'rnn',
        label: 'RNN / LSTM / GRU',
        labelKey: 'rnn',
        aliases: ['rnn', 'lstm', 'gru', 'recurrent neural network'],
      },
      {
        id: 'decision-tree',
        label: 'Decision tree',
        labelKey: 'decisionTree',
        aliases: ['decision tree', 'arbre de decision'],
      },
      {
        id: 'random-forest',
        label: 'Random forest',
        labelKey: 'randomForest',
        aliases: ['random forest', 'foret aleatoire'],
      },
      {
        id: 'xgboost',
        label: 'XGBoost',
        labelKey: 'xgboost',
        aliases: ['xgboost'],
      },
      {
        id: 'svm',
        label: 'SVM',
        labelKey: 'svm',
        aliases: ['svm', 'support vector machine'],
      },
      {
        id: 'knn',
        label: 'KNN',
        labelKey: 'knn',
        aliases: ['knn', 'k nearest neighbors'],
      },
      {
        id: 'som',
        label: 'SOM',
        labelKey: 'som',
        aliases: ['som', 'self organizing map', 'carte auto organisatrice'],
      },
    ],
  },
];
