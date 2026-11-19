import type { SectionId, SectionMeta } from '@/types/section.types';

/* =========================================================================
   DONNÉES : sections du document
   Ordre d'affichage, appartenance à la navigation et ancres DOM.
========================================================================= */

/* ─────────────────────────────────────────────────────────────────────────
   REGISTRE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Réglages des sections du document, dans l'ordre d'affichage.
 *
 * `id` répète la clé pour donner un identifiant typé aux composants.
 */
export const SECTION = {
  about: { id: 'about', inNav: true },
  timeline: { id: 'timeline', inNav: true },
  skills: { id: 'skills', inNav: true },
  projects: { id: 'projects', inNav: true },
  publications: { id: 'publications', inNav: true },
  videos: { id: 'videos', inNav: true },
  teaching: { id: 'teaching', inNav: true },
  awards: { id: 'awards', inNav: true },
  contact: { id: 'contact', inNav: false },
} as const satisfies {
  [Key in SectionId]: Omit<SectionMeta, 'id'> & { id: Key };
};

/* ─────────────────────────────────────────────────────────────────────────
   DÉRIVATIONS
   ───────────────────────────────────────────────────────────────────────── */

/** Identifiants de toutes les sections, dans l'ordre d'affichage. */
export const sectionIds = Object.values(SECTION).map((section) => section.id);

/** Identifiants des rubriques de navigation, dans l'ordre d'affichage. */
export const navSectionIds = sectionIds.filter((id) => SECTION[id].inNav);

/**
 * Retourne l'ancre DOM d'une section.
 *
 * @param id - Identifiant de la section.
 * @returns L'ancre précédée de `#`.
 */
export function sectionAnchor(id: SectionId): `#${SectionId}` {
  return `#${id}`;
}
