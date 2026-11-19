import type MiniSearch from 'minisearch';
import type { KnowledgeThemeId } from '@/types/knowledge.types';
import type { ProjectCategory } from '@/types/project.types';
import type { SearchDocument } from '@/types/search.types';
import type {
  VisitSectionId,
  VisitVerdict,
} from '@/types/visit.types';

/** Nature d'un document indexé. */
export type VisitSearchKind = 'item' | 'section';

/**
 * Étiquette d'un document indexé.
 *
 * @property {string} id - Identifiant stable du document.
 * @property {VisitSectionId} section - Section qui affiche le contenu.
 * @property {string} label - Libellé affiché.
 * @property {string} detail - Précision affichée sous le libellé.
 * @property {string} target - Sélecteur `data-visit-target` du contenu.
 * @property {number} year - Année de référence, 0 si inconnue.
 * @property {VisitSearchKind} kind - Nature du document.
 * @property {KnowledgeThemeId[]} themes - Thèmes détectés.
 * @property {Set<string>} terms - Termes indexés, thèmes compris.
 * @property {Set<string>} ownTerms - Termes du contenu seul, sans les thèmes.
 * @property {string} [skillId] - Compétence décrite, pour un document de la section Compétences.
 * @property {ProjectCategory} [projectCategory] - Catégorie d'un projet.
 */
export type VisitSearchMeta = {
  id: string;
  section: VisitSectionId;
  label: string;
  detail: string;
  target: string;
  year: number;
  kind: VisitSearchKind;
  themes: KnowledgeThemeId[];
  terms: Set<string>;
  ownTerms: Set<string>;
  skillId?: string;
  projectCategory?: ProjectCategory;
};

/**
 * Résultat brut d'une recherche, avec les termes réellement trouvés.
 *
 * @property {string} id - Identifiant du document.
 * @property {number} score - Score renvoyé par MiniSearch.
 * @property {string[]} terms - Termes de la requête trouvés dans le document.
 * @property {VisitSearchMeta} meta - Métadonnées du document.
 * @property {boolean} sectionLabelOnly - Correspondance limitée au nom de la section.
 * @property {boolean} themeOnly - Correspondance limitée à un thème.
 */
export type VisitSearchMatch = {
  id: string;
  score: number;
  terms: string[];
  meta: VisitSearchMeta;
  sectionLabelOnly: boolean;
  themeOnly: boolean;
};

/**
 * Documents indexés pour une langue.
 *
 * @property {MiniSearch<SearchDocument>} index - Index plein texte.
 * @property {Map<string, VisitSearchMeta>} byId - Métadonnées par identifiant.
 * @property {Set<string>} vocabulary - Termes connus, utilisés pour repérer les inconnus.
 * @property {Map<VisitSectionId, Set<string>>} sectionTagTerms - Termes de recherche propres à chaque section.
 */
export type VisitSearchCorpus = {
  index: MiniSearch<SearchDocument>;
  byId: Map<string, VisitSearchMeta>;
  vocabulary: Set<string>;
  sectionTagTerms: Map<VisitSectionId, Set<string>>;
};

/**
 * Groupe de sections dont une seule suffit à couvrir le besoin.
 *
 * @property {VisitSectionId[]} sections - Sections équivalentes.
 * @property {string} gapKey - Clé i18n de l'écart quand aucune ne correspond.
 */
export type RequiredSectionGroup = {
  sections: VisitSectionId[];
  gapKey: string;
};

/**
 * Section classée, avec ses contenus retenus.
 *
 * @property {VisitSectionId} section - Identifiant de la section.
 * @property {Array<{ meta: VisitSearchMeta; score: number }>} entries - Contenus retenus, du plus pertinent au moins pertinent.
 * @property {number} score - Score de la section.
 * @property {boolean} hasRealItem - Indique qu'au moins un contenu réel correspond.
 */
export type VisitSearchSection = {
  section: VisitSectionId;
  entries: Array<{ meta: VisitSearchMeta; score: number }>;
  score: number;
  hasRealItem: boolean;
};

/**
 * Résultat de la sélection et du verdict d'un parcours.
 *
 * @property {VisitSearchSection[]} displaySelected - Sections affichées, compléments compris.
 * @property {Set<VisitSectionId>} strongSelectedIds - Sections retenues sur un contenu réel.
 * @property {VisitVerdict} verdict - Verdict de correspondance.
 */
export type VisitSearchRouting = {
  displaySelected: VisitSearchSection[];
  strongSelectedIds: Set<VisitSectionId>;
  verdict: VisitVerdict;
};
