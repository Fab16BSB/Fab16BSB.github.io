/* =======================================================================
  ÉTAT
======================================================================= */

// --- CONSTANTES DE PERSISTANCE ---------------------------------------------

// Clés de persistance partagées avec le portfolio.
const THEME_KEY = 'fp-theme';
const LANGUAGE_KEY = 'fp-lang';

// --- INDEX DÉRIVÉS ----------------------------------------------------------

// Index des nœuds par identifiant pour les accès directs.
const byId = new Map(DATA.nodes.map((node) => [node.id, node]));

// Compte les nœuds par type pour les filtres et le résumé.
const kindCounts = DATA.nodes.reduce((counts, node) => {
  counts.set(node.kind, (counts.get(node.kind) || 0) + 1);
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

// Préférences et retour au portfolio.
const langSwitch = document.getElementById('lang-switch');
const langTrigger = document.getElementById('lang-trigger');
const langMenu = document.getElementById('lang-menu');
const langFlag = document.getElementById('lang-flag');
const langCurrent = document.getElementById('lang-current');
const themeToggle = document.getElementById('theme-toggle');
const backToPortfolio = document.getElementById('back-to-portfolio');

// --- ÉTAT MUTABLE -----------------------------------------------------------

// Langue, thème et préférences d'affichage.
// detectLanguage est déclarée en fin de fichier ; sa déclaration est hissée.
let lang = detectLanguage();
let theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
let visibleKinds = new Set(DEFAULT_KINDS);
let showConcepts = false;
let showLabels = true;
let filtersCollapsed = false;
let langMenuOpen = false;

// Sélection, feuille mobile et filtre local du thème.
let selectedId = null;
let sheetOpen = false;
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
let alpha = 1;

// Transformation monde vers écran et état du glisser.
const view = { scale: 1, x: 0, y: 0 };
const drag = { mode: null, nodeId: null, startX: 0, startY: 0, moved: false };

// --- DÉTECTION DE LA LANGUE -------------------------------------------------

/**
 * Détecte la langue comme le portfolio : stockage, puis navigateur.
 *
 * @returns {string} Code de langue supporté (`fr`, `en` ou `es`).
 */
function detectLanguage() {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_KEY);
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
