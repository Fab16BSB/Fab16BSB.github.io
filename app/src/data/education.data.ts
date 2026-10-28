import type { Education } from '@/types/education.types';
import { links } from './links.data';

/**
 * Formation, de la plus récente à la plus ancienne.
 *
 * Élément de type `Education`.
 *
 * @property {string} id - Identifiant stable.
 * @property {number} start - Année de début.
 * @property {number} end - Année de fin.
 * @property {Localized} degree - Intitulé du diplôme en FR / EN / ES.
 * @property {Localized} school - Établissement en FR / EN / ES.
 * @property {Localized} [detail] - Précision optionnelle.
 * @property {string} [schoolUrl] - URL de l'établissement.
 * @property {EducationLink[]} [links] - Liens PDF, HAL, démo ou code (`label`, `url`, `icon`).
 * @property {Accent} accent - Couleur d'accent.
 */
export const education: Education[] = [

  /** ▸ 2019–2023 · Doctorat en Intelligence Artificielle */
  {
    id: 'phd',
    start: 2019,
    end: 2023,
    degree: {
      fr: 'Doctorat en Intelligence Artificielle',
      en: 'PhD in Artificial Intelligence',
      es: 'Doctorado en Inteligencia Artificial',
    },
    school: {
      fr: 'Université Paris 8',
      en: 'Paris 8 University',
      es: 'Universidad Paris 8',
    },
    detail: {
      fr: 'Détection d\'anomalies en temps réel dans un flux vidéo',
      en: 'Real-time anomaly detection in video streams',
      es: 'Detección de anomalías en tiempo real en flujos de vídeo',
    },
    schoolUrl: 'https://www.univ-paris8.fr',
    links: [
      {
        label: { fr: 'Thèse PDF', en: 'Thesis PDF', es: 'Tesis PDF' },
        url: links.thesis.pdf,
        icon: 'download',
      },
      {
        label: { fr: 'Notice HAL', en: 'HAL record', es: 'Registro HAL' },
        url: links.thesis.hal,
        icon: 'external',
      },
      {
        label: { fr: 'Démo', en: 'Demo', es: 'Demo' },
        url: links.social.youtubeDemo,
        icon: 'play',
      },
      {
        label: { fr: 'Code', en: 'Code', es: 'Código' },
        url: links.thesis.repo,
        icon: 'code',
      },
    ],
    accent: 'indigo',
  },

  /** ▸ 2017–2019 · Master Big Data et Machine Learning */
  {
    id: 'master',
    start: 2017,
    end: 2019,
    degree: {
      fr: 'Master Big Data et Machine Learning',
      en: 'Master in Big Data and Machine Learning',
      es: 'Máster en Big Data y Machine Learning',
    },
    school: {
      fr: 'Université Paris 8',
      en: 'Paris 8 University',
      es: 'Universidad Paris 8',
    },
    schoolUrl: 'https://www.univ-paris8.fr',
    accent: 'amber',
  },

  /** ▸ 2016–2017 · Licence Informatique MIME */
  {
    id: 'licence',
    start: 2016,
    end: 2017,
    degree: {
      fr: 'Licence Informatique MIME',
      en: 'Bachelor in Computer Science — MIME',
      es: 'Grado en Informática — MIME',
    },
    detail: {
      fr: 'Micro Informatique et Machines Embarquées',
      en: 'Micro Computing and Embedded Machines',
      es: 'Microinformática y Máquinas Embebidas',
    },
    school: {
      fr: 'Université Paris 8',
      en: 'Paris 8 University',
      es: 'Universidad Paris 8',
    },
    schoolUrl: 'https://www.univ-paris8.fr',
    accent: 'rose',
  },

  /** ▸ 2014–2016 · DUT Informatique */
  {
    id: 'dut',
    start: 2014,
    end: 2016,
    degree: {
      fr: 'DUT Informatique',
      en: 'Two-year degree in Computer Science',
      es: 'Diploma Universitario de Tecnología en Informática',
    },
    school: {
      fr: 'IUT de Montreuil, Paris 8',
      en: 'IUT of Montreuil, Paris 8',
      es: 'IUT de Montreuil, Paris 8',
    },
    schoolUrl: links.organizations.sit,
    accent: 'emerald',
  },
];
