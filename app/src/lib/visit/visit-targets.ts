/* =========================================================================
  CIBLES DE VISITE : pont entre le graphe de connaissances et le HTML
  Un nœud du graphe (`kind` + `sourceId`) désigne une carte de la page qui
  porte `data-visit-target="<préfixe>-<id>"`. Ce module est la seule source
  de vérité des préfixes : le DOM, les preuves, le corpus et le graphe les
  importent au lieu de recopier la chaîne.
========================================================================= */
import type { KnowledgeContentKind } from '@/types/knowledge.types';

/* ─────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────── */

/** Préfixes de cible réellement portés par une carte de la page. */
export const VISIT_TARGET_PREFIXES = {
  project: 'project',
  publication: 'publication',
  article: 'article',
  course: 'course',
  supervision: 'supervision',
  experience: 'experience',
  education: 'education',
  skill: 'skill',
  video: 'video',
  award: 'award',
} as const;

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Nature d'une cible de visite. */
export type VisitTargetKind = keyof typeof VISIT_TARGET_PREFIXES;

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Préfixe de cible d'une carte, tiret compris.
 *
 * @param kind - Nature de la cible.
 * @returns Le préfixe prêt à comparer, par exemple `course-`.
 */
export function visitTargetPrefix(kind: VisitTargetKind): string {
  return `${VISIT_TARGET_PREFIXES[kind]}-`;
}

/**
 * Identifiant de cible d'une carte de la page.
 *
 * @param kind - Nature de la cible.
 * @param id - Identifiant du contenu.
 * @returns La valeur attendue dans `data-visit-target`.
 */
export function visitTarget(kind: VisitTargetKind, id: string): string {
  return `${visitTargetPrefix(kind)}${id}`;
}

/**
 * Indique si une valeur est un préfixe de cible connu.
 *
 * @param value - Préfixe candidat.
 * @returns `true` si une carte de la page porte ce préfixe.
 */
export function isVisitTargetKind(
  value: string,
): value is VisitTargetKind {
  return Object.hasOwn(VISIT_TARGET_PREFIXES, value);
}

/**
 * Indique si une valeur désigne une carte de la page.
 *
 * @param value - Valeur complète, par exemple `project-these`.
 * @returns `true` si le préfixe correspond à une carte connue.
 */
export function isVisitTarget(value: string): boolean {
  return Object.values(VISIT_TARGET_PREFIXES).some((prefix) =>
    value.startsWith(`${prefix}-`),
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CORRESPONDANCE AVEC LE GRAPHE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Préfixe HTML correspondant à une nature de nœud du graphe.
 *
 * `teaching` vise les cartes de cours : le type du graphe nomme la section,
 * le préfixe nomme l'élément. Les pivots de taxonomie (`theme`, `concept`)
 * restent hors de la visite faute de carte correspondante.
 *
 * @param kind - Nature du nœud.
 * @returns Le préfixe, ou `null` si le nœud n'est pas ciblable.
 */
export function knowledgeTarget(
  kind: KnowledgeContentKind,
): VisitTargetKind | null {
  const target = kind === 'teaching' ? 'course' : kind;
  const result = isVisitTargetKind(target) ? target : null;

  return result;
}
