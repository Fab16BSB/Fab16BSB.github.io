/* =========================================================================
  CORPUS : sources carrière
  Expériences, formations et compétences converties en documents.
========================================================================= */
import { education } from '@/data/career/education.data';
import { experiences } from '@/data/career/experience.data';
import { skills } from '@/data/career/skills.data';
import { conceptVocabulary } from '@/lib/knowledge/knowledge-matching';
import { normalizeKnowledgeText } from '@/lib/knowledge/knowledge-normalize';
import { formatYearRange } from '@/lib/tenure-format';
import { visitTarget } from '@/lib/visit/visit-targets';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import type { Locale } from '@/types/common.types';
import type { CorpusAdd } from './visit-search-corpus.sources';

/**
 * Ajoute les expériences professionnelles au corpus.
 *
 * @param add - Fonction d'ajout au corpus.
 * @param locale - Langue de lecture.
 */
export function collectExperiences(
  add: CorpusAdd,
  locale: Locale,
): void {
  for (const experience of experiences) {
    add(
      {
        id: visitTarget('experience', experience.id),
        section: 'timeline',
        label: experience.role[locale],
        detail: `${experience.company} · ${formatYearRange(experience.start, experience.end)}`,
        target: visitTarget('experience', experience.id),
        year:
          experience.end === 'present'
            ? VISIT_CONFIG.presentYear
            : experience.end,
      },
      experience.role[locale],
      [experience.company, ...experience.tags],
      [
        experience.description?.[locale] ?? '',
        ...(experience.points ?? []).map((point) => point[locale]),
      ],
    );
  }
}

/**
 * Ajoute les formations au corpus.
 *
 * @param add - Fonction d'ajout au corpus.
 * @param locale - Langue de lecture.
 */
export function collectEducation(
  add: CorpusAdd,
  locale: Locale,
): void {
  for (const item of education) {
    add(
      {
        id: visitTarget('education', item.id),
        section: 'timeline',
        label: item.degree[locale],
        detail: `${item.school[locale]} · ${item.start}–${item.end}`,
        target: visitTarget('education', item.id),
        year: item.end,
      },
      item.degree[locale],
      [item.school[locale], ...(item.tags ?? [])],
      [item.detail?.[locale] ?? ''],
    );
  }
}

/**
 * Ajoute les compétences au corpus.
 *
 * @param add - Fonction d'ajout au corpus.
 */
export function collectSkills(add: CorpusAdd): void {
  for (const skill of skills) {
    const aliases = skill.aliases ?? [];
    const seen = new Set(
      [skill.name, skill.category, ...aliases].map(normalizeKnowledgeText),
    );
    // Les concepts déjà portés par la compétence ne sont pas répétés : un
    // doublon fausserait le score lexical du document.
    const concepts = (skill.conceptIds ?? [])
      .flatMap(
        (conceptId) => conceptVocabulary.get(conceptId) ?? [],
      )
      .filter((term) => {
        const key = normalizeKnowledgeText(term);

        if (!key || seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      });

    // Le nom compte aussi comme tag : une compétence citée explicitement doit
    // peser autant que ses synonymes dans le classement lexical.
    add(
      {
        id: visitTarget('skill', skill.id),
        section: 'skills',
        label: skill.name,
        detail: skill.category,
        target: visitTarget('skill', skill.id),
        year: 0,
        skillId: skill.id,
      },
      skill.name,
      [skill.category, skill.name, ...aliases, ...concepts],
      [],
    );
  }
}
