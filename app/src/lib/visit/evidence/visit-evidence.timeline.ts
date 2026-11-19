/* =========================================================================
   PREUVES : parcours — fonctions pures
   Expériences et formations partagent le score, mais pas le même groupe.
========================================================================= */
import { education } from '@/data/career/education.data';
import { experiences } from '@/data/career/experience.data';
import { formatYearRange } from '@/lib/tenure-format';
import { visitTarget } from '@/lib/visit/visit-targets';
import { detectThemes, getThemeScore } from '@/lib/visit/visit-themes';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import {
  endYear,
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
   EXPÉRIENCES
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Score les expériences professionnelles.
 *
 * @param locale - Langue de lecture.
 * @param referenceYear - Année de référence.
 * @param persona - Profil de lecture.
 * @returns Les expériences scorées.
 */
function buildExperienceEntries(
  locale: Locale,
  referenceYear: number,
  persona: VisitPersonaDefinition,
): VisitEvidenceEntry[] {
  const themes = persona.timelineThemes;
  const experienceThemes = themes.filter(
    (theme) => theme !== 'education',
  );

  return experiences.map((experience) => {
    const texts = [
      experience.role[locale],
      experience.company,
      experience.tags.join(' '),
      experience.description?.[locale] ?? '',
      ...(experience.points ?? []).map((point) => point[locale]),
    ];
    const end = endYear(experience.end, referenceYear);
    const base =
      recencyScore(end) +
      (experience.end === 'present'
        ? VISIT_CONFIG.currentExperienceBonus
        : 0) +
      experience.tags.length * VISIT_CONFIG.evidenceTagWeight;
    const themeScore = getThemeScore(
      detectThemes(texts),
      experienceThemes,
    );

    return {
      score: base + themeScore * VISIT_CONFIG.evidenceThemeWeight,
      themeScore,
      group: 0,
      highlight: {
        label: experience.role[locale],
        detail: `${experience.company} · ${formatYearRange(experience.start, experience.end)}`,
        target: visitTarget('experience', experience.id),
      },
    };
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   FORMATIONS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Score les formations.
 *
 * @param locale - Langue de lecture.
 * @param persona - Profil de lecture.
 * @returns Les formations scorées.
 */
function buildEducationEntries(
  locale: Locale,
  persona: VisitPersonaDefinition,
): VisitEvidenceEntry[] {
  const themes = persona.timelineThemes;

  return education.map((item) => {
    const educationBoost = themes.some(
      (theme) => theme === 'research' || theme === 'education',
    )
      ? VISIT_CONFIG.educationThemeBonus
      : 0;
    const base =
      recencyScore(item.end) +
      (item.tags?.length ?? 0) * VISIT_CONFIG.evidenceTagWeight +
      VISIT_CONFIG.educationBaseScore +
      educationBoost;
    const themeScore = getThemeScore(item.themes, themes);

    return {
      score: base + themeScore * VISIT_CONFIG.evidenceThemeWeight,
      themeScore,
      group: 1,
      highlight: {
        label: item.degree[locale],
        detail: `${item.school[locale]} · ${item.start}–${item.end}`,
        target: visitTarget('education', item.id),
      },
    };
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Retourne les expériences et formations à mettre en avant.
 *
 * @param locale - Langue de lecture.
 * @param limit - Nombre maximal de contenus.
 * @param referenceYear - Année de référence.
 * @param persona - Profil de lecture.
 * @returns Les contenus retenus.
 */
export function getTimelineHighlights(
  locale: Locale,
  limit: number,
  referenceYear: number,
  persona: VisitPersonaDefinition,
): VisitHighlight[] {
  const themes = persona.timelineThemes;
  const entries = [
    ...buildExperienceEntries(locale, referenceYear, persona),
    ...buildEducationEntries(locale, persona),
  ];
  const filtered =
    themes.length > 0
      ? entries.filter((entry) => entry.themeScore > 0)
      : entries;

  if (persona.teachingOrder === 'courses-first') {
    return [...filtered]
      .sort(
        (left, right) =>
          (left.group ?? 0) - (right.group ?? 0) ||
          right.score - left.score,
      )
      .slice(0, limit)
      .map((entry) => entry.highlight);
  }

  return pickHighlights(filtered, limit);
}
