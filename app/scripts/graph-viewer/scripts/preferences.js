/* =======================================================================
  PRÉFÉRENCES : thème, langue et feuille mobile
======================================================================= */

// --- CONSTANTES -------------------------------------------------------------
// Point de rupture de la feuille mobile.
const SHEET_MEDIA_QUERY = '(max-width: 1020px)';
const sheetMedia = window.matchMedia(SHEET_MEDIA_QUERY);

// --- FILTRES ----------------------------------------------------------------

/**
 * Applique l'état replié ou déplié de la barre de filtres.
 *
 * @param {boolean} next - Nouvel état replié.
 */
function setFiltersCollapsed(next) {
  filtersCollapsed = next;
  filtersCard.dataset.collapsed = next ? 'true' : 'false';
  filtersToggle.setAttribute('aria-expanded', next ? 'false' : 'true');
  filtersToggle.setAttribute('aria-label', next ? UI[lang].filtersExpand : UI[lang].filtersCollapse);
  filtersToggle.title = next ? UI[lang].filtersExpand : UI[lang].filtersCollapse;
}

// --- FEUILLE MOBILE ---------------------------------------------------------

/**
 * Indique si le panneau est affiché en feuille basse.
 *
 * @returns {boolean} `true` sur mobile et tablette.
 */
function isSheetLayout() {
  return sheetMedia.matches;
}

/** Met à jour les libellés du panneau rétractable. */
function updateSheetLabels() {
  const label = sheetOpen ? UI[lang].collapsePanel : UI[lang].expandPanel;
  sheetToggle.setAttribute('aria-label', label);
  sheetToggle.title = label;
  sheetClose.setAttribute('aria-label', UI[lang].collapsePanel);
  sheetClose.title = UI[lang].collapsePanel;
}

/**
 * Ouvre ou replie la feuille du panneau.
 *
 * @param {boolean} next - Nouvel état ouvert.
 */
function setSheetOpen(next) {
  sheetOpen = next;
  panelRoot.dataset.open = next ? 'true' : 'false';
  panelBackdrop.hidden = !next;
  sheetToggle.setAttribute('aria-expanded', next ? 'true' : 'false');
  if (next) panel.scrollTop = 0;
  updateSheetLabels();
}

/** Replie la feuille quand on repasse en disposition desktop. */
function syncSheetLayout() {
  if (!sheetMedia.matches) setSheetOpen(false);
}

// --- LANGUE -----------------------------------------------------------------

/**
 * Ouvre ou ferme le menu des langues.
 *
 * @param {boolean} next - Nouvel état ouvert.
 */
function setLangMenuOpen(next) {
  langMenuOpen = next;
  langMenu.hidden = !next;
  langTrigger.setAttribute('aria-expanded', next ? 'true' : 'false');
}

/** Aligne le déclencheur et les options sur la langue courante. */
function updateLanguageSwitcher() {
  for (const option of langMenu.querySelectorAll('[data-lang]')) {
    const active = option.dataset.lang === lang;
    option.setAttribute('aria-selected', active ? 'true' : 'false');
    option.classList.toggle('active', active);
    if (!active) continue;

    const flag = option.querySelector('.flag');
    const label = option.querySelector('span');
    if (flag) langFlag.innerHTML = flag.innerHTML;
    if (label) langCurrent.textContent = label.textContent;
  }
}

/** Met à jour tous les libellés localisés de l'interface. */
function applyLabels() {
  document.documentElement.lang = lang;
  document.title = UI[lang].title;
  search.placeholder = UI[lang].searchPlaceholder;

  // Applique les textes, titres et libellés ARIA traduits.
  for (const node of document.querySelectorAll('[data-i18n]')) {
    const value = UI[lang][node.dataset.i18n];
    if (value) node.textContent = value;
  }
  for (const node of document.querySelectorAll('[data-i18n-title]')) {
    const value = UI[lang][node.dataset.i18nTitle];
    if (value) node.title = value;
  }
  for (const node of document.querySelectorAll('[data-i18n-aria]')) {
    const value = UI[lang][node.dataset.i18nAria];
    if (value) node.setAttribute('aria-label', value);
  }

  updateLanguageSwitcher();
  updateThemeToggle();
  setFiltersCollapsed(filtersCollapsed);
  updateSheetLabels();
}

/**
 * Change la langue, la persiste et rafraîchit les vues.
 *
 * @param {string} next - Code de langue (`fr`, `en` ou `es`).
 * @param {boolean} [persist=true] - Enregistre le choix dans le stockage local.
 */
function setLanguage(next, persist = true) {
  lang = next;
  if (persist) {
    try {
      window.localStorage.setItem(LANGUAGE_KEY, next);
    } catch (error) {
      console.warn('Stockage local indisponible : la langue ne sera pas conservée.', error);
    }
  }
  applyLabels();
  renderFilters();
  renderPanel();
}

// --- SYNCHRONISATION --------------------------------------------------------

/** Reprend le thème et la langue modifiés dans un autre onglet. */
function syncPreferences() {
  try {
    const storedTheme = window.localStorage.getItem(THEME_KEY);
    if ((storedTheme === 'light' || storedTheme === 'dark') && storedTheme !== theme) {
      applyTheme(storedTheme, false);
    }

    const storedLang = window.localStorage.getItem(LANGUAGE_KEY);
    if (
      (storedLang === 'fr' || storedLang === 'en' || storedLang === 'es') &&
      storedLang !== lang
    ) {
      setLanguage(storedLang, false);
    }
  } catch (error) {
    console.warn('Stockage local indisponible : préférences non synchronisées.', error);
  }
}

// --- ÉCOUTEURS --------------------------------------------------------------

/** Branche le menu des langues et sa fermeture au clavier ou au clic extérieur. */
function bindLanguageControls() {
  // Sélection d'une langue : applique, ferme le menu et rend le focus.
  for (const button of document.querySelectorAll('[data-lang]')) {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
      setLangMenuOpen(false);
      langTrigger.focus({ preventScroll: true });
    });
  }

  // Ouvre ou ferme le menu des langues.
  langTrigger.addEventListener('click', () => setLangMenuOpen(!langMenuOpen));

  // Ferme le menu des langues au clic extérieur.
  document.addEventListener('pointerdown', (event) => {
    if (langMenuOpen && !langSwitch.contains(event.target)) setLangMenuOpen(false);
  });

  // Échap ferme le menu et rend le focus au déclencheur.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && langMenuOpen) {
      setLangMenuOpen(false);
      langTrigger.focus();
    }
  });
}

/** Branche les contrôles de la feuille mobile et son changement de disposition. */
function bindSheetControls() {
  sheetToggle.addEventListener('click', () => setSheetOpen(!sheetOpen));
  sheetClose.addEventListener('click', () => setSheetOpen(false));
  panelBackdrop.addEventListener('click', () => setSheetOpen(false));

  // Branche l'écouteur de changement de disposition.
  if (typeof sheetMedia.addEventListener === 'function') {
    sheetMedia.addEventListener('change', syncSheetLayout);
  } else {
    sheetMedia.addListener(syncSheetLayout);
  }
}

/** Branche la bascule entre thème clair et sombre. */
function bindThemeToggle() {
  themeToggle.addEventListener('click', () => {
    applyTheme(theme === 'dark' ? 'light' : 'dark', true);
  });
}

/** Branche le retour vers la section précédente du portfolio. */
function bindPortfolioLink() {
  backToPortfolio.addEventListener('click', (event) => {
    if (window.history.length > 1) {
      try {
        const referrer = new URL(document.referrer);
        if (referrer.origin === window.location.origin) {
          event.preventDefault();
          window.history.back();
        }
      } catch (error) {
        console.debug('Référent absent ou invalide : navigation normale vers le portfolio.', error);
      }
    }
  });
}

/** Branche la synchronisation des préférences entre onglets et au retour du cache. */
function bindPreferenceSync() {
  window.addEventListener('storage', (event) => {
    if (event.key === THEME_KEY || event.key === LANGUAGE_KEY) syncPreferences();
  });

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) syncPreferences();
  });
}

/** Branche tous les écouteurs de préférences du viewer. */
function initPreferences() {
  bindLanguageControls();
  bindSheetControls();
  bindThemeToggle();
  bindPortfolioLink();
  bindPreferenceSync();
}

// --- INITIALISATION ---------------------------------------------------------
initPreferences();
