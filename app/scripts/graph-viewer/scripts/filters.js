/* =======================================================================
  FILTRES ET RECHERCHE
======================================================================= */

/** Reconstruit les puces de filtre et le résumé des types visibles. */
function renderFilters() {

  // Repart d'une liste vide à chaque rendu.
  filters.textContent = '';

  // Une puce par type réellement présent dans le graphe.
  for (const kind of CONTENT_KINDS) {
    const count = kindCounts.get(kind) || 0;

    // Ignore les types absents du graphe.
    if (count === 0) continue;
    filters.appendChild(createFilterChip(kind, count));
  }

  // Résumé des types actifs et du nombre de contenus visibles.
  updateFiltersSummary();
}

/**
 * Bascule la visibilité d'un type puis rafraîchit les vues dépendantes.
 *
 * @param {string} kind - Identifiant du type de contenu.
 * @returns {void}
 */
function toggleKindVisibility(kind) {
  if (visibleKinds.has(kind)) visibleKinds.delete(kind);
  else visibleKinds.add(kind);

  rebuild();
  renderFilters();
  renderPanel();
}

/**
 * Crée la puce d'un type de contenu avec son libellé et son compteur.
 *
 * @param {string} kind - Identifiant du type de contenu.
 * @param {number} count - Nombre de nœuds de ce type.
 * @returns {HTMLButtonElement} Puce prête à être insérée.
 */
function createFilterChip(kind, count) {
  const button = element('button', 'chip');
  button.type = 'button';
  button.setAttribute('aria-pressed', visibleKinds.has(kind) ? 'true' : 'false');
  button.style.setProperty('--kind', kindColor(kind));

  // Pastille de couleur, libellé localisé et compteur.
  button.appendChild(element('span', 'dot'));
  button.appendChild(element('span', '', kindLabel(kind)));
  button.appendChild(element('span', 'count', String(count)));

  // Clic : bascule le type et relance les vues qui en dépendent.
  button.addEventListener('click', () => toggleKindVisibility(kind));

  return button;
}

/**
 * Met à jour le résumé des types actifs et des contenus visibles.
 *
 * @returns {void}
 */
function updateFiltersSummary() {
  const availableKinds = CONTENT_KINDS.filter((kind) => (kindCounts.get(kind) || 0) > 0);
  const activeKinds = availableKinds.filter((kind) => visibleKinds.has(kind));
  const visibleContents = nodes.filter(
    (entry) => entry.node.kind !== 'theme' && entry.node.kind !== 'concept',
  ).length;

  // Format « types actifs / types disponibles » et nombre de contenus.
  filtersSummaryTypes.textContent = `${activeKinds.length}/${availableKinds.length} ${UI[lang].types}`;
  filtersSummaryContents.textContent = `${visibleContents} ${UI[lang].contents}`;
}

/**
 * Lance la recherche plein texte et sélectionne le premier résultat.
 *
 * @returns {void}
 */
function runSearch() {
  const query = search.value.trim().toLowerCase();
  matchIds = new Set();

  // Recherche vide : on revient à la vue d'ensemble.
  if (!query) {
    renderPanel();
    return;
  }

  // Compare la requête aux libellés des trois langues et à l'identifiant.
  const matches = DATA.nodes.filter((node) => {
    if (node.kind === 'concept' || node.kind === 'theme') return false;
    return [node.label.fr, node.label.en, node.label.es, node.id]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });

  for (const node of matches) matchIds.add(node.id);
  if (matches.length > 0) {
    const first = matches[0];
    visibleKinds.add(first.kind);
    rebuild();
    renderFilters();
    selectNode(first.id);
  } 

  // Aucun résultat : message dédié dans le panneau.
  else {
    panel.textContent = '';
    const card = element('div', 'empty-card');
    card.appendChild(element('p', 'empty', UI[lang].searchEmpty));
    panel.appendChild(card);
  }
}
