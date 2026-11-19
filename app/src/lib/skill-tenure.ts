/* =========================================================================
   HELPERS : ancienneté des compétences — calcul mémoïsé
   Calcule les traces d'utilisation depuis les formations, expériences,
   projets, cours et articles Medium. Le résultat est mis en cache par année
   de référence.
========================================================================= */
import { education } from '@/data/career/education.data';
import { experiences } from '@/data/career/experience.data';
import mediumPostsRaw from '@/data/feeds/medium-posts.json';
import { projects } from '@/data/content/projects.data';
import { skills } from '@/data/career/skills.data';
import { teaching } from '@/data/content/teaching.data';
import { normalizeSearchText } from '@/lib/search/search';
import type { MediumPost } from '@/types/medium.types';
import type { SkillTenure, SkillTenureSource } from '@/types/skill.types';

/* ─────────────────────────────────────────────────────────────────────────
   CACHE
   ───────────────────────────────────────────────────────────────────────── */

/** Cache des anciennetés par année de référence. */
const tenureCache = new Map<number, Map<string, SkillTenure>>();

/* ─────────────────────────────────────────────────────────────────────────
   INDEX
   ───────────────────────────────────────────────────────────────────────── */

/** Formations indexées par identifiant. */
const educationById = new Map(education.map((item) => [item.id, item]));

/** Expériences indexées par identifiant. */
const experienceById = new Map(
  experiences.map((item) => [item.id, item]),
);

/** Projets indexés par identifiant. */
const projectById = new Map(projects.map((item) => [item.id, item]));

/** Articles Medium indexés par identifiant. */
const mediumPosts = mediumPostsRaw as unknown as MediumPost[];
const mediumPostById = new Map(mediumPosts.map((item) => [item.id, item]));

/**
 * Indexe les alias normalisés des compétences.
 *
 * @returns La table `alias normalisé → identifiant de compétence`.
 */
function buildSkillAliasIndex(): Map<string, string> {
  const index = new Map<string, string>();

  for (const skill of skills) {
    const aliases = new Set([skill.name, ...(skill.aliases ?? [])]);

    for (const alias of aliases) {
      const normalized = normalizeSearchText(alias);

      if (normalized && !index.has(normalized)) {
        index.set(normalized, skill.id);
      }
    }
  }

  return index;
}

/** Compétence correspondant à un alias normalisé. */
const skillIdByAlias = buildSkillAliasIndex();

/* ─────────────────────────────────────────────────────────────────────────
   COLLECTE DES SOURCES
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Ajoute une source à une compétence sans doublon.
 *
 * @param sources - Sources déjà collectées par compétence.
 * @param skillId - Compétence cible.
 * @param source - Trace à ajouter.
 */
function addSource(
  sources: Map<string, SkillTenureSource[]>,
  skillId: string,
  source: SkillTenureSource,
): void {
  const list = sources.get(skillId);

  if (!list) {
    return;
  }

  const key = `${source.kind}:${source.id}`;

  if (!list.some((item) => `${item.kind}:${item.id}` === key)) {
    list.push(source);
  }
}

/**
 * Convertit une année de projet en nombre.
 *
 * @param year - Année affichée.
 * @returns L'année numérique, ou `null` si elle est illisible.
 */
function projectYear(year: string): number | null {
  const parsed = Number.parseInt(year, 10);
  const result = Number.isFinite(parsed) ? parsed : null;

  return result;
}

/**
 * Ajoute les formations déclarées par une compétence.
 *
 * @param sources - Sources déjà collectées.
 * @param skill - Compétence concernée.
 */
function collectEducationSources(
  sources: Map<string, SkillTenureSource[]>,
  skill: (typeof skills)[number],
): void {
  for (const id of skill.educationIds ?? []) {
    const item = educationById.get(id);

    if (item) {
      addSource(sources, skill.id, {
        kind: 'education',
        id: item.id,
        start: item.start,
        end: item.end,
        label: item.degree,
      });
    }
  }
}

/**
 * Ajoute les expériences déclarées par une compétence.
 *
 * @param sources - Sources déjà collectées.
 * @param skill - Compétence concernée.
 */
function collectExperienceSources(
  sources: Map<string, SkillTenureSource[]>,
  skill: (typeof skills)[number],
): void {
  for (const id of skill.experienceIds ?? []) {
    const item = experienceById.get(id);

    if (item) {
      addSource(sources, skill.id, {
        kind: 'experience',
        id: item.id,
        start: item.start,
        end: item.end,
        label: item.role,
      });
    }
  }
}

/**
 * Ajoute les projets déclarés par une compétence.
 *
 * @param sources - Sources déjà collectées.
 * @param skill - Compétence concernée.
 */
function collectProjectSources(
  sources: Map<string, SkillTenureSource[]>,
  skill: (typeof skills)[number],
): void {
  for (const id of skill.projectIds ?? []) {
    const item = projectById.get(id);
    const year = item ? projectYear(item.year) : null;

    if (item && year !== null) {
      addSource(sources, skill.id, {
        kind: 'project',
        id: item.id,
        start: year,
        end: year,
        label: item.title,
      });
    }
  }
}

/**
 * Ajoute les articles Medium déclarés par une compétence.
 *
 * @param sources - Sources déjà collectées.
 * @param skill - Compétence concernée.
 */
function collectArticleSources(
  sources: Map<string, SkillTenureSource[]>,
  skill: (typeof skills)[number],
): void {
  for (const id of skill.mediumPostIds ?? []) {
    const item = mediumPostById.get(id);
    const year = item
      ? new Date(item.publishedAt).getFullYear()
      : Number.NaN;

    if (item && Number.isFinite(year)) {
      addSource(sources, skill.id, {
        kind: 'article',
        id: item.id,
        start: year,
        end: year,
        label: { fr: item.title, en: item.title, es: item.title },
      });
    }
  }
}

/**
 * Ajoute les sources explicitement déclarées par chaque compétence.
 *
 * @param sources - Sources à remplir.
 */
function collectDeclaredSources(
  sources: Map<string, SkillTenureSource[]>,
): void {
  for (const skill of skills) {
    collectEducationSources(sources, skill);
    collectExperienceSources(sources, skill);
    collectProjectSources(sources, skill);
    collectArticleSources(sources, skill);
  }
}

/**
 * Ajoute les projets dont la stack cite une compétence connue.
 *
 * @param sources - Sources à remplir.
 */
function collectProjectStackSources(
  sources: Map<string, SkillTenureSource[]>,
): void {
  for (const project of projects) {
    for (const stackItem of project.stack) {
      const skillId = skillIdByAlias.get(
        normalizeSearchText(stackItem),
      );
      const year = projectYear(project.year);

      if (skillId && year !== null) {
        addSource(sources, skillId, {
          kind: 'project',
          id: project.id,
          start: year,
          end: year,
          label: project.title,
        });
      }
    }
  }
}

/**
 * Ajoute les cours dont les tags citent une compétence connue.
 *
 * @param sources - Sources à remplir.
 */
function collectTeachingSources(
  sources: Map<string, SkillTenureSource[]>,
): void {
  for (const course of teaching) {
    for (const tag of course.tags ?? []) {
      const skillId = skillIdByAlias.get(normalizeSearchText(tag));

      if (skillId) {
        addSource(sources, skillId, {
          kind: 'teaching',
          id: course.id,
          start: course.start,
          end: course.end,
          label: course.theme,
        });
      }
    }
  }
}

/* ─────────────────────────────────────────────────────────────────────────
   SYNTHÈSE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Retourne l'année de fin effective d'une source.
 *
 * @param source - Trace d'utilisation.
 * @param referenceYear - Année courante de calcul.
 * @returns L'année de fin.
 */
function sourceEndYear(
  source: SkillTenureSource,
  referenceYear: number,
): number {
  const result = source.end === 'present' ? referenceYear : source.end;

  return result;
}

/**
 * Synthétise les traces d'une compétence.
 *
 * @param skillId - Compétence concernée.
 * @param items - Traces d'utilisation collectées.
 * @param referenceYear - Année de référence.
 * @returns L'ancienneté calculée.
 */
function buildTenure(
  skillId: string,
  items: SkillTenureSource[],
  referenceYear: number,
): SkillTenure {
  const starts = items.map((item) => item.start);
  const ends = items.map((item) => sourceEndYear(item, referenceYear));
  const professional = items.filter(
    (item) => item.kind === 'experience',
  );
  const professionalStarts = professional.map((item) => item.start);
  const professionalEnds = professional.map((item) =>
    sourceEndYear(item, referenceYear),
  );
  const firstYear = starts.length > 0 ? Math.min(...starts) : null;
  const lastYear = ends.length > 0 ? Math.max(...ends) : null;
  const spanYears =
    firstYear !== null && lastYear !== null
      ? Math.max(0, lastYear - firstYear)
      : null;
  const professionalYears =
    professionalStarts.length > 0
      ? Math.max(
          0,
          Math.max(...professionalEnds) -
            Math.min(...professionalStarts),
        )
      : null;
  const isCurrent = items.some(
    (item) =>
      item.end === 'present' ||
      sourceEndYear(item, referenceYear) >= referenceYear,
  );
  const sorted = [...items].sort(
    (left, right) =>
      left.start - right.start ||
      sourceEndYear(left, referenceYear) -
        sourceEndYear(right, referenceYear),
  );

  return {
    skillId,
    firstYear,
    lastYear,
    spanYears,
    professionalYears,
    isCurrent,
    sources: sorted,
  };
}

/**
 * Construit toutes les anciennetés pour une année de référence.
 *
 * @param referenceYear - Année utilisée pour les calculs.
 * @returns Les anciennetés indexées par compétence.
 */
function buildTenures(referenceYear: number): Map<string, SkillTenure> {
  const sources = new Map<string, SkillTenureSource[]>();

  for (const skill of skills) {
    sources.set(skill.id, []);
  }

  collectDeclaredSources(sources);
  collectProjectStackSources(sources);
  collectTeachingSources(sources);

  const result = new Map<string, SkillTenure>();

  for (const skill of skills) {
    result.set(
      skill.id,
      buildTenure(
        skill.id,
        sources.get(skill.id) ?? [],
        referenceYear,
      ),
    );
  }

  return result;
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Retourne les anciennetés de toutes les compétences.
 *
 * @param referenceYear - Année de référence, par défaut l'année courante.
 * @returns Les anciennetés indexées par compétence.
 */
export function getSkillTenures(
  referenceYear = new Date().getFullYear(),
): Map<string, SkillTenure> {
  let tenures = tenureCache.get(referenceYear);

  if (!tenures) {
    tenures = buildTenures(referenceYear);
    tenureCache.set(referenceYear, tenures);
  }

  return tenures;
}

/**
 * Retourne l'ancienneté d'une compétence.
 *
 * @param skillId - Identifiant de la compétence.
 * @param referenceYear - Année de référence, par défaut l'année courante.
 * @returns L'ancienneté, ou `null` si la compétence est inconnue.
 */
export function getSkillTenure(
  skillId: string,
  referenceYear = new Date().getFullYear(),
): SkillTenure | null {
  const result = getSkillTenures(referenceYear).get(skillId) ?? null;

  return result;
}
