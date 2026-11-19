/* =========================================================================
  CORPUS : sources de contenu
  Projets, publications, cours, encadrements, vidéos et distinctions.
========================================================================= */
import { awards } from '@/data/content/awards.data';
import { projects } from '@/data/content/projects.data';
import { publicationSummaries } from '@/data/content/publication-summaries.data';
import { publications } from '@/data/content/publications.data';
import { supervisions } from '@/data/content/supervisions.data';
import { teaching } from '@/data/content/teaching.data';
import videosRaw from '@/data/feeds/youtube-videos.json';
import { parseYear } from '@/lib/date.helpers';
import { formatYearRange } from '@/lib/tenure-format';
import { visitTarget } from '@/lib/visit/visit-targets';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import type { Locale } from '@/types/common.types';
import type { YoutubeVideo } from '@/types/youtube.types';
import type { CorpusAdd } from './visit-search-corpus.sources';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Vidéos typées. */
const videos = videosRaw as unknown as YoutubeVideo[];

/* ─────────────────────────────────────────────────────────────────────────
   COLLECTE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Ajoute les projets au corpus.
 *
 * @param add - Fonction d'ajout au corpus.
 * @param locale - Langue de lecture.
 */
export function collectProjects(
  add: CorpusAdd,
  locale: Locale,
): void {
  for (const project of projects) {
    add(
      {
        id: visitTarget('project', project.id),
        section: 'projects',
        label: project.title[locale],
        detail: [project.year, ...project.stack.slice(0, 3)].join(' · '),
        target: visitTarget('project', project.id),
        year: parseYear(project.year),
        projectCategory: project.category,
      },
      project.title[locale],
      [project.category, ...project.stack],
      [project.description[locale], project.details[locale]],
    );
  }
}

/**
 * Ajoute les publications scientifiques au corpus.
 *
 * @param add - Fonction d'ajout au corpus.
 * @param locale - Langue de lecture.
 */
export function collectPublications(
  add: CorpusAdd,
  locale: Locale,
): void {
  for (const publication of publications) {
    const summary = publicationSummaries[publication.id];
    const points = summary?.points[locale];

    add(
      {
        id: visitTarget('publication', publication.id),
        section: 'publications',
        label: publication.versions[0]?.title ?? publication.id,
        detail: `${publication.year} · ${publication.venue[locale]}`,
        target: visitTarget('publication', publication.id),
        year: parseYear(publication.year),
      },
      publication.versions[0]?.title ?? publication.id,
      [publication.venue[locale], ...(summary?.keywords[locale] ?? [])],
      [
        ...publication.versions.map((version) => version.abstract),
        points
          ? `${points.context} ${points.problem} ${points.solution}`
          : '',
      ],
    );
  }
}

/**
 * Ajoute les cours au corpus.
 *
 * @param add - Fonction d'ajout au corpus.
 * @param locale - Langue de lecture.
 */
export function collectCourses(
  add: CorpusAdd,
  locale: Locale,
): void {
  for (const course of teaching) {
    if (course.hours < VISIT_CONFIG.minCourseHours) {
      continue;
    }

    add(
      {
        id: visitTarget('course', course.id),
        section: 'teaching',
        label: course.theme[locale],
        detail: `${formatYearRange(course.start, course.end)} · ${course.level.toUpperCase()} · ${course.hours} h`,
        target: visitTarget('course', course.id),
        year: course.end,
      },
      course.theme[locale],
      [course.level, ...(course.tags ?? [])],
      [],
    );
  }
}

/**
 * Ajoute les encadrements au corpus.
 *
 * @param add - Fonction d'ajout au corpus.
 * @param locale - Langue de lecture.
 */
export function collectSupervisions(
  add: CorpusAdd,
  locale: Locale,
): void {
  for (const supervision of supervisions) {
    add(
      {
        id: visitTarget('supervision', supervision.id),
        section: 'teaching',
        label: supervision.topic[locale],
        detail: `${supervision.role[locale]} · ${supervision.institution}`,
        target: visitTarget('supervision', supervision.id),
        year:
          supervision.end === 'present'
            ? VISIT_CONFIG.presentYear
            : supervision.end ?? supervision.start ?? 0,
      },
      supervision.topic[locale],
      [
        supervision.role[locale],
        supervision.institution,
        ...(supervision.tags ?? []),
      ],
      [supervision.description[locale]],
    );
  }
}

/**
 * Ajoute les vidéos au corpus.
 *
 * @param add - Fonction d'ajout au corpus.
 */
export function collectVideos(add: CorpusAdd): void {
  for (const video of videos) {
    add(
      {
        id: visitTarget('video', video.id),
        section: 'videos',
        label: video.title,
        detail: video.publishedAt.slice(0, 4),
        target: visitTarget('video', video.id),
        year: parseYear(video.publishedAt.slice(0, 4)),
      },
      video.title,
      [video.type],
      [],
    );
  }
}

/**
 * Ajoute les distinctions au corpus.
 *
 * @param add - Fonction d'ajout au corpus.
 * @param locale - Langue de lecture.
 */
export function collectAwards(
  add: CorpusAdd,
  locale: Locale,
): void {
  for (const award of awards) {
    add(
      {
        id: visitTarget('award', award.id),
        section: 'awards',
        label: award.title[locale],
        detail: [award.year, award.event].filter(Boolean).join(' · '),
        target: visitTarget('award', award.id),
        year: parseYear(award.year),
      },
      award.title[locale],
      [award.kind, award.event ?? '', ...(award.tags ?? [])],
      [award.year],
    );
  }
}
