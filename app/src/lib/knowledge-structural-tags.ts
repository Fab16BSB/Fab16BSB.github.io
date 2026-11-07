/* =========================================================================
  HELPERS : tags structurels du graphe — données dérivées
  Tags de métadonnées qui ne doivent pas devenir des pivots `tag:*`.
========================================================================= */
import { awards } from '@/data/awards.data';
import { projects } from '@/data/projects.data';
import { skills } from '@/data/skills.data';
import { supervisions } from '@/data/supervisions.data';
import { teaching } from '@/data/teaching.data';
import { videos } from './knowledge-raw-data';
import { normalizeKnowledgeText } from './knowledge-normalize';

/* =========================================================================
  CONSTANTES
========================================================================= */

/** Tags éditoriaux ajoutés aux nœuds formation et encadrement. */
const EDITORIAL_STRUCTURAL_TAGS = ['formation', 'diplome', 'encadrement'];

/* =========================================================================
  HELPERS
========================================================================= */

/**
 * Construit le set des tags structurels à partir des données typées.
 *
 * Catégories de projet, niveaux d'études, modes d'enseignement, types
 * d'activité, encadrements, distinctions, formats vidéo et catégories de
 * compétences sont dérivés des données. Seuls les trois tags éditoriaux
 * `formation`, `diplome` et `encadrement` restent explicites.
 *
 * @returns Les tags structurels normalisés.
 */
function buildStructuralTags(): Set<string> {
  return new Set(
    [
      ...projects.map((project) => project.category),
      ...projects.flatMap((project) => (project.studyLevel ? [project.studyLevel] : [])),
      ...teaching.map((course) => course.level),
      ...teaching.map((course) => course.place),
      ...teaching.flatMap((course) => course.distribution.map((entry) => entry.type)),
      ...supervisions.map((item) => item.kind),
      ...supervisions.map((item) => item.mode),
      ...awards.map((award) => award.kind),
      ...awards.flatMap((award) => (award.tier ? [award.tier] : [])),
      ...videos.map((video) => video.type),
      ...skills.map((skill) => skill.category),
      ...EDITORIAL_STRUCTURAL_TAGS,
    ]
      .map(normalizeKnowledgeText)
      .filter(Boolean),
  );
}

/* =========================================================================
  API PUBLIQUE
========================================================================= */

/** Tags structurels qui ne doivent pas devenir des concepts libres. */
export const KNOWLEDGE_STRUCTURAL_TAGS = buildStructuralTags();
