/* =========================================================================
  HELPERS : RelatedContent — fonctions pures
  Libellés, ancres et icônes des recommandations du graphe.
========================================================================= */
import type { Locale, Localized } from '@/types/common.types';
import type { MediumPost } from '@/types/medium.types';
import type {
  KnowledgeContentKind,
  KnowledgeContentNode,
  KnowledgeRecommendation,
  KnowledgeRelatedContent,
} from '@/types/knowledge.types';
import type { IconName } from '@/types/ui.types';

/* ─────────────────────────────────────────────────────────────────────────
   ICÔNES
   ───────────────────────────────────────────────────────────────────────── */
const KIND_ICONS: Record<KnowledgeContentKind, IconName> = {
  project: 'layers',
  publication: 'book',
  article: 'medium',
  skill: 'sparkles',
  teaching: 'users',
  experience: 'briefcase',
  education: 'graduation',
  award: 'trophy',
  supervision: 'users',
  video: 'play',
};

/**
 * Retourne l'icône associée à une nature de contenu.
 *
 * @param kind - Nature du contenu.
 * @returns Le nom d'icône du composant Icon.
 */
export function kindIcon(kind: KnowledgeContentKind): IconName {
  return KIND_ICONS[kind];
}

/* ─────────────────────────────────────────────────────────────────────────
   ANCRES
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Retourne l'ancre de section d'un contenu recommandé.
 *
 * @param node - Contenu du graphe.
 * @returns L'ancre à utiliser dans un lien interne.
 */
export function relatedHref(node: KnowledgeContentNode): string {
  const fallback = node.kind === 'project' ? '#projects' : '#';
  return node.anchor ?? fallback;
}

/* ─────────────────────────────────────────────────────────────────────────
   LIBELLÉS PARTAGÉS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Résout les libellés des thèmes partagés.
 *
 * @param recommendation - Recommandation du graphe.
 * @param labels - Index des libellés de thèmes.
 * @returns Les libellés disponibles, dans l'ordre des thèmes partagés.
 */
export function resolveThemeLabels(
  recommendation: KnowledgeRecommendation,
  labels: Map<string, Localized>,
): Localized[] {
  const resolved: Localized[] = [];

  for (const theme of recommendation.sharedThemes) {
    const label = labels.get(theme);
    if (label) resolved.push(label);
  }

  return resolved;
}

/**
 * Résout les libellés des technologies partagées.
 *
 * @param recommendation - Recommandation du graphe.
 * @param labels - Index des libellés de concepts.
 * @returns Les libellés disponibles, dans l'ordre des concepts partagés.
 */
export function resolveTermLabels(
  recommendation: KnowledgeRecommendation,
  labels: Map<string, Localized>,
): Localized[] {
  const resolved: Localized[] = [];

  for (const term of recommendation.sharedTerms) {
    const label = labels.get(term);
    if (label) resolved.push(label);
  }

  return resolved;
}

/* ─────────────────────────────────────────────────────────────────────────
   ARTICLES MEDIUM
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Retourne le titre d'un article Medium dans la langue courante.
 *
 * @param postId - Identifiant de l'article recommandé.
 * @param index - Index des traductions.
 * @param locale - Langue courante.
 * @param fallback - Titre de l'article recommandé, si aucune traduction.
 * @returns Le titre à afficher.
 */
export function localizedArticleTitle(
  postId: string,
  index: Map<string, Map<Locale, MediumPost>>,
  locale: Locale,
  fallback: string,
): string {
  const translations = index.get(postId);

  return (
    translations?.get(locale)?.title ??
    translations?.get('fr')?.title ??
    translations?.get('en')?.title ??
    fallback
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   PRÉPARATION DES CARTES
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Prépare une recommandation avec son titre localisé et ses libellés.
 *
 * @param recommendation - Recommandation du graphe.
 * @param articleTranslations - Index des traductions Medium.
 * @param locale - Langue courante.
 * @param themeLabels - Index des libellés de thèmes.
 * @param conceptLabels - Index des libellés de concepts.
 * @returns La recommandation prête pour l'affichage.
 */
export function buildRelatedContentItem(
  recommendation: KnowledgeRecommendation,
  articleTranslations: Map<string, Map<Locale, MediumPost>>,
  locale: Locale,
  themeLabels: Map<string, Localized>,
  conceptLabels: Map<string, Localized>,
): KnowledgeRelatedContent {
  const node = recommendation.node;
  let displayNode: KnowledgeContentNode = node;

  // Un article Medium est affiché dans la langue du site, même si la
  // recommandation porte sur une autre traduction du même article.
  if (node.kind === 'article') {
    const title = localizedArticleTitle(
      node.sourceId,
      articleTranslations,
      locale,
      node.label.fr,
    );
    displayNode = { ...node, label: { fr: title, en: title, es: title } };
  }

  return {
    node: displayNode,
    recommendation,
    themeLabels: resolveThemeLabels(recommendation, themeLabels),
    termLabels: resolveTermLabels(recommendation, conceptLabels),
  };
}
