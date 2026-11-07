/**
 * Primitives de rendu du splash : couleurs, easing et échantillonnage du texte.
 * Toutes les coordonnées sont exprimées en pixels CSS.
 */

/** Point exprimé en pixels CSS. */
export interface Point {
  x: number;
  y: number;
}

/** Couleur RGB normalisée. */
export type Rgb = readonly [number, number, number];

/** Tour complet, en radians. */
export const TAU = Math.PI * 2;

/** Espacement d'échantillonnage du texte, en pixels CSS. */
const SAMPLE_STEP = 1.6;

/** Nombre maximal de points pour garder une animation fluide. */
const MAX_PARTICLES = 4200;

/**
 * Contraint une valeur entre deux bornes.
 *
 * @param value - Valeur à contraindre.
 * @param min - Borne basse.
 * @param max - Borne haute.
 * @returns La valeur contrainte.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Accélère la fin du rassemblement : les particules se posent franchement.
 *
 * @param value - Progression entre 0 et 1.
 * @returns La progression adoucie.
 */
export function easeOutCubic(value: number): number {
  return 1 - Math.pow(1 - value, 3);
}

/**
 * Tire un point au hasard dans une ellipse.
 *
 * @param center - Centre de l'ellipse.
 * @param radiusX - Rayon horizontal.
 * @param radiusY - Rayon vertical.
 * @returns Le point tiré.
 */
export function randomInEllipse(center: Point, radiusX: number, radiusY: number): Point {
  const angle = Math.random() * TAU;
  const distance = Math.sqrt(Math.random());

  return {
    x: center.x + Math.cos(angle) * distance * radiusX,
    y: center.y + Math.sin(angle) * distance * radiusY,
  };
}

/**
 * Convertit une couleur hexadécimale en triplet RGB.
 *
 * @param value - Couleur CSS de type `#rgb` ou `#rrggbb`.
 * @param fallback - Couleur utilisée si la valeur est invalide.
 * @returns Le triplet RGB.
 */
export function parseHexColor(value: string, fallback: Rgb): Rgb {
  const hex = value.trim().replace(/^#/, '');
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map((character) => character + character)
          .join('')
      : hex;

  if (normalized.length !== 6) return fallback;

  const numeric = Number.parseInt(normalized, 16);
  if (Number.isNaN(numeric)) return fallback;

  return [(numeric >> 16) & 0xff, (numeric >> 8) & 0xff, numeric & 0xff];
}

/**
 * Mélange deux couleurs en triplet RGB.
 *
 * @param from - Couleur de départ.
 * @param to - Couleur d'arrivée.
 * @param ratio - Position dans le mélange, entre 0 et 1.
 * @returns Le triplet mélangé.
 */
export function mixRgb(from: Rgb, to: Rgb, ratio: number): Rgb {
  const position = clamp(ratio, 0, 1);

  return [
    Math.round(from[0] + (to[0] - from[0]) * position),
    Math.round(from[1] + (to[1] - from[1]) * position),
    Math.round(from[2] + (to[2] - from[2]) * position),
  ];
}

/**
 * Mélange deux couleurs et renvoie une couleur CSS.
 *
 * @param from - Couleur de départ.
 * @param to - Couleur d'arrivée.
 * @param ratio - Position dans le mélange, entre 0 et 1.
 * @returns Une couleur CSS `rgb(...)`.
 */
export function mixColor(from: Rgb, to: Rgb, ratio: number): string {
  const [red, green, blue] = mixRgb(from, to, ratio);

  return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * Échantillonne les pixels du texte pour obtenir les cibles des particules.
 *
 * @param element - Élément contenant le nom.
 * @param pixelRatio - Ratio de pixels du canvas.
 * @returns Les points du glyphe en coordonnées CSS.
 */
export function sampleText(element: HTMLElement, pixelRatio: number): Point[] {
  const rect = element.getBoundingClientRect();
  if (rect.width < 1 || rect.height < 1) return [];

  const style = getComputedStyle(element);
  const fontSize = Number.parseFloat(style.fontSize);
  const padding = Math.ceil(fontSize * 0.35);
  const width = rect.width + padding * 2;
  const height = rect.height + padding * 2;

  const offscreen = document.createElement('canvas');
  offscreen.width = Math.max(1, Math.ceil(width * pixelRatio));
  offscreen.height = Math.max(1, Math.ceil(height * pixelRatio));

  const context = offscreen.getContext('2d');
  if (!context) return [];

  context.scale(pixelRatio, pixelRatio);
  context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  context.textAlign = 'center';
  context.textBaseline = 'alphabetic';
  context.fillStyle = '#ffffff';

  const text = element.textContent?.trim() ?? '';
  const metrics = context.measureText(text);
  const ascent = metrics.fontBoundingBoxAscent || fontSize * 0.8;
  const descent = metrics.fontBoundingBoxDescent || fontSize * 0.2;
  const baseline = (rect.height - ascent - descent) / 2 + ascent;

  context.fillText(text, width / 2, padding + baseline);

  const pixels = context.getImageData(0, 0, offscreen.width, offscreen.height).data;
  const step = Math.max(1, Math.round(SAMPLE_STEP * pixelRatio));
  const points: Point[] = [];

  for (let y = 0; y < offscreen.height; y += step) {
    for (let x = 0; x < offscreen.width; x += step) {
      if (pixels[(y * offscreen.width + x) * 4 + 3] > 128) {
        points.push({
          x: rect.left - padding + x / pixelRatio,
          y: rect.top - padding + y / pixelRatio,
        });
      }
    }
  }

  if (points.length <= MAX_PARTICLES) return points;

  const stride = points.length / MAX_PARTICLES;
  return Array.from(
    { length: MAX_PARTICLES },
    (_, index) => points[Math.floor(index * stride)],
  );
}
