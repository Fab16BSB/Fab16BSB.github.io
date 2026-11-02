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
        abstract: `Deep neural networks achieve strong performance on complex tasks but are often regarded as "black boxes," which limits their adoption in domains where transparency is essential. This lack of interpretability raises ethical and legal concerns, particularly in sensitive applications such as security, where automated decisions can have serious consequences. The General Data Protection Regulation (GDPR) reinforces the need to justify decisions made by these systems. In this work, we investigate visualization techniques to improve the interpretability of anomaly detection models based on convolutional recurrent neural networks (CNN+RNN) with a TimeDistributed layer. Our architecture combines Visual Geometry Group 19 (VGG19) for feature extraction with a Gated Recurrent Unit (GRU) for sequential analysis of real-time video data. While this design is well suited for temporal inputs, the TimeDistributed layer complicates gradient propagation and weakens the link between spatial and temporal information, reducing the effectiveness of standard visualization methods. To address this challenge, we adapt techniques such as saliency maps and Gradient-weighted Class Activation Mapping (Grad-CAM) to models that incorporate a temporal dimension. Although dedicated visualization methods for such architectures remain limited, our study highlights both the difficulties and the potential of applying tools originally designed for static images to recurrent convolutional networks handling video sequences. This approach extends classical interpretation strategies to temporal models and provides an intermediate solution until more specialized methods are developed.`,
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
        abstract: `In this paper, we propose a new architecture for real-time anomaly detection in video data, inspired by human behavior combining spatial and temporal analyses. This approach uses two distinct models: (i) for temporal analysis, a recurrent convolutional network (CNN + RNN) is employed, associating VGG19 and a GRU to process video sequences; (ii) regarding spatial analysis, it is performed using YOLOv7 to analyze individual images. These two analyses can be carried out either in parallel, with a final prediction that combines the results of both analysis, or in series, where the spatial analysis enriches the data before the temporal analysis. Some experimentations are been made to compare these two architectural configurations with each other, and evaluate the effectiveness of our hybrid approach in video anomaly detection.`,
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
        abstract: `In this paper, we propose an innovative architecture for anomaly detection in videos, motivated by the need to answer quickly to danger in monitoring streams, without requiring expensive computational power. Drawing inspiration from human behavior our approach integrates spatial and temporal analyses. For the temporal analysis, which classifies video sequences, we associate a recurrent convolutional network combining Visual Geometry Group Net 19 (VGG19) and Gated Reccurrent Units (GRU), with a Multilayer Perceptron (MLP). Simultaneously, the spatial analysis of individual images is conducted through You Only Look Once version 7 (YOLOv7). Then, both predictions are combined to perform the final prediction, where an anomaly is signaled if a perceived suspicious object or unexpected action occurs on the screen. Our experimental results shows the integration of both approaches reduces the rate of false negatives, leading to improved identification of anomalous events within video streams for both binary and multi-class models. We also show that multi-class models are less suited for this task than binary models.`,
        rights: '© 2023 IEEE',
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
        abstract: `Cette thèse s’inscrit dans une convention CIFRE entre l’entreprise Othello et le laboratoire LIASD. L’objectif est un système d’intelligence artificielle détectant en temps réel des dangers dans un flux vidéo. Pour y parvenir, une nouvelle approche combinant analyse temporelle et spatiale a été proposée. Plusieurs pistes ont été explorées pour améliorer la détection d’anomalie, en y intégrant la détection d’objets, de la pose humaine et du mouvement. Pour l’explicabilité des résultats, des techniques propres aux images comme les cartes d’activation et de saillance ont été étendues aux vidéos, et une méthode originale a été proposée. L’architecture proposée réalise une classification binaire ou non suivant qu’on veut alerter ou donner la cause. De nombreux modèles de réseaux neuronaux ont été testés, et trois d’entre eux ont été retenus. You Only Looks Once (YOLO) a été employé pour l’analyse spatiale, un Convolutional Recurrent Neuronal Network (CRNN) composé de VGG19 et d’un Gated Recurrent Unit (GRU) pour l’analyse temporelle, et un perceptron multi-couche pour la classification. Ces modèles traitent des données de types différents et peuvent être combinés en parallèle ou en série. Bien que le mode parallèle soit plus rapide, le mode série est généralement plus fiable. Pour entraîner ces modèles, l’apprentissage supervisé a été choisi, et deux jeux de données propriétaires ont été créés. Le premier est consacré à des objets ayant un rôle potentiel dans les anomalies et le second est constitué de vidéos contenant des anomalies ou non. Cette approche permet de traiter à la fois des flux vidéo continus et des vidéos finies, d’où une meilleure flexibilité dans la détection.`,
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
        abstract: `This thesis is part of a CIFRE agreement between the company Othello and the LIASD laboratory. The objective is to develop an artificial intelligence system that can detect real-time dangers in a video stream. To achieve this, a novel approach combining temporal and spatial analysis has been proposed. Several avenues have been explored to improve anomaly detection by integrating object detection, human pose detection, and motion analysis. For result interpretability, techniques commonly used for image analysis, such as activation and saliency maps, have been extended to videos, and an original method has been proposed. The proposed architecture performs binary or multiclass classification depending on whether an alert or the cause needs to be identified. Numerous neural network models have been tested, and three of them have been selected. You Only Looks Once (YOLO) has been used for spatial analysis, a Convolutional Recurrent Neuronal Network (CRNN) composed of VGG19 and a Gated Recurrent Unit (GRU) for temporal analysis, and a multi-layer perceptron for classification. These models handle different types of data and can be combined in parallel or in series. Although the parallel mode is faster, the serial mode is generally more reliable. For training these models, supervised learning was chosen, and two proprietary datasets were created. The first dataset focuses on objects that may play a potential role in anomalies, while the second consists of videos containing anomalies or non-anomalies. This approach allows for the processing of both continuous video streams and finite videos, providing greater flexibility in detection.`,
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
          { key: 'code', label: 'GitHub', url: links.thesis.repo },
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
        abstract: `De nos jours, de nombreux lieux profitent de la télésurveillance. Mais lorsqu'un incident survient, celle-ci est utilisée dans le but de constater les événements passés. On peut donc la considérer comme un outil de dissuasion plutôt que de détection. Dans cet article, nous allons proposer une approche d'apprentissage automatique profond (deep learning en anglais) visant à résoudre cette lacune. Cette approche utilise des modèles de convolution (CNN) permettant d'extraire des caractéristiques pertinentes liées aux images analysées, qui formeront par la suite des séries temporelles destinées à être traitées par des modèles récurrents.`,
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
        abstract: `Nowadays, many places use security cameras. Unfortunately, when an incident occurs, these technologies are used to show past events. So it can be considered as a deterrence tool than a detection tool. In this article, we will propose a deep learning approach trying to solve this problematic. This approach uses convolutional models (CNN) to extract relevant characteristics linked to the video images, theses characteristics will form times series to be analyzed by LSTM / GRU models.`,
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
          { key: 'demo', label: 'Demo', url: links.social.youtubeDemo },
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
