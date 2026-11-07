/* =========================================================================
  CONFIGURATION : concepts et tags du graphe
  Correspondances entre compétences, concepts et variantes de tags.
========================================================================= */

/**
 * Correspondance entre un identifiant de compétence et un identifiant de concept.
 *
 * La plupart des compétences utilisent le même identifiant. Les exceptions sont
 * listées ici pour conserver les identifiants déjà utilisés par le graphe.
 */
export const CONCEPT_ID_BY_SKILL: Record<string, string> = {
  poo: 'oop',
};

/**
 * Alias supplémentaires par identifiant de concept.
 *
 * Les identifiants et libellés des compétences et des domaines sont déjà
 * ajoutés automatiquement. Ce fichier ne contient que les synonymes
 * supplémentaires à maintenir au fil de l'eau.
 */
export const CONCEPT_ALIASES: Record<string, string[]> = {
  javascript: ['js'],
  html: ['html5'],
  css: ['css3'],
  'api-rest': ['rest api'],
  git: ['github'],
  jupyter: ['notebook'],
  chromadb: ['chroma db'],
  oop: ['oop', 'oriente objet'],
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
 * Variantes de tags fusionnées vers un identifiant canonique.
 *
 * Ces tags ne sont pas des concepts : ils restent des pivots `tag:*`, mais
 * plusieurs graphies pointent vers le même pivot.
 */
export const TAG_ALIASES: Record<string, string> = {
  csharp: 'c#',
  nodejs: 'node-js',
  'node js': 'node-js',
  'multilayer perceptron': 'multi-layer-perceptron',
  'multi layer perceptron': 'multi-layer-perceptron',
};
