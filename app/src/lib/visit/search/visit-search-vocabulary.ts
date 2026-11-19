/* =========================================================================
  SECTIONS DE VISITE : index et noms
  Les réglages vivent dans `visit.config.ts`, les données dans
  `visit-sections.data.ts`. Ici, uniquement les dérivations.
========================================================================= */
import { visitSections } from '@/data/visit/visit-sections.data';
import { normalizeSearchText } from '@/lib/search/search';
import type { VisitSectionId } from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Sections indexées. */
export const sectionsById = new Map(
  visitSections.map((section) => [section.id, section]),
);

/** Expressions qui nomment explicitement une section. */
export const SECTION_NAME_WORDS = new Map<VisitSectionId, string[]>(
  visitSections.map((section) => [
    section.id,
    section.nameWords.map(normalizeNamePhrase).filter(Boolean),
  ]),
);

/* ─────────────────────────────────────────────────────────────────────────
   NORMALISATION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Réduit un mot à sa forme de comparaison stricte.
 *
 * Seul le pluriel simple est fusionné : « publications » et « publication »
 * se rejoignent, mais « public » ne devient pas « publication ».
 *
 * @param word - Mot normalisé.
 * @returns Le mot sans `s` final éventuel.
 */
function normalizeNameWord(word: string): string {
  return word.length > 3 && word.endsWith('s') ? word.slice(0, -1) : word;
}

/**
 * Normalise une expression qui nomme une section.
 *
 * L'expression reste entière : « à propos » ne doit pas se réduire au mot
 * « a », qui apparaît dans n'importe quelle demande.
 *
 * @param phrase - Expression brute.
 * @returns L'expression normalisée, mots repliés au singulier.
 */
export function normalizeNamePhrase(phrase: string): string {
  return normalizeSearchText(phrase)
    .split(' ')
    .map(normalizeNameWord)
    .join(' ');
}
