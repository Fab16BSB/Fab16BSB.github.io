/* =========================================================================
  MOTEUR : recherche plein texte
  MiniSearch + stemmers Snowball, un index par section et par langue.
========================================================================= */
import MiniSearch from 'minisearch';
import { eng, fra, spa } from 'stopword';
import { stemmer as stemmerEn } from '@orama/stemmers/english';
import { stemmer as stemmerEs } from '@orama/stemmers/spanish';
import { stemmer as stemmerFr } from '@orama/stemmers/french';
import { normalizeSearchText } from '@/lib/search';
import type { Locale } from '@/types/common.types';
import type { LexicalMatch, SearchDocument } from '@/types/search.types';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Stemmers Snowball par langue. */
const stemmers: Record<Locale, (token: string) => string> = {
  fr: stemmerFr,
  en: stemmerEn,
  es: stemmerEs,
};

/** Mots vides fournis par la bibliothèque `stopword`, normalisés. */
const buildStopWords = (words: string[]): Set<string> =>
  new Set(words.map((word) => normalizeSearchText(word)).filter(Boolean));

/** Mots vides par langue. */
const STOP_WORDS: Record<Locale, Set<string>> = {
  fr: buildStopWords(fra),
  en: buildStopWords(eng),
  es: buildStopWords(spa),
};

/** Part du meilleur score conservée pour éliminer le bruit de fin de liste. */
const SCORE_FLOOR_RATIO = 0.1;

/** Cache des index : une entrée par section et par langue. */
const indexes = new Map<string, MiniSearch<SearchDocument>>();

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Construit l'index MiniSearch d'un jeu de documents.
 *
 * @param locale - Langue de l'index, pour le stemmer et les mots vides.
 * @param documents - Documents à indexer.
 * @returns L'index prêt à être interrogé.
 */
function createIndex(locale: Locale, documents: SearchDocument[]): MiniSearch<SearchDocument> {
  const stopWords = STOP_WORDS[locale];
  const stemmer = stemmers[locale];
  const index = new MiniSearch<SearchDocument>({
    idField: 'id',
    fields: ['title', 'tags', 'body'],
    storeFields: ['id'],
    processTerm: (term) => {
      const normalized = normalizeSearchText(term);
      let result: string | null = null;

      if (normalized.length > 0 && !stopWords.has(normalized)) {
        result = stemmer(normalized);
      }

      return result;
    },
  });

  index.addAll(
    documents.map((document) => ({
      id: document.id,
      title: normalizeSearchText(document.title),
      tags: normalizeSearchText(document.tags),
      body: normalizeSearchText(document.body),
    })),
  );

  return index;
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Retourne l'index d'une section, en le construisant au premier appel.
 *
 * @param key - Clé unique de l'index (section, variante et langue).
 * @param locale - Langue de l'index.
 * @param documents - Documents à indexer au premier appel.
 * @returns L'index MiniSearch.
 */
export function getSearchIndex(
  key: string,
  locale: Locale,
  documents: SearchDocument[],
): MiniSearch<SearchDocument> {
  let index = indexes.get(key);

  if (!index) {
    index = createIndex(locale, documents);
    indexes.set(key, index);
  }

  return index;
}

/**
 * Interroge un index et retourne les identifiants classés.
 *
 * La recherche accepte les préfixes et une faute de frappe, puis retire les
 * résultats dont le score est très inférieur au meilleur.
 *
 * @param index - Index MiniSearch.
 * @param query - Recherche saisie.
 * @returns Les correspondances lexicales, du meilleur au moins bon.
 */
export function searchDocuments(
  index: MiniSearch<SearchDocument>,
  query: string,
): LexicalMatch[] {
  const normalized = normalizeSearchText(query);
  let result: LexicalMatch[] = [];

  if (normalized.length > 0) {
    const matches = index.search(normalized, {
      prefix: true,
      fuzzy: 0.2,
      boost: { title: 3, tags: 2, body: 1 },
      combineWith: 'OR',
    });
    const floor = (matches[0]?.score ?? 0) * SCORE_FLOOR_RATIO;

    result = matches
      .filter((match) => match.score >= floor)
      .map((match) => ({ id: String(match.id), score: match.score }));
  }

  return result;
}
