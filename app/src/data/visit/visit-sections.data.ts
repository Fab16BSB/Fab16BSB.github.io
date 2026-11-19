import { sectionIds } from '@/data/site/sections.data';
import type { SectionId } from '@/types/section.types';
import type { VisitSectionDefinition } from '@/types/visit.types';

/* =========================================================================
   DONNÉES : étapes du parcours de visite
   Sections du site et fiches de recherche.
========================================================================= */

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────────────── */

/** Contenu de visite d'une section, hors identité et ancre dérivées. */
type VisitSectionContent = Omit<VisitSectionDefinition, 'id'>;

/* ─────────────────────────────────────────────────────────────────────────
   SECTIONS
   Chaque section du document doit fournir son contenu de visite.
   L'ordre de `visitSections` est l'ordre narratif de repli.
   ───────────────────────────────────────────────────────────────────────── */

/** Contenus de visite, indexés par section du document. */
const visitSectionContent: Record<SectionId, VisitSectionContent> = {

  // À propos
  about: {
    icon: 'user',
    labelKey: 'nav.about',
    description: {
      fr: 'Identité, positionnement et disponibilité.',
      en: 'Identity, positioning and availability.',
      es: 'Identidad, posicionamiento y disponibilidad.',
    },
    duration: 20,
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
  timeline: {
    icon: 'route',
    labelKey: 'nav.timeline',
    description: {
      fr: 'Postes, responsabilités et contexte industriel.',
      en: 'Roles, responsibilities and industry context.',
      es: 'Puestos, responsabilidades y contexto industrial.',
    },
    duration: 45,
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
  skills: {
    icon: 'sparkles',
    labelKey: 'nav.skills',
    description: {
      fr: 'Stack technique, outils et domaines de maîtrise.',
      en: 'Technical stack, tools and areas of expertise.',
      es: 'Stack técnico, herramientas y áreas de dominio.',
    },
    duration: 30,
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
  projects: {
    icon: 'code',
    labelKey: 'nav.projects',
    description: {
      fr: 'Réalisations concrètes, code et démonstrations.',
      en: 'Concrete projects, code and demos.',
      es: 'Realizaciones concretas, código y demostraciones.',
    },
    duration: 60,
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
  publications: {
    icon: 'book',
    labelKey: 'nav.publications',
    description: {
      fr: 'Travaux scientifiques, revues et conférences.',
      en: 'Scientific work, journals and conferences.',
      es: 'Trabajos científicos, revistas y conferencias.',
    },
    duration: 45,
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
  videos: {
    icon: 'play',
    labelKey: 'nav.videos',
    description: {
      fr: 'Démonstrations et vulgarisation en vidéo.',
      en: 'Video demos and explainers.',
      es: 'Demostraciones y divulgación en vídeo.',
    },
    duration: 25,
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
  teaching: {
    icon: 'graduation',
    labelKey: 'nav.teaching',
    description: {
      fr: 'Cours, encadrement et transmission.',
      en: 'Courses, supervision and teaching.',
      es: 'Cursos, tutoría y transmisión.',
    },
    duration: 40,
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
  awards: {
    icon: 'trophy',
    labelKey: 'nav.awards',
    description: {
      fr: 'Distinctions, concours et responsabilités.',
      en: 'Awards, competitions and responsibilities.',
      es: 'Premios, concursos y responsabilidades.',
    },
    duration: 20,
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

  // Contact
  contact: {
    icon: 'mail',
    labelKey: 'nav.contact',
    description: {
      fr: 'LinkedIn, GitHub, Medium, Kaggle et YouTube pour me contacter.',
      en: 'LinkedIn, GitHub, Medium, Kaggle and YouTube to get in touch.',
      es: 'LinkedIn, GitHub, Medium, Kaggle y YouTube para contactarme.',
    },
    duration: 10,
    nameWords: [
      'contact', 'contacto', 'linkedin', 'github', 'medium', 'kaggle',
      'youtube', 'réseau', 'reseau', 'network', 'red', 'email', 'mail',
      'courriel', 'correo', 'recrutement', 'recruitment', 'recrutamiento',
      'embauche', 'hiring', 'contratacion',
    ],
    searchTags: [
      'contact', 'contacto', 'linkedin', 'github', 'medium', 'kaggle',
      'youtube', 'réseau', 'reseau', 'network', 'red', 'email', 'mail',
      'courriel', 'correo',
    ],
  },
};

/** Sections proposées par le parcours de visite, dans l'ordre du document. */
export const visitSections: VisitSectionDefinition[] = sectionIds.map((id) => ({
  id,
  ...visitSectionContent[id],
}));
