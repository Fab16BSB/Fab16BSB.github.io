/**
 * Source de vérité des métadonnées SEO statiques et du JSON-LD.
 *
 * Ces valeurs sont injectées dans `index.html` au build par le plugin
 * `seo-html` de `vite.config.ts`.
 *
 * @property {string} name - Nom affiché.
 * @property {string} title - Titre de la page.
 * @property {string} description - Description meta.
 * @property {string} url - URL canonique du site.
 * @property {string} lang - Langue par défaut du document.
 * @property {string} image - Image utilisée pour le partage social.
 * @property {number} imageWidth - Largeur de l'image de partage.
 * @property {number} imageHeight - Hauteur de l'image de partage.
 * @property {string} imageAlt - Texte alternatif de l'image de partage.
 * @property {string} locale - Locale Open Graph.
 * @property {string} twitterCard - Type de Twitter Card.
 * @property {string} jobTitle - Intitulé du poste.
 * @property {string} alumniOf - Université de formation.
 * @property {string[]} socialProfiles - Profils officiels pour `sameAs`.
 * @property {string[]} knowsAbout - Domaines d'expertise.
 */
export const seo = {
  name: 'Fabien Poirier',
  title: 'Fabien Poirier — Docteur en Intelligence Artificielle',
  description:
    'Portfolio de Fabien Poirier, docteur en intelligence artificielle. Systèmes RAG, LLM, computer vision et développement de projets IA.',

  url: 'https://fab16bsb.github.io/',
  lang: 'fr',
  image: 'https://fab16bsb.github.io/images/profil/og-image.jpg',
  imageWidth: 1200,
  imageHeight: 630,
  imageAlt: 'Portrait de Fabien Poirier',
  locale: 'fr_FR',
  twitterCard: 'summary_large_image',

  jobTitle: 'Docteur en Intelligence Artificielle',
  alumniOf: 'Université Paris 8',
  socialProfiles: [
    'https://www.linkedin.com/in/fabien-poirier1/',
    'https://github.com/Fab16BSB',
    'https://medium.com/@fab.16',
    'https://www.kaggle.com/fpoirier',
    'https://www.youtube.com/channel/UCHS2xgITwh7olsnznmq8o0A',
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'Computer Vision',
    'Retrieval-Augmented Generation',
    'Large Language Models',
    'Deep Learning',
  ],
} as const;
