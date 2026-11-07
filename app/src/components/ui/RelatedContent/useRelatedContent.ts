/* =========================================================================
  IMPORTS
========================================================================= */
import { useMemo } from 'react';
import { knowledgeThemes } from '@/data/knowledge-taxonomy.data';
import mediumPostsRaw from '@/data/medium-posts.json';
import { useI18n } from '@/i18n/useI18n';
import { getKnowledgeGraph } from '@/lib/knowledge-index';
import { getKnowledgeRecommendations } from '@/lib/knowledge-recommendations';
import { KNOWLEDGE_RANKING } from '@/lib/knowledge.config';
import type { Localized } from '@/types/common.types';
import type { MediumPost } from '@/types/medium.types';
import type {
  KnowledgeContentKind,
  KnowledgeRelatedContent,
} from '@/types/knowledge.types';
import {
  buildArticleTranslationIndex,
  buildRelatedContentItem,
} from './relatedContent.helpers';

/* =========================================================================
  INTERFACES
========================================================================= */
type UseRelatedContentOptions = {
  limit?: number;
  minScore?: number;
  kinds?: KnowledgeContentKind[];
  excludeKinds?: KnowledgeContentKind[];
};

type UseRelatedContentResult = {
  items: KnowledgeRelatedContent[];
};

/* =========================================================================
  CONSTANTES
========================================================================= */
/** Toutes les natures de contenu pouvant être recommandées. */
const ALL_CONTENT_KINDS: KnowledgeContentKind[] = [
  'project',
  'publication',
  'article',
  'skill',
  'teaching',
  'experience',
  'education',
  'award',
  'supervision',
  'video',
];

/** Articles Medium utilisés pour résoudre les traductions. */
const MEDIUM_POSTS = mediumPostsRaw as unknown as MediumPost[];

/* =========================================================================
  HOOK : useRelatedContent
  Calcule les contenus proches d'un nœud et prépare leurs libellés.
========================================================================= */
export function useRelatedContent(
  nodeId: string,
  options: UseRelatedContentOptions = {},
): UseRelatedContentResult {
  const { locale } = useI18n();
  const {
    limit = 4,
    minScore = KNOWLEDGE_RANKING.relatedContentMinScore,
    kinds,
    excludeKinds,
  } = options;

  // Clés stables pour ne recalculer que lorsque les filtres changent.
  const kindsKey = kinds?.join(',') ?? '';
  const excludeKey = excludeKinds?.join(',') ?? '';

  // Index des traductions Medium, construit une seule fois par composant.
  const articleTranslations = useMemo(
    () => buildArticleTranslationIndex(MEDIUM_POSTS),
    [],
  );

  // Libellés des thèmes, stables pour toute la durée de vie du composant.
  const themeLabels = useMemo(
    () => new Map<string, Localized>(knowledgeThemes.map((theme) => [theme.id, theme.label])),
    [],
  );

  // Libellés des concepts, extraits une seule fois du graphe mémoisé.
  const conceptLabels = useMemo(() => {
    const graph = getKnowledgeGraph();
    return new Map<string, Localized>(
      graph.nodes
        .filter((node) => node.kind === 'concept')
        .map((node) => [node.sourceId, node.label]),
    );
  }, []);

  // Recommandations filtrées, puis enrichies de leurs libellés.
  const items = useMemo(() => {
    const acceptedKinds = kindsKey
      ? (kindsKey.split(',') as KnowledgeContentKind[])
      : undefined;
    const excluded = new Set(
      excludeKey ? (excludeKey.split(',') as KnowledgeContentKind[]) : [],
    );

    // Le moteur ne reçoit que les natures réellement affichables.
    const queryKinds =
      acceptedKinds ??
      (excluded.size > 0
        ? ALL_CONTENT_KINDS.filter((kind) => !excluded.has(kind))
        : undefined);

    // Marge de résultats quand des natures sont filtrées après coup.
    const fetchLimit = excluded.size > 0 ? Math.max(limit * 2, limit + 2) : limit;
    const recommendations = getKnowledgeRecommendations(nodeId, {
      limit: fetchLimit,
      minScore,
      kinds: queryKinds,
    });

    // Écarte les natures exclues après le calcul, puis prépare chaque carte.
    const relatedItems = recommendations
      .filter((recommendation) => !excluded.has(recommendation.node.kind))
      .map((recommendation) =>
        buildRelatedContentItem(
          recommendation,
          articleTranslations,
          locale,
          themeLabels,
          conceptLabels,
        ),
      );

    return relatedItems.slice(0, limit);
  }, [nodeId, limit, kindsKey, excludeKey, themeLabels, conceptLabels, articleTranslations, locale]);

  return { items };
}
