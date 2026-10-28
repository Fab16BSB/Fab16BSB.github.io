import { seo } from './seo.data';
import type { Locale } from '@/types/common.types';

/**
 * Métadonnées SEO globales.
 *
 * @property {string} title - Titre de la page.
 * @property {string} description - Description meta.
 * @property {string} url - URL canonique du site.
 */
export const siteMeta = {
  title: seo.title,
  description: seo.description,
  url: seo.url,
} as const;

/**
 * Métadonnées SEO localisées utilisées par le provider i18n.
 *
 * @property {string} title - Titre de la page dans la langue courante.
 * @property {string} description - Description meta dans la langue courante.
 */
export const localizedSiteMeta: Record<Locale, { title: string; description: string }> = {
  fr: {
    title: siteMeta.title,
    description: siteMeta.description,
  },
  en: {
    title: 'Fabien Poirier — PhD in Artificial Intelligence',
    description:
      'Portfolio of Fabien Poirier, PhD in artificial intelligence. RAG systems, LLMs, computer vision and AI project development.',
  },
  es: {
    title: 'Fabien Poirier — Doctor en Inteligencia Artificial',
    description:
      'Portafolio de Fabien Poirier, doctor en inteligencia artificial. Sistemas RAG, LLM, visión por computador y desarrollo de proyectos de IA.',
  },
};
