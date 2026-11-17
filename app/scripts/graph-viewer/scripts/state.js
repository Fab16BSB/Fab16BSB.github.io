/* =======================================================================
  ÉTAT
======================================================================= */

// --- INDEX DÉRIVÉS ----------------------------------------------------------

// Index des nœuds par identifiant pour les accès directs.
const byId = new Map(DATA.nodes.map((node) => [node.id, node]));

// Compte les nœuds par type pour les filtres et le résumé.
const kindCounts = DATA.nodes.reduce((counts, node) => {
  const kind = displayKind(node);
  counts.set(kind, (counts.get(kind) || 0) + 1);
  return counts;
}, new Map());

// --- RÉFÉRENCES DOM ---------------------------------------------------------

// Canvas, scène et panneau.
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
const stage = document.getElementById('stage');
const tooltip = document.getElementById('tooltip');
const panelRoot = document.getElementById('panel');
const panel = document.getElementById('panel-content');
const panelBackdrop = document.getElementById('panel-backdrop');
const sheetToggle = document.getElementById('sheet-toggle');
const sheetTitle = document.getElementById('sheet-title');
const sheetClose = document.getElementById('sheet-close');

// Filtres et recherche.
const filters = document.getElementById('filters');
const filtersCard = document.getElementById('filters-card');
const filtersSummaryTypes = document.getElementById('filters-summary-types');
const filtersSummaryContents = document.getElementById('filters-summary-contents');
const filtersToggle = document.getElementById('filters-toggle');
const search = document.getElementById('search');

// Outils de vue disponibles selon la disposition.
const toggleConcepts = document.getElementById('toggle-concepts');
const releaseNodes = document.getElementById('release-nodes');

// Menu de vue mobile.
const viewToolbar = document.getElementById('view-toolbar');
const viewTrigger = document.getElementById('view-trigger');
const viewTriggerUse = document.getElementById('view-trigger-use');

// Préférences et retour au portfolio.
const langSwitch = document.getElementById('lang-switch');
const langTrigger = document.getElementById('lang-trigger');
const langMenu = document.getElementById('lang-menu');
const langFlag = document.getElementById('lang-flag');
const langCurrent = document.getElementById('lang-current');
const themeToggle = document.getElementById('theme-toggle');
const backToPortfolio = document.getElementById('back-to-portfolio');
const brandHome = document.getElementById('brand-home');

// --- ÉTAT MUTABLE -----------------------------------------------------------

// Langue, thème et préférences d'affichage.
// detectLanguage est déclarée en fin de fichier ; sa déclaration est hissée.
let lang = detectLanguage();
let theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
let visibleKinds = new Set(DEFAULT_KINDS);
let showConcepts = false;
let filtersCollapsed = false;
let langMenuOpen = false;
let viewMenuOpen = false;

// Disposition courante : réseau de liens, grappes par section ou par thème.
let layoutMode = 'network';

// Sélection, feuille mobile et filtre local du thème.
let selectedId = null;
let sheetOpen = false;
let sheetOpenedAt = 0;
let memberKindFilter = new Set();
let memberFilterKey = null;

// Nœud survolé, nœud suivi par la caméra et résultats de recherche.
let hoverId = null;
let followId = null;
let matchIds = new Set();

// Positions mémorisées et état courant du graphe.
const positions = new Map();
let nodes = [];
let edges = [];
let clusters = [];
let clusterCellX = 0;
let alpha = 1;

// Transformation monde vers écran et état du glisser.
const view = { scale: 1, x: 0, y: 0 };
const drag = { mode: null, nodeId: null, startX: 0, startY: 0, slop: 0, moved: false };

// Pointeurs actifs sur la scène, pour le panoramique et le pincement tactile.
const pointers = new Map();

// État du pincement tactile : distance de départ et point monde sous le milieu.
const pinch = { active: false, distance: 0, scale: 1, worldX: 0, worldY: 0 };

// --- DÉTECTION DE LA LANGUE -------------------------------------------------

/**
 * Détecte la langue comme le portfolio : stockage, puis navigateur.
 *
 * @returns {string} Code de langue supporté (`fr`, `en` ou `es`).
 */
function detectLanguage() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.language);
    if (stored === 'fr' || stored === 'en' || stored === 'es') return stored;
  } catch (error) {
    console.warn('Stockage local indisponible : détection via le navigateur.', error);
  }

  const candidates = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language];
  for (const candidate of candidates) {
    const base = String(candidate || '').toLowerCase().split('-')[0];
    if (base === 'fr' || base === 'en' || base === 'es') return base;
  }
  return 'fr';
}
