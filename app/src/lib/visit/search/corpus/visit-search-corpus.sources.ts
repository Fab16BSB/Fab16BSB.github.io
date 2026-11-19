/* =========================================================================
  CORPUS : sources du parcours de visite
  Chaque contenu du portfolio est converti en document indexable.
========================================================================= */
import {
  conceptAliasIndex,
  conceptVocabulary,
} from '@/lib/knowledge/knowledge-matching';
import {
  includesKnowledgePhrase,
  normalizeKnowledgeText,
  padKnowledgeText,
} from '@/lib/knowledge/knowledge-normalize';
import { tokenizeSearchText } from '@/lib/search/search-engine';
import { detectThemes } from '@/lib/visit/visit-themes';
import { sectionsById } from '@/lib/visit/search/visit-search-vocabulary';
import type { Locale } from '@/types/common.types';
import type { SearchDocument } from '@/types/search.types';
import type {
  VisitSearchKind,
  VisitSearchMeta,
} from '@/types/visit-search.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Concepts préparés pour la détection dans un texte. */
const conceptMatchers = [...conceptAliasIndex]
  .map(([id, { normalized }]) => ({
    id,
    aliases: normalized.filter((alias) => alias.length >= 3),
  }))
  .filter((concept) => concept.aliases.length > 0);

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Ajoute un document au corpus en cours de construction. */
export type CorpusAdd = (
  meta: Omit<
    VisitSearchMeta,
    'themes' | 'terms' | 'ownTerms' | 'kind'
  > & {
    kind?: VisitSearchKind;
  },
  title: string,
  tags: string[],
  body: string[],
) => void;

/** Structures partagées pendant la construction du corpus. */
export type CorpusDraft = {
  byId: Map<string, VisitSearchMeta>;
  documents: SearchDocument[];
  vocabulary: Set<string>;
};

/* ─────────────────────────────────────────────────────────────────────────
   CONCEPTS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Retourne le vocabulaire des concepts reconnus dans un texte.
 *
 * Un document qui parle d'un concept hérite de ses autres graphies : le
 * vocabulaire vient des concepts déclarés, pas d'une liste par thème.
 *
 * @param texts - Textes du document.
 * @returns Les graphies des concepts détectés.
 */
function getConceptTerms(texts: string[]): string[] {
  const padded = padKnowledgeText(
    normalizeKnowledgeText(texts.join(' ')),
  );
  const result: string[] = [];

  for (const concept of conceptMatchers) {
    const found = concept.aliases.some((alias) =>
      includesKnowledgePhrase(padded, alias),
    );

    if (found) {
      result.push(...(conceptVocabulary.get(concept.id) ?? []));
    }
  }

  return [...new Set(result)];
}

/* ─────────────────────────────────────────────────────────────────────────
   AJOUT D'UN DOCUMENT
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Crée les structures vides du corpus.
 *
 * @returns Le brouillon à remplir.
 */
export function createCorpusDraft(): CorpusDraft {
  return {
    byId: new Map(),
    documents: [],
    vocabulary: new Set(),
  };
}

/**
 * Crée la fonction d'ajout d'un document au corpus.
 *
 * @param locale - Langue de lecture.
 * @param draft - Structures à remplir.
 * @returns La fonction d'ajout.
 */
export function createCorpusAdd(
  locale: Locale,
  draft: CorpusDraft,
): CorpusAdd {
  return (meta, title, tags, body) => {
    const kind = meta.kind ?? 'item';
    const allTags = [
      ...tags,
      ...(sectionsById.get(meta.section)?.searchTags ?? []),
    ];
    const themes = detectThemes([title, allTags.join(' '), body.join(' ')]);
    const conceptTags =
      kind === 'item' && meta.section !== 'skills'
        ? getConceptTerms([title, allTags.join(' '), body.join(' ')])
        : [];
    const indexedTags = [...allTags, ...conceptTags];
    const ownTerms = new Set(
      tokenizeSearchText(
        locale,
        [title, allTags.join(' '), body.join(' ')].join(' '),
      ),
    );
    const terms = new Set(
      tokenizeSearchText(
        locale,
        [title, indexedTags.join(' '), body.join(' ')].join(' '),
      ),
    );

    draft.byId.set(meta.id, { ...meta, kind, themes, terms, ownTerms });
    draft.documents.push({
      id: meta.id,
      title,
      tags: indexedTags.join(' '),
      body: body.join(' '),
    });

    for (const token of terms) {
      draft.vocabulary.add(token);
    }
  };
}
