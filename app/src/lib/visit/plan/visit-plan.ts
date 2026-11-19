/* =========================================================================
   HELPERS : construction du parcours — fonctions pures
   Le profil fixe l'ordre ; la recherche fournit les correspondances.
========================================================================= */
import { visitPersonas } from '@/data/visit/visit-personas.data';
import { getMaxContentSections } from '@/lib/visit/visit-mode';
import { buildStops } from '@/lib/visit/plan/visit-plan.stops';
import { buildSearchVisitPlan } from '@/lib/visit/search/visit-search';
import { getUnknownTechTerms } from '@/lib/visit/search/corpus/visit-search-corpus';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import type { Locale } from '@/types/common.types';
import type {
  VisitMode,
  VisitPersona,
  VisitPersonaDefinition,
  VisitPlan,
  VisitVerdict,
  VisitVerdictGap,
} from '@/types/visit.types';


/* ─────────────────────────────────────────────────────────────────────────
   VERDICT SANS CORRESPONDANCE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Construit le verdict d'une demande sans aucun contenu correspondant.
 *
 * @param query - Demande nettoyée.
 * @param locale - Langue de lecture.
 * @returns Le verdict faible, avec les termes inconnus puis la couverture.
 */
function buildNoMatchVerdict(
  query: string,
  locale: Locale,
): VisitVerdict {
  const unknownTerms = getUnknownTechTerms(query, locale);
  const gaps: VisitVerdictGap[] = unknownTerms.map((term) => ({
    key: 'visit.gaps.unknown',
    params: { term },
  }));

  if (gaps.length < VISIT_CONFIG.maxGaps) {
    gaps.push({ key: 'visit.gaps.coverage' });
  }

  return {
    fit: 'weak',
    coverage: 0,
    evidence: [],
    gaps,
  };
}

/**
 * Construit un parcours vide : aucune étape, seulement le verdict.
 *
 * @param query - Demande nettoyée.
 * @param persona - Profil de lecture appliqué.
 * @param mode - Parcours essentiel ou approfondi.
 * @param locale - Langue de lecture.
 * @returns Le parcours sans visite disponible.
 */
function buildEmptyQueryPlan(
  query: string,
  persona: VisitPersonaDefinition,
  mode: VisitMode,
  locale: Locale,
): VisitPlan {
  return {
    stops: [],
    duration: 0,
    mode,
    persona: persona.id,
    hasMatches: false,
    verdict: buildNoMatchVerdict(query, locale),
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Construit un parcours de visite pour une demande et un profil.
 *
 * Le panneau garantit l'exclusivité des deux modes : une requête s'évalue
 * toujours avec le profil généraliste, un profil sélectionné s'évalue sans
 * requête. Sans demande, le parcours suit l'ordre du profil. Avec une demande,
 * seules les sections qui correspondent sont retenues, classées par pertinence.
 * Une demande sans contenu correspondant, ou dont la correspondance reste
 * faible, ne propose aucune visite. Le mode approfondi garde les mêmes sections
 * puis ajoute celles qui ne tenaient pas dans l'essentiel, avec davantage de
 * contenus par section.
 *
 * @param query - Demande saisie par le visiteur.
 * @param persona - Profil de lecture sélectionné.
 * @param mode - Parcours essentiel ou approfondi.
 * @param locale - Langue de lecture.
 * @param referenceYear - Année de référence pour l'ancienneté des compétences.
 * @returns Le parcours ordonné, sa durée et les correspondances trouvées.
 */
export function buildVisitPlan(
  query: string,
  persona: VisitPersona,
  mode: VisitMode,
  locale: Locale,
  referenceYear = new Date().getFullYear(),
): VisitPlan {
  const trimmed = query.trim();
  const personaDefinition =
    visitPersonas.find((item) => item.id === persona) ??
    visitPersonas[0];

  if (trimmed.length > 0) {
    const searchPlan = buildSearchVisitPlan(
      trimmed,
      personaDefinition,
      mode,
      locale,
      referenceYear,
    );

    // Une correspondance faible n'est pas crédible : aucune visite.
    return searchPlan && searchPlan.verdict?.fit !== 'weak'
      ? searchPlan
      : buildEmptyQueryPlan(trimmed, personaDefinition, mode, locale);
  }

  const order = personaDefinition.sectionOrder.filter(
    (id) => id !== 'about',
  );
  const profileThemes = personaDefinition.themes;
  const maxSections = getMaxContentSections(mode);
  const contentIds =
    maxSections === null ? [...order] : order.slice(0, maxSections);
  const stops = buildStops(
    contentIds,
    locale,
    referenceYear,
    mode,
    personaDefinition,
  );
  const visibleStops =
    profileThemes.length > 0
      ? stops.filter(
          (stop) =>
            stop.id === 'about' || stop.highlights.length > 0,
        )
      : stops;
  const duration = visibleStops.reduce(
    (total, stop) => total + stop.duration,
    0,
  );

  return {
    stops: visibleStops,
    duration,
    mode,
    persona: personaDefinition.id,
    hasMatches: true,
  };
}
