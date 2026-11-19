import type { VisitSectionDefinition } from '@/types/visit.types';

/* =========================================================================
   DONNÉES : étapes du parcours de visite
   Sections du site et fiches de recherche.
========================================================================= */

/* ─────────────────────────────────────────────────────────────────────────
   SECTIONS
   L'ordre de `visitSections` est l'ordre narratif de repli.
   ───────────────────────────────────────────────────────────────────────── */

/** Sections proposées par le parcours de visite. */
export const visitSections: VisitSectionDefinition[] = [

  // À propos
  {
    id: 'about',
    anchor: '#about',
    icon: 'user',
    labelKey: 'nav.about',
    description: {
      fr: 'Identité, positionnement et disponibilité.',
      en: 'Identity, positioning and availability.',
      es: 'Identidad, posicionamiento y disponibilidad.',
    },
    duration: 20,
    order: 0,
    nameWords: [
      'à propos', 'about', 'présentation', 'presentation', 'presentación',
      'identité', 'identidad',
      'disponibilité', 'disponible', 'disponibilidad', 'freelance',
      'availability', 'contrat', 'contract', 'contrato', 'cdi', 'cdd',
      'remote', 'télétravail', 'teletravail', 'mobilité', 'mobilidad',
      'mobility',
    ],
    searchTags: [
      'à propos', 'about', 'presentación',
      'presentation', 'identité', 'identidad',
    ],
    searchAliases: [
      'disponibilité', 'disponible', 'disponibilidad', 'freelance',
      'availability', 'contrat', 'contract', 'contrato', 'cdi', 'cdd',
      'remote', 'télétravail', 'teletravail', 'mobilité', 'mobilidad',
      'mobility',
    ],
  },

  // Parcours
  {
    id: 'timeline',
    anchor: '#timeline',
    icon: 'route',
    labelKey: 'nav.timeline',
    description: {
      fr: 'Postes, responsabilités et contexte industriel.',
      en: 'Roles, responsibilities and industry context.',
      es: 'Puestos, responsabilidades y contexto industrial.',
    },
    duration: 45,
    order: 3,
    nameWords: [
      'parcours', 'expérience', 'experiencia', 'carrière', 'career',
      'trayectoria', 'formation', 'education', 'formación', 'historial',
    ],
    searchTags: [
      'parcours', 'experience', 'experiencia', 'carrière', 'career',
      'trayectoria', 'formation', 'education', 'formación', 'historial',
    ],
  },

  // Compétences
  {
    id: 'skills',
    anchor: '#skills',
    icon: 'sparkles',
    labelKey: 'nav.skills',
    description: {
      fr: 'Stack technique, outils et domaines de maîtrise.',
      en: 'Technical stack, tools and areas of expertise.',
      es: 'Stack técnico, herramientas y áreas de dominio.',
    },
    duration: 30,
    order: 4,
    nameWords: [
      'compétence', 'competence', 'competencia', 'habilidad', 'skill',
      'technologie', 'technology', 'tecnología', 'herramienta',
    ],
    searchTags: [
      'compétence', 'competence', 'skill', 'competencia', 'habilidad',
      'technologie', 'technology', 'tecnología', 'herramienta',
    ],
  },

  // Projets
  {
    id: 'projects',
    anchor: '#projects',
    icon: 'code',
    labelKey: 'nav.projects',
    description: {
      fr: 'Réalisations concrètes, code et démonstrations.',
      en: 'Concrete projects, code and demos.',
      es: 'Realizaciones concretas, código y demostraciones.',
    },
    duration: 60,
    order: 1,
    nameWords: [
      'projet', 'project', 'proyecto', 'réalisation', 'realización',
      'réalisations', 'realizaciones', 'portfolio', 'application',
      'aplicación',
    ],
    searchTags: [
      'projet', 'project', 'proyecto', 'réalisation', 'realización',
      'réalisations', 'realizaciones', 'portfolio', 'aplicación',
    ],
  },

  // Publications
  {
    id: 'publications',
    anchor: '#publications',
    icon: 'book',
    labelKey: 'nav.publications',
    description: {
      fr: 'Travaux scientifiques, revues et conférences.',
      en: 'Scientific work, journals and conferences.',
      es: 'Trabajos científicos, revistas y conferencias.',
    },
    duration: 45,
    order: 2,
    nameWords: [
      'publication', 'publicación', 'publicaciones', 'paper', 'article',
      'artículo', 'artículos', 'recherche', 'research', 'investigación',
      'conférence', 'conference', 'conferencia', 'revue', 'journal',
      'chercheur', 'chercheuse', 'researcher', 'investigateur',
      'investigadora', 'investigador', 'postdoc', 'doctorant', 'doctorat',
      'doctorado', 'doctoral', 'thèse', 'thesis', 'tesis', 'congreso',
      'congresos',
    ],
    searchTags: [
      'publication', 'publicación', 'publicaciones', 'paper', 'article',
      'artículo', 'artículos', 'recherche', 'research', 'investigación',
      'conférence', 'conference', 'conferencia', 'revue', 'journal',
    ],
    searchAliases: [
      'chercheur', 'chercheuse', 'researcher', 'investigateur',
      'investigadora', 'investigador', 'postdoc', 'doctorant', 'doctorat',
      'doctorado', 'doctoral', 'thèse', 'thesis', 'tesis', 'congreso',
      'congresos',
    ],
  },

  // Vidéos
  {
    id: 'videos',
    anchor: '#videos',
    icon: 'play',
    labelKey: 'nav.videos',
    description: {
      fr: 'Démonstrations et vulgarisation en vidéo.',
      en: 'Video demos and explainers.',
      es: 'Demostraciones y divulgación en vídeo.',
    },
    duration: 25,
    order: 6,
    nameWords: [
      'vidéo', 'video', 'vídeo', 'youtube', 'tutoriel', 'tutorial',
      'canal', 'chaîne', 'channel', 'vulgarisation', 'vulgarización',
      'vulgarizacion', 'divulgación', 'divulgacion', 'outreach',
    ],
    searchTags: [
      'vidéo', 'video', 'vídeo', 'youtube', 'tutoriel', 'tutorial',
      'canal', 'chaîne', 'channel', 'vulgarisation', 'vulgarización',
      'vulgarizacion', 'divulgación', 'divulgacion', 'outreach',
    ],
    searchAliases: ['vulgarisation', 'chaîne', 'channel'],
  },

  // Enseignement
  {
    id: 'teaching',
    anchor: '#teaching',
    icon: 'graduation',
    labelKey: 'nav.teaching',
    description: {
      fr: 'Cours, encadrement et transmission.',
      en: 'Courses, supervision and teaching.',
      es: 'Cursos, tutoría y transmisión.',
    },
    duration: 40,
    order: 5,
    nameWords: [
      'enseignement', 'teaching', 'enseñanza', 'cours', 'course', 'curso',
      'formation', 'training', 'formación', 'encadrement', 'supervision',
      'supervisión', 'docencia', 'tutoría',
      'formateur', 'formatrice', 'formador', 'professeur', 'profesor',
      'enseignant', 'teacher', 'professor', 'trainer', 'docente',
      'pédagogie', 'pedagogy', 'tp', 'td', 'travaux pratiques',
      'practical sessions', 'práctica', 'prácticas', 'clase', 'clases',
    ],
    searchTags: [
      'enseignement', 'teaching', 'enseñanza', 'cours', 'course', 'curso',
      'formation', 'training', 'formación', 'encadrement', 'supervision',
      'supervisión', 'docencia', 'tutoría',
    ],
    searchAliases: [
      'formateur', 'formatrice', 'formador', 'professeur', 'profesor',
      'enseignant', 'teacher', 'professor', 'trainer', 'docente',
      'pédagogie', 'pedagogy', 'tp', 'td', 'travaux pratiques',
      'practical sessions', 'práctica', 'prácticas', 'clase', 'clases',
    ],
  },

  // Distinctions
  {
    id: 'awards',
    anchor: '#awards',
    icon: 'trophy',
    labelKey: 'nav.awards',
    description: {
      fr: 'Distinctions, concours et responsabilités.',
      en: 'Awards, competitions and responsibilities.',
      es: 'Premios, concursos y responsabilidades.',
    },
    duration: 20,
    order: 7,
    nameWords: [
      'distinction', 'distinción', 'distinciones', 'award', 'prize', 'prix',
      'premio', 'palmarès', 'reconnaissance', 'reconocimiento',
      'recompensa', 'trofeo',
      'récompense', 'concours', 'compétition', 'competition', 'médaille',
      'medaille', 'medal', 'medalla', 'trophée', 'trophy',
    ],
    searchTags: [
      'distinction', 'distinción', 'distinciones', 'award', 'prize', 'prix',
      'premio', 'palmarès', 'reconnaissance', 'reconocimiento',
      'recompensa', 'trofeo',
    ],
    searchAliases: [
      'récompense', 'reconnaissance', 'concours', 'compétition',
      'competition', 'médaille', 'medaille', 'medal', 'medalla',
      'trophée', 'trophy',
    ],
  },
];
