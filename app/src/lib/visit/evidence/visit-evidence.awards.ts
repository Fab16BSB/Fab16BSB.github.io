/* =========================================================================
   PREUVES : distinctions — fonctions pures
   Une distinction compte par son type, sa récence et son thème.
========================================================================= */
import { awards } from '@/data/content/awards.data';
import { visitTarget } from '@/lib/visit/visit-targets';
import { detectThemes, getThemeScore } from '@/lib/visit/visit-themes';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import { parseYear } from '@/lib/date.helpers';
import {
  pickHighlights,
  recencyScore,
} from './visit-evidence.helpers';
import type { VisitEvidenceEntry } from './visit-evidence.types';
import type { Locale } from '@/types/common.types';
import type {
  VisitHighlight,
  VisitPersonaDefinition,
} from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Poids des types de distinction. */
const AWARD_KIND_WEIGHT: Record<string, number> = {
  medal: 20,
  trophy: 8,
  rosette: 4,
  badge: 2,
  pin: 2,
};

/* ─────────────────────────────────────────────────────────────────────────
   SÉLECTION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Score une distinction pour un profil de lecture.
 *
 * @param award - Distinction du portfolio.
 * @param locale - Langue de lecture.
 * @param themes - Thèmes attendus par le profil.
 * @returns Le contenu scoré.
 */
function buildAwardEntry(
  award: (typeof awards)[number],
  locale: Locale,
  themes: VisitPersonaDefinition['themes'],
): VisitEvidenceEntry {
  const texts = [
    award.title[locale],
    award.event ?? '',
    award.year,
    award.kind,
    ...(award.tags ?? []),
  ];
  const base =
    recencyScore(parseYear(award.year)) +
    (AWARD_KIND_WEIGHT[award.kind] ?? 0);
  const themeScore = getThemeScore(detectThemes(texts), themes);

  return {
    score: base + themeScore * VISIT_CONFIG.evidenceThemeWeight,
    themeScore,
    highlight: {
      label: award.title[locale],
      detail: [award.year, award.event].filter(Boolean).join(' · '),
      target: visitTarget('award', award.id),
    },
  };
}

/**
 * Retourne les distinctions à mettre en avant.
 *
 * @param locale - Langue de lecture.
 * @param limit - Nombre maximal de contenus.
 * @param persona - Profil de lecture.
 * @returns Les distinctions retenues.
 */
export function getAwardHighlights(
  locale: Locale,
  limit: number,
  persona: VisitPersonaDefinition,
): VisitHighlight[] {
  const themes = persona.awardThemes ?? persona.themes;
  const entries = awards.map((award) =>
    buildAwardEntry(award, locale, themes),
  );
  const filtered =
    themes.length > 0
      ? entries.filter((entry) => entry.themeScore > 0)
      : entries;

  return pickHighlights(filtered, limit);
}
