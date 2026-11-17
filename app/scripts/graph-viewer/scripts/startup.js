/* =======================================================================
  DÉMARRAGE : filtres, recherche et animation
======================================================================= */

// Filtres globaux : tout afficher.
document.getElementById('filters-all').addEventListener('click', () => {
  for (const kind of CONTENT_KINDS) visibleKinds.add(kind);
  rebuild();
  renderFilters();
  renderPanel();
});

// Filtres globaux : tout masquer.
document.getElementById('filters-none').addEventListener('click', () => {
  visibleKinds.clear();
  rebuild();
  renderFilters();
  renderPanel();
});

// Repli de la carte des filtres.
filtersToggle.addEventListener('click', () => setFiltersCollapsed(!filtersCollapsed));

// Bascule des concepts techniques et reprise du panneau.
toggleConcepts.addEventListener('click', () => {
  showConcepts = !showConcepts;
  toggleConcepts.setAttribute('aria-pressed', showConcepts ? 'true' : 'false');
  rebuild();
  renderPanel();
  setViewMenuOpen(false);
});

// Sélecteur de disposition : réseau, sections ou thèmes.
for (const button of document.querySelectorAll('[data-layout]')) {
  button.addEventListener('click', () => setLayoutMode(button.dataset.layout));
}

// Menu de vue mobile : ouverture, fermeture extérieure et clavier.
viewTrigger.addEventListener('click', () => setViewMenuOpen(!viewMenuOpen));

document.addEventListener('pointerdown', (event) => {
  if (viewMenuOpen && !viewToolbar.contains(event.target)) setViewMenuOpen(false);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && viewMenuOpen) {
    setViewMenuOpen(false);
    viewTrigger.focus();
  }
});

// Ferme le menu en repassant en disposition desktop.
const viewMenuMedia = window.matchMedia('(max-width: 520px)');
const syncViewMenu = () => {
  if (!viewMenuMedia.matches) setViewMenuOpen(false);
};
if (typeof viewMenuMedia.addEventListener === 'function') {
  viewMenuMedia.addEventListener('change', syncViewMenu);
} else {
  viewMenuMedia.addListener(syncViewMenu);
}

// Zoom tactile : boutons visibles sur les petits écrans.
document.getElementById('zoom-in').addEventListener('click', () => zoomBy(1.35));
document.getElementById('zoom-out').addEventListener('click', () => zoomBy(1 / 1.35));

// Recentre la vue sans réinitialiser les positions.
document.getElementById('reset-view').addEventListener('click', () => {
  alpha = 0.02;
  followId = null;
  fitView();
  setViewMenuOpen(false);
});

// Libère tous les nœuds épinglés.
releaseNodes.addEventListener('click', () => {
  for (const position of positions.values()) position.pinned = false;
  alpha = 1;
  setViewMenuOpen(false);
});

// Entrée lance la recherche.
search.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') runSearch();
});

// Une requête vidée efface les résultats de recherche.
search.addEventListener('input', () => {
  if (!search.value.trim()) {
    matchIds = new Set();
    renderPanel();
  }
});

// Toute variation de la scène recadre le canvas et le graphe sans zone morte.
if (typeof ResizeObserver === 'function') {
  const stageObserver = new ResizeObserver(() => {
    resize();
    if (!followId) fitView();
  });
  stageObserver.observe(stage);
} else {
  window.addEventListener('resize', () => {
    resize();
    if (!followId) fitView();
  });
}

// Disposition initiale : mémoire locale, puis lien direct `?mode=`.
try {
  const storedLayout = window.localStorage.getItem(STORAGE_KEYS.layout);
  if (LAYOUT_MODES.includes(storedLayout)) layoutMode = storedLayout;
} catch (error) {
  console.warn('Stockage local indisponible : disposition par défaut appliquée.', error);
}

const params = new URLSearchParams(window.location.search);
const initialLayout = params.get('mode');
if (LAYOUT_MODES.includes(initialLayout)) layoutMode = initialLayout;

// Premier rendu : libellés, disposition, dimensions, données et panneau.
filtersCollapsed = isCompactLayout();
applyLabels();
syncLayoutSwitch();
resize();
rebuild();
renderFilters();
renderPanel();

// Lien direct pour ouvrir un contenu précis : ?select=project:these
const initialId = params.get('select');
if (initialId && byId.has(initialId)) {
  const initialNode = byId.get(initialId);
  visibleKinds.add(displayKind(initialNode));
  if (params.get('concepts') === '1') showConcepts = true;
  rebuild();
  renderFilters();
  // Attend la stabilisation de la simulation avant de sélectionner.
  setTimeout(() => selectNode(initialId), 2600);
}

let frameRequest = null;

/** Démarre la boucle d'animation si elle n'est pas déjà active. */
function startFrame() {
  if (frameRequest === null) frameRequest = requestAnimationFrame(frame);
}

/** Arrête la boucle d'animation. */
function stopFrame() {
  if (frameRequest === null) return;
  cancelAnimationFrame(frameRequest);
  frameRequest = null;
}

/** Exécute une image : simulation, suivi et rendu. */
function frame() {
  frameRequest = null;
  tick();
  // Suit le nœud sélectionné pour le garder au centre.
  if (followId) {
    const position = positions.get(followId);
    if (position) {
      view.x = stage.clientWidth / 2 - position.x * view.scale;
      view.y = stage.clientHeight / 2 - position.y * view.scale;
    }
  }
  draw();
  frameRequest = requestAnimationFrame(frame);
}

// Stoppe la simulation quand le viewer est masqué ou quitté.
window.addEventListener('pagehide', stopFrame);
window.addEventListener('pageshow', () => {
  if (document.visibilityState !== 'hidden') startFrame();
});
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') stopFrame();
  else startFrame();
});

// Point d'entrée de débogage, sans effet sur l'interface.
window.__knowledgeViewer = {
  get nodes() { return nodes; },
  get edges() { return edges; },
  view,
  fitView,
};

// Démarre le rendu continu.
startFrame();
