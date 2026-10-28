import type { Publication } from '@/types/publication.types';
import { links } from './links.data';

/**
 * Publications, de la plus récente à la plus ancienne.
 *
 * Élément de type `Publication`.
 *
 * @property {string} id - Identifiant stable.
 * @property {string} year - Année de publication.
 * @property {Localized} venue - Revue, conférence ou dépôt en FR / EN / ES.
 * @property {string} [venueUrl] - URL de la publication.
 * @property {string[]} authors - Liste des auteurs.
 * @property {PublicationVersion[]} versions - Versions FR / EN avec liens et BibTeX.
 * @property {boolean} [preprint] - Indique un préprint.
 * @property {Accent} accent - Couleur d'accent.
 *
 * Chaque version contient : `language`, `title`, `subtitle`, `links` et `bibtex`.
 * Chaque `links` contient : `key`, `label` et `url`.
 */
export const publications: Publication[] = [

  /** ▸ 2024 · arXiv — visualisation pour la détection d\'anomalies temporelles */
  {
    id: 'arxiv-2411-04707',
    year: '2024',
    preprint: true,
    venue: {
      fr: 'arXiv preprint — Computer Vision and Pattern Recognition (cs.CV)',
      en: 'arXiv preprint — Computer Vision and Pattern Recognition (cs.CV)',
      es: 'arXiv preprint — Computer Vision and Pattern Recognition (cs.CV)',
    },
    venueUrl: 'https://arxiv.org/abs/2411.04707',
    authors: ['Fabien Poirier', 'Myriam Lamolle'],
    versions: [
      {
        language: 'en',
        title:
          'Adapting Visualization Techniques for Time-Series Anomaly Detection: From Convolutional Neural Networks to Convolutional-Recurrent Neural Networks',
        links: [
          {
            key: 'article',
            label: 'arXiv',
            url: 'https://arxiv.org/abs/2411.04707',
          },
          {
            key: 'pdf',
            label: 'PDF',
            url: 'https://arxiv.org/pdf/2411.04707',
          },
        ],
        bibtex: `@misc{poirier2024timeseries,
  author = {Poirier, Fabien and Lamolle, Myriam},
  title = {Adapting Visualization Techniques for Time-Series Anomaly Detection: From Convolutional Neural Networks to Convolutional-Recurrent Neural Networks},
  year = {2024},
  eprint = {2411.04707},
  archivePrefix = {arXiv},
  primaryClass = {cs.CV},
  url = {https://arxiv.org/abs/2411.04707}
}`,
      },
    ],
    accent: 'indigo',
  },

  /** ▸ 2024 · arXiv — architecture hybride pour la vidéo */
  {
    id: 'arxiv-2410-15909',
    year: '2024',
    preprint: true,
    venue: {
      fr: 'arXiv preprint — Computer Vision and Pattern Recognition (cs.CV)',
      en: 'arXiv preprint — Computer Vision and Pattern Recognition (cs.CV)',
      es: 'arXiv preprint — Computer Vision and Pattern Recognition (cs.CV)',
    },
    venueUrl: 'https://arxiv.org/abs/2410.15909',
    authors: ['Fabien Poirier'],
    versions: [
      {
        language: 'en',
        title:
          'Hybrid Architecture for Real-Time Video Anomaly Detection: Integrating Spatial and Temporal Analysis',
        links: [
          {
            key: 'article',
            label: 'arXiv',
            url: 'https://arxiv.org/abs/2410.15909',
          },
          {
            key: 'pdf',
            label: 'PDF',
            url: 'https://arxiv.org/pdf/2410.15909',
          },
        ],
        bibtex: `@misc{poirier2024hybrid,
  author = {Poirier, Fabien},
  title = {Hybrid Architecture for Real-Time Video Anomaly Detection: Integrating Spatial and Temporal Analysis},
  year = {2024},
  eprint = {2410.15909},
  archivePrefix = {arXiv},
  primaryClass = {cs.CV},
  url = {https://arxiv.org/abs/2410.15909}
}`,
      },
    ],
    accent: 'emerald',
  },

  /** ▸ 2023 · AICCSA — YOLO + VGG/GRU */
  {
    id: 'aiccsa-2023',
    year: '2023',
    venue: {
      fr: 'AICCSA 2023 — ACS/IEEE International Conference on Computer Systems and Applications',
      en: 'AICCSA 2023 — ACS/IEEE International Conference on Computer Systems and Applications',
      es: 'AICCSA 2023 — ACS/IEEE International Conference on Computer Systems and Applications',
    },
    venueUrl: 'https://aiccsa.net/AICCSA2023/',
    authors: ['Fabien Poirier', 'Rakia Jaziri', 'Camille Srour', 'Gilles Bernard'],
    versions: [
      {
        language: 'en',
        title:
          'Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach',
        links: [
          {
            key: 'article',
            label: 'IEEE Xplore',
            url: 'https://ieeexplore.ieee.org/abstract/document/10479307',
          },
        ],
        bibtex: `@INPROCEEDINGS{10479307,
  author={Poirier, Fabien and Jaziri, Rakia and Srour, Camille and Bernard, Gilles},
  booktitle={2023 20th ACS/IEEE International Conference on Computer Systems and Applications (AICCSA)},
  title={Enhancing Anomaly Detection in Videos using a Combined YOLO and a VGG GRU Approach},
  year={2023},
  volume={},
  number={},
  pages={1-6},
  keywords={YOLO;Analytical models;Visualization;Video sequences;Computer architecture;Data models;Task analysis;Videos;Anomaly detection;YOLOv7;VGG19;GRU;Temporal Analysis},
  doi={10.1109/AICCSA59173.2023.10479307}
}`,
      },
    ],
    accent: 'cyan',
  },

  /** ▸ 2023 · Thèse de doctorat (FR + traduction EN) */
  {
    id: 'thesis-2023',
    year: '2023',
    venue: {
      fr: 'Soutenance de thèse — Université Paris 8',
      en: 'PhD defense — Paris 8 University',
      es: 'Defensa de tesis — Universidad Paris 8',
    },
    venueUrl: 'https://www.univ-paris8.fr',
    authors: ['Fabien Poirier'],
    versions: [
      {
        language: 'fr',
        title: 'Détection d\'anomalies en temps réel dans un flux vidéo',
        subtitle: {
          fr: 'Thèse de doctorat en informatique',
          en: 'PhD thesis in computer science',
          es: 'Tesis doctoral en informática',
        },
        links: [
          { key: 'pdf', label: 'PDF', url: links.thesis.pdf },
          { key: 'article', label: 'HAL', url: links.thesis.hal },
          { key: 'code', label: 'GitHub', url: links.thesis.repo },
        ],
        bibtex: `@phdthesis{poirier:tel-04792952,
  TITLE = {{D{\\'e}tection d'anomalies en temps r{\\'e}el dans un flux vid{\\'e}o}},
  AUTHOR = {Poirier, Fabien},
  URL = {https://hal.science/tel-04792952},
  NUMBER = {2023PA080032},
  SCHOOL = {{Universit{\\'e} Paris 8}},
  YEAR = {2023},
  MONTH = Sep,
  KEYWORDS = {Neural networks ; Recurrent networks ; Convolutional networks ; Deep learning ;
  Object detection ; Action recognition ; Real-time ; Anomaly detection},
  TYPE = {Theses},
  PDF = {https://hal.science/tel-04792952v1/file/2023PA080032_POIRIER_Det.pdf},
  HAL_ID = {tel-04792952},
  HAL_VERSION = {v1}
}`,
      },
      {
        language: 'en',
        title: 'Real-Time Anomaly Detection in Video Streams',
        subtitle: {
          fr: 'Traduction anglaise de la thèse',
          en: 'English translation of the PhD thesis',
          es: 'Traducción al inglés de la tesis',
        },
        links: [
          {
            key: 'article',
            label: 'arXiv',
            url: 'https://arxiv.org/abs/2411.19731',
          },
          {
            key: 'pdf',
            label: 'PDF',
            url: 'https://arxiv.org/pdf/2411.19731',
          },
        ],
        bibtex: `@misc{poirier2024thesis,
  author = {Poirier, Fabien},
  title = {Real-Time Anomaly Detection in Video Streams},
  year = {2024},
  eprint = {2411.19731},
  archivePrefix = {arXiv},
  primaryClass = {cs.CV},
  url = {https://arxiv.org/abs/2411.19731}
}`,
      },
    ],
    accent: 'indigo',
  },

  /** ▸ 2022 · EGC — article, poster et démo */
  {
    id: 'egc-2022',
    year: '2022',
    venue: {
      fr: 'EGC 2022 — Conférence francophone sur l\'Extraction et la Gestion des Connaissances',
      en: 'EGC 2022 — French-speaking conference on Knowledge Extraction and Management',
      es: 'EGC 2022 — Conferencia francófona sobre extracción y gestión del conocimiento',
    },
    venueUrl: 'https://egc2022.univ-tours.fr',
    authors: ['Fabien Poirier', 'Rakia Jaziri', 'Camille Srour', 'Gilles Bernard'],
    versions: [
      {
        language: 'fr',
        title: 'Détection d\'anomalies en temps réel dans le flux vidéo',
        links: [
          {
            key: 'article',
            label: 'Article',
            url: 'https://editions-rnti.fr/?inprocid=1002757',
          },
          {
            key: 'poster',
            label: 'Poster',
            url: '/documents/EGC2022_POSTER_POIRIER_FABIEN.pdf',
          },
          { key: 'demo', label: 'Démo', url: links.social.youtubeDemo },
        ],
        bibtex: `@article{RNTI/papers/1002757,
  author = {Fabien Poirier and Rakia Jaziri and Camille Srour and Gilles Bernard},
  title = {Détection d'anomalies en temps réel dans le flux vidéo},
  journal = {Revue des Nouvelles Technologies de l'Information},
  volume = {Extraction et Gestion des Connaissances, RNTI-E-38},
  year = {2022},
  pages = {437-444}
}`,
      },
      {
        language: 'en',
        title: 'Real time anomalies detection on video',
        links: [
          {
            key: 'article',
            label: 'arXiv',
            url: 'https://arxiv.org/abs/2410.18051',
          },
          {
            key: 'pdf',
            label: 'PDF',
            url: 'https://arxiv.org/pdf/2410.18051',
          },
        ],
        bibtex: `@misc{poirier2022egc,
  author = {Poirier, Fabien and Jaziri, Rakia and Srour, Camille and Bernard, Gilles},
  title = {Real time anomalies detection on video},
  year = {2022},
  eprint = {2410.18051},
  archivePrefix = {arXiv},
  primaryClass = {cs.CV},
  url = {https://arxiv.org/abs/2410.18051}
}`,
      },
    ],
    accent: 'rose',
  },
];
