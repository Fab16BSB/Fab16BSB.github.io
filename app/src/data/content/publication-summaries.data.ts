import type { PublicationSummary } from '@/types/publication.types';

/**
 * Contenu éditorial des publications scientifiques : points clés et mots-clés.
 *
 * Indexé par identifiant de publication. Chaque point (contexte, problématique,
 * solution proposée) tient en une phrase, sans jargon. Les articles Medium ne
 * sont pas concernés.
 */
export const publicationSummaries: Partial<Record<string, PublicationSummary>> = {

  /** ▸ 2024 · arXiv — rendre les modèles temporels explicables */
  'arxiv-2411-04707': {
    points: {
      fr: {
        context:
          'Les modèles qui détectent des anomalies dans une vidéo sont souvent des boîtes noires : on ignore ce qui déclenche l\'alerte.',
        problem:
          'Les cartes visuelles classiques (saillance, Grad-CAM) ont été conçues pour des images fixes et perdent en efficacité sur les modèles qui analysent aussi le temps.',
        solution:
          'L\'article les adapte aux réseaux convolutifs récurrents pour montrer les zones de l\'image qui influencent la décision, et rendre les alertes plus faciles à justifier.',
      },
      en: {
        context:
          'Video anomaly detectors are often black boxes: we cannot tell what triggered an alert.',
        problem:
          'Classic visual maps (saliency, Grad-CAM) were designed for still images and lose effectiveness on models that also analyse time.',
        solution:
          'The paper adapts them to convolutional recurrent networks to show which image areas influence a decision, making alerts easier to justify.',
      },
      es: {
        context:
          'Los detectores de anomalías en vídeo suelen ser cajas negras: no se sabe qué provoca una alerta.',
        problem:
          'Los mapas visuales clásicos (saliencia, Grad-CAM) se diseñaron para imágenes fijas y pierden eficacia en modelos que también analizan el tiempo.',
        solution:
          'El artículo los adapta a redes convolucionales recurrentes para mostrar qué zonas de la imagen influyen en la decisión y hacer las alertas más fáciles de justificar.',
      },
    },
    keywords: {
      fr: ['détection d\'anomalies', 'réseaux convolutifs récurrents', 'Grad-CAM', 'cartes de saillance', 'VGG19 + GRU', 'explicabilité'],
      en: ['anomaly detection', 'convolutional recurrent networks', 'Grad-CAM', 'saliency maps', 'VGG19 + GRU', 'explainability'],
      es: ['detección de anomalías', 'redes convolucionales recurrentes', 'Grad-CAM', 'mapas de saliencia', 'VGG19 + GRU', 'explicabilidad'],
    },
  },

  /** ▸ 2024 · arXiv — regard spatial et temporel combinés */
  'arxiv-2410-15909': {
    points: {
      fr: {
        context:
          'Repérer un danger dans une vidéo demande de comprendre à la fois ce que montre l\'image et ce qui se passe dans la durée.',
        problem:
          'Il reste difficile de combiner ces deux analyses sans perdre en vitesse ni en fiabilité.',
        solution:
          'L\'article combine YOLOv7 pour les objets et VGG19 + GRU pour l\'évolution dans le temps, en parallèle (plus rapide) ou en série (plus fiable), puis compare les deux.',
      },
      en: {
        context:
          'Spotting danger in a video means understanding both what a single image shows and what happens over time.',
        problem:
          'It remains difficult to combine these two analyses without losing speed or reliability.',
        solution:
          'The paper combines YOLOv7 for objects and VGG19 + GRU for change over time, in parallel (faster) or in series (more reliable), then compares both.',
      },
      es: {
        context:
          'Detectar un peligro en un vídeo exige entender tanto lo que muestra una imagen como lo que ocurre con el tiempo.',
        problem:
          'Sigue siendo difícil combinar ambos análisis sin perder velocidad ni fiabilidad.',
        solution:
          'El artículo combina YOLOv7 para los objetos y VGG19 + GRU para la evolución temporal, en paralelo (más rápido) o en serie (más fiable), y compara ambas opciones.',
      },
    },
    keywords: {
      fr: ['détection d\'anomalies vidéo', 'YOLOv7', 'VGG19 + GRU', 'analyse spatio-temporelle', 'temps réel', 'architecture hybride'],
      en: ['video anomaly detection', 'YOLOv7', 'VGG19 + GRU', 'spatio-temporal analysis', 'real time', 'hybrid architecture'],
      es: ['detección de anomalías en vídeo', 'YOLOv7', 'VGG19 + GRU', 'análisis espaciotemporal', 'tiempo real', 'arquitectura híbrida'],
    },
  },

  /** ▸ 2023 · AICCSA — YOLO + VGG/GRU en surveillance */
  'aiccsa-2023': {
    points: {
      fr: {
        context:
          'Les caméras de surveillance produisent un flux continu d\'images, et réagir vite à un danger demande des calculs importants.',
        problem:
          'Les systèmes existants manquent parfois des événements dangereux, ou nécessitent trop de puissance pour tourner en continu.',
        solution:
          'L\'article associe YOLOv7 (objets) et VGG19 + GRU (mouvement), puis combine leurs prédictions ; le modèle binaire réduit les alertes manquées, le multiclasse étant plus fragile.',
      },
      en: {
        context:
          'Surveillance cameras produce a continuous stream of images, and reacting quickly to danger requires significant computing power.',
        problem:
          'Existing systems sometimes miss dangerous events, or need too much power to run continuously.',
        solution:
          'The paper pairs YOLOv7 (objects) with VGG19 + GRU (motion), then combines their predictions; the binary model misses fewer alerts, while the multi-class model is less reliable.',
      },
      es: {
        context:
          'Las cámaras de vigilancia producen un flujo continuo de imágenes, y reaccionar rápido a un peligro exige mucha capacidad de cálculo.',
        problem:
          'Los sistemas existentes a veces omiten eventos peligrosos o necesitan demasiada potencia para funcionar sin parar.',
        solution:
          'El artículo asocia YOLOv7 (objetos) y VGG19 + GRU (movimiento), y combina sus predicciones; el modelo binario omite menos alertas y el multiclase resulta menos fiable.',
      },
    },
    keywords: {
      fr: ['détection d\'anomalies vidéo', 'YOLOv7', 'VGG19 + GRU', 'perceptron multicouche', 'classification binaire', 'classification multiclasse'],
      en: ['video anomaly detection', 'YOLOv7', 'VGG19 + GRU', 'multilayer perceptron', 'binary classification', 'multi-class classification'],
      es: ['detección de anomalías en vídeo', 'YOLOv7', 'VGG19 + GRU', 'perceptrón multicapa', 'clasificación binaria', 'clasificación multiclase'],
    },
  },

  /** ▸ 2023 · Thèse — système complet de détection en temps réel */
  'thesis-2023': {
    points: {
      fr: {
        context:
          'Cette thèse, menée avec l\'entreprise Othello et le laboratoire LIASD, vise à détecter automatiquement des dangers dans des flux vidéo.',
        problem:
          'Un système utile doit alerter vite, expliquer sa décision et limiter les fausses alertes, tout en traitant à la fois l\'image et le temps.',
        solution:
          'Elle combine détection d\'objets (YOLO), posture humaine et mouvement, avec un réseau VGG19 + GRU et un classifieur ; l\'analyse en série est plus fiable, et des cartes visuelles rendent les décisions lisibles.',
      },
      en: {
        context:
          'This PhD, run with the company Othello and the LIASD laboratory, aims to detect danger automatically in video streams.',
        problem:
          'A useful system must alert quickly, explain its decision and limit false alarms, while handling both image and time.',
        solution:
          'It combines object detection (YOLO), human pose and motion, with a VGG19 + GRU network and a classifier; serial analysis is more reliable, and visual maps make decisions readable.',
      },
      es: {
        context:
          'Esta tesis, realizada con la empresa Othello y el laboratorio LIASD, busca detectar peligros automáticamente en flujos de vídeo.',
        problem:
          'Un sistema útil debe avisar rápido, explicar su decisión y limitar las falsas alarmas, tratando a la vez la imagen y el tiempo.',
        solution:
          'Combina detección de objetos (YOLO), postura humana y movimiento, con una red VGG19 + GRU y un clasificador; el análisis en serie es más fiable y los mapas visuales hacen legibles las decisiones.',
      },
    },
    keywords: {
      fr: ['détection d\'anomalies vidéo', 'YOLO', 'VGG19 + GRU', 'estimation de pose', 'cartes de saillance', 'apprentissage supervisé'],
      en: ['video anomaly detection', 'YOLO', 'VGG19 + GRU', 'pose estimation', 'saliency maps', 'supervised learning'],
      es: ['detección de anomalías en vídeo', 'YOLO', 'VGG19 + GRU', 'estimación de pose', 'mapas de saliencia', 'aprendizaje supervisado'],
    },
  },

  /** ▸ 2022 · EGC — caméras de surveillance et alerte immédiate */
  'egc-2022': {
    points: {
      fr: {
        context:
          'Beaucoup de caméras de sécurité servent surtout à revoir un incident après coup, pas à le détecter sur le moment.',
        problem:
          'Analyser chaque image séparément ne suffit pas à repérer un comportement anormal, et une alerte n\'a de valeur que si elle arrive tout de suite.',
        solution:
          'L\'article extrait les éléments utiles de chaque image avec un réseau convolutif, les transforme en série temporelle et la fait analyser par un modèle récurrent (LSTM / GRU) pour signaler l\'anomalie en temps réel.',
      },
      en: {
        context:
          'Many security cameras are mostly used to review an incident afterwards, not to detect it as it happens.',
        problem:
          'Analysing each frame separately cannot reveal an abnormal behaviour, and an alert is only useful if it arrives immediately.',
        solution:
          'The paper extracts useful features from each frame with a convolutional network, turns them into a time series and has a recurrent model (LSTM / GRU) analyse it to flag the anomaly in real time.',
      },
      es: {
        context:
          'Muchas cámaras de seguridad solo sirven para revisar un incidente después, no para detectarlo en el momento.',
        problem:
          'Analizar cada imagen por separado no basta para detectar un comportamiento anormal, y una alerta solo es útil si llega de inmediato.',
        solution:
          'El artículo extrae los elementos útiles de cada imagen con una red convolucional, los convierte en una serie temporal y la hace analizar por un modelo recurrente (LSTM / GRU) para señalar la anomalía en tiempo real.',
      },
    },
    keywords: {
      fr: ['détection d\'anomalies vidéo', 'CNN', 'LSTM / GRU', 'séries temporelles', 'apprentissage profond'],
      en: ['video anomaly detection', 'CNN', 'LSTM / GRU', 'time series', 'deep learning'],
      es: ['detección de anomalías en vídeo', 'CNN', 'LSTM / GRU', 'series temporales', 'aprendizaje profundo'],
    },
  },
};
