/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useState } from 'react';
import { useI18n } from '@/i18n/useI18n';
import { logger } from '@/lib/logger';
import { computeSemanticScores, loadSearchIndex } from '@/lib/search-index';
import type { SearchSection } from '@/types/search.types';
import { embedQuery } from './embeddings.client';
import { useSearchSettings } from './useSearchSettings';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Délai avant d'encoder la requête, pour éviter un appel par frappe. */
const DEBOUNCE_MS = 280;

/** Longueur minimale d'une requête sémantique. */
const MIN_QUERY_LENGTH = 2;

/* =========================================================================
  HOOK : useSemanticSearch
  Encode la requête et calcule les scores sémantiques de la section.
========================================================================= */
export function useSemanticSearch(section: SearchSection, query: string) {
  const { locale } = useI18n();
  const { semanticEnabled, semanticStatus } = useSearchSettings();

  // Scores sémantiques de la requête courante, ou `null` avant le calcul.
  const [scores, setScores] = useState<Map<string, number> | null>(null);

  const trimmed = query.trim();
  const active =
    semanticEnabled && semanticStatus === 'ready' && trimmed.length >= MIN_QUERY_LENGTH;

  // Encode la requête après un court délai, puis calcule les cosinus.
  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;

    if (active) {
      // Les anciens scores ne concernent plus la requête affichée.
      setScores(null);
      timer = window.setTimeout(() => {
        Promise.all([loadSearchIndex(locale), embedQuery(trimmed)])
          .then(([index, vector]) => {
            if (!cancelled) {
              setScores(computeSemanticScores(index, section, vector));
            }
          })
          .catch((error: unknown) => {
            logger.warn(
              'Recherche sémantique indisponible — repli sur la recherche lexicale',
              error,
            );

            if (!cancelled) {
              setScores(null);
            }
          });
      }, DEBOUNCE_MS);
    } else {
      setScores(null);
    }

    return () => {
      cancelled = true;

      if (timer !== undefined) {
        window.clearTimeout(timer);
      }
    };
  }, [active, locale, section, trimmed]);

  return { semanticScores: scores };
}
