import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
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
