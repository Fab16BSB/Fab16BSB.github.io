/**
 * Initialise le thème avant le rendu React pour éviter un flash de couleur.
 *
 * Ce script doit rester un script classique chargé dans le <head> :
 * un module serait différé et laisserait le thème par défaut s'afficher.
 */
(function () {
  try {
    const stored = localStorage.getItem('fp-theme');
    const theme = stored === 'light' || stored === 'dark' ? stored : 'dark';
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;

    const meta = document.querySelector('meta[name="theme-color"]');

    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#070b14' : '#e7dfd1');
    }
  } catch (error) {
    console.warn('Initialisation du thème impossible — thème par défaut appliqué', error);
  }
})();
