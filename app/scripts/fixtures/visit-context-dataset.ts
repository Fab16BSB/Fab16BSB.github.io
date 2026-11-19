/**
 * Données : jeu synthétique du routage de visite.
 *
 * Offres générées par templates, exécutées par `npm run visit:dataset`.
 * Chaque famille de template décrit un contexte attendu : enseignement,
 * recherche, vidéos, distinctions ou disponibilité.
 * Jeu de charge, pas de tenue à l'écart : une régression ici ne prouve pas
 * un bon routage, elle prouve seulement que les templates restent couverts.
 */

/* =========================================================================
  IMPORTS
========================================================================= */
import type { Locale } from '@/types/common.types';

/* ─────────────────────────────────────────────────────────────────────────
   TYPES
   Contrat consommé par `check-visit-dataset.ts`.
   ───────────────────────────────────────────────────────────────────────── */

/** Contextes attendus d'une offre. */
export type VisitContextLabel =
  | 'teaching'
  | 'research'
  | 'videos'
  | 'awards'
  | 'availability'
  | 'none';

/** Une offre étiquetée pour le contrôle du routage. */
export type VisitContextCase = {
  id: string;
  locale: Locale;
  text: string;
  labels: VisitContextLabel[];
};

/* ─────────────────────────────────────────────────────────────────────────
   VARIABLES DE GÉNÉRATION
   ───────────────────────────────────────────────────────────────────────── */

/** Langues générées. */
const LOCALES: Locale[] = ['fr', 'en', 'es'];

/** Contextes simples générés par template. */
const SIMPLE_CONTEXTS = [
  'teaching',
  'research',
  'videos',
  'awards',
  'availability',
  'none',
] as const;

/** Contexte simple, hors offres multi-contextes. */
type SimpleContext = (typeof SIMPLE_CONTEXTS)[number];

/** Domaines en profil, utilisés pour les offres routables. */
const DOMAINS: Record<Locale, string[]> = {
  fr: [
    'data',
    'intelligence artificielle',
    'développement web',
    'cybersécurité',
    'vision par ordinateur',
    'NLP',
  ],
  en: [
    'data',
    'artificial intelligence',
    'web development',
    'cybersecurity',
    'computer vision',
    'NLP',
  ],
  es: [
    'datos',
    'inteligencia artificial',
    'desarrollo web',
    'ciberseguridad',
    'visión por computador',
    'NLP',
  ],
};

/** Domaines hors profil, pour les offres sans contexte. */
const NONE_DOMAINS: Record<Locale, string[]> = {
  fr: ['cuisine', 'marketing', 'droit', 'finance', 'logistique', 'santé'],
  en: ['cooking', 'marketing', 'law', 'finance', 'logistics', 'healthcare'],
  es: ['cocina', 'marketing', 'derecho', 'finanzas', 'logística', 'salud'],
};

/** Villes utilisées dans les offres de disponibilité. */
const CITIES: Record<Locale, string[]> = {
  fr: ['Paris', 'Lyon', 'Lille'],
  en: ['Paris', 'Lyon', 'Lille'],
  es: ['París', 'Lyon', 'Lille'],
};

/* ─────────────────────────────────────────────────────────────────────────
   TEMPLATES
   ───────────────────────────────────────────────────────────────────────── */

/** Templates simples, par contexte et par langue. */
const TEMPLATES: Record<Locale, Record<SimpleContext, string[]>> = {

  // Français
  fr: {
    teaching: [
      'Nous cherchons un formateur {domain} pour animer des cours et des TD.',
      "Poste d'enseignant en {domain} : cours magistraux, TP et encadrement d'étudiants.",
      'Un professeur de {domain} est recherché pour le BUT.',
      'Mission de formation {domain} auprès de développeurs juniors, avec tutorat.',
    ],
    research: [
      'Postdoc en {domain} avec publications et expérimentation.',
      'Poste de chercheur en {domain}, publication dans des conférences exigée.',
      'Research scientist en {domain}, doctorat et articles scientifiques requis.',
      'Thèse CIFRE en {domain}, avec conférences internationales.',
    ],
    videos: [
      'Chaîne YouTube de vulgarisation en {domain}.',
      'Nous cherchons un créateur de tutoriels vidéo sur {domain}.',
      'Production de vidéos pédagogiques en {domain} pour une chaîne.',
      'Tutoriels {domain} à réaliser pour YouTube.',
    ],
    awards: [
      "Prix de l'innovation en {domain}.",
      "Concours national en {domain}, remise d'une médaille.",
      'Distinction pour un projet {domain}.',
      'Palmarès {domain} : trophée et reconnaissance.',
    ],
    availability: [
      'CDI à {city} pour un développeur {domain}.',
      'Disponible pour une mission freelance de six mois en {domain}.',
      "CDD d'un an en {domain}, télétravail possible.",
      'Remote en {domain}, contrat freelance.',
    ],
    none: [
      'Nous cherchons un chef de cuisine pour un restaurant gastronomique.',
      'Poste de comptable en assurance.',
      'Stage en marketing digital.',
      'Avocat en droit public.',
    ],
  },

  // Anglais
  en: {
    teaching: [
      'We are looking for a {domain} trainer to deliver courses and practical sessions.',
      'Teaching position in {domain}: lectures, labs and student supervision.',
      'A {domain} professor is needed for the undergraduate program.',
      'Training mission in {domain} for junior developers, including tutoring.',
    ],
    research: [
      'Postdoc in {domain} with publications and experimentation.',
      'Research position in {domain}, conference publications required.',
      'Research scientist in {domain}, PhD and scientific papers required.',
      'PhD project in {domain}, targeting international conferences.',
    ],
    videos: [
      'YouTube channel about {domain} outreach.',
      'We need a video tutorial creator for {domain}.',
      'Educational video production in {domain} for a channel.',
      '{domain} tutorials to produce for YouTube.',
    ],
    awards: [
      'Innovation prize in {domain}.',
      'National competition in {domain}, medal award.',
      'Award for a {domain} project.',
      '{domain} awards: trophy and recognition.',
    ],
    availability: [
      'Permanent contract in {city} for a {domain} developer.',
      'Available for a six-month freelance mission in {domain}.',
      'One-year fixed-term contract in {domain}, remote possible.',
      'Remote {domain} role, freelance contract.',
    ],
    none: [
      'We are looking for a head chef for a gourmet restaurant.',
      'Accountant position in insurance.',
      'Marketing internship.',
      'Public law lawyer.',
    ],
  },

  // Espagnol
  es: {
    teaching: [
      'Buscamos un formador de {domain} para impartir cursos y prácticas.',
      'Puesto de docente en {domain}: clases, laboratorios y supervisión de estudiantes.',
      'Se busca profesor de {domain} para el grado.',
      'Misión de formación en {domain} para desarrolladores junior, con tutoría.',
    ],
    research: [
      'Postdoc en {domain} con publicaciones y experimentación.',
      'Puesto de investigador en {domain}, se exigen publicaciones en congresos.',
      'Research scientist en {domain}, doctorado y artículos científicos requeridos.',
      'Tesis doctoral en {domain}, con congresos internacionales.',
    ],
    videos: [
      'Canal de YouTube de divulgación sobre {domain}.',
      'Buscamos un creador de tutoriales en vídeo sobre {domain}.',
      'Producción de vídeos educativos de {domain} para un canal.',
      'Tutoriales de {domain} para YouTube.',
    ],
    awards: [
      'Premio a la innovación en {domain}.',
      'Concurso nacional de {domain}, entrega de medalla.',
      'Distinción para un proyecto de {domain}.',
      'Palmarés de {domain}: trofeo y reconocimiento.',
    ],
    availability: [
      'Contrato indefinido en {city} para un desarrollador de {domain}.',
      'Disponible para una misión freelance de seis meses en {domain}.',
      'Contrato temporal de un año en {domain}, teletrabajo posible.',
      'Puesto remoto de {domain}, contrato freelance.',
    ],
    none: [
      'Buscamos un jefe de cocina para un restaurante gastronómico.',
      'Puesto de contable en seguros.',
      'Prácticas en marketing digital.',
      'Abogado en derecho público.',
    ],
  },
};

/** Offres multi-contextes, générées séparément des templates simples. */
const MULTI_TEMPLATES: Record<
  Locale,
  Array<{ text: string; labels: VisitContextLabel[] }>
> = {

  // Français
  fr: [
    {
      text: 'Enseignant-chercheur en {domain} : cours, encadrement et publications.',
      labels: ['teaching', 'research'],
    },
    {
      text: 'Formateur {domain} disponible pour des missions en CDI.',
      labels: ['teaching', 'availability'],
    },
    {
      text: 'Postdoc en {domain}, contrat CDD, publications attendues.',
      labels: ['research', 'availability'],
    },
    {
      text: 'Formateur {domain} pour créer des tutoriels vidéo.',
      labels: ['teaching', 'videos'],
    },
  ],

  // Anglais
  en: [
    {
      text: 'Teacher-researcher in {domain}: courses, supervision and publications.',
      labels: ['teaching', 'research'],
    },
    {
      text: '{domain} trainer available for permanent missions.',
      labels: ['teaching', 'availability'],
    },
    {
      text: 'Postdoc in {domain}, fixed-term contract, publications expected.',
      labels: ['research', 'availability'],
    },
    {
      text: '{domain} trainer to create video tutorials.',
      labels: ['teaching', 'videos'],
    },
  ],

  // Espagnol
  es: [
    {
      text: 'Profesor-investigador en {domain}: cursos, supervisión y publicaciones.',
      labels: ['teaching', 'research'],
    },
    {
      text: 'Formador de {domain} disponible para misiones con contrato indefinido.',
      labels: ['teaching', 'availability'],
    },
    {
      text: 'Postdoc en {domain}, contrato temporal, publicaciones esperadas.',
      labels: ['research', 'availability'],
    },
    {
      text: 'Formador de {domain} para crear tutoriales en vídeo.',
      labels: ['teaching', 'videos'],
    },
  ],
};

/* ─────────────────────────────────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Remplace les emplacements d'un template.
 *
 * @param template - Texte avec `{domain}` ou `{city}`.
 * @param domain - Domaine à insérer.
 * @param city - Ville à insérer.
 * @returns Le texte final.
 */
function fillTemplate(
  template: string,
  domain: string,
  city: string,
): string {
  return template
    .replaceAll('{domain}', domain)
    .replaceAll('{city}', city);
}

/* ─────────────────────────────────────────────────────────────────────────
   API PUBLIQUE
   ───────────────────────────────────────────────────────────────────────── */

/**
 * Génère le jeu d'offres étiquetées.
 *
 * Chaque famille de template est déclinée sur plusieurs domaines, dans les
 * trois langues. Les familles servent à regrouper les écarts par formulation
 * quand un contexte échoue.
 *
 * @returns Les offres étiquetées, toutes langues confondues.
 */
export function generateVisitContextDataset(): VisitContextCase[] {
  const cases: VisitContextCase[] = [];

  for (const locale of LOCALES) {
    for (const context of SIMPLE_CONTEXTS) {
      const templates = TEMPLATES[locale][context];

      templates.forEach((template, templateIndex) => {
        const domains =
          context === 'none' ? NONE_DOMAINS[locale] : DOMAINS[locale];

        domains.forEach((domain, domainIndex) => {
          const city = CITIES[locale][domainIndex % CITIES[locale].length];
          const family = `${context}-${locale}-${templateIndex}`;
          const labels: VisitContextLabel[] =
            context === 'none' ? ['none'] : [context];

          cases.push({
            id: `${family}-${domainIndex}`,
            locale,
            text: fillTemplate(template, domain, city),
            labels,
          });
        });
      });
    }

    MULTI_TEMPLATES[locale].forEach((template, templateIndex) => {
      DOMAINS[locale].forEach((domain, domainIndex) => {
        const city = CITIES[locale][domainIndex % CITIES[locale].length];
        const family = `multi-${locale}-${templateIndex}`;

        cases.push({
          id: `${family}-${domainIndex}`,
          locale,
          text: fillTemplate(template.text, domain, city),
          labels: template.labels,
        });
      });
    });
  }

  return cases;
}
