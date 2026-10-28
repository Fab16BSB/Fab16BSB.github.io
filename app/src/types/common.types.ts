/** Langues disponibles sur le site. */
export type Locale = 'fr' | 'en' | 'es';

/** Thème d'affichage clair ou sombre. */
export type Theme = 'light' | 'dark';

/** Texte traduit dans les trois langues du site. */
export type Localized = Record<Locale, string>;

/** Couleur d'accent utilisée par les cartes et les sections. */
export type Accent = 'indigo' | 'cyan' | 'amber' | 'rose' | 'emerald' | 'slate';
