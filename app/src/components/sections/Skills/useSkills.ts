/* =========================================================================
  IMPORTS
========================================================================= */
import { useEffect, useMemo, useState } from 'react';
import { skills } from '@/data/skills.data';
import type { SkillCategory } from '@/types/skill.types';
import { countSkills, filterSkills, skillCategories } from './skills.helpers';


/* =========================================================================
  TYPES & INTERFACES
========================================================================= */
export type SkillFilter = SkillCategory | 'all';

/* =========================================================================
  CONSTANTES
========================================================================= */
/** Nombre de compétences affichées avant « voir plus ». */
const INITIAL_VISIBLE = 16;


/* =========================================================================
  HOOK : useSkills
  Gère la catégorie active et l'affichage progressif des compétences.
========================================================================= */
export function useSkills() {
  // Catégorie active.
  const [active, setActive] = useState<SkillFilter>('all');

  // Indique si la liste complète est affichée.
  const [expanded, setExpanded] = useState(false);

  // Chaque catégorie repart d'une liste repliée.
  useEffect(() => {
    setExpanded(false);
  }, [active]);

  // Compétences de la catégorie active.
  const filtered = useMemo(() => filterSkills(skills, active), [active]);

  // Compteurs des onglets, calculés sur la liste complète.
  const counts = useMemo(() => {
    const next = { all: skills.length } as Record<SkillFilter, number>;

    for (const category of skillCategories) {
      next[category] = countSkills(skills, category);
    }

    return next;
  }, []);

  // La pagination ne s'applique qu'à la vue complète.
  const visible =
    active === 'all' && !expanded ? filtered.slice(0, INITIAL_VISIBLE) : filtered;
  const hasMore = active === 'all' && filtered.length > INITIAL_VISIBLE;

  return { active, setActive, filtered, visible, counts, expanded, setExpanded, hasMore };
}
