/* =======================================================================
  INTERACTIONS
======================================================================= */
/**
 * Convertit un événement pointeur en coordonnées locales au canvas.
 *
 * @param {PointerEvent} event - Événement pointeur.
 * @returns {{ x: number, y: number }} Position dans le canvas.
 */
function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

/**
 * Retourne le nœud le plus proche d'un point écran, dans son rayon de clic.
 *
 * @param {{ x: number, y: number }} screenPoint - Point écran.
 * @returns {{ node: object, position: { x: number, y: number } } | null} Entrée de nœud, ou `null`.
 */
function nodeAt(screenPoint) {
  const world = screenToWorld(screenPoint);
  let closest = null;
  let closestDistance = Infinity;
  for (const entry of nodes) {
    const radius = ((KIND_RADIUS[entry.node.kind] || 5) / Math.sqrt(view.scale)) + 4 / view.scale;
    const dx = entry.position.x - world.x;
    const dy = entry.position.y - world.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= radius && distance < closestDistance) {
      closest = entry;
      closestDistance = distance;
    }
  }
  return closest;
}

/**
 * Met à jour l'infobulle au survol d'un nœud.
 *
 * @param {PointerEvent} event - Événement pointeur.
 * @param {{ node: object, position: { x: number, y: number } } | null} entry - Nœud survolé.
 */
function updateTooltip(event, entry) {
  if (entry) {
    const node = entry.node;
    tooltip.textContent = labelOf(node);

    const small = document.createElement('small');
    small.textContent = kindLabel(node.kind) + (node.year ? ' · ' + node.year : '');
    tooltip.appendChild(small);

    tooltip.style.left = event.clientX - canvas.getBoundingClientRect().left + 'px';
    tooltip.style.top = event.clientY - canvas.getBoundingClientRect().top + 'px';
    tooltip.classList.add('visible');
  } 

  // Hors nœud, masque l'infobulle.
  else {
    tooltip.classList.remove('visible');
  }
}

/**
 * Centre la vue sur un nœud sans réduire le zoom courant.
 *
 * @param {string} id - Identifiant du nœud.
 * @returns {void}
 */
function focusNode(id) {
  const position = positions.get(id);
  if (position) {
    view.scale = Math.max(view.scale, 1);
    view.x = stage.clientWidth / 2 - position.x * view.scale;
    view.y = stage.clientHeight / 2 - position.y * view.scale;
  }
}

/**
 * Sélectionne un nœud, ouvre le panneau et centre la vue.
 *
 * @param {string} id - Identifiant du nœud.
 * @returns {void}
 */
function selectNode(id) {
  selectedId = id;
  followId = id;
  renderPanel();
  if (isSheetLayout()) setSheetOpen(true);
  focusNode(id);
}

// Saisie d'un nœud pour l'épingler ou du fond pour déplacer la vue.
canvas.addEventListener('pointerdown', (event) => {
  const point = pointerPosition(event);
  const entry = nodeAt(point);
  followId = null;
  drag.moved = false;

  // Un nœud saisi est épinglé immédiatement.
  if (entry) {
    drag.mode = 'node';
    drag.nodeId = entry.node.id;
    entry.position.pinned = true;
    canvas.setPointerCapture(event.pointerId);
  } else {
    // Sinon, mémorise l'origine du déplacement de la vue.
    drag.mode = 'pan';
    drag.startX = point.x - view.x;
    drag.startY = point.y - view.y;
    canvas.classList.add('dragging');
    canvas.setPointerCapture(event.pointerId);
  }
});

// Déplacement du nœud saisi ou panoramique du fond.
canvas.addEventListener('pointermove', (event) => {
  const point = pointerPosition(event);

  if (drag.mode === 'node') {
    // Le nœud suit le pointeur et relance légèrement la simulation.
    drag.moved = true;
    const world = screenToWorld(point);
    const position = positions.get(drag.nodeId);
    position.x = world.x;
    position.y = world.y;
    position.vx = 0;
    position.vy = 0;
    alpha = Math.max(alpha, 0.25);
  } else if (drag.mode === 'pan') {
    // Le fond suit le pointeur.
    drag.moved = true;
    view.x = point.x - drag.startX;
    view.y = point.y - drag.startY;
  } else {
    // Hors saisie, met à jour le survol, l'infobulle et le curseur.
    const entry = nodeAt(point);
    hoverId = entry ? entry.node.id : null;
    updateTooltip(event, entry);
    canvas.style.cursor = entry ? 'pointer' : 'grab';
  }
});

// Fin de saisie : un clic sans déplacement sélectionne le nœud.
canvas.addEventListener('pointerup', (event) => {
  if (drag.mode === 'node' && !drag.moved) selectNode(drag.nodeId);
  drag.mode = null;
  drag.nodeId = null;
  canvas.classList.remove('dragging');
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

// Sortie du canvas : efface le survol et l'infobulle.
canvas.addEventListener('pointerleave', () => {
  hoverId = null;
  tooltip.classList.remove('visible');
});

// Double-clic : libère un nœud épinglé.
canvas.addEventListener('dblclick', (event) => {
  const entry = nodeAt(pointerPosition(event));
  if (entry) {
    entry.position.pinned = false;
    alpha = 1;
  }
});

// Molette : zoom centré sur le pointeur, dans les bornes autorisées.
canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  followId = null;
  const point = pointerPosition(event);
  const world = screenToWorld(point);
  const nextScale = Math.min(3, Math.max(0.18, view.scale * (event.deltaY < 0 ? 1.12 : 0.89)));
  view.scale = nextScale;
  view.x = point.x - world.x * nextScale;
  view.y = point.y - world.y * nextScale;
}, { passive: false });
