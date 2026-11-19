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

/**
 * Origine d'une trace d'utilisation d'une compétence.
 *
 * - `education` : formation où la compétence a été pratiquée ;
 * - `experience` : poste professionnel ;
 * - `project` : projet personnel, académique ou client ;
 * - `teaching` : cours dont les tags citent la compétence ;
 * - `article` : article Medium rattaché à la compétence.
 */
export type SkillTenureSourceKind =
  | 'education'
  | 'experience'
  | 'project'
  | 'teaching'
  | 'article';

/**
 * Trace datée d'utilisation d'une compétence.
 *
 * `end` vaut `present` tant que la source est en cours ; l'année de référence
 * est alors utilisée pour les calculs.
 *
 * @property {SkillTenureSourceKind} kind - Nature de la source.
 * @property {string} id - Identifiant du contenu d'origine (formation, expérience, projet, cours ou article).
 * @property {number} start - Année de début.
 * @property {number | 'present'} end - Année de fin, ou `present` si la source continue.
 * @property {Localized} label - Libellé localisé affiché pour la source.
 */
export type SkillTenureSource = {
  kind: SkillTenureSourceKind;
  id: string;
  start: number;
  end: number | 'present';
  label: Localized;
};

/**
 * Ancienneté calculée d'une compétence.
 *
 * Les années sont des écarts, pas des durées cumulées : seule la première et
 * la dernière trace comptent, les périodes intermédiaires ne s'additionnent
 * pas. Un champ reste `null` quand la compétence n'a aucune source de ce type.
 *
 * @property {string} skillId - Compétence concernée.
 * @property {number | null} firstYear - Première année d'utilisation.
 * @property {number | null} lastYear - Dernière année d'utilisation, `present` compté comme l'année de référence.
 * @property {number | null} spanYears - Écart entre la première et la dernière année, toutes sources confondues.
 * @property {number | null} professionalYears - Écart entre la première et la dernière année en expérience.
 * @property {boolean} isCurrent - Vrai si une source est en cours ou se termine pendant l'année de référence.
 * @property {SkillTenureSource[]} sources - Traces triées par année de début, puis par année de fin.
 */
export type SkillTenure = {
  skillId: string;
  firstYear: number | null;
  lastYear: number | null;
  spanYears: number | null;
  professionalYears: number | null;
  isCurrent: boolean;
  sources: SkillTenureSource[];
};

/** Ancienneté réduite aux champs affichés, sans la liste des sources. */
export type SkillTenureSummary = Pick<
  SkillTenure,
  'firstYear' | 'lastYear' | 'spanYears' | 'professionalYears' | 'isCurrent'
>;
