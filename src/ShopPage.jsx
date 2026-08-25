import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import './ShopPage.css'

/* ===== SHOP =====
   Static cards that link OUT to Shopify. Checkout, payment, shipping and tax
   all happen on Shopify's domain — nothing is transacted on ladstravel.com,
   which is exactly what /privacy states.

   EVERY value below is real, pulled from the connected Shopify store on
   Aug 17 2026. Never invent a product, a price, or an image. If a price
   changes in Shopify it must be changed here too — see the note in
   CLAUDE.md. Cards are deliberately price-ranged where the product has
   multiple variants so the card can't understate the real cost. */

const STORE = 'https://ladstravel.myshopify.com'

const HERO = {
  handle: 'scenic-shore-crewneck-sweatshirt-lads-travel-co-vintage-coastal-travel-graphic',
  name: 'Scenic Shore Crewneck',
  sub: 'Vintage coastal travel graphic',
  price: '$50.48 – $57.45',
  meta: 'S – 3XL',
  img: 'https://cdn.shopify.com/s/files/1/1001/6931/8682/files/3468546893014423118_2048.jpg?v=1783035575',
  line: 'The one that actually sold at the Scenic Shore table. Great Lakes shoreline, worn in.',
}

const PRODUCTS = [
  {
    handle: 'canvas-lunch-bag-vintage-travel-explore-the-world-seaside-design',
    name: 'Canvas Lunch Bag',
    sub: "'Explore The World' seaside design",
    price: '$22.99',
    meta: 'Natural · 8" × 12.5" × 5.5"',
    img: 'https://cdn.shopify.com/s/files/1/1001/6931/8682/files/16173150431711592235_2048.jpg?v=1783699442',
  },
  {
    handle: 'travel-magnet-lads-travel-co-explore-the-world-souvenir-fridge-magnet',
    name: 'Explore the World Magnet',
    sub: 'Topographic globe, location pins',
    price: '$9.99',
    meta: '3" × 3"',
    img: 'https://cdn.shopify.com/s/files/1/1001/6931/8682/files/8762525171198999119_1200.jpg?v=1783963334',
  },
  {
    handle: 'lads-travel-company-vintage-travel-badge-magnet',
    name: 'Vintage Travel Badge Magnet',
    sub: 'Jewel-toned destination badges',
    price: '$9.99',
    meta: '3" × 3"',
    img: 'https://cdn.shopify.com/s/files/1/1001/6931/8682/files/5439777295802067698_1200.jpg?v=1783909104',
  },
  /* PULLED Aug 25 2026 — `kiss-cut-vinyl-decals` ("Lads Travel Co.
     Sticker", $6.99). The artwork is a genuine Lads Paris crest, but the
     print file has a transparency checkerboard rasterized into it. All
     four Printify mockups (flat, glass, fridge, laptop) render the
     checker, which means it is in the uploaded print file, not just a bad
     preview export — a buyer would receive a sticker with a printed grey
     grid on it.

     This is a PRODUCT defect, not a site bug: /shop was showing exactly
     what Shopify has. The fix is in Printify (re-export with real alpha,
     re-upload, regenerate mockups, re-sync) and Printify is manual admin,
     not MCP. The product remains ACTIVE on Shopify by Brady's decision —
     only the card is pulled from this page.

     To restore: re-add the entry with the NEW image URL from Shopify, and
     rename to "Paris Sticker" to match the art and sit alongside the
     Barcelona and Prague city stickers. Do not restore against the old
     image. */
  {
    handle: 'barcelona-gaudi-square-sticker-vintage-travel-decal',
    name: 'Barcelona Gaudí Sticker',
    sub: 'Vintage travel decal',
    price: '$4.99',
    meta: '2" × 2"',
    img: 'https://cdn.shopify.com/s/files/1/1001/6931/8682/files/15842256168554504060_2048.jpg?v=1783963563',
  },
  {
    handle: 'prague-vintage-travel-sticker-retro-cityscape-square-sticker',
    name: 'Prague Sticker',
    sub: 'Retro cityscape',
    price: '$4.99',
    meta: '2" × 2"',
    img: 'https://cdn.shopify.com/s/files/1/1001/6931/8682/files/2969360584156208618_2048.jpg?v=1783963786',
  },
]

const url = (handle) => `${STORE}/products/${handle}`

function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useReveal()
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined
  return (
    <div ref={ref} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

export default function ShopPage() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Shop &mdash; The Lads Travel Co.</title>
        <meta
          name="description"
          content="A small, honest lineup — the Scenic Shore crewneck, a canvas lunch bag, magnets and stickers. Checkout happens on our Shopify store."
        />
        <link rel="canonical" href="https://ladstravel.com/shop" />
      </Helmet>

      <Nav scrolled={true} />

      <main className="shop-page">
        <header className="shop-hero">
          <Reveal>
            <div className="shop-eyebrow">LADS SHOP</div>
            <h1 className="shop-h1">
              Small lineup. <em>Things we actually made.</em>
            </h1>
            <p className="shop-lede">
              Not a merch empire &mdash; a handful of pieces we designed and would wear. Checkout
              happens on our Shopify store, so you&rsquo;ll hop over there to buy.
            </p>
          </Reveal>
        </header>

        {/* HERO PRODUCT */}
        <section className="shop-feature-section" aria-labelledby="feature-h">
          <h2 id="feature-h" className="sr-only">
            Featured
          </h2>
          <Reveal>
            <a
              className="shop-feature"
              href={url(HERO.handle)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="shop-feature-media">
                <img src={HERO.img} alt={HERO.name} loading="eager" />
              </div>
              <div className="shop-feature-body">
                <div className="shop-tag">THE ONE THAT SOLD</div>
                <h3 className="shop-feature-name">{HERO.name}</h3>
                <div className="shop-feature-sub">{HERO.sub}</div>
                <p className="shop-feature-line">{HERO.line}</p>
                <div className="shop-feature-price">{HERO.price}</div>
                <div className="shop-meta">{HERO.meta}</div>
                <div className="shop-cta">BUY ON SHOPIFY &rarr;</div>
              </div>
            </a>
          </Reveal>
        </section>

        {/* GRID */}
        <section className="shop-grid-section" aria-labelledby="grid-h">
          <h2 id="grid-h" className="sr-only">
            Everything else
          </h2>
          <div className="shop-grid">
            {PRODUCTS.map((p, i) => (
              <Reveal key={p.handle} delay={i * 70}>
                <a
                  className="shop-card"
                  href={url(p.handle)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="shop-card-media">
                    <img src={p.img} alt={p.name} loading="lazy" />
                  </div>
                  <div className="shop-card-body">
                    <h3 className="shop-card-name">{p.name}</h3>
                    <div className="shop-card-sub">{p.sub}</div>
                    <div className="shop-card-foot">
                      <span className="shop-card-price">{p.price}</span>
                      <span className="shop-card-go">BUY &rarr;</span>
                    </div>
                    <div className="shop-meta">{p.meta}</div>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="shop-note">
              Every purchase, payment and shipping detail is handled by Shopify on their site
              &mdash; nothing is charged on ladstravel.com. See our{' '}
              <Link to="/privacy">privacy page</Link> for what that means.
            </p>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  )
}
