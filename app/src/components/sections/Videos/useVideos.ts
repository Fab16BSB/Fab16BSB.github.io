/* =========================================================================
  IMPORTS
========================================================================= */
import { useMemo, useState } from 'react';
import videosRaw from '@/data/youtube-videos.json';
import { getSearchIndex, searchDocuments } from '@/lib/search-engine';
import { videoSearchFields } from '@/lib/search-fields';
import { rankSearchResults } from '@/lib/search-rank';
import { useSemanticSearch } from '@/search/useSemanticSearch';
import type { Locale } from '@/types/common.types';
import type { YoutubeVideo } from '@/types/youtube.types';
import { videoYear } from './videos.helpers';


/* =========================================================================
  TYPES & INTERFACES
========================================================================= */
export type VideoFilter = 'all' | 'video' | 'short';

/* =========================================================================
  CONSTANTES
========================================================================= */
const videos = videosRaw as YoutubeVideo[];

/* =========================================================================
  HOOK : useVideos
  Gère les filtres, la recherche et les dérivations de la section Vidéos.
========================================================================= */
export function useVideos(locale: Locale) {

  // Filtre de type actif.
  const [filter, setFilter] = useState<VideoFilter>('all');

  // Recherche saisie.
  const [query, setQuery] = useState('');

  // Année sélectionnée.
  const [year, setYear] = useState('all');

  // Années disponibles, de la plus récente à la plus ancienne.
  const years = useMemo(
    () => [...new Set(videos.map(videoYear))].sort((a, b) => Number(b) - Number(a)),
    [],
  );

  // Index plein texte des vidéos, construit une fois par langue.
  const index = useMemo(
    () =>
      getSearchIndex(
        `videos:${locale}`,
        locale,
        videos.map((video) => ({
          id: `videos:${video.id}`,
          ...videoSearchFields(video, locale),
        })),
      ),
    [locale],
  );

  // Scores sémantiques de la requête courante, si l'option est active.
  const { semanticScores } = useSemanticSearch('videos', query);

  // Identifiants des vidéos, pour limiter les candidats sémantiques.
  const allowedIds = useMemo(() => new Set(videos.map((video) => `videos:${video.id}`)), []);

  // Correspondances lexicales puis fusion avec les scores sémantiques.
  const matches = useMemo(() => searchDocuments(index, query), [index, query]);
  const orderedIds = useMemo(
    () => rankSearchResults({ lexical: matches, semantic: semanticScores, allowedIds }),
    [allowedIds, matches, semanticScores],
  );

  // Vidéos correspondant à l'année, classées par pertinence.
  const searched = useMemo(() => {
    const base = videos.filter((video) => year === 'all' || videoYear(video) === year);
    let result: YoutubeVideo[] = [];

    if (query.trim().length === 0) {
      result = base;
    } else {
      const order = new Map(orderedIds.map((id, rank) => [id, rank]));

      result = base
        .map((video) => ({ video, rank: order.get(`videos:${video.id}`) }))
        .filter((entry): entry is { video: YoutubeVideo; rank: number } => entry.rank !== undefined)
        .sort((left, right) => left.rank - right.rank)
        .map((entry) => entry.video);
    }

    return result;
  }, [orderedIds, query, year]);

  // Compteurs des onglets, calculés sur les résultats recherchés.
  const counts = useMemo(
    () => ({
      all: searched.length,
      video: searched.filter((video) => video.type === 'video').length,
      short: searched.filter((video) => video.type === 'short').length,
    }),
    [searched],
  );

  // Vidéos de la catégorie active.
  const filtered = useMemo(
    () => (filter === 'all' ? searched : searched.filter((video) => video.type === filter)),
    [filter, searched],
  );

  // Le filtre de type est exclu : les onglets restent toujours visibles.
  const hasFilters = query.length > 0 || year !== 'all';

  // Remet la recherche, l'année et le type à zéro.
  const resetFilters = () => {
    setQuery('');
    setYear('all');
    setFilter('all');
  };

  return {
    filter,
    setFilter,
    query,
    setQuery,
    year,
    setYear,
    years,
    counts,
    filtered,
    hasFilters,
    resetFilters,
  };
}
