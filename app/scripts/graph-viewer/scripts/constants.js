/* =======================================================================
  CONSTANTES
======================================================================= */

// Types de contenus affichables dans les filtres.
const CONTENT_KINDS = [
  'project', 'publication', 'article', 'teaching', 'experience',
  'education', 'award', 'supervision', 'video', 'skill',
];

// Types visibles au démarrage : les compétences restent masquées.
const DEFAULT_KINDS = CONTENT_KINDS.filter((kind) => kind !== 'skill');

// Libellés localisés des types de nœuds.
const KIND_LABELS = {
  project: { fr: 'Projets', en: 'Projects', es: 'Proyectos' },
  publication: { fr: 'Publications', en: 'Publications', es: 'Publicaciones' },
  article: { fr: 'Posts', en: 'Posts', es: 'Posts' },
  teaching: { fr: 'Enseignement', en: 'Teaching', es: 'Enseñanza' },
  experience: { fr: 'Expériences', en: 'Experience', es: 'Experiencia' },
  education: { fr: 'Formation', en: 'Education', es: 'Formación' },
  award: { fr: 'Distinctions', en: 'Awards', es: 'Distinciones' },
  supervision: { fr: 'Encadrements', en: 'Supervisions', es: 'Supervisiones' },
  video: { fr: 'Vidéos', en: 'Videos', es: 'Vídeos' },
  skill: { fr: 'Compétences', en: 'Skills', es: 'Competencias' },
  theme: { fr: 'Thème', en: 'Theme', es: 'Tema' },
  concept: { fr: 'Concept', en: 'Concept', es: 'Concepto' },
};

// Couleurs de base par type pour le thème sombre.
const KIND_COLORS = {
  project: '#6366f1',
  publication: '#f43f5e',
  article: '#fb923c',
  teaching: '#10b981',
  experience: '#06b6d4',
  education: '#14b8a6',
  award: '#facc15',
  supervision: '#a855f7',
  video: '#ef4444',
  skill: '#94a3b8',
  theme: '#e2e8f0',
  concept: '#64748b',
};

// Variantes plus sombres pour rester lisibles sur le thème clair.
const KIND_COLORS_LIGHT = {
  ...KIND_COLORS,
  project: '#4f46e5',
  publication: '#e11d48',
  article: '#c2410c',
  teaching: '#047857',
  experience: '#0e7490',
  education: '#0f766e',
  award: '#b45309',
  supervision: '#7e22ce',
  video: '#dc2626',
  skill: '#64748b',
  theme: '#201a13',
  concept: '#475569',
};

// Couleurs du canvas, séparées du DOM car elles ne lisent pas les variables CSS.
const CANVAS_COLORS = {

  // Palette du thème sombre.
  dark: {
    activeEdge: 'rgba(165, 180, 252, 0.6)',
    contextEdge: (alpha) => 'rgba(34, 211, 238, ' + alpha + ')',
    relatedEdge: (alpha) => 'rgba(129, 140, 248, ' + alpha + ')',
    matchRing: 'rgba(34, 211, 238, 0.9)',
    focusRing: 'rgba(226, 232, 240, 0.7)',
    themeRing: 'rgba(226, 232, 240, 0.35)',
    labelBackground: 'rgba(8, 13, 26, 0.72)',
    labelText: 'rgba(230, 236, 255, 0.92)',
    themeLabel: '#e2e8f0',
  },

  // Palette du thème clair.
  light: {
    activeEdge: 'rgba(37, 99, 235, 0.55)',
    contextEdge: (alpha) => 'rgba(3, 105, 161, ' + Math.min(1, alpha + 0.1) + ')',
    relatedEdge: (alpha) => 'rgba(67, 56, 202, ' + Math.min(1, alpha + 0.08) + ')',
    matchRing: 'rgba(3, 105, 161, 0.9)',
    focusRing: 'rgba(32, 26, 19, 0.55)',
    themeRing: 'rgba(32, 26, 19, 0.22)',
    labelBackground: 'rgba(241, 234, 221, 0.82)',
    labelText: 'rgba(32, 26, 19, 0.9)',
    themeLabel: '#201a13',
  },
};

// Rayon de dessin des nœuds par type, en pixels monde.
const KIND_RADIUS = {
  project: 11,
  publication: 10,
  article: 8,
  teaching: 9,
  experience: 7,
  education: 7,
  award: 6,
  supervision: 6,
  video: 5,
  skill: 4.5,
  theme: 9,
  concept: 3.5,
};
