import type { Passion, Quality } from '@/types/about.types';

/** Passions affichées dans la section À propos. */
export const passions: Passion[] = [
  {
    id: 'games',
    image: '/images/passions/jeux-video.webp',
    labelKey: 'about.passionGames',
  },
  {
    id: 'scifi',
    image: '/images/passions/science-fiction.webp',
    labelKey: 'about.passionScifi',
  },
  {
    id: 'anime',
    image: '/images/passions/anime-manga.webp',
    labelKey: 'about.passionAnime',
  },
];

/** Qualités illustrées dans la section À propos. */
export const qualities: Quality[] = [
  {
    id: 'creative',
    images: {
      fr: '/images/soft-skills/creatif-fr.webp',
      en: '/images/soft-skills/creatif-en.webp',
      es: '/images/soft-skills/creatif-es.webp',
    },
    labelKey: 'about.qualityCreative',
  },
  {
    id: 'persistent',
    images: {
      fr: '/images/soft-skills/perseverant-fr.webp',
      en: '/images/soft-skills/perseverant-en.webp',
      es: '/images/soft-skills/perseverant-es.webp',
    },
    labelKey: 'about.qualityPersistent',
  },
  {
    id: 'social',
    images: {
      fr: '/images/soft-skills/sociable.webp',
      en: '/images/soft-skills/sociable.webp',
      es: '/images/soft-skills/sociable.webp',
    },
    labelKey: 'about.qualitySocial',
  },
];
