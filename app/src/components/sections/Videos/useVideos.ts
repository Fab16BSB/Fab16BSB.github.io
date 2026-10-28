/* =========================================================================
  IMPORTS
========================================================================= */
import { useMemo, useState } from 'react';
import videosRaw from '@/data/youtube-videos.json';
import { matchesQuery } from '@/lib/search';
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
export function useVideos() {

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

  // Vidéos correspondant à l'année et à la recherche.
  const searched = useMemo(
    () =>
      videos.filter(
        (video) =>
          (year === 'all' || videoYear(video) === year) && matchesQuery([video.title], query),
      ),
    [query, year],
  );

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
