/* =========================================================================
  IMPORTS
========================================================================= */
import type { KnowledgeDomainId, Skill, SkillCategory } from '@/types/skill.types';


/* =========================================================================
  TYPES & INTERFACES
========================================================================= */

/** Domaine de connaissance affiché dans la section. */
export type KnowledgeDomain = {
  id: KnowledgeDomainId;
  titleKey: string;
  items: string[];
};


/* =========================================================================
  CONSTANTES
========================================================================= */

/** Catégories de compétences, dans l'ordre des onglets. */
export const skillCategories: SkillCategory[] = [
  'languages',
  'libraries',
  'llm',
  'databases',
  'deployment',
  'tools',
];

/** Domaines affichés, avec leurs compétences associées. */
export const knowledgeDomains: KnowledgeDomain[] = [
  {
    id: 'vision',
    titleKey: 'skills.knowledge.domains.vision',
    items: ['objectDetection', 'anomaly', 'ocr', 'cnn', 'yolo', 'vgg'],
  },
  {
    id: 'nlp',
    titleKey: 'skills.knowledge.domains.nlp',
    items: ['nlp', 'llm', 'rag', 'transformers', 'embeddings', 'reranking'],
  },
  {
    id: 'ml',
    titleKey: 'skills.knowledge.domains.ml',
    items: [
      'regression',
      'classification',
      'clustering',
      'timeseries',
      'featureEngineering',
      'dataAugmentation',
      'interpretability',
      'neuralNetwork',
      'mlp',
      'rnn',
      'decisionTree',
      'randomForest',
      'xgboost',
      'svm',
      'knn',
      'som',
    ],
  },
];


/* =========================================================================
  HELPERS : skills — fonctions pures
  Catégories, domaines de connaissance et filtrage des compétences.
========================================================================= */

/**
 * Filtre les compétences par catégorie.
 *
 * @param skills - Liste complète des compétences.
 * @param category - Catégorie à conserver, ou `all`.
 * @returns Les compétences de la catégorie demandée.
 */
export function filterSkills(skills: Skill[], category: SkillCategory | 'all'): Skill[] {
  return category === 'all' ? skills : skills.filter((skill) => skill.category === category);
}

/**
 * Compte les compétences d'une catégorie.
 *
 * @param skills - Liste complète des compétences.
 * @param category - Catégorie à compter, ou `all`.
 * @returns Le nombre de compétences.
 */
export function countSkills(skills: Skill[], category: SkillCategory | 'all'): number {
  return filterSkills(skills, category).length;
}
