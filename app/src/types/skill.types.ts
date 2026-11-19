import type { Localized } from './common.types';
import type { EducationId } from './education.types';
import type { ExperienceId } from './experience.types';
import type { KnowledgeConcept } from './knowledge.types';

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
 * Élément d'un domaine de connaissance.
 *
 * @property {string} id - Identifiant stable du concept.
 * @property {string} label - Libellé affiché dans le graphe.
 * @property {string} labelKey - Clé de traduction dans les locales.
 * @property {string[]} aliases - Graphies reconnues dans les textes et les tags.
 */
export type KnowledgeDomainItem = {
  id: string;
  label: string;
  labelKey: string;
  aliases: string[];
};

/**
 * Domaine de connaissance affiché dans la section Skills.
 *
 * @property {KnowledgeDomainId} id - Identifiant du domaine.
 * @property {string} titleKey - Clé de traduction du titre.
 * @property {KnowledgeConcept[]} [concepts] - Concepts de haut niveau du domaine.
 * @property {KnowledgeDomainItem[]} items - Concepts rattachés au domaine.
 */
export type KnowledgeDomain = {
  id: KnowledgeDomainId;
  titleKey: string;
  concepts?: KnowledgeConcept[];
  items: KnowledgeDomainItem[];
};

/**
 * Compétence affichée dans la section Skills.
 *
 * Les alias servent à la correspondance, pas à l'affichage : ils sont comparés
 * sans casse, accents ni ponctuation, et n'ont pas à répéter le nom.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} name - Nom affiché.
 * @property {string[]} [aliases] - Graphies supplémentaires reconnues dans les stacks, les tags de cours et la recherche.
 * @property {SkillCategory} category - Catégorie de compétence.
 * @property {string[]} [conceptIds] - Concepts associés à la compétence, identifiants de `knowledgeConcepts`.
 * @property {string} [icon] - Fichier d'icône.
 * @property {string} [monogram] - Texte affiché si aucune icône n'est disponible.
 * @property {Localized} [context] - Contexte optionnel.
 * @property {EducationId[]} [educationIds] - Formations pendant lesquelles la compétence a été utilisée.
 * @property {ExperienceId[]} [experienceIds] - Expériences pendant lesquelles la compétence a été utilisée.
 * @property {string[]} [projectIds] - Projets où la compétence est utilisée.
 * @property {string[]} [mediumPostIds] - Articles Medium associés.
 */
export type Skill = {
  id: string;
  name: string;
  aliases?: string[];
  category: SkillCategory;
  conceptIds?: string[];
  icon?: string;
  monogram?: string;
  context?: Localized;
  educationIds?: EducationId[];
  experienceIds?: ExperienceId[];
  projectIds?: string[];
  mediumPostIds?: string[];
};
