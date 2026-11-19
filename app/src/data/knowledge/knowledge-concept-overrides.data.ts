import type { KnowledgeConcept } from '@/types/knowledge.types';

/**
 * Correspondance entre un identifiant de compétence et un identifiant de
 * concept : clé = compétence, valeur = concept. La plupart des compétences
 * utilisent le même identifiant ; les exceptions sont listées ici pour
 * conserver les identifiants déjà utilisés par le graphe.
 */
export const CONCEPT_ID_BY_SKILL: Record<string, string> = {
  poo: 'oop',
};

/**
 * Alias supplémentaires par identifiant de concept : clé = concept, valeur =
 * synonymes. Les identifiants et libellés des compétences et des domaines sont
 * déjà ajoutés automatiquement ; ce fichier ne contient que les synonymes à
 * maintenir au fil de l'eau.
 */
export const CONCEPT_ALIASES: Record<string, string[]> = {
  javascript: ['js'],
  html: ['html5'],
  css: ['css3'],
  'api-rest': ['rest api'],
  git: ['github'],
  jupyter: ['notebook'],
  chromadb: ['chroma db'],
  oop: [
    'oop',
    'oriente objet',
    'programmation orientee objet',
    'object oriented programming',
    'programacion orientada a objetos',
  ],
  cnn: [
    'convolutional neural network',
    'convolutional neural net',
    'convolutional network',
  ],
  svm: ['support vector machine'],
  mlp: ['multi layer perceptron', 'multilayer perceptron'],
  interpretability: ['explainability', 'explicabilite', 'saliency map'],
};

/**
 * Concepts transverses qui ne viennent ni d'une compétence ni d'un domaine.
 * Ils servent de pivots aux offres génériques (programmation, web, bases de
 * données) et sont déclarés par les compétences via `conceptIds`.
 *
 * Élément de type `KnowledgeConcept`.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} label - Libellé affiché dans les raisons.
 * @property {string[]} aliases - Graphies reconnues dans les textes et les tags.
 */
export const EXTRA_CONCEPTS: KnowledgeConcept[] = [
  {
    id: 'programming',
    label: 'Programmation',
    aliases: [
      'programmation',
      'programming',
      'programacion',
      'codage',
      'coding',
      'codificacion',
      'code',
    ],
  },
  {
    id: 'web',
    label: 'Développement web',
    aliases: ['web'],
  },
  {
    id: 'databases',
    label: 'Bases de données',
    aliases: [
      'base de donnees',
      'bases de donnees',
      'base de datos',
      'bases de datos',
    ],
  },
  {
    id: 'vector-database',
    label: 'Base vectorielle',
    aliases: [
      'base vectorielle',
      'bases vectorielles',
      'base de datos vectorial',
      'vector database',
      'vector store',
    ],
  },
  {
    id: 'data-science',
    label: 'Data science',
    aliases: [
      'data science',
      'science des donnees',
      'ciencia de datos',
    ],
  },
  {
    id: 'visualization',
    label: 'Visualisation',
    aliases: [
      'visualisation',
      'visualization',
      'dataviz',
      'data visualization',
      'visualisation de donnees',
      'visualizacion de datos',
    ],
  },
  {
    id: 'mlops',
    label: 'MLOps',
    aliases: ['mlops'],
  },
  {
    id: 'software-engineering',
    label: 'Génie logiciel',
    aliases: [
      'genie logiciel',
      'software engineering',
      'ingenieria de software',
    ],
  },
];

/**
 * Variantes de tags fusionnées vers un identifiant canonique : clé = graphie
 * libre, valeur = identifiant du pivot `tag:*`. Ces tags ne sont pas des
 * concepts : plusieurs graphies pointent simplement vers le même pivot.
 */
export const TAG_ALIASES: Record<string, string> = {
  csharp: 'c#',
  nodejs: 'node-js',
  'node js': 'node-js',
  'multilayer perceptron': 'multi-layer-perceptron',
  'multi layer perceptron': 'multi-layer-perceptron',
};
