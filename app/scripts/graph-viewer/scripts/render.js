/* =======================================================================
  RENDU
======================================================================= */

// Dimensions, texte et priorités des étiquettes.
const LABEL_FONT_SIZE = 11;
const LABEL_PADDING = 3;
const LABEL_MAX_LENGTH = 38;
const LABEL_FONT_FAMILY = '"Segoe UI", system-ui, sans-serif';
const LABEL_PRIORITIES = {
  project: 0,
  theme: 1,
  publication: 2,
  teaching: 3,
  article: 4,
};

/**
 * Indique si une arête touche un nœud donné.
 *
 * @param {{ from: string, to: string }} edge - Arête du graphe.
 * @param {string} id - Identifiant du nœud.
 * @returns {boolean} `true` si l'arête touche le nœud.
 */
function isConnected(edge, id) {
  return edge.from === id || edge.to === id;
}

/**
 * Retourne l'ensemble des identifiants voisins d'un nœud.
 *
 * @param {string} id - Identifiant du nœud.
 * @returns {Set<string>} Identifiants des nœuds reliés.
 */
function neighborsOf(id) {
  const ids = new Set();
  for (const edge of edges) {
    if (edge.from === id) ids.add(edge.to);
    if (edge.to === id) ids.add(edge.from);
  }
  return ids;
}

/**
 * Dessine les arêtes, les nœuds et les étiquettes du graphe.
 */
function draw() {
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  const palette = canvasPalette();
  const focusId = hoverId || selectedId;
  const highlighted = focusId ? neighborsOf(focusId) : new Set();

  // Efface le canvas avant de redessiner la scène.
  ctx.clearRect(0, 0, width, height);

  // Applique la transformation monde vers écran.
  ctx.save();
  ctx.translate(view.x, view.y);
  ctx.scale(view.scale, view.scale);

  drawEdges(focusId, palette);
  drawNodes(highlighted, palette);
  if (showLabels) drawLabels(palette);

  ctx.restore();
}

/**
 * Dessine les arêtes visibles et remet le style de ligne à zéro.
 *
 * @param {string | null} focusId - Nœud survolé ou sélectionné.
 * @param {object} palette - Couleurs du canvas.
 */
function drawEdges(focusId, palette) {
  for (const edge of edges) {
    const source = positions.get(edge.from);
    const target = positions.get(edge.to);
    if (source && target) {
      drawEdge(edge, source, target, focusId, palette);
    }
  }
  ctx.setLineDash([]);
}

/**
 * Dessine une arête avec son style et son opacité.
 *
 * @param {object} edge - Arête à dessiner.
 * @param {{ x: number, y: number }} source - Position de départ.
 * @param {{ x: number, y: number }} target - Position d'arrivée.
 * @param {string | null} focusId - Nœud survolé ou sélectionné.
 * @param {object} palette - Couleurs du canvas.
 */
function drawEdge(edge, source, target, focusId, palette) {
  const active = focusId ? isConnected(edge, focusId) : false;
  const baseAlpha = edgeBaseAlpha(edge);

  ctx.beginPath();
  ctx.moveTo(source.x, source.y);
  ctx.lineTo(target.x, target.y);
  ctx.strokeStyle = active
    ? palette.activeEdge
    : edgeStrokeStyle(edge, baseAlpha, palette);
  ctx.lineWidth = edgeLineWidth(edge);
  ctx.setLineDash(edge.relation === 'context' ? [5 / view.scale, 4 / view.scale] : []);
  ctx.stroke();
}

/**
 * Retourne l'opacité de base d'une arête selon sa relation.
 *
 * @param {object} edge - Arête du graphe.
 * @returns {number} Opacité entre 0 et 1.
 */
function edgeBaseAlpha(edge) {
  let alpha = 0.06;
  if (edge.relation === 'related') alpha = 0.1 + (edge.score || 0) * 0.32;
  else if (edge.relation === 'context') alpha = 0.35;
  else if (edge.relation === 'has-theme') alpha = 0.14;
  return alpha;
}

/**
 * Retourne la couleur d'une arête non active.
 *
 * @param {object} edge - Arête du graphe.
 * @param {number} alpha - Opacité de base.
 * @param {object} palette - Couleurs du canvas.
 * @returns {string} Couleur CSS.
 */
function edgeStrokeStyle(edge, alpha, palette) {
  return edge.relation === 'context'
    ? palette.contextEdge(alpha)
    : palette.relatedEdge(alpha);
}

/**
 * Retourne l'épaisseur d'une arête adaptée au zoom.
 *
 * @param {object} edge - Arête du graphe.
 * @returns {number} Épaisseur en pixels écran.
 */
function edgeLineWidth(edge) {
  let width = 0.8;
  if (edge.relation === 'related') width = 1.2 + (edge.score || 0) * 2;
  else if (edge.relation === 'context') width = 1.2;
  return width / view.scale;
}

/**
 * Dessine tous les nœuds visibles.
 *
 * @param {Set<string>} highlighted - Voisins du nœud focus.
 * @param {object} palette - Couleurs du canvas.
 */
function drawNodes(highlighted, palette) {
  for (const entry of nodes) {
    drawNode(entry, highlighted, palette);
  }
}

/**
 * Dessine un nœud, son anneau de focus et son anneau de thème.
 *
 * @param {{ node: object, position: { x: number, y: number } }} entry - Nœud à dessiner.
 * @param {Set<string>} highlighted - Voisins du nœud focus.
 * @param {object} palette - Couleurs du canvas.
 */
function drawNode(entry, highlighted, palette) {
  const node = entry.node;
  const position = entry.position;
  const radius = nodeRadius(node.kind);
  const focused = node.id === selectedId || node.id === hoverId;
  const connected = highlighted.has(node.id);
  const matched = matchIds.has(node.id);

  if (matched || focused || connected) {
    drawFocusRing(position, radius, matched, palette);
  }

  ctx.beginPath();
  ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = kindColor(node.kind);
  ctx.globalAlpha = focused || connected || matched ? 1 : 0.88;
  ctx.fill();
  ctx.globalAlpha = 1;

  if (node.kind === 'theme') {
    drawThemeRing(position, radius, palette);
  }
}

/**
 * Dessine l'anneau de mise en avant d'un nœud.
 *
 * @param {{ x: number, y: number }} position - Position du nœud.
 * @param {number} radius - Rayon du nœud.
 * @param {boolean} matched - Nœud trouvé par la recherche.
 * @param {object} palette - Couleurs du canvas.
 */
function drawFocusRing(position, radius, matched, palette) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius + 5 / view.scale, 0, Math.PI * 2);
  ctx.strokeStyle = matched ? palette.matchRing : palette.focusRing;
  ctx.lineWidth = 1.4 / view.scale;
  ctx.stroke();
}

/**
 * Dessine l'anneau supplémentaire d'un thème.
 *
 * @param {{ x: number, y: number }} position - Position du nœud.
 * @param {number} radius - Rayon du nœud.
 * @param {object} palette - Couleurs du canvas.
 */
function drawThemeRing(position, radius, palette) {
  ctx.beginPath();
  ctx.arc(position.x, position.y, radius + 3 / view.scale, 0, Math.PI * 2);
  ctx.strokeStyle = palette.themeRing;
  ctx.lineWidth = 1 / view.scale;
  ctx.stroke();
}

/**
 * Dessine les étiquettes visibles sans chevauchement.
 *
 * @param {object} palette - Couleurs du canvas.
 */
function drawLabels(palette) {
  const labelEntries = nodes
    .filter((entry) => isLabelVisible(entry.node))
    .sort((left, right) => labelPriority(left.node) - labelPriority(right.node));

  const size = LABEL_FONT_SIZE / view.scale;
  const padding = LABEL_PADDING / view.scale;
  const centerWorldX = (stage.clientWidth / 2 - view.x) / view.scale;
  const layout = { size, padding, centerWorldX, placed: [] };

  ctx.textBaseline = 'middle';
  ctx.font = size + 'px ' + LABEL_FONT_FAMILY;

  for (const entry of labelEntries) {
    drawLabel(entry, palette, layout);
  }
}

/**
 * Retourne la priorité de placement d'une étiquette.
 *
 * @param {object} node - Nœud à évaluer.
 * @returns {number} Priorité, la plus petite étant affichée en premier.
 */
function labelPriority(node) {
  let priority = LABEL_PRIORITIES[node.kind] ?? 5;
  if (node.id === selectedId) priority = -2;
  else if (node.id === hoverId) priority = -1;
  return priority;
}

/**
 * Indique si l'étiquette d'un nœud est visible au zoom courant.
 *
 * @param {object} node - Nœud à évaluer.
 * @returns {boolean} `true` si l'étiquette peut être affichée.
 */
function isLabelVisible(node) {
  let visible = view.scale >= 1.1;
  if (node.id === selectedId || node.id === hoverId) visible = true;
  else if (node.kind === 'theme' || node.kind === 'project') visible = true;
  else if (node.kind === 'publication') visible = view.scale >= 0.9;
  else if (node.kind === 'concept') visible = view.scale >= 1.5;
  return visible;
}

/**
 * Dessine une étiquette si elle ne chevauche pas les précédentes.
 *
 * @param {{ node: object, position: { x: number, y: number } }} entry - Nœud de l'étiquette.
 * @param {object} palette - Couleurs du canvas.
 * @param {{ size: number, padding: number, centerWorldX: number, placed: object[] }} layout - Contexte de placement.
 */
function drawLabel(entry, palette, layout) {
  const node = entry.node;
  const position = entry.position;
  const text = truncateLabel(labelOf(node));
  const rect = labelRect(position, node.kind, text, layout);

  if (!labelsOverlap(rect, layout.placed)) {
    layout.placed.push(rect);
    fillLabelBackground(rect, palette);
    ctx.fillStyle = node.kind === 'theme' ? palette.themeLabel : palette.labelText;
    ctx.fillText(text, rect.x1 + layout.padding, position.y);
  }
}

/**
 * Tronque un libellé trop long pour limiter l'encombrement.
 *
 * @param {string} text - Libellé complet.
 * @returns {string} Libellé tronqué.
 */
function truncateLabel(text) {
  return text.length > LABEL_MAX_LENGTH
    ? text.slice(0, LABEL_MAX_LENGTH - 1).trimEnd() + '…'
    : text;
}

/**
 * Calcule le rectangle d'une étiquette autour de son nœud.
 *
 * @param {{ x: number, y: number }} position - Position du nœud.
 * @param {string} kind - Type du nœud.
 * @param {string} text - Libellé affiché.
 * @param {{ size: number, padding: number, centerWorldX: number }} layout - Contexte de placement.
 * @returns {{ x1: number, y1: number, x2: number, y2: number }} Rectangle de l'étiquette.
 */
function labelRect(position, kind, text, layout) {
  const offset = nodeRadius(kind) + LABEL_PADDING / view.scale;
  const width = ctx.measureText(text).width;
  const startsAt = position.x > layout.centerWorldX
    ? position.x - offset - width - layout.padding * 2
    : position.x + offset;

  return {
    x1: startsAt,
    y1: position.y - layout.size / 2 - layout.padding,
    x2: startsAt + width + layout.padding * 2,
    y2: position.y + layout.size / 2 + layout.padding,
  };
}

/**
 * Indique si un rectangle chevauche une étiquette déjà placée.
 *
 * @param {{ x1: number, y1: number, x2: number, y2: number }} rect - Rectangle à tester.
 * @param {{ x1: number, y1: number, x2: number, y2: number }[]} placed - Rectangles déjà placés.
 * @returns {boolean} `true` en cas de chevauchement.
 */
function labelsOverlap(rect, placed) {
  return placed.some(
    (other) =>
      rect.x1 < other.x2 &&
      rect.x2 > other.x1 &&
      rect.y1 < other.y2 &&
      rect.y2 > other.y1,
  );
}

/**
 * Dessine le fond translucide d'une étiquette.
 *
 * @param {{ x1: number, y1: number, x2: number, y2: number }} rect - Rectangle de l'étiquette.
 * @param {object} palette - Couleurs du canvas.
 */
function fillLabelBackground(rect, palette) {
  ctx.fillStyle = palette.labelBackground;
  ctx.fillRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
}
