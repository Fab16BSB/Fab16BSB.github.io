/* =========================================================================
  CORPUS : index plein texte et métadonnées du parcours de visite
  Contenus réels et fiches de section, avec cache par langue.
========================================================================= */
import { profile } from '@/data/profile/profile.data';
import { visitSections } from '@/data/visit/visit-sections.data';
import { getSearchIndex, tokenizeSearchText } from '@/lib/search/search-engine';
import { getSkillTenures } from '@/lib/skill-tenure';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import {
  collectEducation,
  collectExperiences,
  collectSkills,
} from '@/lib/visit/search/corpus/visit-search-corpus.career';
import {
  collectAwards,
  collectCourses,
  collectProjects,
  collectPublications,
  collectSupervisions,
  collectVideos,
} from '@/lib/visit/search/corpus/visit-search-corpus.content';
import {
  collectAvailability,
  collectSectionSheets,
} from '@/lib/visit/search/corpus/visit-search-corpus.sections';
import {
  createCorpusAdd,
  createCorpusDraft,
} from '@/lib/visit/search/corpus/visit-search-corpus.sources';
import type { Locale } from '@/types/common.types';
import type { KnowledgeThemeId } from '@/types/knowledge.types';
import type {
  VisitSearchCorpus,
  VisitSearchMeta,
} from '@/types/visit-search.types';
import type {
  VisitHighlight,
  VisitPersonaDefinition,
  VisitSectionId,
} from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Cache des corpus par langue. */
const corpusCache = new Map<Locale, VisitSearchCorpus>();

/* ─────────────────────────────────────────────────────────────────────────
   CONSTRUCTION
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Construit les documents indexés et leurs métadonnées.
 *
 * @param locale - Langue de lecture.
 * @returns L'index et les métadonnées.
 */
function buildCorpus(locale: Locale): VisitSearchCorpus {
  const draft = createCorpusDraft();
  const sectionTagTerms = new Map<VisitSectionId, Set<string>>();

  for (const section of visitSections) {
    sectionTagTerms.set(
      section.id,
      new Set(
        tokenizeSearchText(locale, section.searchTags.join(' ')),
      ),
    );
  }

  const add = createCorpusAdd(locale, draft);

  collectProjects(add, locale);
  collectExperiences(add, locale);
  collectEducation(add, locale);
  collectPublications(add, locale);
  collectCourses(add, locale);
  collectSupervisions(add, locale);
  collectSkills(add);
  collectVideos(add);
  collectAwards(add, locale);
  collectSectionSheets(add, locale);
  collectAvailability(add, getAvailabilityText(locale));

  const index = getSearchIndex(`visit-${locale}`, locale, draft.documents);

  return {
    index,
    byId: draft.byId,
    vocabulary: draft.vocabulary,
    sectionTagTerms,
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Retourne le texte de disponibilité pour une langue.
 *
 * @param locale - Langue de lecture.
 * @returns Le texte, ou `null` quand la disponibilité est masquée.
 */
export function getAvailabilityText(locale: Locale): string | null {
  const { status, text } = profile.availability;

  return status === 'hidden' ? null : text[status][locale];
}

/**
 * Retourne le corpus d'une langue.
 *
 * @param locale - Langue de lecture.
 * @returns L'index et les métadonnées.
 */
export function getCorpus(locale: Locale): VisitSearchCorpus {
  let corpus = corpusCache.get(locale);

  if (!corpus) {
    corpus = buildCorpus(locale);
    corpusCache.set(locale, corpus);
  }

  return corpus;
}

/**
 * Retourne les thèmes à appliquer à une section pour un profil.
 *
 * @param persona - Profil de lecture.
 * @param section - Section concernée.
 * @returns Les thèmes de la section.
 */
export function getSectionThemes(
  persona: VisitPersonaDefinition,
  section: VisitSectionId,
): KnowledgeThemeId[] {
  if (section === 'projects') {
    return persona.projectThemes;
  }

  if (section === 'skills') {
    return persona.skillThemes;
  }

  if (section === 'timeline') {
    return persona.timelineThemes;
  }

  if (section === 'teaching') {
    return persona.teachingThemes;
  }

  // Les prix suivent leur propre filtre : sans entrée, les thèmes du profil.
  if (section === 'awards') {
    return persona.awardThemes ?? persona.themes;
  }

  return persona.themes;
}

/**
 * Convertit un document indexé en contenu de visite.
 *
 * @param meta - Métadonnées du document.
 * @param referenceYear - Année de référence pour les compétences.
 * @returns Le contenu prêt à afficher.
 */
export function toHighlight(
  meta: VisitSearchMeta,
  referenceYear: number,
): VisitHighlight {
  if (meta.skillId) {
    const tenure = getSkillTenures(referenceYear).get(meta.skillId);

    return {
      label: meta.label,
      detail: meta.detail,
      target: meta.target,
      skillId: meta.skillId,
      tenure: {
        firstYear: tenure?.firstYear ?? null,
        lastYear: tenure?.lastYear ?? null,
        spanYears: tenure?.spanYears ?? null,
        professionalYears: tenure?.professionalYears ?? null,
        isCurrent: tenure?.isCurrent ?? false,
      },
    };
  }

  return {
    label: meta.label,
    detail: meta.detail,
    target: meta.target,
  };
}

/**
 * Liste les acronymes ou technologies inconnus d'une offre.
 *
 * Seuls les tokens qui commencent par une majuscule sont vérifiés : un mot
 * ordinaire inconnu reste neutre et ne doit pas devenir un écart nommé.
 *
 * @param query - Offre ou besoin formulé.
 * @param locale - Langue de lecture.
 * @returns Les termes inconnus, limités au nombre maximal d'écarts.
 */
export function getUnknownTechTerms(
  query: string,
  locale: Locale,
): string[] {
  const { vocabulary } = getCorpus(locale);
  const tokens = [
    ...new Set(query.match(/\b[A-Z][A-Z0-9+#.-]{1,}\b/g) ?? []),
  ];
  const unknown = tokens.filter((token) => {
    const normalized = tokenizeSearchText(locale, token)[0];

    return normalized !== undefined && !vocabulary.has(normalized);
  });

  return unknown.slice(0, VISIT_CONFIG.maxGaps);
}
