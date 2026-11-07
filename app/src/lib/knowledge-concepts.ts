/* =========================================================================
  HELPERS : concepts du graphe — fonctions pures
  Génération des concepts depuis les compétences et les domaines de connaissance.
========================================================================= */
import type { KnowledgeConcept } from '@/types/knowledge.types';
import { skills } from '@/data/skills.data';
import { knowledgeDomains } from '@/data/knowledge-domains.data';
import {
  CONCEPT_ALIASES,
  CONCEPT_ID_BY_SKILL,
} from '@/data/knowledge-concept-overrides.data';

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Ajoute les alias supplémentaires à un concept.
 *
 * @param concept - Concept à enrichir.
 * @returns Le concept avec ses alias dédoublonnés.
 */
function withAliases(concept: KnowledgeConcept): KnowledgeConcept {
  return {
    ...concept,
    aliases: [...new Set([...concept.aliases, ...(CONCEPT_ALIASES[concept.id] ?? [])])],
  };
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/**
 * Génère les concepts des compétences puis fusionne les concepts de domaine.
 *
 * @returns La liste complète des concepts, sans doublon d'identifiant.
 */
export function buildKnowledgeConcepts(): KnowledgeConcept[] {
  const skillConcepts: KnowledgeConcept[] = skills.map((skill) => {
    const id = CONCEPT_ID_BY_SKILL[skill.id] ?? skill.id;
    return {
      id,
      label: skill.name,
      aliases: [skill.id, skill.name],
    };
  });

  const domainConcepts: KnowledgeConcept[] = knowledgeDomains.flatMap((domain) =>
    domain.items.map((item) => ({
      id: item.id,
      label: item.label,
      aliases: [item.label, ...item.aliases],
    })),
  );

  // Concepts de haut niveau déclarés directement sur leur domaine.
  const domainLevelConcepts: KnowledgeConcept[] = knowledgeDomains.flatMap(
    (domain) => domain.concepts ?? [],
  );

  const merged = new Map<string, KnowledgeConcept>();

  for (const concept of [
    ...skillConcepts,
    ...domainConcepts,
    ...domainLevelConcepts,
  ].map(withAliases)) {
    const existing = merged.get(concept.id);
    if (!existing) {
      merged.set(concept.id, {
        ...concept,
        aliases: [...new Set(concept.aliases)],
      });
      continue;
    }

    merged.set(concept.id, {
      ...existing,
      aliases: [...new Set([...existing.aliases, ...concept.aliases])],
    });
  }

  return [...merged.values()];
}

/** Concepts techniques détectés dans les textes et les tags. */
export const knowledgeConcepts: KnowledgeConcept[] = buildKnowledgeConcepts();
