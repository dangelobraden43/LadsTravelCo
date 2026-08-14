---
name: optimize
description: Optimize the React + Vite bundle and media for performance. Use when Brady says "optimize", "compress", "speed up", "bundle size", "file size", or "PageSpeed".
---

# Optimization Workflow

The site is React + Vite (no static HTML). Optimize the production bundle
and the media pipeline, not inline base64.

## Bundle Analysis
1. Run `npm run build` and report per-chunk raw + gzip sizes from the Vite output.
2. Known heavy chunk: `three-vendor` (~863 KB raw / 227 KB gzip) — used only by
   the Globe/DepthHero. Confirm it stays behind its lazy boundary; never let it
   into the homepage entry chunk.
3. Verify every route is `lazy()`-loaded in `src/main.jsx` (framework chunks
   should be 5–33 KB each, loaded on demand).
4. Flag any new dependency that inflates `react-vendor` or the App entry.

## Media
- Images: run `npm run extract-images` (pipeline in `scripts/extract-images.js`).
  Report the largest assets in `dist/assets`; flag anything oversized.
- Video is served from Cloudinary, not bundled — confirm no video files landed
  in `dist/`.
- No base64-embedded images in source; if any exist, flag for extraction.

## Runtime / Meta
- [ ] Each route sets `<Helmet>` title + meta description + canonical (react-helmet-async).
- [ ] All 5 fonts in `index.html` load with `preconnect`.
- [ ] No render-blocking scripts added.
- [ ] Analytics/SpeedInsights stay in the App shell only.
- [ ] `prefers-reduced-motion` respected (GSAP hero + IntersectionObserver reveals).

## Output
Report a summary table (chunk / raw / gzip / lazy?) plus the largest assets,
then ask Brady which fixes to apply before changing anything.
