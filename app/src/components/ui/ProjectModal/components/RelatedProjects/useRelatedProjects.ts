/* =========================================================================
  IMPORTS
========================================================================= */
import { useMemo } from 'react';
import { getRelatedProjects } from '@/lib/knowledge-projects';
import type { KnowledgeRelatedProject } from '@/types/knowledge.types';

/* =========================================================================
  CONSTANTES
========================================================================= */
/** Nombre de projets recommandés affichés dans la modale. */
const RELATED_LIMIT = 3;

/* =========================================================================
  HOOK : useRelatedProjects
  Calcule les projets proches affichés dans le bloc « Voir aussi ».
========================================================================= */
export function useRelatedProjects(projectId: string): KnowledgeRelatedProject[] {

  // Recommandations recalculées uniquement quand le projet change.
  return useMemo(
    () => getRelatedProjects(projectId, RELATED_LIMIT),
    [projectId],
  );
}
