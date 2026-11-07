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
 * @param {number} [extraSlop=0] - Tolérance supplémentaire, en pixels écran.
 * @returns {{ node: object, position: { x: number, y: number } } | null} Entrée de nœud, ou `null`.
 */
function nodeAt(screenPoint, extraSlop = 0) {
  const world = screenToWorld(screenPoint);
  let closest = null;
  let closestDistance = Infinity;
  for (const entry of nodes) {
    const radius = nodeRadius(entry.node.kind) + (NODE_HIT_SLOP + extraSlop) / view.scale;
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
 * Sur mobile, la feuille ouverte masque le bas de la scène : le nœud est
 * centré dans la bande restée visible.
 *
 * @param {string} id - Identifiant du nœud.
 * @returns {void}
 */
function focusNode(id) {
  const position = positions.get(id);
  if (!position) return;

  view.scale = Math.max(view.scale, 1);
  const covered = isSheetLayout() ? stage.clientHeight * SHEET_OPEN_RATIO : 0;
  const centerY = Math.max(
    stage.clientHeight * 0.2,
    (stage.clientHeight - covered) / 2,
  );
  view.x = stage.clientWidth / 2 - position.x * view.scale;
  view.y = centerY - position.y * view.scale;
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

/**
 * Retourne le milieu et l'écart des deux premiers pointeurs actifs.
 *
 * @returns {{ midX: number, midY: number, distance: number }} Mesures du pincement.
 */
function pinchMetrics() {
  const [first, second] = [...pointers.values()];
  return {
    midX: (first.x + second.x) / 2,
    midY: (first.y + second.y) / 2,
    distance: Math.hypot(second.x - first.x, second.y - first.y),
  };
}

/**
 * Démarre un pincement à deux doigts.
 *
 * Mémorise l'échelle et le point monde sous le milieu pour que le zoom reste
 * centré sur les doigts, même si le milieu se déplace.
 *
 * @returns {void}
 */
function startPinch() {
  const metrics = pinchMetrics();
  const world = screenToWorld({ x: metrics.midX, y: metrics.midY });

  // Un premier doigt posé sur un nœud ne doit pas l'épingler par accident.
  if (drag.mode === 'node' && drag.nodeId && !drag.moved) {
    const position = positions.get(drag.nodeId);
    if (position) position.pinned = false;
  }

  pinch.active = true;
  pinch.distance = Math.max(metrics.distance, 1);
  pinch.scale = view.scale;
  pinch.worldX = world.x;
  pinch.worldY = world.y;
  drag.mode = null;
  drag.nodeId = null;
  drag.moved = false;
  canvas.classList.remove('dragging');
}

/**
 * Borne l'échelle de zoom aux valeurs autorisées.
 *
 * @param {number} scale - Échelle demandée.
 * @returns {number} Échelle comprise entre `ZOOM_MIN` et `ZOOM_MAX`.
 */
function clampScale(scale) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, scale));
}

/**
 * Applique le pincement courant : zoom et déplacement autour du milieu.
 *
 * @returns {void}
 */
function updatePinch() {
  if (!pinch.active) return;
  const metrics = pinchMetrics();
  const nextScale = clampScale(pinch.scale * (metrics.distance / pinch.distance));
  view.scale = nextScale;
  view.x = metrics.midX - pinch.worldX * nextScale;
  view.y = metrics.midY - pinch.worldY * nextScale;
}

// Saisie d'un nœud pour l'épingler ou du fond pour déplacer la vue.
canvas.addEventListener('pointerdown', (event) => {
  const point = pointerPosition(event);
  pointers.set(event.pointerId, point);
  canvas.setPointerCapture(event.pointerId);

  // Deux doigts : bascule en pincement et abandonne le glisser en cours.
  if (pointers.size === 2) {
    startPinch();
    return;
  }
  if (pointers.size > 2) return;

  const entry = nodeAt(point, event.pointerType === 'touch' ? TOUCH_HIT_SLOP : 0);
  followId = null;
  drag.moved = false;

  // Un nœud saisi est épinglé immédiatement.
  if (entry) {
    drag.mode = 'node';
    drag.nodeId = entry.node.id;
    entry.position.pinned = true;
  } else {
    // Sinon, mémorise l'origine du déplacement de la vue.
    drag.mode = 'pan';
    drag.startX = point.x - view.x;
    drag.startY = point.y - view.y;
    canvas.classList.add('dragging');
  }
});

// Déplacement du nœud saisi, panoramique du fond ou pincement tactile.
canvas.addEventListener('pointermove', (event) => {
  const point = pointerPosition(event);
  if (pointers.has(event.pointerId)) pointers.set(event.pointerId, point);

  // Pincement : le zoom et le panoramique suivent les deux doigts.
  if (pinch.active) {
    updatePinch();
    return;
  }

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
  pointers.delete(event.pointerId);

  // Fin du pincement : le doigt restant reprend le panoramique sans saut.
  if (pinch.active) {
    if (pointers.size < 2) {
      pinch.active = false;
      const remaining = pointers.values().next().value;
      if (remaining) {
        drag.mode = 'pan';
        drag.nodeId = null;
        drag.startX = remaining.x - view.x;
        drag.startY = remaining.y - view.y;
        drag.moved = true;
        canvas.classList.add('dragging');
      }
    }
    if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
    return;
  }

  if (drag.mode === 'node' && !drag.moved) selectNode(drag.nodeId);
  drag.mode = null;
  drag.nodeId = null;
  drag.moved = false;
  canvas.classList.remove('dragging');
  if (canvas.hasPointerCapture(event.pointerId)) canvas.releasePointerCapture(event.pointerId);
});

// Annulation système : oublie le pointeur et le pincement en cours.
canvas.addEventListener('pointercancel', (event) => {
  pointers.delete(event.pointerId);
  if (pointers.size < 2) pinch.active = false;
  drag.mode = null;
  drag.nodeId = null;
  drag.moved = false;
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

/**
 * Zoome autour du centre de la scène, pour les boutons tactiles.
 *
 * @param {number} factor - Facteur appliqué à l'échelle courante.
 * @returns {void}
 */
function zoomBy(factor) {
  const center = { x: stage.clientWidth / 2, y: stage.clientHeight / 2 };
  const world = screenToWorld(center);
  const nextScale = clampScale(view.scale * factor);
  followId = null;
  view.scale = nextScale;
  view.x = center.x - world.x * nextScale;
  view.y = center.y - world.y * nextScale;
}

// Molette : zoom centré sur le pointeur, dans les bornes autorisées.
canvas.addEventListener('wheel', (event) => {
  event.preventDefault();
  followId = null;
  const point = pointerPosition(event);
  const world = screenToWorld(point);
  const nextScale = clampScale(view.scale * (event.deltaY < 0 ? 1.12 : 0.89));
  view.scale = nextScale;
  view.x = point.x - world.x * nextScale;
  view.y = point.y - world.y * nextScale;
}, { passive: false });
