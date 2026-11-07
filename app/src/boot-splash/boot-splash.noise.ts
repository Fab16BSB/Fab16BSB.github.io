/**
 * Grain ambiant du splash : il densifie le champ initial avant de s'effacer.
 */

import { clamp, randomInEllipse, TAU } from '@/boot-splash/boot-splash.rendering';
import type { Point, Rgb } from '@/boot-splash/boot-splash.rendering';

/** Grain ambiant qui s'efface pendant le rassemblement. */
interface NoiseParticle {
  x: number;
  y: number;
  size: number;
  color: string;
  phase: number;
  falloff: number;
}

/** Durée de vie du grain ambiant, en secondes. */
const NOISE_FADE_SECONDS = 1.1;

/**
 * Prépare les grains ambiants qui densifient le champ initial.
 *
 * @param count - Nombre de grains.
 * @param center - Centre du champ.
 * @param radiusX - Rayon horizontal.
 * @param radiusY - Rayon vertical.
 * @param palette - Couleurs possibles.
 * @returns Les grains prêts à être dessinés.
 */
export function createAmbientNoise(
  count: number,
  center: Point,
  radiusX: number,
  radiusY: number,
  palette: Rgb[],
): NoiseParticle[] {
  return Array.from({ length: count }, () => {
    const point = randomInEllipse(center, radiusX, radiusY);
    const normalizedX = (point.x - center.x) / Math.max(1, radiusX);
    const normalizedY = (point.y - center.y) / Math.max(1, radiusY);
    const distance = Math.hypot(normalizedX, normalizedY);
    const color = palette[Math.floor(Math.random() * palette.length)];

    return {
      x: point.x,
      y: point.y,
      size: 0.4 + Math.random() * 1.1,
      color: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
      phase: Math.random() * TAU,
      // Garde une lueur visible jusqu'aux bords du champ.
      falloff: 0.35 + 0.65 * clamp(1 - distance * distance, 0, 1),
    };
  });
}

/**
 * Dessine le grain ambiant, qui s'efface pendant le rassemblement.
 *
 * @param context - Contexte du canvas.
 * @param particles - Grains à dessiner.
 * @param elapsed - Temps écoulé, en secondes.
 */
export function drawAmbientNoise(
  context: CanvasRenderingContext2D,
  particles: NoiseParticle[],
  elapsed: number,
): void {
  const fade = 1 - clamp(elapsed / NOISE_FADE_SECONDS, 0, 1);
  if (fade <= 0) return;

  for (const particle of particles) {
    const flicker = 0.65 + Math.sin(elapsed * 9 + particle.phase) * 0.35;
    const driftX = Math.sin(elapsed * 2 + particle.phase) * 2;
    const driftY = Math.cos(elapsed * 1.7 + particle.phase) * 2;

    context.globalAlpha = fade * particle.falloff * flicker * 0.4;
    context.fillStyle = particle.color;
    context.beginPath();
    context.arc(particle.x + driftX, particle.y + driftY, particle.size, 0, TAU);
    context.fill();
  }
}
