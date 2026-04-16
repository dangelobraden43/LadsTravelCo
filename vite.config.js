import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: false, gzipSize: true, filename: 'dist/bundle-report.html' }),
    viteCompression({ algorithm: 'gzip', threshold: 1024 }),
    viteCompression({ algorithm: 'brotliCompress', threshold: 1024 }),
    sitemap({
      hostname: 'https://ladstravel.com',
      dynamicRoutes: [
        '/', '/dublin-galway', '/italy', '/spain', '/australia-nz', '/iceland',
        '/prague-vienna', '/munich', '/poland', '/thailand', '/charleston',
        '/lads-local', '/vegas-zion-rise', '/jordi',
      ],
      changefreq: 'weekly',
      priority: {
        '/': 1.0,
        '/dublin-galway': 0.9, '/italy': 0.9, '/spain': 0.9,
        '/australia-nz': 0.8, '/iceland': 0.8, '/prague-vienna': 0.8,
        '/munich': 0.7, '/poland': 0.7, '/thailand': 0.8, '/charleston': 0.7,
        '/lads-local': 0.7, '/vegas-zion-rise': 0.8, '/jordi': 0.6,
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
