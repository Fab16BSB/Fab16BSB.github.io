/* =======================================================================
  GRAPPES : affectation et placement
  Regroupe les contenus par section ou par thème, sans simulation.
====================================================================== */

// --- CACHE DES THÈMES -------------------------------------------------------

// Cache des contenus par thème, rempli une seule fois sur tout le graphe.
const themeMemberCountsCache = new Map();

/**
 * Compte les contenus par thème, indépendamment des filtres.
 *
 * @returns {Map<string, number>} Nombre de contenus par identifiant de thème.
 */
function themeMemberCounts() {
  if (themeMemberCountsCache.size > 0) return themeMemberCountsCache;

  // Remplit le cache au premier appel, puis le réutilise tel quel.
  for (const node of DATA.nodes) {
    if (node.kind === 'theme' || node.kind === 'concept') continue;
    for (const themeId of node.themes) {
      const current = themeMemberCountsCache.get(themeId) || 0;
      themeMemberCountsCache.set(themeId, current + 1);
    }
  }

  return themeMemberCountsCache;
}

// --- AFFECTATION ------------------------------------------------------------

/**
 * Retourne le thème le plus spécifique d'un contenu.
 *
 * Le thème le moins fréquent du nœud est le plus discriminant : il évite
 * d'écraser toutes les grappes dans « Apprentissage automatique ».
 *
 * @param {object} node - Nœud de contenu.
 * @returns {string | null} Identifiant du thème, ou `null` sans thème.
 */
function mostSpecificTheme(node) {
  const counts = themeMemberCounts();
  let best = null;
  let bestCount = Infinity;

  // Garde le thème le plus rare, donc le plus discriminant.
  for (const themeId of node.themes) {
    const count = counts.get(themeId) || 0;
    if (count < bestCount) {
      best = themeId;
      bestCount = count;
    }
  }

  return best;
}

/**
 * Retourne la clé de grappe d'un contenu.
 *
 * @param {object} node - Nœud de contenu.
 * @returns {string} Type en mode Sections, thème en mode Thèmes.
 */
function clusterKeyOf(node) {
  if (layoutMode === 'themes') {
    return mostSpecificTheme(node) || OTHER_CLUSTER_ID;
  }
  return displayKind(node);
}

/**
 * Retourne le libellé localisé d'une grappe.
 *
 * @param {string} key - Clé de grappe.
 * @returns {string} Libellé dans la langue courante.
 */
function clusterLabel(key) {
  if (layoutMode !== 'themes') return kindLabel(key);
  if (key === OTHER_CLUSTER_ID) return UI[lang].layoutOther;
  return themeLabel(key);
}

/**
 * Retourne la couleur d'une grappe.
 *
 * Les sections reprennent la couleur de leur type ; les thèmes reçoivent une
 * teinte stable dérivée de leur identifiant.
 *
 * @param {string} key - Clé de grappe.
 * @returns {string} Couleur CSS.
 */
function clusterColor(key) {
  if (layoutMode !== 'themes') return kindColor(key);

  // Teinte stable dérivée de la clé, pour distinguer les thèmes.
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) % 360;
  }
  return 'hsl(' + hash + ', 68%, 62%)';
}

// --- REGROUPEMENT -----------------------------------------------------------

/**
 * Regroupe les nœuds visibles par grappe.
 *
 * @returns {Map<string, { key: string, entries: object[], center: { x: number, y: number }, radius: number }>} Grappes indexées par clé.
 */
function collectClusters() {
  const groups = new Map();

  for (const entry of nodes) {
    const key = clusterKeyOf(entry.node);

    // Crée la grappe à la première occurrence de sa clé.
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        entries: [],
        center: { x: 0, y: 0 },
        radius: 0,
      });
    }
    groups.get(key).entries.push(entry);
  }

  return groups;
}

/**
 * Retourne le rayon d'une grappe, en unités monde.
 *
 * @param {object} group - Grappe à mesurer.
 * @returns {number} Rayon couvrant la spirale et la taille des nœuds.
 */
function clusterRadius(group) {
  const { spiralStep, minRadius, nodeMargin } = CLUSTER_LAYOUT;
  const spiral = spiralStep * Math.sqrt(group.entries.length);
  return Math.max(minRadius, spiral + nodeMargin);
}

/**
 * Ordonne les grappes pour un placement stable.
 *
 * @param {object[]} groups - Grappes à ordonner.
 * @returns {object[]} Grappes dans l'ordre des filtres ou par effectif.
 */
function clusterOrder(groups) {
  return groups.sort((left, right) => {
    // Sections : ordre des filtres. Thèmes : effectif puis libellé.
    if (layoutMode !== 'themes') {
      return CONTENT_KINDS.indexOf(left.key) - CONTENT_KINDS.indexOf(right.key);
    }
    if (left.entries.length !== right.entries.length) {
      return right.entries.length - left.entries.length;
    }
    return clusterLabel(left.key).localeCompare(clusterLabel(right.key));
  });
}

/**
 * Choisit un nombre de colonnes adapté à la largeur de la scène.
 *
 * @param {number} count - Nombre de grappes.
 * @returns {number} Nombre de colonnes, au moins une.
 */
function clusterColumns(count) {
  const { columnCompact, columnDesktop } = CLUSTER_LAYOUT;
  const minWidth = isCompactLayout() ? columnCompact : columnDesktop;

  // Ne dépasse pas la largeur de la scène.
  const byWidth = Math.max(1, Math.floor(stage.clientWidth / minWidth));
  return Math.max(1, Math.min(Math.ceil(Math.sqrt(count)), byWidth));
}

// --- PLACEMENT --------------------------------------------------------------

/**
 * Répartit les contenus d'une grappe en spirale à angle d'or.
 *
 * @param {object} group - Grappe dont le centre est déjà placé.
 * @returns {void}
 */
function placeClusterMembers(group) {
  const { spiralStep } = CLUSTER_LAYOUT;

  group.entries.forEach((entry, index) => {
    // Angle d'or : évite les alignements réguliers.
    const angle = index * 2.399963;
    const radius = index === 0 ? 0 : spiralStep * Math.sqrt(index);

    entry.position.x = group.center.x + Math.cos(angle) * radius;
    entry.position.y = group.center.y + Math.sin(angle) * radius;
    entry.position.vx = 0;
    entry.position.vy = 0;
    entry.position.pinned = false;
  });
}

/**
 * Place les grappes en grille et leurs contenus en spirale.
 *
 * Le placement est statique et déterministe : aucune simulation n'est lancée.
 *
 * @returns {void}
 */
function seedClusterLayout() {
  const { minRadius, cellGap, cellAspect } = CLUSTER_LAYOUT;
  const groups = clusterOrder([...collectClusters().values()]);
  const maxRadius = groups.reduce(
    (radius, group) => Math.max(radius, clusterRadius(group)),
    minRadius,
  );

  // Cellule assez grande pour le plus gros halo.
  const cellY = maxRadius * 2 + cellGap;
  const cellX = cellY * cellAspect;
  const cols = clusterColumns(groups.length);
  const rows = Math.ceil(groups.length / cols);
  const offsetX = ((cols - 1) * cellX) / 2;
  const offsetY = ((rows - 1) * cellY) / 2;

  // Grille centrée, puis spirale dans chaque cellule.
  groups.forEach((group, index) => {
    group.center.x = (index % cols) * cellX - offsetX;
    group.center.y = Math.floor(index / cols) * cellY - offsetY;
    group.radius = clusterRadius(group);
    placeClusterMembers(group);
  });

  clusterCellX = cellX;
  clusters = groups;
}
