import { startParticleFlow } from '@/boot-splash/boot-splash.particles';

/**
 * Durée minimale d'affichage pour laisser le rassemblement se terminer.
 */
const MIN_VISIBLE_MS = 2000;

/**
 * Durée minimale à laisser au flux une fois qu'il a démarré.
 */
const MIN_ANIMATION_VISIBLE_MS = 1900;

/**
 * Durée minimale quand les animations sont coupées.
 */
const REDUCED_MOTION_MIN_MS = 500;

/**
 * Durée du fondu de sortie, alignée sur la transition CSS.
 */
const FADE_MS = 240;

/**
 * Instant où le module est chargé, donc où le splash peut être animé.
 * Le module de démarrage l'importe avant React pour que les particules
 * apparaissent sans attendre le bundle de l'application.
 */
const shownAt = performance.now();

/** Arrêt du flux de particules. */
let stopFlow: (() => void) | null = null;

/** Instant de démarrage effectif du flux, utile si le chargement traîne. */
let animationStartedAt: number | null = null;

/** Empêche un second démarrage si le module est appelé deux fois. */
let started = false;

/**
 * Indique si l'utilisateur demande à réduire les animations.
 *
 * @returns `true` si les animations doivent être coupées.
 */
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Démarre le rassemblement des particules qui forme le nom.
 * Les particules sont dessinées immédiatement, sans attendre la police.
 */
export function startBootSplash(): void {
  const splash = document.getElementById('boot-splash');
  const canvas = document.getElementById('boot-flow');
  const name = document.getElementById('boot-name');

  if (started || !splash || !(canvas instanceof HTMLCanvasElement) || !name) return;

  if (prefersReducedMotion()) return;

  started = true;
  splash.dataset.flow = 'on';
  splash.classList.remove('is-fallback');

  stopFlow = startParticleFlow({
    canvas,
    nameElement: name,
    onReveal: () => splash.classList.add('is-text-visible'),
  });

  if (stopFlow) {
    animationStartedAt = performance.now();
  } else {
    splash.classList.add('is-fallback');
  }
}

/**
 * Retire l'écran de chargement après le premier rendu React.
 * Laisse au rassemblement le temps de se terminer avant le fondu.
 */
export function removeBootSplash(): void {
  const splash = document.getElementById('boot-splash');
  if (!splash) return;

  const reduced = prefersReducedMotion();
  const minVisible = reduced ? REDUCED_MOTION_MIN_MS : MIN_VISIBLE_MS;
  const fade = reduced ? 0 : FADE_MS;
  const now = performance.now();
  const elapsed = now - shownAt;
  const animationWait =
    !reduced && animationStartedAt !== null
      ? Math.max(0, MIN_ANIMATION_VISIBLE_MS - (now - animationStartedAt))
      : 0;
  const wait = Math.max(0, minVisible - elapsed, animationWait);

  window.setTimeout(() => {
    requestAnimationFrame(() => {
      splash.classList.add('is-hidden');
      window.setTimeout(() => {
        stopFlow?.();
        stopFlow = null;
        splash.remove();
      }, fade);
    });
  }, wait);
}
