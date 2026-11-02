/* =========================================================================
  IMPORTS
========================================================================= */
import { SEARCH_RANKING } from '@/lib/search.config';
import type { LexicalMatch } from '@/types/search.types';

/* =========================================================================
  TYPES
========================================================================= */

/** Options de fusion des résultats. */
export type RankOptions = {
  lexical: LexicalMatch[];
  semantic?: Map<string, number> | null;
  allowedIds?: Set<string>;
};

/* =========================================================================
  HELPERS : fusion lexicale / sémantique — fonctions pures
  Classement final à partir des résultats MiniSearch et des cosinus.
========================================================================= */

/**
 * Fusionne les résultats lexicaux et sémantiques.
 *
 * Sans sémantique, l'ordre lexical est conservé. Avec sémantique, les scores
 * lexicaux sont normalisés sur le meilleur résultat, puis additionnés aux
 * cosinus. Seuls les meilleurs candidats sémantiques sont ajoutés.
 *
 * @param options - Résultats lexicaux, scores sémantiques et identifiants autorisés.
 * @returns Les identifiants classés par pertinence.
 */
export function rankSearchResults({
  lexical,
  semantic,
  allowedIds,
}: RankOptions): string[] {
  let result = lexical.map((match) => match.id);

  if (semantic) {
    const topLexical = lexical[0]?.score ?? 0;
    const lexicalScores = new Map(
      lexical.map((match) => [match.id, topLexical > 0 ? match.score / topLexical : 0]),
    );
    const lexicalRanks = new Map(lexical.map((match, index) => [match.id, index]));
    const candidates = [...semantic.entries()]
      .filter(([id, score]) => (!allowedIds || allowedIds.has(id)) && score >= SEARCH_RANKING.semanticMin)
      .sort((left, right) => right[1] - left[1])
      .slice(0, SEARCH_RANKING.semanticTopK);
    const ids = new Set(result);

    for (const [id] of candidates) {
      ids.add(id);
    }

    result = [...ids].sort((left, right) => {
      const leftScore =
        SEARCH_RANKING.lexicalWeight * (lexicalScores.get(left) ?? 0) +
        SEARCH_RANKING.semanticWeight * Math.max(0, semantic.get(left) ?? 0);
      const rightScore =
        SEARCH_RANKING.lexicalWeight * (lexicalScores.get(right) ?? 0) +
        SEARCH_RANKING.semanticWeight * Math.max(0, semantic.get(right) ?? 0);

      return (
        rightScore - leftScore ||
        (lexicalRanks.get(left) ?? Number.MAX_SAFE_INTEGER) -
          (lexicalRanks.get(right) ?? Number.MAX_SAFE_INTEGER)
      );
    });
  }

  return result;
}
