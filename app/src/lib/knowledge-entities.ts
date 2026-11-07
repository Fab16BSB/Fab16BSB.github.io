/* =========================================================================
  HELPERS : nœuds bruts — fonctions pures
  Transformation des données du portfolio en nœuds avant enrichissement.
  Un nœud brut est un nœud intermédiaire : il contient les données brutes du
  contenu, avant la détection des thèmes, des concepts et des arêtes.
========================================================================= */
import { awards } from '@/data/awards.data';
import { education } from '@/data/education.data';
import { experiences } from '@/data/experience.data';
import { publicationSummaries } from '@/data/publication-summaries.data';
import { publications } from '@/data/publications.data';
import { projects } from '@/data/projects.data';
import { skills } from '@/data/skills.data';
import { supervisions } from '@/data/supervisions.data';
import { teaching } from '@/data/teaching.data';
import type { Locale, Localized } from '@/types/common.types';
import type { EducationId } from '@/types/education.types';
import type { ExperienceId } from '@/types/experience.types';
import type { KnowledgeContentKind } from '@/types/knowledge.types';
import type { MediumPost } from '@/types/medium.types';
import type { Publication } from '@/types/publication.types';
import type { YoutubeVideo } from '@/types/youtube.types';
import { mediumPosts, videos } from './knowledge-raw-data';

/* =========================================================================
  TYPES ET CONSTANTES
========================================================================= */

/** Nœud de contenu avant détection des thèmes et des concepts. */
export type KnowledgeRawNode = {
  kind: KnowledgeContentKind;
  sourceId: string;
  label: Localized;
  year?: number;
  anchor?: string;
  educationId?: EducationId;
  educationIds?: EducationId[];
  experienceIds?: ExperienceId[];
  tags: string[];
  text: Record<Locale, string>;
};

/** Ordre d'export des natures de contenu. */
const KIND_ORDER: KnowledgeContentKind[] = [
  'project',
  'publication',
  'article',
  'skill',
  'teaching',
  'experience',
  'education',
  'award',
  'supervision',
  'video',
];

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Assemble des fragments de texte non vides.
 *
 * @param parts - Fragments éventuellement absents.
 * @returns Les fragments joints par un point.
 */
function joinText(parts: Array<string | undefined | null>): string {
  return parts
    .filter((part): part is string => Boolean(part && part.trim()))
    .join('. ');
}

/**
 * Construit un libellé identique dans les trois langues.
 *
 * @param value - Libellé invariant.
 * @returns Le libellé traduit.
 */
function sameLabel(value: string): Localized {
  return { fr: value, en: value, es: value };
}

/**
 * Extrait la première année à quatre chiffres d'un libellé.
 *
 * @param value - Année ou plage d'années.
 * @returns L'année numérique, sinon `undefined`.
 */
function parseYear(value: string | number): number | undefined {
  if (typeof value === 'number') return value;
  const match = value.match(/\d{4}/);
  return match ? Number(match[0]) : undefined;
}

/**
 * Sélectionne la version de publication la plus proche d'une langue.
 *
 * @param publication - Publication source.
 * @param locale - Langue demandée.
 * @returns La version localisée, avec repli sur l'anglais puis la première.
 */
function publicationVersion(publication: Publication, locale: Locale) {
  return (
    publication.versions.find((version) => version.language === locale) ??
    publication.versions.find((version) => version.language === 'en') ??
    publication.versions[0]
  );
}

/* =========================================================================
  NŒUDS BRUTS : projets et publications
========================================================================= */

/**
 * Construit le nœud brut d'un projet.
 *
 * @param project - Projet du portfolio.
 * @returns Le nœud brut projet.
 */
function projectRawNode(project: (typeof projects)[number]): KnowledgeRawNode {
  const locales: Locale[] = ['fr', 'en', 'es'];
  const text = Object.fromEntries(
    locales.map((locale) => [
      locale,
      joinText([
        project.title[locale],
        project.description[locale],
        project.details[locale],
        ...(project.highlights ?? []).map((highlight) => highlight[locale]),
        project.stack.join(' '),
        project.category,
        project.studyLevel,
      ]),
    ]),
  ) as Record<Locale, string>;

  return {
    kind: 'project',
    sourceId: project.id,
    label: project.title,
    year: parseYear(project.year),
    anchor: '#projects',
    educationIds: project.educationIds,
    experienceIds: project.experienceIds,
    tags: [...project.stack, project.category],
    text,
  };
}

/**
 * Construit le nœud brut d'une publication scientifique.
 *
 * @param publication - Publication du portfolio.
 * @returns Le nœud brut publication.
 */
function publicationRawNode(publication: Publication): KnowledgeRawNode {
  const summary = publicationSummaries[publication.id];
  const locales: Locale[] = ['fr', 'en', 'es'];
  const text = Object.fromEntries(
    locales.map((locale) => {
      const version = publicationVersion(publication, locale);
      const points = summary?.points[locale];
      return [
        locale,
        joinText([
          version?.title,
          version?.abstract,
          publication.venue[locale],
          publication.authors.join(' '),
          points ? `${points.context} ${points.problem} ${points.solution}` : '',
          summary?.keywords[locale].join(' '),
        ]),
      ];
    }),
  ) as Record<Locale, string>;

  return {
    kind: 'publication',
    sourceId: publication.id,
    label: {
      fr: publicationVersion(publication, 'fr')?.title ?? publication.id,
      en: publicationVersion(publication, 'en')?.title ?? publication.id,
      es:
        publicationVersion(publication, 'en')?.title ??
        publicationVersion(publication, 'fr')?.title ??
        publication.id,
    },
    year: parseYear(publication.year),
    anchor: '#publications',
    tags: [
      ...publication.authors,
      publication.venue.fr,
      ...(summary?.keywords.fr ?? []),
      ...(summary?.keywords.en ?? []),
      'LaTeX',
    ],
    text,
  };
}

/**
 * Construit le nœud brut d'un article Medium.
 *
 * @param post - Article Medium.
 * @returns Le nœud brut article.
 */
function articleRawNode(post: MediumPost): KnowledgeRawNode {
  const text = joinText([post.title, post.excerpt, post.tags.join(' ')]);
  return {
    kind: 'article',
    sourceId: post.id,
    label: sameLabel(post.title),
    year: parseYear(post.publishedAt.slice(0, 4)),
    anchor: '#publications',
    tags: [...post.tags, 'Medium'],
    text: { fr: text, en: text, es: text },
  };
}

/* =========================================================================
  NŒUDS BRUTS : parcours et enseignement
========================================================================= */

/**
 * Construit le nœud brut d'une compétence.
 *
 * @param skill - Compétence du portfolio.
 * @returns Le nœud brut compétence.
 */
function skillRawNode(skill: (typeof skills)[number]): KnowledgeRawNode {
  const locales: Locale[] = ['fr', 'en', 'es'];
  const text = Object.fromEntries(
    locales.map((locale) => [
      locale,
      joinText([skill.name, skill.context?.[locale]]),
    ]),
  ) as Record<Locale, string>;

  return {
    kind: 'skill',
    sourceId: skill.id,
    label: sameLabel(skill.name),
    anchor: '#skills',
    educationIds: skill.educationIds,
    experienceIds: skill.experienceIds,
    tags: [skill.name, skill.category],
    text,
  };
}

/**
 * Construit le nœud brut d'un cours enseigné.
 *
 * @param course - Cours du portfolio.
 * @returns Le nœud brut enseignement.
 */
function teachingRawNode(course: (typeof teaching)[number]): KnowledgeRawNode {
  const activities = course.distribution.map((entry) => entry.type).join(' ');
  const text = Object.fromEntries(
    (['fr', 'en', 'es'] as Locale[]).map((locale) => [
      locale,
      joinText([
        course.theme[locale],
        course.level,
        course.place,
        course.students,
        activities,
        `${course.hours} heures`,
      ]),
    ]),
  ) as Record<Locale, string>;

  return {
    kind: 'teaching',
    sourceId: course.id,
    label: course.theme,
    year: course.end,
    anchor: '#teaching',
    tags: [
      course.level,
      course.place,
      ...course.distribution.map((entry) => entry.type),
      ...(course.tags ?? []),
    ],
    text,
  };
}

/**
 * Construit le nœud brut d'une expérience professionnelle.
 *
 * @param experience - Expérience du portfolio.
 * @returns Le nœud brut expérience.
 */
function experienceRawNode(experience: (typeof experiences)[number]): KnowledgeRawNode {
  const text = Object.fromEntries(
    (['fr', 'en', 'es'] as Locale[]).map((locale) => [
      locale,
      joinText([
        experience.role[locale],
        experience.company,
        experience.description?.[locale],
        ...(experience.points ?? []).map((point) => point[locale]),
        experience.tags.join(' '),
      ]),
    ]),
  ) as Record<Locale, string>;

  return {
    kind: 'experience',
    sourceId: experience.id,
    label: experience.role,
    year: experience.start,
    anchor: '#timeline',
    educationId: experience.educationId,
    tags: experience.tags,
    text,
  };
}

/**
 * Construit le nœud brut d'une formation.
 *
 * @param item - Formation du portfolio.
 * @returns Le nœud brut formation.
 */
function educationRawNode(item: (typeof education)[number]): KnowledgeRawNode {
  const text = Object.fromEntries(
    (['fr', 'en', 'es'] as Locale[]).map((locale) => [
      locale,
      joinText([item.degree[locale], item.school[locale], item.detail?.[locale]]),
    ]),
  ) as Record<Locale, string>;

  return {
    kind: 'education',
    sourceId: item.id,
    label: item.degree,
    year: item.end,
    anchor: '#timeline',
    tags: ['formation', 'diplome', ...(item.tags ?? [])],
    text,
  };
}

/**
 * Construit le nœud brut d'une distinction.
 *
 * @param award - Distinction du portfolio.
 * @returns Le nœud brut distinction.
 */
function awardRawNode(award: (typeof awards)[number]): KnowledgeRawNode {
  const text = Object.fromEntries(
    (['fr', 'en', 'es'] as Locale[]).map((locale) => [
      locale,
      joinText([award.title[locale], award.event, award.kind, award.tier, award.year]),
    ]),
  ) as Record<Locale, string>;

  return {
    kind: 'award',
    sourceId: award.id,
    label: award.title,
    year: parseYear(award.year),
    anchor: '#awards',
    tags: [award.kind, award.tier ?? '', award.event ?? ''].filter(Boolean),
    text,
  };
}

/**
 * Construit le nœud brut d'un encadrement.
 *
 * @param item - Encadrement du portfolio.
 * @returns Le nœud brut encadrement.
 */
function supervisionRawNode(item: (typeof supervisions)[number]): KnowledgeRawNode {
  const text = Object.fromEntries(
    (['fr', 'en', 'es'] as Locale[]).map((locale) => [
      locale,
      joinText([
        item.topic[locale],
        item.role[locale],
        item.institution,
        item.description[locale],
        item.kind,
        item.mode,
        'encadrement',
        ...(item.tags ?? []),
      ]),
    ]),
  ) as Record<Locale, string>;

  return {
    kind: 'supervision',
    sourceId: item.id,
    label: item.topic,
    year: item.start ?? (typeof item.end === 'number' ? item.end : undefined),
    anchor: '#teaching',
    tags: [item.kind, item.mode, item.institution, ...(item.tags ?? [])],
    text,
  };
}

/**
 * Construit le nœud brut d'une vidéo YouTube.
 *
 * @param video - Vidéo du portfolio.
 * @returns Le nœud brut vidéo.
 */
function videoRawNode(video: YoutubeVideo): KnowledgeRawNode {
  const text = joinText([video.title, video.type, 'youtube video tutoriel']);
  return {
    kind: 'video',
    sourceId: video.id,
    label: sameLabel(video.title),
    year: parseYear(video.publishedAt.slice(0, 4)),
    anchor: '#videos',
    tags: [video.type, 'YouTube'],
    text: { fr: text, en: text, es: text },
  };
}

/* =========================================================================
  EXPORT
========================================================================= */

/**
 * Construit tous les nœuds bruts du portfolio.
 *
 * @returns Les contenus triés par nature puis par année décroissante.
 */
export function extractRawNodes(): KnowledgeRawNode[] {
  const rawNodes: KnowledgeRawNode[] = [
    ...projects.map(projectRawNode),
    ...publications.map(publicationRawNode),
    ...mediumPosts.map(articleRawNode),
    ...skills.map(skillRawNode),
    ...teaching.map(teachingRawNode),
    ...experiences.map(experienceRawNode),
    ...education.map(educationRawNode),
    ...awards.map(awardRawNode),
    ...supervisions.map(supervisionRawNode),
    ...videos.map(videoRawNode),
  ];

  return rawNodes.sort((left, right) => {
    const kindGap = KIND_ORDER.indexOf(left.kind) - KIND_ORDER.indexOf(right.kind);
    if (kindGap !== 0) return kindGap;
    return (right.year ?? 0) - (left.year ?? 0) || left.sourceId.localeCompare(right.sourceId);
  });
}
