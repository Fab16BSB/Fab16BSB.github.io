/* =======================================================================
  PANNEAU LATÉRAL
======================================================================= */

// --- HELPERS DOM ------------------------------------------------------------

/**
 * Crée un élément DOM avec une classe et un texte optionnels.
 *
 * @param {string} tag - Nom de la balise HTML.
 * @param {string} [className] - Classes CSS à appliquer.
 * @param {string} [text] - Contenu texte de l'élément.
 * @returns {HTMLElement} Élément créé.
 */
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Ajoute une rangée de puces cliquables dans un conteneur.
 *
 * @param {HTMLElement} container - Conteneur cible.
 * @param {{ id: string, label: string }[]} values - Puces à afficher.
 * @param {(id: string) => void} [onSelect] - Callback appelé au clic sur une puce.
 */
function addChips(container, values, onSelect) {
  const chips = element('div', 'chips');
  for (const value of values) {
    const chip = element('button', 'chip static link', value.label);
    chip.type = 'button';
    if (onSelect) chip.addEventListener('click', () => onSelect(value.id));
    chips.appendChild(chip);
  }
  container.appendChild(chips);
}

/**
 * Ajoute un élément optionnel à un conteneur.
 *
 * @param {HTMLElement} container - Conteneur cible.
 * @param {HTMLElement | null} child - Élément à ajouter, ou `null`.
 */
function appendIfPresent(container, child) {
  if (child) container.appendChild(child);
}

// --- PANNEAU ----------------------------------------------------------------

/** Reconstruit le panneau selon la sélection et la langue courantes. */
function renderPanel() {

  // Repart d'un panneau vide à chaque rendu.
  panel.textContent = '';

  const node = selectedId ? byId.get(selectedId) : null;

  // Titre de la feuille mobile : nœud sélectionné ou vue d'ensemble.
  sheetTitle.textContent = node ? labelOf(node) : UI[lang].overviewTitle;

  if (!selectedId) {
    memberFilterKey = null;
    renderOverview();
  } else if (node) {
    renderNodeDetails(node);
  }
}

// --- VUE D'ENSEMBLE ---------------------------------------------------------

/** Affiche la vue d'ensemble : en-tête, compteurs et invitation. */
function renderOverview() {
  panel.appendChild(createOverviewHead());
  panel.appendChild(createOverviewStats());
  panel.appendChild(createOverviewHint());
}

/**
 * Crée l'en-tête de la vue d'ensemble.
 *
 * @returns {HTMLElement} En-tête du panneau.
 */
function createOverviewHead() {
  const head = element('div', 'panel-head');
  const title = element('div', 'panel-title');
  title.appendChild(element('div', 'panel-kicker', UI[lang].overviewKicker));
  title.appendChild(element('h2', '', UI[lang].overviewTitle));
  head.appendChild(title);
  return head;
}

/**
 * Crée la grille des compteurs visibles.
 *
 * @returns {HTMLElement} Grille des statistiques.
 */
function createOverviewStats() {
  const stats = element('div', 'stats');
  const current = counts();
  const items = [
    [current.contents, UI[lang].contents],
    [current.themes, UI[lang].themes],
    [current.concepts, UI[lang].concepts],
    [current.relations, UI[lang].relations],
  ];

  for (const [value, label] of items) {
    const stat = element('div', 'stat');
    stat.appendChild(element('strong', '', String(value)));
    stat.appendChild(element('span', '', label));
    stats.appendChild(stat);
  }

  return stats;
}

/**
 * Crée l'encart d'aide affiché quand aucun nœud n'est sélectionné.
 *
 * @returns {HTMLElement} Encart d'aide.
 */
function createOverviewHint() {
  const card = element('div', 'empty-card');
  card.appendChild(element('p', 'empty', UI[lang].select));
  card.appendChild(element('p', 'empty-note', UI[lang].drag));
  return card;
}

// --- DÉTAIL D'UN NŒUD -------------------------------------------------------

/**
 * Affiche le détail d'un nœud sélectionné.
 *
 * @param {object} node - Nœud sélectionné.
 */
function renderNodeDetails(node) {
  // Quitte le filtre local dès que le nœud n'est plus un thème.
  if (node.kind !== 'theme') memberFilterKey = null;

  panel.appendChild(createDetailHead(node));
  panel.appendChild(createNodeMeta(node));
  appendIfPresent(panel, createSiteLink(node));
  appendIfPresent(panel, createThemeSection(node));
  appendIfPresent(panel, createTermSection(node));
  appendIfPresent(panel, createContextSection(node));

  if (node.kind === 'theme') {
    renderThemeMembers(node);
  } else {
    renderRecommendations(node);
  }
}

/**
 * Crée l'en-tête du détail avec le titre et le bouton de fermeture.
 *
 * @param {object} node - Nœud sélectionné.
 * @returns {HTMLElement} En-tête du panneau.
 */
function createDetailHead(node) {
  const head = element('div', 'panel-head');
  const title = element('div', 'panel-title');
  title.appendChild(element('div', 'panel-kicker', UI[lang].detailKicker));
  title.appendChild(element('h2', '', labelOf(node)));
  head.appendChild(title);
  head.appendChild(createCloseButton());
  return head;
}

/**
 * Crée le bouton de fermeture du détail.
 *
 * @returns {HTMLButtonElement} Bouton de fermeture.
 */
function createCloseButton() {
  const close = element('button', 'icon-btn panel-close');
  close.type = 'button';
  close.title = UI[lang].closePanel;
  close.setAttribute('aria-label', UI[lang].closePanel);
  close.innerHTML = [
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"',
    'stroke-width="1.8" stroke-linecap="round" aria-hidden="true">',
    '<path d="M6 6l12 12M18 6L6 18" />',
    '</svg>',
  ].join('');
  close.addEventListener('click', closeSelectedPanel);
  return close;
}

/** Ferme le détail : replie la feuille mobile ou désélectionne le nœud. */
function closeSelectedPanel() {
  if (isSheetLayout()) {
    setSheetOpen(false);
  } else {
    selectedId = null;
    followId = null;
    renderPanel();
  }
}

/**
 * Crée les métadonnées du nœud : type et année éventuelle.
 *
 * @param {object} node - Nœud sélectionné.
 * @returns {HTMLElement} Bloc de métadonnées.
 */
function createNodeMeta(node) {
  const meta = element('div', 'meta');
  const badge = element('span', 'kind-badge', kindLabel(node.kind));
  badge.style.setProperty('--kind', kindColor(node.kind));
  meta.appendChild(badge);
  if (node.year) meta.appendChild(element('span', 'meta-year', String(node.year)));
  return meta;
}

/**
 * Crée le lien vers la section du portfolio, s'il existe.
 *
 * @param {object} node - Nœud sélectionné.
 * @returns {HTMLAnchorElement | null} Lien ou `null`.
 */
function createSiteLink(node) {
  let link = null;
  if (node.anchor) {
    link = element('a', 'site-link', UI[lang].openSite + ' ↗');
    link.href = SITE_URL + node.anchor;
    link.target = '_blank';
    link.rel = 'noreferrer';
  }
  return link;
}

/**
 * Crée l'étiquette colorée d'un type de nœud.
 *
 * @param {string} kind - Identifiant du type.
 * @returns {HTMLElement} Étiquette de type.
 */
function createKindTag(kind) {
  const tag = element('span', 'kind-tag', kindLabel(kind));
  tag.style.setProperty('--kind', kindColor(kind));
  return tag;
}

/**
 * Crée un bouton de contenu avec son nom et son type.
 *
 * @param {object} target - Nœud cible.
 * @param {(id: string) => void} onSelect - Callback de sélection.
 * @returns {HTMLButtonElement} Bouton configuré.
 */
function createRecordButton(target, onSelect) {
  const button = element('button', 'rec');
  button.type = 'button';

  const row = element('div', 'row');
  row.appendChild(element('span', 'name', labelOf(target)));
  row.appendChild(createKindTag(target.kind));
  button.appendChild(row);

  button.addEventListener('click', () => onSelect(target.id));
  return button;
}

/**
 * Crée la section des thèmes associés.
 *
 * @param {object} node - Nœud sélectionné.
 * @returns {HTMLElement | null} Section ou `null`.
 */
function createThemeSection(node) {
  let section = null;
  if (node.themes.length > 0) {
    section = element('div', 'section');
    section.appendChild(element('h3', '', UI[lang].panelThemes));
    addChips(
      section,
      node.themes.map((theme) => ({
        id: 'theme:' + theme,
        label: labelOf(byId.get('theme:' + theme) || { label: { fr: theme } }),
      })),
      selectNode,
    );
  }
  return section;
}

/**
 * Crée la section des termes techniques associés.
 *
 * @param {object} node - Nœud sélectionné.
 * @returns {HTMLElement | null} Section ou `null`.
 */
function createTermSection(node) {
  let section = null;
  if (node.terms.length > 0) {
    section = element('div', 'section');
    section.appendChild(element('h3', '', UI[lang].panelTerms));
    addChips(
      section,
      node.terms.map((term) => ({
        id: 'concept:' + term,
        label: labelOf(byId.get('concept:' + term) || { label: { fr: term } }),
      })),
      selectTermNode,
    );
  }
  return section;
}

/**
 * Crée la section des relations de contexte.
 *
 * @param {object} node - Nœud sélectionné.
 * @returns {HTMLElement | null} Section ou `null`.
 */
function createContextSection(node) {
  const contextEdges = DATA.edges.filter(
    (edge) =>
      edge.relation === 'context' &&
      (edge.from === node.id || edge.to === node.id),
  );
  let section = null;

  if (contextEdges.length > 0) {
    section = element('div', 'section');
    section.appendChild(element('h3', '', UI[lang].panelContext));

    for (const edge of contextEdges) {
      const targetId = edge.from === node.id ? edge.to : edge.from;
      const target = byId.get(targetId);
      if (target) {
        section.appendChild(createRecordButton(target, selectContentNode));
      }
    }
  }

  return section;
}

/**
 * Rend un contenu visible puis le sélectionne.
 *
 * @param {string} id - Identifiant du nœud.
 */
function selectContentNode(id) {
  const target = byId.get(id);
  if (target) {
    visibleKinds.add(target.kind);
    rebuild();
    renderFilters();
    selectNode(id);
  }
}

/**
 * Rend une recommandation visible puis la sélectionne.
 *
 * @param {string} id - Identifiant du nœud.
 */
function selectRecommendedNode(id) {
  const target = byId.get(id);
  if (target) {
    visibleKinds.add(target.kind);
    if (target.kind === 'concept') showConcepts = true;
    rebuild();
    renderFilters();
    selectNode(id);
  }
}

/** Active l'affichage des concepts et met à jour le bouton dédié. */
function activateConcepts() {
  showConcepts = true;
  document.getElementById('toggle-concepts').setAttribute('aria-pressed', 'true');
}

/**
 * Active les concepts puis sélectionne un terme du nœud.
 *
 * @param {string} id - Identifiant du concept.
 */
function selectTermNode(id) {
  activateConcepts();
  rebuild();
  selectNode(id);
}

/**
 * Active les concepts, rafraîchit les filtres puis sélectionne un terme lié.
 *
 * @param {string} id - Identifiant du concept.
 */
function selectLinkedTermNode(id) {
  activateConcepts();
  rebuild();
  renderFilters();
  selectNode(id);
}

// --- CONTENUS D'UN THÈME ----------------------------------------------------

/**
 * Affiche les contenus rattachés à un thème et leurs termes fréquents.
 *
 * @param {object} node - Nœud de type thème.
 */
function renderThemeMembers(node) {
  const members = getThemeMembers(node);
  const kinds = getMemberKinds(members);
  syncMemberKindFilter(node, kinds);
  const visibleMembers = getVisibleMembers(members);

  appendIfPresent(panel, createLinkedTermsSection(visibleMembers));
  panel.appendChild(createThemeMembersSection(members, kinds, visibleMembers));
}

/**
 * Retourne les contenus rattachés à un thème.
 *
 * @param {object} node - Nœud de type thème.
 * @returns {object[]} Contenus du thème.
 */
function getThemeMembers(node) {
  return DATA.edges
    .filter((edge) => edge.relation === 'has-theme' && edge.to === node.id)
    .map((edge) => byId.get(edge.from))
    .filter(Boolean);
}

/**
 * Retourne les types présents dans une liste de contenus.
 *
 * @param {object[]} members - Contenus du thème.
 * @returns {string[]} Types présents, dans l'ordre des filtres.
 */
function getMemberKinds(members) {
  return CONTENT_KINDS.filter((kind) =>
    members.some((member) => member.kind === kind),
  );
}

/**
 * Réinitialise et nettoie le filtre local du thème.
 *
 * @param {object} node - Nœud de type thème.
 * @param {string[]} kinds - Types encore présents.
 */
function syncMemberKindFilter(node, kinds) {
  if (memberFilterKey !== node.id) {
    memberFilterKey = node.id;
    memberKindFilter = new Set();
  }

  const presentKinds = new Set(kinds);
  for (const kind of [...memberKindFilter]) {
    if (!presentKinds.has(kind)) memberKindFilter.delete(kind);
  }
}

/**
 * Retourne les contenus du thème correspondant au filtre local.
 *
 * @param {object[]} members - Contenus du thème.
 * @returns {object[]} Contenus visibles.
 */
function getVisibleMembers(members) {
  return memberKindFilter.size === 0
    ? members
    : members.filter((member) => memberKindFilter.has(member.kind));
}

/**
 * Crée la section des contenus du thème avec son filtre par type.
 *
 * @param {object[]} members - Contenus du thème.
 * @param {string[]} kinds - Types présents.
 * @param {object[]} visibleMembers - Contenus après filtrage.
 * @returns {HTMLElement} Section des contenus.
 */
function createThemeMembersSection(members, kinds, visibleMembers) {
  const section = element('div', 'section');
  section.appendChild(element('h3', '', UI[lang].panelMembers));
  section.appendChild(createMemberFilters(members, kinds));

  if (visibleMembers.length === 0) {
    section.appendChild(element('p', 'empty', UI[lang].panelFilterEmpty));
  }

  for (const member of visibleMembers) {
    section.appendChild(createRecordButton(member, selectContentNode));
  }

  return section;
}

/**
 * Crée la rangée de filtres par type du thème.
 *
 * @param {object[]} members - Contenus du thème.
 * @param {string[]} kinds - Types présents.
 * @returns {HTMLElement} Rangée de filtres.
 */
function createMemberFilters(members, kinds) {
  const filterRow = element('div', 'member-filters');
  filterRow.appendChild(createAllMembersChip());

  for (const kind of kinds) {
    const count = members.filter((member) => member.kind === kind).length;
    filterRow.appendChild(createMemberChip(kind, count));
  }

  return filterRow;
}

/**
 * Crée la puce « Tout » du filtre de thème.
 *
 * @returns {HTMLButtonElement} Puce « Tout ».
 */
function createAllMembersChip() {
  const chip = element('button', 'chip', UI[lang].filterAll);
  chip.type = 'button';
  chip.setAttribute('aria-pressed', memberKindFilter.size === 0 ? 'true' : 'false');
  chip.style.setProperty('--kind', 'var(--accent)');
  chip.addEventListener('click', () => {
    memberKindFilter.clear();
    renderPanel();
  });
  return chip;
}

/**
 * Crée une puce de filtre pour un type du thème.
 *
 * @param {string} kind - Identifiant du type.
 * @param {number} count - Nombre de contenus de ce type.
 * @returns {HTMLButtonElement} Puce de filtre.
 */
function createMemberChip(kind, count) {
  const chip = element('button', 'chip');
  chip.type = 'button';
  chip.setAttribute('aria-pressed', memberKindFilter.has(kind) ? 'true' : 'false');
  chip.style.setProperty('--kind', kindColor(kind));
  chip.appendChild(element('span', 'dot'));
  chip.appendChild(element('span', '', kindLabel(kind)));
  chip.appendChild(element('span', 'count', String(count)));
  chip.addEventListener('click', () => {
    if (memberKindFilter.has(kind)) memberKindFilter.delete(kind);
    else memberKindFilter.add(kind);
    renderPanel();
  });
  return chip;
}

/**
 * Crée la section des termes les plus fréquents des contenus visibles.
 *
 * @param {object[]} visibleMembers - Contenus après filtrage.
 * @returns {HTMLElement | null} Section ou `null`.
 */
function createLinkedTermsSection(visibleMembers) {
  const linkedTermNodes = getLinkedTermNodes(visibleMembers);
  let section = null;

  if (linkedTermNodes.length > 0) {
    section = element('div', 'section');
    section.appendChild(element('h3', '', UI[lang].panelLinkedTerms));
    addChips(
      section,
      linkedTermNodes.map((termNode) => ({
        id: termNode.id,
        label: labelOf(termNode),
      })),
      selectLinkedTermNode,
    );
  }

  return section;
}

/**
 * Retourne les termes les plus fréquents parmi les contenus visibles.
 *
 * @param {object[]} visibleMembers - Contenus après filtrage.
 * @returns {object[]} Concepts liés, triés par fréquence.
 */
function getLinkedTermNodes(visibleMembers) {
  const termCounts = new Map();
  for (const member of visibleMembers) {
    for (const term of member.terms) {
      termCounts.set(term, (termCounts.get(term) || 0) + 1);
    }
  }

  return [...termCounts.entries()]
    .map(([term, count]) => ({ node: byId.get('concept:' + term), count }))
    .filter((entry) => Boolean(entry.node))
    .sort(
      (left, right) =>
        right.count - left.count ||
        labelOf(left.node).localeCompare(labelOf(right.node)),
    )
    .slice(0, 12)
    .map((entry) => entry.node);
}

// --- RECOMMANDATIONS --------------------------------------------------------

/**
 * Affiche les recommandations sémantiques d'un contenu.
 *
 * @param {object} node - Nœud sélectionné.
 */
function renderRecommendations(node) {
  const recommendations = DATA.recommendations[node.id] || [];
  const section = element('div', 'section');
  section.appendChild(element('h3', '', UI[lang].panelRelated));

  if (recommendations.length === 0) {
    section.appendChild(element('p', 'empty', UI[lang].panelNoRelated));
  }

  for (const recommendation of recommendations) {
    const target = byId.get(recommendation.node);
    if (target) {
      section.appendChild(createRecommendationButton(recommendation, target));
    }
  }

  panel.appendChild(section);
}

/**
 * Crée le bouton d'une recommandation avec son score et ses raisons.
 *
 * @param {object} recommendation - Recommandation calculée.
 * @param {object} target - Nœud recommandé.
 * @returns {HTMLButtonElement} Bouton de recommandation.
 */
function createRecommendationButton(recommendation, target) {
  const button = element('button', 'rec');
  button.type = 'button';

  const row = element('div', 'row');
  row.appendChild(element('span', 'name', labelOf(target)));
  row.appendChild(element('span', 'score', recommendation.score.toFixed(2)));
  button.appendChild(row);

  const reasons = getRecommendationReasons(recommendation);
  if (reasons.length > 0) {
    button.appendChild(element('div', 'why', reasons.join(' · ')));
  }

  button.appendChild(createScoreBar(recommendation.score));
  button.addEventListener('click', () => selectRecommendedNode(target.id));
  return button;
}

/**
 * Explique une recommandation par son contexte, ses thèmes ou ses termes.
 *
 * @param {object} recommendation - Recommandation calculée.
 * @returns {string[]} Raisons lisibles.
 */
function getRecommendationReasons(recommendation) {
  const reasons = [];

  if (recommendation.context) {
    reasons.push(UI[lang].whyContext);
  } else if (
    recommendation.sharedThemes.length === 0 &&
    recommendation.sharedTerms.length === 0
  ) {
    reasons.push(UI[lang].whySemantic);
  } else {
    for (const theme of recommendation.sharedThemes.slice(0, 2)) {
      const themeNode = byId.get('theme:' + theme);
      if (themeNode) reasons.push(UI[lang].whyTheme + ' : ' + labelOf(themeNode));
    }
    for (const term of recommendation.sharedTerms.slice(0, 2)) {
      const termNode = byId.get('concept:' + term);
      if (termNode) reasons.push(UI[lang].whyTerm + ' : ' + labelOf(termNode));
    }
    if (recommendation.samePeriod) reasons.push(UI[lang].whyPeriod);
  }

  return reasons;
}

/**
 * Crée la barre de score d'une recommandation.
 *
 * @param {number} score - Score entre 0 et 1.
 * @returns {HTMLElement} Barre de score.
 */
function createScoreBar(score) {
  const bar = element('div', 'bar');
  const fill = element('span');
  fill.style.width = Math.round(score * 100) + '%';
  bar.appendChild(fill);
  return bar;
}
