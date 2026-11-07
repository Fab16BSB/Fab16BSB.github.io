/* =======================================================================
  HELPERS
======================================================================= */

/**
 * Retourne le libellé localisé d'un nœud, avec repli sur son identifiant.
 *
 * @param {object} node - Nœud du graphe.
 * @returns {string} Libellé dans la langue courante.
 */
function labelOf(node) {
  return (node.label && (node.label[lang] || node.label.fr || node.label.en)) || node.id;
}

/**
 * Retourne le libellé localisé d'un type de contenu.
 *
 * @param {string} kind - Identifiant du type.
 * @returns {string} Libellé traduit, ou identifiant en repli.
 */
function kindLabel(kind) {
  return (KIND_LABELS[kind] || {})[lang] || kind;
}

/**
 * Retourne la couleur d'un type de nœud pour le thème courant.
 *
 * @param {string} kind - Identifiant du type.
 * @returns {string} Couleur CSS.
 */
function kindColor(kind) {
  const palette = theme === 'light' ? KIND_COLORS_LIGHT : KIND_COLORS;
  return palette[kind] || '#94a3b8';
}

/**
 * Retourne les couleurs du canvas pour le thème courant.
 *
 * @returns {object} Palette de tracés et d'étiquettes.
 */
function canvasPalette() {
  return CANVAS_COLORS[theme] || CANVAS_COLORS.dark;
}

/**
 * Met à jour le libellé et l'icône du bouton de thème.
 *
 * @returns {void}
 */
function updateThemeToggle() {
  if (!themeToggle) return;
  const isDark = theme === 'dark';
  themeToggle.title = isDark ? UI[lang].themeLight : UI[lang].themeDark;
  themeToggle.setAttribute('aria-label', UI[lang].toggleTheme);
}

/**
 * Applique un thème et synchronise l'interface.
 *
 * @param {'light'|'dark'} next - Thème à appliquer.
 * @param {boolean} persist - Enregistre le choix dans le stockage local.
 * @returns {void}
 */
function applyTheme(next, persist) {
  theme = next;
  document.documentElement.dataset.theme = next;
  document.documentElement.style.colorScheme = next;

  // Aligne la couleur de la barre navigateur sur le thème appliqué.
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', next === 'dark' ? '#070b14' : '#e7dfd1');

  if (persist) {
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch (error) {
      console.warn('Stockage local indisponible : le thème ne sera pas conservé.', error);
    }
  }

  // Rafraîchit les vues qui dépendent des couleurs du thème.
  updateThemeToggle();
  renderFilters();
  renderPanel();
}

// Le script du head a déjà posé le thème ; on aligne la meta et le bouton.
const initialThemeMeta = document.querySelector('meta[name="theme-color"]');
if (initialThemeMeta) {
  initialThemeMeta.setAttribute('content', theme === 'dark' ? '#070b14' : '#e7dfd1');
}

/**
 * Crée un générateur pseudo-aléatoire déterministe.
 *
 * @param {number} seed - Graine initiale.
 * @returns {() => number} Générateur renvoyant une valeur dans [0, 1).
 */
function seededRandom(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

// Instance partagée : les positions restent identiques entre deux chargements.
const random = seededRandom(20261104);

/**
 * Retourne la position d'un nœud, en la créant au besoin.
 *
 * @param {string} id - Identifiant du nœud.
 * @returns {{ x: number, y: number, vx: number, vy: number, pinned: boolean }} Position courante.
 */
function positionOf(id) {
  if (!positions.has(id)) {
    // Coordonnées polaires pour répartir les nœuds à l'initialisation.
    const angle = random() * Math.PI * 2;
    const radius = 120 + random() * 480;
    positions.set(id, {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      pinned: false,
    });
  }
  return positions.get(id);
}

/**
 * Indique si un nœud doit être affiché selon les filtres et les concepts.
 *
 * @param {object} node - Nœud à tester.
 * @returns {boolean} `true` si le nœud est visible.
 */
function isVisible(node) {
  let visible;
  if (node.kind === 'theme') visible = true;
  else if (node.kind === 'concept') visible = showConcepts;
  else visible = visibleKinds.has(node.kind);
  return visible;
}

/**
 * Convertit un point du monde du graphe en coordonnées écran.
 *
 * @param {{ x: number, y: number }} point - Point dans le repère monde.
 * @returns {{ x: number, y: number }} Point dans le repère écran.
 */
function worldToScreen(point) {
  return {
    x: point.x * view.scale + view.x,
    y: point.y * view.scale + view.y,
  };
}

/**
 * Convertit un point écran en coordonnées du monde du graphe.
 *
 * @param {{ x: number, y: number }} point - Point dans le repère écran.
 * @returns {{ x: number, y: number }} Point dans le repère monde.
 */
function screenToWorld(point) {
  return {
    x: (point.x - view.x) / view.scale,
    y: (point.y - view.y) / view.scale,
  };
}

/**
 * Adapte le canvas à la taille de la scène et au ratio de pixels.
 *
 * @returns {void}
 */
function resize() {
  // Plafonne le ratio pour limiter le coût de rendu sur les écrans denses.
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}
