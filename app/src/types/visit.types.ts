import type { Localized } from './common.types';
import type { KnowledgeThemeId } from './knowledge.types';
import type { SectionId } from './section.types';
import type { SkillTenureSummary } from './skill.types';
import type { IconName } from './ui.types';

/** Section du site proposée dans un parcours de visite. */
export type VisitSectionId = SectionId;

/** Profil de lecture utilisé pour pondérer le parcours. */
export type VisitPersona =
  | 'general'
  | 'data'
  | 'research'
  | 'teaching'
  | 'industry';

/** Longueur du parcours proposé. */
export type VisitMode = 'express' | 'full';

/**
 * Politique d'accès aux sections hors noyau.
 *
 * `named` exige que la demande nomme la section, `matched` l'ouvre dès qu'un
 * contenu réel correspond.
 */
export type VisitSectionPolicy = 'named' | 'matched';

/**
 * Définition statique d'une étape possible.
 *
 * @property {VisitSectionId} id - Identifiant de la section.
 * @property {IconName} icon - Icône affichée dans l'étape.
 * @property {string} labelKey - Clé i18n du libellé.
 * @property {Localized} description - Ce que la section apporte au visiteur.
 * @property {number} duration - Durée estimée en minutes.
 * @property {string[]} searchTags - Vocabulaire de recherche de la section.
 * @property {string[]} nameWords - Expressions qui nomment la section dans une demande.
 * @property {string[]} [searchAliases] - Alias réservés à la fiche de la section.
 */
export type VisitSectionDefinition = {
  id: VisitSectionId;
  icon: IconName;
  labelKey: string;
  description: Localized;
  duration: number;
  searchTags: string[];
  nameWords: string[];
  searchAliases?: string[];
};

/**
 * Profil de lecture proposé sous le champ de recherche.
 *
 * @property {VisitPersona} id - Identifiant du profil.
 * @property {string} labelKey - Clé i18n du libellé.
 * @property {IconName} icon - Icône affichée dans le sélecteur.
 * @property {VisitSectionId[]} sectionOrder - Ordre des sections attendu.
 * @property {VisitSectionId[]} contextSections - Sections secondaires que ce profil attend.
 * @property {KnowledgeThemeId[]} themes - Thèmes qui portent le profil.
 * @property {KnowledgeThemeId[]} projectThemes - Thèmes acceptés pour les projets.
 * @property {KnowledgeThemeId[]} skillThemes - Thèmes acceptés pour les compétences.
 * @property {KnowledgeThemeId[]} timelineThemes - Thèmes acceptés pour le parcours.
 * @property {KnowledgeThemeId[]} teachingThemes - Thèmes acceptés pour l'enseignement.
 * @property {KnowledgeThemeId[]} [awardThemes] - Thèmes des prix retenus, `themes` par défaut.
 * @property {string[]} [projectCategories] - Catégories de projets retenues.
 * @property {'relevance' | 'courses-first'} [teachingOrder] - Ordre préféré entre cours et encadrements.
 * @property {number} [minTeachingHours] - Volume horaire minimal d'un cours retenu.
 */
export type VisitPersonaDefinition = {
  id: VisitPersona;
  labelKey: string;
  icon: IconName;
  sectionOrder: VisitSectionId[];
  contextSections: VisitSectionId[];
  themes: KnowledgeThemeId[];
  projectThemes: KnowledgeThemeId[];
  skillThemes: KnowledgeThemeId[];
  timelineThemes: KnowledgeThemeId[];
  teachingThemes: KnowledgeThemeId[];
  awardThemes?: KnowledgeThemeId[];
  projectCategories?: string[];
  teachingOrder?: 'relevance' | 'courses-first';
  minTeachingHours?: number;
};

/**
 * Élément concret à regarder dans une section.
 *
 * @property {string} label - Libellé de l'élément.
 * @property {string} [detail] - Précision affichée sous le libellé.
 * @property {string} [skillId] - Compétence décrite par l'élément.
 * @property {string} [target] - Sélecteur `data-visit-target` de l'élément.
 * @property {SkillTenureSummary} [tenure] - Ancienneté d'une compétence.
 */
export type VisitHighlight = {
  label: string;
  detail?: string;
  skillId?: string;
  target?: string;
  tenure?: SkillTenureSummary;
};

/**
 * Étape calculée du parcours.
 *
 * @property {VisitSectionId} id - Identifiant de la section.
 * @property {string} anchor - Ancre de la section.
 * @property {IconName} icon - Icône de l'étape.
 * @property {string} labelKey - Clé i18n du libellé.
 * @property {string} description - Description traduite de l'étape.
 * @property {number} duration - Durée estimée en minutes.
 * @property {number} score - Score de la section pour la requête.
 * @property {VisitHighlight[]} highlights - Éléments concrets à regarder.
 * @property {boolean} isComplement - Étape ajoutée sans contenu réel.
 */
export type VisitStop = {
  id: VisitSectionId;
  anchor: string;
  icon: IconName;
  labelKey: string;
  description: string;
  duration: number;
  score: number;
  highlights: VisitHighlight[];
  isComplement: boolean;
};

/**
 * Parcours calculé pour une requête et un profil de lecture.
 *
 * @property {VisitStop[]} stops - Étapes ordonnées.
 * @property {number} duration - Durée totale estimée en minutes.
 * @property {VisitMode} mode - Longueur retenue du parcours.
 * @property {VisitPersona} persona - Profil de lecture appliqué.
 * @property {boolean} hasMatches - Indique qu'au moins un contenu correspond.
 * @property {VisitVerdict} [verdict] - Verdict de correspondance de l'offre.
 */
export type VisitPlan = {
  stops: VisitStop[];
  duration: number;
  mode: VisitMode;
  persona: VisitPersona;
  hasMatches: boolean;
  verdict?: VisitVerdict;
};

/**
 * Cible d'une étape de visite guidée.
 *
 * @property {VisitSectionId} stopId - Étape d'origine.
 * @property {string} labelKey - Clé i18n du libellé de l'étape.
 * @property {string | null} label - Libellé de l'élément, `null` pour la section seule.
 * @property {string} target - Sélecteur de l'élément ciblé.
 * @property {string} section - Ancre de la section qui contient la cible.
 */
export type VisitTourTarget = {
  stopId: VisitSectionId;
  labelKey: string;
  label: string | null;
  target: string;
  section: string;
};

/**
 * État de la visite guidée.
 *
 * @property {VisitTourTarget[]} targets - Cibles ordonnées.
 * @property {number} index - Cible courante.
 * @property {boolean} done - Indique une visite terminée.
 */
export type VisitTourState = {
  targets: VisitTourTarget[];
  index: number;
  done: boolean;
};

/** Niveau de correspondance entre une offre et le profil. */
export type VisitFit = 'strong' | 'partial' | 'weak';

/**
 * Écart ou preuve manquante affichée dans le verdict.
 *
 * @property {string} key - Clé i18n du message.
 * @property {Record<string, string | number>} [params] - Valeurs injectées dans la traduction.
 */
export type VisitVerdictGap = {
  key: string;
  params?: Record<string, string | number>;
};

/**
 * Verdict de correspondance d'une offre.
 *
 * @property {VisitFit} fit - Niveau de correspondance.
 * @property {number} coverage - Part de la requête couverte.
 * @property {string[]} evidence - Preuves affichées.
 * @property {string[]} [evidenceTargets] - Sélecteurs des preuves cliquables.
 * @property {VisitVerdictGap[]} gaps - Écarts et preuves manquantes.
 */
export type VisitVerdict = {
  fit: VisitFit;
  coverage: number;
  evidence: string[];
  evidenceTargets?: string[];
  gaps: VisitVerdictGap[];
};

/**
 * Rectangle du projecteur autour de l'élément courant.
 *
 * @property {number} top - Position verticale en pixels.
 * @property {number} left - Position horizontale en pixels.
 * @property {number} width - Largeur en pixels.
 * @property {number} height - Hauteur en pixels.
 */
export type VisitSpotlightRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};
