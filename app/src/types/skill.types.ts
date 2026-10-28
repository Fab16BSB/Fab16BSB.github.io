import type { Localized } from './common.types';

/** Catégorie de compétence affichée dans les filtres. */
export type SkillCategory =
  | 'languages'
  | 'libraries'
  | 'llm'
  | 'databases'
  | 'deployment'
  | 'tools';

/** Domaine de connaissance mis en avant dans la section Skills. */
export type KnowledgeDomainId = 'vision' | 'nlp' | 'ml';

/**
 * Compétence affichée dans la section Skills.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} name - Nom affiché.
 * @property {SkillCategory} category - Catégorie de compétence.
 * @property {string} [icon] - Fichier d'icône.
 * @property {string} [monogram] - Texte affiché si aucune icône n'est disponible.
 * @property {Localized} [context] - Contexte optionnel.
 */
export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  monogram?: string;
  context?: Localized;
};
