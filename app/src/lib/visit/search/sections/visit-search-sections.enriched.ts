/* =========================================================================
   ENRICHISSEMENT : sections cœur ouvertes par les thèmes de l'offre
   Une section absente des correspondances exactes est ajoutée avec un
   minimum de contenus dès qu'elle porte le domaine de la demande.
========================================================================= */
import { getContentLimit } from '@/lib/visit/visit-mode';
import type { VisitOfferGraphSignals } from '@/lib/visit/visit-graph';
import type {
  VisitSearchMeta,
  VisitSearchSection,
} from '@/types/visit-search.types';
import type {
  VisitMode,
  VisitSectionId,
} from '@/types/visit.types';

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Sections enrichies et sections ouvertes par les seuls thèmes. */
export type EnrichedRankedSections = {
  sections: VisitSearchSection[];
  themeSectionIds: Set<VisitSectionId>;
};

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Sections cœur que les thèmes de la demande peuvent ouvrir. */
const THEME_SECTIONS: VisitSectionId[] = [
  'timeline',
  'projects',
  'skills',
];

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Indique si un contenu partage un thème avec l'offre.
 *
 * @param meta - Métadonnées du contenu.
 * @param themes - Thèmes détectés dans la demande.
 * @returns `true` si au moins un thème est commun.
 */
function sharesOfferTheme(
  meta: VisitSearchMeta,
  themes: string[],
): boolean {
  return meta.themes.some((theme) => themes.includes(theme));
}

/**
 * Trie les contenus de complément du plus récent au plus ancien.
 *
 * @param left - Premier contenu.
 * @param right - Second contenu.
 * @returns L'ordre d'affichage.
 */
function compareFillers(
  left: VisitSearchMeta,
  right: VisitSearchMeta,
): number {
  return (
    right.year - left.year ||
    left.label.localeCompare(right.label)
  );
}

/**
 * Ajoute les contenus du même domaine à une section classée.
 *
 * @param entry - Section classée.
 * @param items - Contenus du même domaine pour cette section.
 * @param limit - Nombre maximal de contenus.
 * @returns La section enrichie.
 */
function fillSectionEntries(
  entry: VisitSearchSection,
  items: VisitSearchMeta[],
  limit: number,
): VisitSearchSection {
  const known = new Set(entry.entries.map((item) => item.meta.id));
  const fillers = items
    .filter((meta) => !known.has(meta.id))
    .sort(compareFillers)
    .map((meta) => ({ meta, score: 0 }));

  return {
    ...entry,
    entries: [...entry.entries, ...fillers].slice(0, limit),
  };
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Enrichit les sections classées avec les contenus du domaine de la demande.
 *
 * Les correspondances exactes restent devant. En mode essentiel, seules les
 * sections cœur absentes sont ajoutées, avec le minimum de contenus du mode.
 * En mode complet, chaque section affichée est complétée jusqu'au plafond.
 *
 * @param ranked - Sections issues des correspondances exactes.
 * @param byId - Métadonnées indexées du corpus.
 * @param offerGraph - Thèmes détectés dans la demande.
 * @param mode - Mode essentiel ou approfondi.
 * @returns Les sections enrichies et les sections ouvertes par les thèmes.
 */
export function buildEnrichedRanked(
  ranked: VisitSearchSection[],
  byId: Map<string, VisitSearchMeta>,
  offerGraph: VisitOfferGraphSignals,
  mode: VisitMode,
): EnrichedRankedSections {
  const themes = offerGraph.themes;
  const themeSectionIds = new Set<VisitSectionId>();

  if (themes.length === 0) {
    return { sections: ranked, themeSectionIds };
  }

  const itemsBySection = new Map<VisitSectionId, VisitSearchMeta[]>();

  for (const meta of byId.values()) {
    if (meta.kind !== 'item' || !sharesOfferTheme(meta, themes)) {
      continue;
    }

    const items = itemsBySection.get(meta.section) ?? [];
    items.push(meta);
    itemsBySection.set(meta.section, items);
  }

  const enriched = ranked.map((entry) =>
    mode === 'full'
      ? fillSectionEntries(
          entry,
          itemsBySection.get(entry.section) ?? [],
          getContentLimit(entry.section, 'full'),
        )
      : entry,
  );
  const present = new Set(enriched.map((entry) => entry.section));

  for (const section of THEME_SECTIONS) {
    if (present.has(section)) {
      continue;
    }

    const entries = (itemsBySection.get(section) ?? [])
      .sort(compareFillers)
      .slice(0, getContentLimit(section, mode))
      .map((meta) => ({ meta, score: 0 }));

    if (entries.length > 0) {
      enriched.push({
        section,
        entries,
        score: 0,
        hasRealItem: true,
      });
      themeSectionIds.add(section);
    }
  }

  return { sections: enriched, themeSectionIds };
}
