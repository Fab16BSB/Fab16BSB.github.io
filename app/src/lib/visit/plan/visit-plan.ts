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
  VisitPlan,
  VisitVerdict,
  VisitVerdictGap,
} from '@/types/visit.types';


/* ─────────────────────────────────────────────────────────────────────────
   VERDICT DE REPLI
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Construit le verdict faible d'un parcours de repli.
 *
 * @param query - Demande nettoyée.
 * @param locale - Langue de lecture.
 * @param useProfileFallback - Indique que le parcours suit le profil.
 * @returns Le verdict, ou `undefined` quand la recherche a répondu.
 */
function buildFallbackVerdict(
  query: string,
  locale: Locale,
  useProfileFallback: boolean,
): VisitVerdict | undefined {
  if (!useProfileFallback) {
    return undefined;
  }

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
 * Le mode approfondi garde les mêmes sections mais montre davantage de contenus
 * par section.
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
  const order = personaDefinition.sectionOrder.filter(
    (id) => id !== 'about',
  );
  const profileThemes = personaDefinition.themes;

  let useProfileFallback = false;

  if (trimmed.length > 0) {
    const searchPlan = buildSearchVisitPlan(
      trimmed,
      personaDefinition,
      mode,
      locale,
      referenceYear,
    );

    if (searchPlan && searchPlan.verdict?.fit !== 'weak') {
      return searchPlan;
    }

    useProfileFallback = true;
  }

  const hasMatches = trimmed.length === 0;
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
  const verdict = buildFallbackVerdict(
    trimmed,
    locale,
    useProfileFallback,
  );

  return {
    stops: visibleStops,
    duration,
    mode,
    persona,
    hasMatches,
    ...(verdict ? { verdict } : {}),
  };
}
