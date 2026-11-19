/* =========================================================================
   GRAPHE : signaux de contenu pour la deuxième passe du parcours
   Réutilise les thèmes et concepts déjà extraits pour comparer une offre à
   un contenu, sans relire les données du portfolio.
========================================================================= */
import { extractContentNodes } from '@/lib/knowledge/knowledge-extract';
import { conceptAliasIndex } from '@/lib/knowledge/knowledge-matching';
import {
  includesKnowledgeAcronym,
  includesKnowledgePhrase,
  normalizeKnowledgeText,
  padKnowledgeText,
} from '@/lib/knowledge/knowledge-normalize';
import { knowledgeTarget, visitTarget } from '@/lib/visit/visit-targets';
import { detectThemes } from '@/lib/visit/visit-themes';
import type { KnowledgeThemeId } from '@/types/knowledge.types';

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Signaux d'un contenu dans le graphe. */
export type VisitGraphSignals = {
  themes: KnowledgeThemeId[];
  terms: string[];
};

/** Signaux d'une offre dans le graphe. */
export type VisitOfferGraphSignals = {
  themes: KnowledgeThemeId[];
  terms: string[];
  primaryTheme: KnowledgeThemeId | null;
};

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Cache des signaux du graphe.
 *
 * Construit au premier appel : le contenu du portfolio est figé au chargement.
 */
let cache: {
  byTarget: Map<string, VisitGraphSignals>;
  themeFrequency: Map<string, number>;
  termFrequency: Map<string, number>;
} | null = null;

/** Concepts préparés pour la détection dans une offre. */
const conceptMatchers = [...conceptAliasIndex].map(
  ([id, { raw, normalized }]) => ({
    id,
    aliases: normalized.filter((alias) => alias.length >= 3),
    acronyms: raw
      .map((alias) => alias.trim().toUpperCase())
      .filter((alias) => alias.length === 2),
  }),
);

/* ─────────────────────────────────────────────────────────────────────────
   SIGNAUX DES CONTENUS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Construit les signaux du graphe à partir des nœuds de contenu.
 *
 * @returns Les signaux indexés et les fréquences.
 */
function buildSignals() {
  const extraction = extractContentNodes();
  const byTarget = new Map<string, VisitGraphSignals>();
  const themeFrequency = new Map<string, number>();
  const termFrequency = new Map<string, number>();

  for (const node of extraction.nodes) {
    const kind = knowledgeTarget(node.kind);

    if (!kind) {
      continue;
    }

    const target = visitTarget(kind, node.sourceId);
    byTarget.set(target, {
      themes: node.themes,
      // Les concepts déclarés relèvent de la couverture de la compétence, pas
      // d'une mention : ils ne doivent pas gonfler la cohérence de la visite.
      terms: node.terms.filter(
        (term) => !(node.declaredTerms ?? []).includes(term),
      ),
    });

    for (const theme of node.themes) {
      themeFrequency.set(
        theme,
        (themeFrequency.get(theme) ?? 0) + 1,
      );
    }

    for (const term of node.terms) {
      termFrequency.set(
        term,
        (termFrequency.get(term) ?? 0) + 1,
      );
    }
  }

  return { byTarget, themeFrequency, termFrequency };
}

/**
 * Retourne les signaux du graphe, construits une seule fois.
 *
 * @returns Les signaux et les fréquences.
 */
function getSignals() {
  if (!cache) {
    cache = buildSignals();
  }

  return cache;
}

/**
 * Retourne les signaux d'un contenu.
 *
 * @param target - Identifiant de cible de visite.
 * @returns Les thèmes et concepts du contenu.
 */
export function getVisitGraphSignals(
  target: string,
): VisitGraphSignals | null {
  return getSignals().byTarget.get(target) ?? null;
}

/* ─────────────────────────────────────────────────────────────────────────
   SIGNAUX DE L'OFFRE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Détecte les concepts d'une offre.
 *
 * @param query - Offre saisie.
 * @returns Les concepts reconnus.
 */
function detectOfferTerms(query: string): string[] {
  const padded = padKnowledgeText(normalizeKnowledgeText(query));
  const result: string[] = [];

  for (const matcher of conceptMatchers) {
    if (
      matcher.aliases.some((alias) =>
        includesKnowledgePhrase(padded, alias),
      ) ||
      matcher.acronyms.some((acronym) =>
        includesKnowledgeAcronym(query, acronym),
      )
    ) {
      result.push(matcher.id);
    }
  }

  return result;
}

/**
 * Retourne les signaux d'une offre.
 *
 * @param query - Offre saisie.
 * @returns Les thèmes, concepts et thème principal.
 */
export function getOfferGraphSignals(
  query: string,
): VisitOfferGraphSignals {
  const themes = detectThemes([query]);
  const terms = detectOfferTerms(query);

  return {
    themes,
    terms,
    primaryTheme: themes[0] ?? null,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   COHÉRENCE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Calcule la cohérence entre une offre et un contenu.
 *
 * Les nœuds rares comptent plus que les nœuds génériques.
 *
 * @param doc - Signaux du contenu.
 * @param offer - Signaux de l'offre.
 * @returns Le score de cohérence, le partage de thème principal et de concept.
 */
export function getGraphCoherence(
  doc: VisitGraphSignals | null,
  offer: VisitOfferGraphSignals,
): {
  score: number;
  sharesPrimary: boolean;
  sharesConcept: boolean;
} {
  if (!doc) {
    return { score: 0, sharesPrimary: false, sharesConcept: false };
  }

  const { themeFrequency, termFrequency } = getSignals();
  const sharedThemes = doc.themes.filter((theme) =>
    offer.themes.includes(theme),
  );
  const sharedTerms = doc.terms.filter((term) =>
    offer.terms.includes(term),
  );
  const themeScore = sharedThemes.reduce(
    (total, theme) =>
      total + 1 / Math.log(2 + (themeFrequency.get(theme) ?? 1)),
    0,
  );
  const termScore = sharedTerms.reduce(
    (total, term) =>
      total + 1.5 / Math.log(2 + (termFrequency.get(term) ?? 1)),
    0,
  );
  const sharesPrimary =
    offer.primaryTheme !== null &&
    doc.themes.includes(offer.primaryTheme);

  return {
    score: themeScore + termScore,
    sharesPrimary,
    sharesConcept: sharedTerms.length > 0,
  };
}
