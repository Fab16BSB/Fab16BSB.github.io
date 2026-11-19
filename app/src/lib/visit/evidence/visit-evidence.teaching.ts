/* =========================================================================
  PREUVES : enseignement — fonctions pures
  Cours et encadrements partagent le score, mais pas le même ordre.
========================================================================= */
import { supervisions } from '@/data/content/supervisions.data';
import { teaching } from '@/data/content/teaching.data';
import { formatYearRange } from '@/lib/tenure-format';
import { visitTarget } from '@/lib/visit/visit-targets';
import { detectThemes, getThemeScore } from '@/lib/visit/visit-themes';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
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
   COURS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Score les cours pour un profil de lecture.
 *
 * @param locale - Langue de lecture.
 * @param persona - Profil de lecture.
 * @returns Les cours scorés.
 */
function buildCourseEntries(
  locale: Locale,
  persona: VisitPersonaDefinition,
): VisitEvidenceEntry[] {
  const themes = persona.teachingThemes;
  const courseBonus =
    persona.teachingOrder === 'courses-first'
      ? VISIT_CONFIG.courseFirstBonus
      : 0;
  const minHours =
    persona.minTeachingHours ?? VISIT_CONFIG.minCourseHours;

  return teaching.map((course) => {
    const allowed =
      persona.teachingOrder !== 'courses-first' ||
      course.hours >= minHours;
    const texts = [
      course.theme[locale],
      course.tags?.join(' ') ?? '',
      course.level,
      course.place,
    ];
    const base = allowed
      ? recencyScore(course.end) +
        (course.tags?.length ?? 0) * VISIT_CONFIG.evidenceTagWeight +
        VISIT_CONFIG.courseBaseScore +
        courseBonus
      : 0;
    const themeScore = allowed
      ? getThemeScore(detectThemes(texts), themes)
      : 0;

    return {
      score: base + themeScore * VISIT_CONFIG.evidenceThemeWeight,
      themeScore,
      group: 0,
      highlight: {
        label: course.theme[locale],
        detail: `${formatYearRange(course.start, course.end)} · ${course.level.toUpperCase()} · ${course.hours} h`,
        target: visitTarget('course', course.id),
      },
    };
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   ENCADREMENTS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Indique si un encadrement est un tutorat.
 *
 * @param supervision - Encadrement du portfolio.
 * @returns `true` si le tag `tutorat` est présent.
 */
function isTutor(
  supervision: (typeof supervisions)[number],
): boolean {
  return (supervision.tags ?? []).some(
    (tag) => tag.toLowerCase() === 'tutorat',
  );
}

/**
 * Score les encadrements retenus par le profil.
 *
 * @param locale - Langue de lecture.
 * @param referenceYear - Année de référence.
 * @param persona - Profil de lecture.
 * @returns Les encadrements scorés.
 */
function buildSupervisionEntries(
  locale: Locale,
  referenceYear: number,
  persona: VisitPersonaDefinition,
): VisitEvidenceEntry[] {
  const themes = persona.teachingThemes;
  const supervisionBonus =
    persona.teachingOrder === 'courses-first'
      ? 0
      : VISIT_CONFIG.supervisionBonus;
  const teachingSupervisions =
    persona.teachingOrder === 'courses-first'
      ? supervisions.filter(isTutor)
      : supervisions;

  return teachingSupervisions.map((supervision) => {
    const texts = [
      supervision.topic[locale],
      supervision.role[locale],
      supervision.description[locale],
      supervision.institution,
      supervision.tags?.join(' ') ?? '',
    ];
    const end =
      supervision.end === 'present'
        ? referenceYear
        : supervision.end ?? supervision.start ?? 0;
    const base =
      recencyScore(end) +
      (supervision.tags?.length ?? 0) * VISIT_CONFIG.evidenceTagWeight +
      supervisionBonus;
    const themeScore = getThemeScore(detectThemes(texts), themes);
    const tutor = isTutor(supervision);
    const years =
      supervision.start && supervision.end
        ? `${supervision.start}–${supervision.end === 'present' ? '...' : supervision.end}`
        : supervision.institution;

    return {
      score: base + themeScore * VISIT_CONFIG.evidenceThemeWeight,
      themeScore,
      group: tutor ? 1 : 2,
      highlight: {
        label: supervision.topic[locale],
        detail: `${supervision.role[locale]} · ${years}`,
        target: visitTarget('supervision', supervision.id),
      },
    };
  });
}

/* ─────────────────────────────────────────────────────────────────────────
   SÉLECTION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Sélectionne un cours, un tutorat, puis complète la liste.
 *
 * @param sorted - Contenus triés par groupe puis par score.
 * @param limit - Nombre maximal de contenus.
 * @returns Les contenus retenus.
 */
function selectCoursesFirstEntries(
  sorted: VisitEvidenceEntry[],
  limit: number,
): VisitHighlight[] {
  const selected: VisitEvidenceEntry[] = [];
  const course = sorted.find((entry) => entry.group === 0);
  const tutor = sorted.find((entry) => entry.group === 1);

  if (course) {
    selected.push(course);
  }

  if (tutor) {
    selected.push(tutor);
  }

  for (const entry of sorted) {
    const hasRoom = selected.length < limit;

    if (hasRoom && !selected.includes(entry)) {
      selected.push(entry);
    }
  }

  return selected
    .slice(0, limit)
    .map((entry) => entry.highlight);
}

/**
 * Retourne les cours et encadrements à mettre en avant.
 *
 * @param locale - Langue de lecture.
 * @param limit - Nombre maximal de contenus.
 * @param referenceYear - Année de référence.
 * @param persona - Profil de lecture.
 * @returns Les contenus retenus.
 */
export function getTeachingHighlights(
  locale: Locale,
  limit: number,
  referenceYear: number,
  persona: VisitPersonaDefinition,
): VisitHighlight[] {
  const themes = persona.teachingThemes;
  const entries = [
    ...buildCourseEntries(locale, persona),
    ...buildSupervisionEntries(locale, referenceYear, persona),
  ];
  const filtered =
    themes.length > 0
      ? entries.filter((entry) => entry.themeScore > 0)
      : entries;

  if (persona.teachingOrder === 'courses-first') {
    const sorted = [...filtered].sort(
      (left, right) =>
        (left.group ?? 0) - (right.group ?? 0) ||
        right.score - left.score,
    );

    return selectCoursesFirstEntries(sorted, limit);
  }

  return pickHighlights(filtered, limit);
}
