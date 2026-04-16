#!/usr/bin/env node
/**
 * Enhance hero photos for the 3D depth experience
 * Boosts contrast, saturation, sharpness, and applies per-image tuning
 */
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const OUT_DIR = 'public/images/hero-enhanced'
fs.mkdirSync(OUT_DIR, { recursive: true })

const photos = [
  {
    src: 'public/images/images/colosseum.webp',
    out: 'colosseum.webp',
    // Night shot — lift shadows slightly, boost warm tones, increase contrast
    ops: (img) => img
      .modulate({ brightness: 1.1, saturation: 1.4 })
      .linear(1.3, -30) // contrast boost
      .sharpen({ sigma: 1.5, m1: 1.0, m2: 0.5 })
      .resize(1920, null, { withoutEnlargement: true })
  },
  {
    src: 'public/images/images/opera.webp',
    out: 'opera.webp',
    // Golden hour — boost warmth and saturation, moderate contrast
    ops: (img) => img
      .modulate({ brightness: 1.05, saturation: 1.35 })
      .linear(1.2, -20)
      .sharpen({ sigma: 1.2, m1: 0.8, m2: 0.4 })
      .resize(1920, null, { withoutEnlargement: true })
  },
  {
    src: 'public/images/images/iceland.webp',
    out: 'iceland.webp',
    // Volcanic landscape — boost reds and greens, strong contrast
    ops: (img) => img
      .modulate({ brightness: 1.08, saturation: 1.5 })
      .linear(1.35, -35)
      .sharpen({ sigma: 1.5, m1: 1.0, m2: 0.5 })
      .resize(1920, null, { withoutEnlargement: true })
  },
  {
    src: 'public/images/images/cliffs.webp',
    out: 'cliffs.webp',
    // Moody landscape — boost greens, deepen shadows, strong contrast
    ops: (img) => img
      .modulate({ brightness: 1.05, saturation: 1.45 })
      .linear(1.3, -25)
      .sharpen({ sigma: 1.3, m1: 0.9, m2: 0.5 })
      .resize(1920, null, { withoutEnlargement: true })
  },
]

async function enhance() {
  for (const photo of photos) {
    console.log(`Enhancing ${photo.src}...`)
    const img = sharp(photo.src)
    const enhanced = photo.ops(img)

    const outPath = path.join(OUT_DIR, photo.out)
    await enhanced
      .webp({ quality: 88 })
      .toFile(outPath)

    const stats = fs.statSync(outPath)
    const origStats = fs.statSync(photo.src)
    console.log(`  ${photo.out}: ${(origStats.size/1024).toFixed(0)}KB → ${(stats.size/1024).toFixed(0)}KB`)
  }
  console.log('\nDone! Enhanced photos in', OUT_DIR)
}

enhance().catch(console.error)
