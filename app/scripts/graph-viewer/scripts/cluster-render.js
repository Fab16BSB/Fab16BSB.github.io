/* =======================================================================
  GRAPPES : rendu des halos et des en-têtes
  Pastilles et compteurs dessinés au-dessus de chaque grappe.
====================================================================== */

// --- HALOS ------------------------------------------------------------------

/**
 * Dessine les halos des grappes.
 *
 * @param {object} palette - Couleurs du canvas.
 */
function drawClusters(palette) {
  for (const group of clusters) {
    ctx.beginPath();
    ctx.arc(group.center.x, group.center.y, group.radius, 0, Math.PI * 2);

    // Remplissage très léger, teinté par la grappe.
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = clusterColor(group.key);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = palette.clusterStroke;
    ctx.lineWidth = 1 / view.scale;
    ctx.stroke();
  }
}

// --- EN-TÊTES ---------------------------------------------------------------

/**
 * Dessine l'en-tête de chaque grappe : pastille de couleur, nom et effectif.
 *
 * L'en-tête reprend le langage des puces de filtre : fond arrondi, point de
 * couleur et badge de compteur. Il reste au-dessus du halo, sur une ligne.
 *
 * @param {object} palette - Couleurs du canvas.
 * @param {{ size: number, padding: number, placed: object[] }} layout - Contexte de placement.
 */
function drawClusterLabels(palette, layout) {
  const style = clusterTitleStyle(isCompactLayout(), layout.size);
  const previousFont = ctx.font;
  const previousAlign = ctx.textAlign;
  const spacingScreen = clusterCellX * view.scale;

  for (const group of clusters) {
    const metrics = measureClusterLabel(group, style, spacingScreen);

    // Réserve la place de l'en-tête avant les étiquettes des nœuds.
    layout.placed.push(metrics.rect);
    drawClusterLabel(metrics, style, palette);
  }

  ctx.textAlign = previousAlign;
  ctx.font = previousFont;
}

// --- MESURES ----------------------------------------------------------------

/**
 * Construit les tailles et marges d'un en-tête de grappe.
 *
 * @param {boolean} compact - Disposition mobile.
 * @param {number} layoutSize - Taille de police de base en unités monde.
 * @returns {object} Tailles et marges de l'en-tête.
 */
function clusterTitleStyle(compact, layoutSize) {
  const nameSize = layoutSize * (compact ? 0.78 : 0.95);

  return {
    nameSize,
    countSize: nameSize * 0.82,
    padX: (compact ? 6 : 8) / view.scale,
    dotRadius: (compact ? 3 : 3.5) / view.scale,
    gap: 5 / view.scale,
    height: nameSize + (compact ? 9 : 12) / view.scale,
  };
}

/**
 * Mesure un en-tête de grappe et calcule ses positions.
 *
 * @param {object} group - Grappe à étiqueter.
 * @param {object} style - Tailles et marges de l'en-tête.
 * @param {number} spacingScreen - Espacement horizontal des grappes, en pixels écran.
 * @returns {object} Métriques prêtes pour le dessin.
 */
function measureClusterLabel(group, style, spacingScreen) {
  const { labelGap, titlePillGap } = CLUSTER_LAYOUT;
  const count = String(group.entries.length);
  const countWidth = labelWidth(count, style.countSize);

  // Largeur du badge et du reste de la pastille.
  const badgeWidth = countWidth + 8 / view.scale;
  const badgeHeight = style.countSize * 1.6;
  const chrome =
    style.padX * 2 + style.dotRadius * 2 + style.gap * 2 + badgeWidth;

  // Tronque le nom à l'espace disponible entre deux grappes.
  const maxNameScreen = Math.max(
    24,
    spacingScreen - chrome * view.scale - titlePillGap,
  );
  const name = fitClusterTitle(
    clusterLabel(group.key),
    maxNameScreen / view.scale,
    style.nameSize,
  );
  const nameWidth = labelWidth(name, style.nameSize);
  const width = chrome + nameWidth;

  // Place la pastille au-dessus du halo.
  const bottom =
    group.center.y - group.radius - labelGap / view.scale;
  const top = bottom - style.height;
  const left = group.center.x - width / 2;
  const centerY = top + style.height / 2;

  return {
    count,
    color: clusterColor(group.key),
    name,
    width,
    height: style.height,
    left,
    top,
    bottom,
    centerY,
    dotX: left + style.padX + style.dotRadius,
    nameX: left + style.padX + style.dotRadius * 2 + style.gap,
    badgeX: left + width - style.padX - badgeWidth,
    badgeWidth,
    badgeHeight,
    rect: { x1: left, y1: top, x2: left + width, y2: bottom },
  };
}

// --- DESSIN -----------------------------------------------------------------

/**
 * Dessine un en-tête de grappe complet.
 *
 * @param {object} metrics - Métriques de l'en-tête.
 * @param {object} style - Tailles et marges de l'en-tête.
 * @param {object} palette - Couleurs du canvas.
 * @returns {void}
 */
function drawClusterLabel(metrics, style, palette) {
  drawClusterLabelBackground(metrics, style, palette);
  drawClusterLabelText(metrics, style, palette);
}

/**
 * Dessine le fond, la bordure et la pastille de couleur d'un en-tête.
 *
 * @param {object} metrics - Métriques de l'en-tête.
 * @param {object} style - Tailles et marges de l'en-tête.
 * @param {object} palette - Couleurs du canvas.
 * @returns {void}
 */
function drawClusterLabelBackground(metrics, style, palette) {
  // Fond arrondi et bordure teintée.
  roundedRectPath(
    metrics.left,
    metrics.top,
    metrics.width,
    metrics.height,
    metrics.height / 2,
  );
  ctx.fillStyle = palette.labelBackground;
  ctx.fill();

  ctx.globalAlpha = 0.32;
  ctx.strokeStyle = metrics.color;
  ctx.lineWidth = 1 / view.scale;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Pastille de couleur à gauche.
  ctx.beginPath();
  ctx.arc(metrics.dotX, metrics.centerY, style.dotRadius, 0, Math.PI * 2);
  ctx.fillStyle = metrics.color;
  ctx.fill();
}

/**
 * Dessine le nom et le badge de compteur d'un en-tête.
 *
 * @param {object} metrics - Métriques de l'en-tête.
 * @param {object} style - Tailles et marges de l'en-tête.
 * @param {object} palette - Couleurs du canvas.
 * @returns {void}
 */
function drawClusterLabelText(metrics, style, palette) {
  // Nom de la grappe.
  ctx.textAlign = 'start';
  ctx.font = style.nameSize + 'px ' + LABEL_FONT_FAMILY;
  ctx.fillStyle = palette.labelText;
  ctx.fillText(metrics.name, metrics.nameX, metrics.centerY);

  // Badge de compteur, aligné à droite.
  const badgeTop = metrics.centerY - metrics.badgeHeight / 2;
  roundedRectPath(
    metrics.badgeX,
    badgeTop,
    metrics.badgeWidth,
    metrics.badgeHeight,
    metrics.badgeHeight / 2,
  );
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = metrics.color;
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.textAlign = 'center';
  ctx.font = style.countSize + 'px ' + LABEL_FONT_FAMILY;
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = palette.labelText;
  ctx.fillText(
    metrics.count,
    metrics.badgeX + metrics.badgeWidth / 2,
    metrics.centerY,
  );
  ctx.globalAlpha = 1;
}

// --- OUTILS -----------------------------------------------------------------

/**
 * Trace un rectangle arrondi, avec repli sur un rectangle simple.
 *
 * @param {number} x - Bord gauche.
 * @param {number} y - Bord supérieur.
 * @param {number} width - Largeur.
 * @param {number} height - Hauteur.
 * @param {number} radius - Rayon des coins.
 * @returns {void}
 */
function roundedRectPath(x, y, width, height, radius) {
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.rect(x, y, width, height);
  }
}

/**
 * Tronque un nom de grappe à une largeur maximale.
 *
 * @param {string} text - Nom complet.
 * @param {number} maxWidth - Largeur maximale en unités monde.
 * @param {number} size - Taille de police en unités monde.
 * @returns {string} Nom complet ou tronqué avec une ellipse.
 */
function fitClusterTitle(text, maxWidth, size) {
  if (labelWidth(text, size) <= maxWidth) return text;

  // Retire des caractères jusqu'à tenir dans la largeur.
  let shortened = text;
  while (shortened.length > 1 && labelWidth(shortened + '…', size) > maxWidth) {
    shortened = shortened.slice(0, -1).trimEnd();
  }
  return shortened + '…';
}
