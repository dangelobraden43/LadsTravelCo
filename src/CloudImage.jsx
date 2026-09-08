/* CLOUD IMAGE — the site's image delivery layer.
 *
 * Ruled by Brady on Sept 8 2026: photography is served from Cloudinary, and
 * this is architected as a REUSABLE COMPONENT rather than something Peru owns.
 * Peru is simply the first framework to use it.
 *
 * WHY THIS EXISTS AT ALL. `dist` has been sitting at 40 MB against an 8 MB
 * target, and the JavaScript is not the problem: `dist/assets` is 2.7 MB and
 * the other ~37 MB is photographs shipped as build output. Every framework that
 * gains real imagery makes that worse. An image served from here adds nothing
 * to the bundle, arrives as AVIF or WebP when the browser supports it, and is
 * resized per device instead of shipping one full-size file to a phone.
 *
 * WHAT IT GUARANTEES, because these are the things that go wrong:
 *   - ZERO LAYOUT SHIFT. `width` and `height` are required and set as
 *     attributes, so the box is reserved before a byte of image arrives.
 *   - ALT TEXT IS REQUIRED. Not defaulted, not optional. A decorative image
 *     must say so explicitly by passing alt="".
 *   - LAZY BELOW THE FOLD, EAGER ABOVE IT. `priority` opts into eager loading
 *     plus high fetch priority for a hero; everything else defers.
 *   - BLUR-UP. A 24px version of the same asset paints immediately behind the
 *     real one, so the space is never an empty rectangle.
 *
 * ⛔ Do not hardcode a res.cloudinary.com URL anywhere else. If a surface needs
 * an image, it comes through here, or the next audit finds three different
 * transform strings that disagree about quality.
 */

import { useState } from 'react'
import './CloudImage.css'

const CLOUD_NAME = 'doonck2rm'
const BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

/* The widths a real device actually asks for. Kept short on purpose: every
 * extra entry is another derived asset Cloudinary has to generate and cache. */
const WIDTHS = [480, 768, 1080, 1440, 1920, 2560]

/* `f_auto` picks AVIF/WebP/JPEG per browser, `q_auto` picks the quality that
 * survives the content. Both are Cloudinary-side, so the source stays master. */
const src = (id, w) => `${BASE}/f_auto,q_auto,w_${w}/${id}`

/* The blur-up frame: 24px wide, heavily compressed, blurred so the upscale
 * reads as intentional rather than broken. */
const placeholder = (id) => `${BASE}/f_auto,q_10,w_24,e_blur:400/${id}`

export default function CloudImage({
  id,
  alt,
  width,
  height,
  priority = false,
  sizes = '100vw',
  className = '',
  objectPosition,
}) {
  const [loaded, setLoaded] = useState(false)

  if (alt === undefined) {
    /* Loud on purpose. A missing alt is an accessibility defect that renders
     * perfectly, which is exactly the class of bug that survives review. */
    throw new Error(`CloudImage: alt is required for "${id}". Pass alt="" if decorative.`)
  }

  const srcSet = WIDTHS.map((w) => `${src(id, w)} ${w}w`).join(', ')

  return (
    <span
      className={`cloudimg${loaded ? ' is-loaded' : ''} ${className}`.trim()}
      style={{
        aspectRatio: `${width} / ${height}`,
        backgroundImage: `url("${placeholder(id)}")`,
      }}
    >
      <img
        src={src(id, 1440)}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        style={objectPosition ? { objectPosition } : undefined}
      />
    </span>
  )
}
