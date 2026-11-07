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
 * @property {string} id - Identifiant stable.
 * @property {string} name - Nom affiché.
 * @property {SkillCategory} category - Catégorie de compétence.
 * @property {string} [icon] - Fichier d'icône.
 * @property {string} [monogram] - Texte affiché si aucune icône n'est disponible.
 * @property {Localized} [context] - Contexte optionnel.
 * @property {EducationId[]} [educationIds] - Formations pendant lesquelles la compétence a été utilisée.
 * @property {ExperienceId[]} [experienceIds] - Expériences pendant lesquelles la compétence a été utilisée.
 */
export type Skill = {
  id: string;
  name: string;
  category: SkillCategory;
  icon?: string;
  monogram?: string;
  context?: Localized;
  educationIds?: EducationId[];
  experienceIds?: ExperienceId[];
};
