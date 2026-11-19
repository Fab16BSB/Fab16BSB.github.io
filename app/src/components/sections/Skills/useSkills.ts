/* =========================================================================
  IMPORTS
========================================================================= */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { projects } from '@/data/content/projects.data';
import { skills } from '@/data/career/skills.data';
import { useVisitReveal } from '@/hooks/sections/useVisitReveal';
import { visitTargetPrefix } from '@/lib/visit/visit-targets';
import type { Project } from '@/types/project.types';
import type { Skill, SkillCategory } from '@/types/skill.types';
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

  // Compétence dont le détail est ouvert.
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  // Projet ouvert depuis la modale d'une compétence.
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Évite de replier la liste juste après une demande de visite.
  const skipCollapseRef = useRef(false);

  // Minuteur de fin de révélation, annulé au démontage.
  const collapseTimerRef = useRef<number | undefined>(undefined);

  // Annule le minuteur de révélation au démontage.
  useEffect(
    () => () => window.clearTimeout(collapseTimerRef.current),
    [],
  );

  // Chaque catégorie repart d'une liste repliée, sauf pendant une révélation.
  useEffect(() => {
    if (skipCollapseRef.current) {
      skipCollapseRef.current = false;
    } else {
      setExpanded(false);
    }
  }, [active]);

  // Une visite guidée peut demander une compétence précise : on montre tout.
  useVisitReveal([visitTargetPrefix('skill')], () => {
    skipCollapseRef.current = true;
    setActive('all');
    setExpanded(true);
    window.clearTimeout(collapseTimerRef.current);
    collapseTimerRef.current = window.setTimeout(() => {
      skipCollapseRef.current = false;
    }, 200);
  });

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

  // Ouvre le détail d'une compétence.
  const openSkill = useCallback((skill: Skill) => setSelectedSkill(skill), []);

  // Ferme le détail de la compétence.
  const closeSkill = useCallback(() => setSelectedSkill(null), []);

  // Ouvre un projet précis et referme la modale de compétence.
  const openProject = useCallback((project: Project) => {
    setSelectedSkill(null);
    setSelectedProject(project);
  }, []);

  // Ouvre un projet à partir de son identifiant.
  const openProjectById = useCallback(
    (projectId: string) => {
      const project = projects.find((item) => item.id === projectId);
      if (project) openProject(project);
    },
    [openProject],
  );

  // Ferme la modale de projet.
  const closeProject = useCallback(() => setSelectedProject(null), []);

  return {
    active,
    setActive,
    filtered,
    visible,
    counts,
    expanded,
    setExpanded,
    hasMore,
    selectedSkill,
    selectedProject,
    openSkill,
    closeSkill,
    openProject,
    openProjectById,
    closeProject,
  };
}
