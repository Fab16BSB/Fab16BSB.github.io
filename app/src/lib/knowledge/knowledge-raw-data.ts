/* =========================================================================
  DONNÉES : contenus bruts
  JSON importés et normalisés avant la construction des nœuds du graphe.
========================================================================= */
import mediumPostsRaw from '@/data/feeds/medium-posts.json';
import videosRaw from '@/data/feeds/youtube-videos.json';
import type { MediumPost } from '@/types/medium.types';
import type { YoutubeVideo } from '@/types/youtube.types';

/** Articles Medium normalisés depuis le JSON brut. */
export const mediumPosts = mediumPostsRaw as unknown as MediumPost[];

/** Vidéos YouTube normalisées depuis le JSON brut. */
export const videos = videosRaw as unknown as YoutubeVideo[];
