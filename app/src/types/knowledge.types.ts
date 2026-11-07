import type { Locale, Localized } from './common.types';
import type { EducationId } from './education.types';
import type { ExperienceId } from './experience.types';
import type { Project } from './project.types';

/** Contenus du portfolio qui peuvent recevoir des recommandations. */
export type KnowledgeContentKind =
  | 'project'
  | 'publication'
  | 'article'
  | 'skill'
  | 'teaching'
  | 'experience'
  | 'education'
  | 'award'
  | 'supervision'
  | 'video';

/** Nature d'un nœud du graphe, contenu ou pivot taxonomique. */
export type KnowledgeNodeKind = KnowledgeContentKind | 'theme' | 'concept';

/** Thèmes transverses qui relient les contenus entre eux. */
export type KnowledgeThemeId =
  | 'vision'
  | 'nlp'
  | 'machine-learning'
  | 'data'
  | 'web'
  | 'backend'
  | 'search'
  | 'games'
  | 'algorithms'
  | 'teaching'
  | 'research'
  | 'systems'
  | 'education'
  | 'programming'
  | 'software-engineering';

/**
 * Thème du graphe avec son vocabulaire de détection.
 *
 * @property {KnowledgeThemeId} id - Identifiant stable.
 * @property {Localized} label - Libellé affiché dans les raisons.
 * @property {number} weight - Poids utilisé pour ordonner les thèmes détectés.
 * @property {string[]} terms - Termes et expressions qui déclenchent le thème.
 */
export type KnowledgeTheme = {
  id: KnowledgeThemeId;
  label: Localized;
  weight: number;
  terms: string[];
};

/**
 * Concept canonique partagé par plusieurs contenus.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} label - Libellé affiché dans les raisons.
 * @property {string[]} aliases - Graphies reconnues dans les textes et les tags.
 */
export type KnowledgeConcept = {
  id: string;
  label: string;
  aliases: string[];
};

/**
 * Nœud du graphe de connaissances.
 *
 * @property {string} id - Identifiant global, préfixé par la nature du nœud.
 * @property {KnowledgeNodeKind} kind - Nature du nœud.
 * @property {string} sourceId - Identifiant d'origine dans les données du site.
 * @property {Localized} label - Libellé traduit.
 * @property {number} [year] - Année de référence, si connue.
 * @property {string} [anchor] - Ancre de la section qui affiche le contenu.
 * @property {KnowledgeThemeId[]} themes - Thèmes détectés.
 * @property {string[]} terms - Concepts détectés.
 * @property {string[]} tags - Technologies et mots-clés bruts.
 * @property {Record<Locale, string>} text - Texte analysé, par langue.
 */
export type KnowledgeNode = {
  id: string;
  kind: KnowledgeNodeKind;
  sourceId: string;
  label: Localized;
  year?: number;
  anchor?: string;
  themes: KnowledgeThemeId[];
  terms: string[];
  tags: string[];
  text: Record<Locale, string>;
};

/**
 * Nœud de contenu, par opposition aux pivots de taxonomie.
 *
 * @property {KnowledgeContentKind} kind - Nature du contenu.
 * @property {EducationId} [educationId] - Formation suivie pendant une expérience.
 * @property {EducationId[]} [educationIds] - Formations pendant lesquelles le contenu a été réalisé ou utilisé.
 * @property {ExperienceId[]} [experienceIds] - Expériences pendant lesquelles le contenu a été réalisé ou utilisé.
 */
export type KnowledgeContentNode = KnowledgeNode & {
  kind: KnowledgeContentKind;
  educationId?: EducationId;
  educationIds?: EducationId[];
  experienceIds?: ExperienceId[];
};

/**
 * Relations matérialisées dans le graphe.
 * `context` relie explicitement un contenu à une formation ou une expérience.
 */
export type KnowledgeEdgeRelation = 'has-theme' | 'uses-term' | 'related' | 'context';

/**
 * Arête du graphe de connaissances.
 *
 * @property {string} id - Identifiant stable de l'arête.
 * @property {string} from - Nœud source.
 * @property {string} to - Nœud cible.
 * @property {KnowledgeEdgeRelation} relation - Nature de la relation.
 * @property {number} [score] - Score de similarité pour les relations `related`.
 * @property {KnowledgeThemeId[]} [themes] - Thèmes partagés.
 * @property {string[]} [terms] - Concepts partagés.
 */
export type KnowledgeEdge = {
  id: string;
  from: string;
  to: string;
  relation: KnowledgeEdgeRelation;
  score?: number;
  themes?: KnowledgeThemeId[];
  terms?: string[];
};

/**
 * Graphe de connaissances complet du portfolio.
 *
 * @property {KnowledgeNode[]} nodes - Contenus, thèmes et concepts.
 * @property {KnowledgeEdge[]} edges - Relations typées entre les nœuds.
 */
export type KnowledgeGraph = {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
};

/**
 * Recommandation « voir aussi » pour un contenu.
 *
 * @property {KnowledgeContentNode} node - Contenu recommandé.
 * @property {number} score - Score de pertinence entre 0 et 1.
 * @property {KnowledgeThemeId[]} sharedThemes - Thèmes communs.
 * @property {string[]} sharedTerms - Concepts et mots-clés communs.
 * @property {boolean} samePeriod - Indique des années proches.
 * @property {boolean} [context] - Lien explicite de contexte formation/expérience.
 */
export type KnowledgeRecommendation = {
  node: KnowledgeContentNode;
  score: number;
  sharedThemes: KnowledgeThemeId[];
  sharedTerms: string[];
  samePeriod: boolean;
  context?: boolean;
};

/**
 * Recommandation prête pour l'affichage, avec ses libellés traduits.
 *
 * @property {KnowledgeContentNode} node - Contenu recommandé.
 * @property {KnowledgeRecommendation} recommendation - Score et signaux partagés.
 * @property {Localized[]} themeLabels - Libellés des thèmes communs.
 * @property {Localized[]} termLabels - Libellés des concepts et mots-clés communs.
 */
export type KnowledgeRelatedContent = {
  node: KnowledgeContentNode;
  recommendation: KnowledgeRecommendation;
  themeLabels: Localized[];
  termLabels: Localized[];
};

/**
 * Filtres appliqués au calcul des recommandations.
 *
 * @property {number} [limit] - Nombre maximal de recommandations.
 * @property {KnowledgeContentKind[]} [kinds] - Natures de contenu acceptées.
 * @property {number} [minScore] - Score minimal des recommandations.
 */
export type KnowledgeRecommendationOptions = {
  limit?: number;
  kinds?: KnowledgeContentKind[];
  minScore?: number;
};

/**
 * Projet recommandé, prêt à être affiché dans une carte de projet.
 *
 * @property {Project} project - Projet du portfolio.
 * @property {number} score - Score de proximité.
 * @property {Localized[]} themeLabels - Libellés des thèmes communs.
 * @property {string[]} termLabels - Libellés des concepts et mots-clés communs.
 */
export type KnowledgeRelatedProject = {
  project: Project;
  score: number;
  themeLabels: Localized[];
  termLabels: string[];
};

/**
 * Voisin sémantique précalculé d'un contenu.
 *
 * @property {string} id - Identifiant global du contenu voisin.
 * @property {number} score - Score de similarité cosinus.
 */
export type KnowledgeSimilarityNeighbor = {
  id: string;
  score: number;
};

/** Voisins précalculés d'un contenu, stockés en `[id, score]`. */
export type KnowledgeSimilarityDocument = {
  neighbors: Array<[string, number]>;
};

/**
 * Modèle utilisé pour produire les voisins sémantiques.
 *
 * @property {string} name - Nom du modèle d'embedding.
 * @property {string} revision - Révision ou empreinte du modèle.
 * @property {number} dimension - Dimension des vecteurs produits.
 */
export type KnowledgeSimilarityModel = {
  name: string;
  revision: string;
  dimension: number;
};

/**
 * Index de similarité sémantique du portfolio.
 *
 * @property {1} version - Version du format.
 * @property {string} generatedAt - Date de génération ISO.
 * @property {KnowledgeSimilarityModel} model - Modèle d'embedding utilisé.
 * @property {Record<string, string>} sources - Hash du texte source par contenu.
 * @property {Record<string, KnowledgeSimilarityDocument>} documents - Voisins par contenu.
 */
export type KnowledgeSimilarityIndex = {
  version: 1;
  generatedAt: string;
  model: KnowledgeSimilarityModel;
  sources: Record<string, string>;
  documents: Record<string, KnowledgeSimilarityDocument>;
};
