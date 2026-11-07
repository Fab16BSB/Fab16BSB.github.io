/**
 * Animation du splash : les particules partent du plein écran et se
 * rassemblent sur le nom. Rendu en Canvas 2D, sans dépendance externe.
 */

import { createAmbientNoise, drawAmbientNoise } from '@/boot-splash/boot-splash.noise';
import {
  clamp,
  easeOutCubic,
  mixColor,
  mixRgb,
  parseHexColor,
  randomInEllipse,
  sampleText,
  TAU,
} from '@/boot-splash/boot-splash.rendering';
import type { Point, Rgb } from '@/boot-splash/boot-splash.rendering';

/** Particule qui passe d'une position du champ à une lettre. */
interface Particle {
  start: Point;
  control: Point;
  target: Point;
  colorStart: Rgb;
  colorEnd: Rgb;
  sizeStart: number;
  sizeEnd: number;
  alphaStart: number;
  alphaEnd: number;
  delay: number;
  duration: number;
  phase: number;
  glow: boolean;
}

/** Options du moteur de particules. */
export interface ParticleFlowOptions {
  canvas: HTMLCanvasElement;
  nameElement: HTMLElement;
  onReveal: () => void;
}

/** Ratio de pixels maximal pour ne pas surcharger les écrans haute densité. */
const MAX_PIXEL_RATIO = 2;

/** Délai maximal d'attente de la police avant de recalculer les cibles. */
const FONT_TIMEOUT_MS = 600;

/** Nombre de grains ambiants sur desktop. */
const AMBIENT_PARTICLES = 1600;

/** Ratio du rayon horizontal du champ de particules par rapport à l'écran. */
const FIELD_RADIUS_X = 0.52;

/** Ratio du rayon vertical du champ de particules par rapport à l'écran. */
const FIELD_RADIUS_Y = 0.52;

/** Instant où le texte net prend le relais, en secondes. */
const REVEAL_AT = 1.25;

/** Instant où le canvas est vidé et la boucle arrêtée, en secondes. */
const END_AT = 1.75;

/** Couleurs de repli si les jetons CSS sont indisponibles. */
const FALLBACK_START: Rgb = [139, 124, 255];
const FALLBACK_END: Rgb = [34, 211, 238];

/**
 * Attend la police du nom pour recalculer les cibles des particules.
 * L'animation démarre sans attendre : ce contrôle sert seulement à corriger
 * les positions si la police définitive arrive après le premier rendu.
 *
 * @param element - Élément contenant le nom.
 */
async function waitForNameFont(element: HTMLElement): Promise<void> {
  if (!document.fonts) return;

  const style = getComputedStyle(element);
  const descriptor = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;

  try {
    await Promise.race([
      document.fonts.load(descriptor, element.textContent ?? ''),
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, FONT_TIMEOUT_MS);
      }),
    ]);
  } catch (error) {
    console.warn('Police du splash indisponible, le nom utilisera la police de repli.', error);
  }
}

/**
 * Construit une particule qui part d'un point du champ vers une lettre.
 *
 * @param target - Point cible sur le glyphe.
 * @param textRect - Rectangle du nom.
 * @param fieldCenter - Centre du champ de particules.
 * @param fieldRadiusX - Rayon horizontal du champ.
 * @param fieldRadiusY - Rayon vertical du champ.
 * @param startColor - Couleur du côté gauche du dégradé.
 * @param endColor - Couleur du côté droit du dégradé.
 * @param fieldPalette - Couleurs possibles pour le champ initial.
 * @returns La particule prête à être animée.
 */
function createParticle(
  target: Point,
  textRect: DOMRect,
  fieldCenter: Point,
  fieldRadiusX: number,
  fieldRadiusY: number,
  startColor: Rgb,
  endColor: Rgb,
  fieldPalette: Rgb[],
): Particle {
  const start = randomInEllipse(fieldCenter, fieldRadiusX, fieldRadiusY);
  const control: Point = {
    x: (start.x + target.x) / 2 + (Math.random() - 0.5) * 40,
    y: (start.y + target.y) / 2 + (Math.random() - 0.5) * 40,
  };
  const ratio = clamp((target.x - textRect.left) / Math.max(1, textRect.width), 0, 1);

  return {
    start,
    control,
    target,
    colorStart: fieldPalette[Math.floor(Math.random() * fieldPalette.length)],
    colorEnd: mixRgb(startColor, endColor, ratio),
    sizeStart: 0.6 + Math.random() * 1.4,
    sizeEnd: 0.8 + Math.random() * 0.9,
    alphaStart: 0.18 + Math.random() * 0.42,
    alphaEnd: 0.9,
    delay: Math.random() * 0.4,
    duration: 0.65 + Math.random() * 0.3,
    phase: Math.random() * TAU,
    glow: Math.random() < 0.06,
  };
}

/**
 * Dessine une particule à un instant donné.
 *
 * @param context - Contexte du canvas.
 * @param particle - Particule à dessiner.
 * @param elapsed - Temps écoulé, en secondes.
 */
function drawParticle(
  context: CanvasRenderingContext2D,
  particle: Particle,
  elapsed: number,
): void {
  const progress = clamp((elapsed - particle.delay) / particle.duration, 0, 1);
  const eased = easeOutCubic(progress);
  const inverse = 1 - eased;
  const jitter = (1 - eased) * 7;
  const x =
    inverse * inverse * particle.start.x +
    2 * inverse * eased * particle.control.x +
    eased * eased * particle.target.x +
    Math.sin(elapsed * 7 + particle.phase) * jitter;
  const y =
    inverse * inverse * particle.start.y +
    2 * inverse * eased * particle.control.y +
    eased * eased * particle.target.y +
    Math.cos(elapsed * 6 + particle.phase) * jitter;
  const alpha =
    particle.alphaStart + (particle.alphaEnd - particle.alphaStart) * eased;
  const size = particle.sizeStart + (particle.sizeEnd - particle.sizeStart) * eased;

  context.fillStyle = mixColor(particle.colorStart, particle.colorEnd, eased);

  if (particle.glow) {
    context.globalAlpha = alpha * 0.12;
    context.beginPath();
    context.arc(x, y, size * 3.2, 0, TAU);
    context.fill();
  }

  context.globalAlpha = alpha;
  context.beginPath();
  context.arc(x, y, size, 0, TAU);
  context.fill();
}

/**
 * Démarre le rassemblement des particules qui forme le nom.
 *
 * @param options - Canvas, élément cible et callback de révélation.
 * @returns Une fonction d'arrêt, ou `null` si le rendu est impossible.
 */
export function startParticleFlow({
  canvas,
  nameElement,
  onReveal,
}: ParticleFlowOptions): (() => void) | null {
  const context = canvas.getContext('2d');
  if (!context) return null;

  const splash = document.getElementById('boot-splash');
  const styles = getComputedStyle(splash ?? document.documentElement);
  const startColor = parseHexColor(styles.getPropertyValue('--boot-start'), FALLBACK_START);
  const endColor = parseHexColor(styles.getPropertyValue('--boot-end'), FALLBACK_END);
  const isLight = document.documentElement.dataset.theme === 'light';

  const pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO);
  const bounds = canvas.getBoundingClientRect();
  if (bounds.width < 1 || bounds.height < 1) return null;

  const viewport = { width: bounds.width, height: bounds.height };

  canvas.width = Math.round(viewport.width * pixelRatio);
  canvas.height = Math.round(viewport.height * pixelRatio);
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const textRect = nameElement.getBoundingClientRect();
  const points = sampleText(nameElement, pixelRatio);
  if (points.length === 0) return null;

  const fieldCenter = { x: viewport.width / 2, y: viewport.height / 2 };
  const fieldRadiusX = viewport.width * FIELD_RADIUS_X;
  const fieldRadiusY = viewport.height * FIELD_RADIUS_Y;
  // Champ initial bleu et violet uniquement : aucun point clair avant la révélation.
  const fieldPalette: Rgb[] = [startColor, endColor, mixRgb(startColor, endColor, 0.5)];

  const particles = points.map((target) =>
    createParticle(
      target,
      textRect,
      fieldCenter,
      fieldRadiusX,
      fieldRadiusY,
      startColor,
      endColor,
      fieldPalette,
    ),
  );
  const ambientCount = viewport.width < 640 ? 700 : AMBIENT_PARTICLES;
  const ambient = createAmbientNoise(
    ambientCount,
    fieldCenter,
    fieldRadiusX,
    fieldRadiusY,
    fieldPalette,
  );

  context.globalCompositeOperation = isLight ? 'source-over' : 'lighter';

  let frame = 0;
  let revealed = false;
  let disposed = false;
  const startedAt = performance.now();

  const render = (now: number): void => {
    if (disposed) return;

    const elapsed = (now - startedAt) / 1000;
    context.clearRect(0, 0, viewport.width, viewport.height);
    drawAmbientNoise(context, ambient, elapsed);

    for (const particle of particles) {
      drawParticle(context, particle, elapsed);
    }

    if (!revealed && elapsed >= REVEAL_AT) {
      revealed = true;
      onReveal();
    }

    if (elapsed >= END_AT) {
      context.clearRect(0, 0, viewport.width, viewport.height);
      return;
    }

    frame = requestAnimationFrame(render);
  };

  frame = requestAnimationFrame(render);

  // Corrige les cibles si la police définitive arrive après le premier rendu.
  void (async () => {
    await waitForNameFont(nameElement);
    if (disposed) return;

    const updatedRect = nameElement.getBoundingClientRect();
    const updatedPoints = sampleText(nameElement, pixelRatio);
    if (updatedPoints.length === 0) return;

    particles.forEach((particle, index) => {
      const target = updatedPoints[index % updatedPoints.length];
      const ratio = clamp(
        (target.x - updatedRect.left) / Math.max(1, updatedRect.width),
        0,
        1,
      );

      particle.target = target;
      particle.colorEnd = mixRgb(startColor, endColor, ratio);
    });
  })();

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    context.clearRect(0, 0, viewport.width, viewport.height);
  };
}
