/**
 * Profil public du site.
 *
 * @property {string} name - Nom affiché.
 * @property {string} location - Localisation affichée.
 * @property {Localized} role - Rôle professionnel en FR / EN / ES.
 * @property {Localized} current - Activité actuelle en FR / EN / ES.
 */
export const profile = {
  name: 'Fabien Poirier',
  location: 'France',
  role: {
    fr: 'Docteur en Intelligence Artificielle',
    en: 'PhD in Artificial Intelligence',
    es: 'Doctor en Inteligencia Artificial',
  },
  current: {
    fr: 'Freelance — IA, Data & RAG',
    en: 'Freelance — AI, Data & RAG',
    es: 'Freelance — IA, Data & RAG',
  },
} as const;
