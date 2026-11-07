/* =======================================================================
  CONSTRUCTION DE LA VUE
======================================================================= */
/** Place les thèmes en cercle et accroche chaque contenu à ses thèmes. */
function seedLayout() {
  const themeEntries = nodes.filter((entry) => entry.node.kind === 'theme');
  const radius = 320;

  // Répartit les thèmes sur un cercle et les fixe.
  themeEntries.forEach((entry, index) => {
    const angle = (index / Math.max(1, themeEntries.length)) * Math.PI * 2 - Math.PI / 2;
    entry.position.x = Math.cos(angle) * radius;
    entry.position.y = Math.sin(angle) * radius;
    entry.position.vx = 0;
    entry.position.vy = 0;
    entry.position.pinned = true;
  });

  let freeIndex = 0;
  for (const entry of nodes) {
    if (entry.node.kind === 'theme') continue;

    const anchors = entry.node.themes
      .map((theme) => positions.get('theme:' + theme))
      .filter(Boolean);

    // Angle d'or et jitter pour éviter les alignements réguliers.
    const angle = freeIndex * 2.399963;
    const jitter = 26 + (freeIndex % 5) * 9;

    // Accroche le contenu à la moyenne pondérée de ses thèmes.
    if (anchors.length > 0) {
      let x = anchors[0].x * 0.7;
      let y = anchors[0].y * 0.7;
      const rest = anchors.slice(1);
      for (const anchor of rest) {
        x += (anchor.x * 0.3) / rest.length;
        y += (anchor.y * 0.3) / rest.length;
      }
      entry.position.x = x + Math.cos(angle) * jitter;
      entry.position.y = y + Math.sin(angle) * jitter;
    } 

    // Sans thème, répartit le nœud sur une spirale intérieure.
    else {
      const innerRadius = 120 + (freeIndex % 6) * 24;
      entry.position.x = Math.cos(angle) * innerRadius;
      entry.position.y = Math.sin(angle) * innerRadius;
    }

    entry.position.vx = 0;
    entry.position.vy = 0;
    entry.position.pinned = false;
    freeIndex += 1;
  }
}

/**
 * Reconstruit les nœuds et arêtes visibles puis stabilise la simulation.
 *
 * @returns {void}
 */
function rebuild() {
  const visibleIds = new Set();
  nodes = [];

  // Ne conserve que les nœuds visibles et leurs positions mémorisées.
  for (const node of DATA.nodes) {
    if (!isVisible(node)) continue;
    visibleIds.add(node.id);
    nodes.push({ node, position: positionOf(node.id) });
  }

  // Ne garde que les arêtes dont les deux extrémités sont visibles.
  edges = DATA.edges.filter((edge) => {
    if (!visibleIds.has(edge.from) || !visibleIds.has(edge.to)) return false;
    if (edge.relation === 'uses-term' && !showConcepts) return false;
    return true;
  });

  // Stabilise la simulation avant le premier rendu pour une vue immobile.
  seedLayout();
  alpha = 1;
  for (let step = 0; step < 260; step += 1) tick();
  alpha = 0.02;
  fitView();
}

/**
 * Recadre la vue sur l'ensemble des nœuds visibles.
 *
 * @returns {void}
 */
function fitView() {
  if (nodes.length === 0) return;

  // Bornes du graphe sur chaque axe.
  const xs = nodes.map((entry) => entry.position.x).sort((left, right) => left - right);
  const ys = nodes.map((entry) => entry.position.y).sort((left, right) => left - right);

  const minX = xs[0];
  const maxX = xs[xs.length - 1];
  const minY = ys[0];
  const maxY = ys[ys.length - 1];

  const width = Math.max(1, maxX - minX);
  const height = Math.max(1, maxY - minY);
  const compact = stage.clientWidth < 900;

  // Marge réduite sur les petits écrans.
  const padding = compact
    ? { left: 40, right: 40, top: 40, bottom: 40 }
    : { left: 70, right: 70, top: 70, bottom: 70 };
  const availableWidth = Math.max(1, stage.clientWidth - padding.left - padding.right);
  const availableHeight = Math.max(1, stage.clientHeight - padding.top - padding.bottom);

  // Échelle limitée pour éviter un zoom excessif sur un petit graphe.
  const scale = Math.min(availableWidth / width, availableHeight / height, 1.5);

  // Centre le graphe dans la zone disponible.
  view.scale = Math.max(0.16, scale);
  view.x = padding.left + availableWidth / 2 - ((minX + maxX) / 2) * view.scale;
  view.y = padding.top + availableHeight / 2 - ((minY + maxY) / 2) * view.scale;
}

/**
 * Compte les contenus, thèmes, concepts et relations visibles.
 *
 * @returns {{ contents: number, themes: number, concepts: number, relations: number }} Compteurs du panneau.
 */
function counts() {
  // Les contenus excluent les thèmes et les concepts.
  const visibleContents = nodes.filter(
    (entry) => entry.node.kind !== 'theme' && entry.node.kind !== 'concept',
  );
  return {
    contents: visibleContents.length,
    themes: DATA.nodes.filter((node) => node.kind === 'theme').length,
    concepts: DATA.nodes.filter((node) => node.kind === 'concept').length,
    relations: edges.filter((edge) => edge.relation === 'related').length,
  };
}
