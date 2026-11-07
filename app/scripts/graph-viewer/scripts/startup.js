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
document.getElementById('toggle-concepts').addEventListener('click', (event) => {
  showConcepts = !showConcepts;
  event.currentTarget.setAttribute('aria-pressed', showConcepts ? 'true' : 'false');
  rebuild();
  renderPanel();
});

// Bascule des étiquettes sans relancer la simulation.
document.getElementById('toggle-labels').addEventListener('click', (event) => {
  showLabels = !showLabels;
  event.currentTarget.setAttribute('aria-pressed', showLabels ? 'true' : 'false');
});

// Zoom tactile : boutons visibles sur les petits écrans.
document.getElementById('zoom-in').addEventListener('click', () => zoomBy(1.35));
document.getElementById('zoom-out').addEventListener('click', () => zoomBy(1 / 1.35));

// Recentre la vue sans réinitialiser les positions.
document.getElementById('reset-view').addEventListener('click', () => {
  alpha = 0.02;
  followId = null;
  fitView();
});

// Libère tous les nœuds épinglés.
document.getElementById('release-nodes').addEventListener('click', () => {
  for (const position of positions.values()) position.pinned = false;
  alpha = 1;
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

// Premier rendu : libellés, dimensions, données et panneau.
filtersCollapsed = isCompactLayout();
applyLabels();
resize();
rebuild();
renderFilters();
renderPanel();

// Lien direct pour ouvrir un contenu précis : ?select=project:these
const params = new URLSearchParams(window.location.search);
const initialId = params.get('select');
if (initialId && byId.has(initialId)) {
  const initialNode = byId.get(initialId);
  visibleKinds.add(initialNode.kind);
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
