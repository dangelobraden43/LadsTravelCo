import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import sitemap from 'vite-plugin-sitemap';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

/* BUILD-TIME CANONICAL STATS.
 *
 * Every site-wide number the site displays — total spots, validated cities,
 * countries, continents, frameworks — is computed HERE, by importing the real
 * framework data files during the build and walking them, then handed to the
 * app as the virtual module `virtual:lads-stats`.
 *
 * Why a virtual module and not a plain import: Globe.jsx can afford to import
 * all ten data files because it already sits behind a lazy three.js boundary.
 * The homepage cannot — a static import of ten data files would pull roughly
 * 150 KB of prose into the first paint just to render the number 220. The
 * virtual module ships the integers and nothing else.
 *
 * Why not a generated file committed to the repo: a committed artefact goes
 * stale exactly the way the hardcoded strings did. This is recomputed on every
 * build and on every dev-server data edit, so it cannot.
 */
function ladsCanonicalStats() {
  const VIRTUAL_ID = 'virtual:lads-stats';
  // Rollup convention: a resolved virtual id is prefixed with a NUL byte so no
  // other plugin and no filesystem lookup can claim it.
  const RESOLVED_ID = '\0' + VIRTUAL_ID;
  const dataDir = path.resolve(process.cwd(), 'src/data');

  /* Node caches ESM by URL, so a dev-server edit to a data file would keep
   * serving the old numbers. The cache-busting query is what makes the count
   * update on save rather than only on restart. */
  const fresh = (file) => import(pathToFileURL(file).href + '?v=' + Date.now());

  /* Walks the real data files and returns every canonical number. Shared by
   * the virtual module and by the index.html meta-description rewrite, so the
   * page shell and the app can never disagree about how many spots exist. */
  async function computeStats() {
    const derive = await fresh(path.resolve(process.cwd(), 'src/utils/derive.js'));
    const canonical = await fresh(path.join(dataDir, 'canonical.js'));

    const perFramework = {};
    let totalSpots = 0;
    for (const fw of canonical.FRAMEWORKS) {
      const mod = await fresh(path.join(dataDir, fw.slug + '.js'));
      const data = mod.default || Object.values(mod)[0];
      const n = derive.walkSpots(data).length;
      perFramework[fw.slug] = n;
      totalSpots += n;
    }
    return { canonical, perFramework, totalSpots };
  }

  return {
    name: 'lads-canonical-stats',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },

    /* The three meta descriptions in index.html are what search results and
     * link previews actually render. They carried hand-typed counts, and on
     * Aug 25 2026 all three were found claiming "285+ spots / 12 frameworks"
     * against a canonical 219/9. They are tokens now, filled from the same
     * walk the app uses. */
    async transformIndexHtml(html) {
      const { canonical, totalSpots } = await computeStats();
      return html
        .split('%LADS_SPOTS%')
        .join(String(totalSpots))
        .split('%LADS_FRAMEWORKS%')
        .join(String(canonical.FRAMEWORK_COUNT));
    },

    async load(id) {
      if (id !== RESOLVED_ID) return;

      const { canonical, perFramework, totalSpots } = await computeStats();

      const lines = [
        '/* GENERATED AT BUILD TIME by ladsCanonicalStats() in vite.config.js.',
        ' * Do not edit it, do not commit a copy of it, and do not type these',
        ' * numbers anywhere else. Walked from the real src/data/*.js files on',
        ' * ' + new Date().toISOString().slice(0, 10) + '. */',
        'export const TOTAL_SPOTS = ' + totalSpots + ';',
        'export const SPOTS_BY_FRAMEWORK = ' + JSON.stringify(perFramework) + ';',
        'export const VALIDATED_CITIES = ' + canonical.VALIDATED_CITY_COUNT + ';',
        'export const COUNTRIES = ' + canonical.COUNTRY_COUNT + ';',
        'export const CONTINENTS = ' + canonical.CONTINENT_COUNT + ';',
        'export const FRAMEWORKS = ' + canonical.FRAMEWORK_COUNT + ';',
      ];
      return lines.join('\n');
    },

    /* A data-file edit must invalidate the computed module, or the dev server
     * keeps showing a number the data no longer supports — the exact bug this
     * whole mechanism replaces. */
    handleHotUpdate({ file, server }) {
      if (!file.split(path.sep).join('/').includes('/src/data/')) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
      if (mod) server.moduleGraph.invalidateModule(mod);
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    ladsCanonicalStats(),
    // Written OUTSIDE dist/ on purpose. At dist/bundle-report.html it was
    // deploying to production with every build — 368 KB publicly readable at
    // ladstravel.com/bundle-report.html, mapping the whole internal module
    // structure. It is a local build artefact, not a page.
    visualizer({ open: false, gzipSize: true, filename: '.bundle-report.html' }),
    viteCompression({ algorithm: 'gzip', threshold: 1024 }),
    viteCompression({ algorithm: 'brotliCompress', threshold: 1024 }),
    sitemap({
      hostname: 'https://ladstravel.com',
      dynamicRoutes: [
        '/',
        '/global', '/outdoors', '/bucket-list', '/local',
        '/dublin', '/rome', '/spain', '/australia', '/iceland', '/prague', '/vienna',
        '/munich', '/poland', '/michigan',
        // thailand + charleston were RETIRED Aug 13 2026 and have no route.
        // They sat in this sitemap for three weeks pointing search engines at
        // two 404s. Removed Sept 2 2026 - do not re-add them unless the
        // frameworks come back out of retired/.
      ],
      changefreq: 'weekly',
      priority: {
        '/': 1.0,
        '/global': 0.9, '/outdoors': 0.9, '/bucket-list': 0.9, '/local': 0.9,
        '/dublin': 0.9, '/rome': 0.9, '/spain': 0.9,
        '/australia': 0.8, '/iceland': 0.8, '/prague': 0.8, '/vienna': 0.8,
        '/munich': 0.7, '/poland': 0.7,
        '/michigan': 0.7,
      },
    }),
  ],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'react-vendor';
          if (id.includes('node_modules/three') || id.includes('node_modules/@react-three')) return 'three-vendor';
          if (id.includes('src/images-heic-card')) return 'images-heic-card';
          if (id.includes('src/images-heic-hero')) return 'images-heic-hero';
          if (id.includes('src/images-hero')) return 'images-hero';
          if (id.includes('src/images-batch4')) return 'images-batch4';
          if (id.includes('src/images-batch3')) return 'images-batch3';
          if (id.includes('src/images-new')) return 'images-new';
          if (id.endsWith('src/images.js')) return 'images';
        },
      },
    },
  },
});
