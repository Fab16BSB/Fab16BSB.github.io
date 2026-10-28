import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { seo } from './src/data/seo.data';

/** Échappe les valeurs injectées dans les attributs HTML. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Injecte les métadonnées SEO et le JSON-LD dans index.html. */
function seoHtml(): Plugin {
  return {
    name: 'seo-html',
    transformIndexHtml(html) {
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: seo.name,
        jobTitle: seo.jobTitle,
        url: seo.url,
        image: seo.image,
        sameAs: seo.socialProfiles,
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: seo.alumniOf,
        },
        knowsAbout: seo.knowsAbout,
      };

      return html
        .replaceAll('%HTML_LANG%', escapeHtml(seo.lang))
        .replaceAll('%SEO_TITLE%', escapeHtml(seo.title))
        .replaceAll('%SEO_DESCRIPTION%', escapeHtml(seo.description))
        .replaceAll('%SEO_URL%', escapeHtml(seo.url))
        .replaceAll('%SEO_NAME%', escapeHtml(seo.name))
        .replaceAll('%SEO_IMAGE%', escapeHtml(seo.image))
        .replaceAll('%SEO_IMAGE_WIDTH%', String(seo.imageWidth))
        .replaceAll('%SEO_IMAGE_HEIGHT%', String(seo.imageHeight))
        .replaceAll('%SEO_IMAGE_ALT%', escapeHtml(seo.imageAlt))
        .replaceAll('%SEO_LOCALE%', escapeHtml(seo.locale))
        .replaceAll('%SEO_TWITTER_CARD%', escapeHtml(seo.twitterCard))
        .replace(
          '<!-- SEO_JSON_LD -->',
          `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n    </script>`,
        );
    },
  };
}

export default defineConfig({
  plugins: [react(), seoHtml()],
  // Site utilisateur servi à la racine de fab16bsb.github.io.
  base: '/',
  define: {
    // Date de build affichée dans le footer.
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
