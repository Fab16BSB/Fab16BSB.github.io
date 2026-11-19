/* =========================================================================
   PREUVES : vidéos — fonctions pures
   Une vidéo compte par sa récence et son thème.
========================================================================= */
import videosRaw from '@/data/feeds/youtube-videos.json';
import { visitTarget } from '@/lib/visit/visit-targets';
import { detectThemes, getThemeScore } from '@/lib/visit/visit-themes';
import { VISIT_CONFIG } from '@/lib/visit/visit.config';
import { parseYear } from '@/lib/date.helpers';
import {
  pickHighlights,
  recencyScore,
} from './visit-evidence.helpers';
import type { VisitEvidenceEntry } from './visit-evidence.types';
import type {
  VisitHighlight,
  VisitPersonaDefinition,
} from '@/types/visit.types';
import type { YoutubeVideo } from '@/types/youtube.types';


/**
 * Retourne les vidéos à mettre en avant.
 *
 * @param limit - Nombre maximal de contenus.
 * @param persona - Profil de lecture.
 * @returns Les vidéos retenues.
 */
export function getVideoHighlights(
  limit: number,
  persona: VisitPersonaDefinition,
): VisitHighlight[] {
  const videos = videosRaw as unknown as YoutubeVideo[];
  const entries: VisitEvidenceEntry[] = videos.map((video) => {
    const texts = [
      video.title,
      video.publishedAt.slice(0, 4),
      video.type,
    ];
    const base = recencyScore(parseYear(video.publishedAt.slice(0, 4)));
    const themeScore = getThemeScore(
      detectThemes(texts),
      persona.themes,
    );

    return {
      score: base + themeScore * VISIT_CONFIG.evidenceThemeWeight,
      themeScore,
      highlight: {
        label: video.title,
        detail: video.publishedAt.slice(0, 4),
        target: visitTarget('video', video.id),
      },
    };
  });
  const filtered =
    persona.themes.length > 0
      ? entries.filter((entry) => entry.themeScore > 0)
      : entries;

  return pickHighlights(filtered, limit);
}
