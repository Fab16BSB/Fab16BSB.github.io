/* =========================================================================
  HELPERS : champs de recherche — fonctions pures
  Extraction des champs indexés par MiniSearch et par les embeddings.
========================================================================= */
import type { Locale } from '@/types/common.types';
import type { MediumPost } from '@/types/medium.types';
import type { Project } from '@/types/project.types';
import type { Publication, PublicationSummary } from '@/types/publication.types';
import type { SearchDocumentFields, SearchSection } from '@/types/search.types';
import type { TeachingCourse } from '@/types/teaching.types';
import type { YoutubeVideo } from '@/types/youtube.types';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Mots-clés de section ajoutés aux tags, dans les trois langues. */
const SECTION_LABELS: Record<SearchSection, Record<Locale, string>> = {
  projects: {
    fr: 'projet réalisation portfolio',
    en: 'project build portfolio',
    es: 'proyecto realización portafolio',
  },
  publications: {
    fr: 'publication article papier recherche',
    en: 'publication paper article research',
    es: 'publicación artículo paper investigación',
  },
  videos: {
    fr: 'vidéo tutoriel youtube',
    en: 'video tutorial youtube',
    es: 'vídeo tutorial youtube',
  },
  teaching: {
    fr: 'cours enseignement formation module',
    en: 'course teaching lecture module',
    es: 'curso enseñanza formación módulo',
  },
};

/* =========================================================================
  HELPERS : champs par domaine
========================================================================= */

/**
 * Retourne le libellé de section utilisé dans les tags.
 *
 * @param section - Section du document.
 * @param locale - Langue de la recherche.
 * @returns Le libellé de section.
 */
export function sectionSearchLabel(section: SearchSection, locale: Locale): string {
  return SECTION_LABELS[section][locale];
}

/**
 * Construit les champs recherchables d'un projet.
 *
 * @param project - Projet à indexer.
 * @param locale - Langue de la recherche.
 * @returns Les champs titre, tags et corps.
 */
export function projectSearchFields(
  project: Project,
  locale: Locale,
): SearchDocumentFields {
  return {
    title: project.title[locale],
    tags: [
      project.stack.join(' '),
      project.year,
      sectionSearchLabel('projects', locale),
    ]
      .filter(Boolean)
      .join(' '),
    body: [
      project.description[locale],
      project.details[locale],
      ...(project.highlights ?? []).map((highlight) => highlight[locale]),
    ]
      .filter(Boolean)
      .join(' '),
  };
}

/**
 * Construit les champs recherchables d'une publication scientifique.
 *
 * @param publication - Publication à indexer.
 * @param locale - Langue de la recherche.
 * @param summary - Contenu éditorial optionnel (contexte, problème, solution).
 * @returns Les champs titre, tags et corps.
 */
export function publicationSearchFields(
  publication: Publication,
  locale: Locale,
  summary?: PublicationSummary,
): SearchDocumentFields {
  const versions = publication.versions;
  const localized =
    versions.find((version) => version.language === locale) ??
    versions.find((version) => version.language === 'en') ??
    versions[0];
  const points = summary?.points[locale];

  return {
    title: versions.map((version) => version.title).join(' '),
    tags: [
      publication.authors.join(' '),
      publication.venue[locale],
      publication.year,
      summary?.keywords[locale].join(' ') ?? '',
      sectionSearchLabel('publications', locale),
    ]
      .filter(Boolean)
      .join(' '),
    body: [
      localized?.abstract ?? '',
      points ? `${points.context} ${points.problem} ${points.solution}` : '',
    ]
      .filter(Boolean)
      .join(' '),
  };
}

/**
 * Construit les champs recherchables d'un article Medium.
 *
 * @param post - Article à indexer.
 * @param locale - Langue de la recherche.
 * @returns Les champs titre, tags et corps.
 */
export function mediumPostSearchFields(
  post: MediumPost,
  locale: Locale,
): SearchDocumentFields {
  return {
    title: post.title,
    tags: [post.tags.join(' '), post.publishedAt.slice(0, 4), sectionSearchLabel('publications', locale)]
      .filter(Boolean)
      .join(' '),
    body: post.excerpt,
  };
}

/**
 * Construit les champs recherchables d'une vidéo YouTube.
 *
 * @param video - Vidéo à indexer.
 * @param locale - Langue de la recherche.
 * @returns Les champs titre, tags et corps.
 */
export function videoSearchFields(
  video: YoutubeVideo,
  locale: Locale,
): SearchDocumentFields {
  return {
    title: video.title,
    tags: [
      video.type === 'short' ? 'short' : 'vidéo',
      video.publishedAt.slice(0, 4),
      sectionSearchLabel('videos', locale),
    ]
      .filter(Boolean)
      .join(' '),
    body: '',
  };
}

/**
 * Construit les champs recherchables d'un cours.
 *
 * @param course - Cours à indexer.
 * @param locale - Langue de la recherche.
 * @returns Les champs titre, tags et corps.
 */
export function teachingCourseSearchFields(
  course: TeachingCourse,
  locale: Locale,
): SearchDocumentFields {
  return {
    title: course.theme[locale],
    tags: [
      `${course.start} ${course.end}`,
      course.level,
      course.place,
      sectionSearchLabel('teaching', locale),
    ]
      .filter(Boolean)
      .join(' '),
    body: '',
  };
}

/* =========================================================================
  HELPERS : texte indexé
========================================================================= */

/**
 * Assemble les champs en un texte unique destiné à l'embedding.
 *
 * @param fields - Champs titre, tags et corps.
 * @returns Le texte complet, séparé par des points.
 */
export function buildSearchText(fields: SearchDocumentFields): string {
  return [fields.title, fields.tags, fields.body]
    .map((part) => part.trim())
    .filter(Boolean)
    .join('. ');
}
