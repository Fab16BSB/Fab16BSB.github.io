// Applique le thème avant le rendu pour éviter un flash clair ou sombre.
  (() => {
    try {
      // Préférence enregistrée ; le thème sombre reste le défaut.
      const stored = window.localStorage.getItem('fp-theme');
      const theme = stored === 'light' ? 'light' : 'dark';

      // Pose le thème avant le premier rendu pour éviter un flash.
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', theme === 'dark' ? '#070b14' : '#e7dfd1');
    } 
    catch (error) {
      console.warn('Stockage local indisponible : thème sombre appliqué par défaut.', error);
      document.documentElement.dataset.theme = 'dark';
    }
  })();
