import React, { Suspense, lazy, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import { IMAGES, BATCH3_IMAGES } from './images-paths'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { reportWebVitals } from './utils/vitals'
import RouteBoundary from './RouteBoundary'
import Clarity from '@microsoft/clarity'
import './index.css'

const FrameworkPage = lazy(() => import('./FrameworkPage'))
const ExplorePage = lazy(() => import('./ExplorePage'))
const AdventurePage = lazy(() => import('./AdventurePage'))
const WhenPage = lazy(() => import('./WhenPage'))
const PlanPage = lazy(() => import('./PlanPage'))
const LadsPage = lazy(() => import('./LadsPage'))
const GiftPage = lazy(() => import('./GiftPage'))
const OutdoorsPage = lazy(() => import('./OutdoorsPage'))
const BucketListPage = lazy(() => import('./BucketListPage'))
const LocalPage = lazy(() => import('./LocalPage'))
const PrivacyPage = lazy(() => import('./PrivacyPage'))
const ShopPage = lazy(() => import('./ShopPage'))
const GoodNews = lazy(() => import('./GoodNews'))

Clarity.init('wbqqkbsekh')

const HERO_IMAGES = {
  dublin: IMAGES.cliffs,
  spain: IMAGES.sagrada,
  rome: IMAGES.colosseum,
  australia: IMAGES.opera,
  iceland: IMAGES.iceland,
  prague: IMAGES.stvitus,
  munich: BATCH3_IMAGES.munichMarienplatz,
}

function LazyFramework({ slug }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    setData(null)
    import(`./data/${slug}.js`).then((mod) => setData(mod.default))
  }, [slug])

  if (!data) {
    return (
      <div
        style={{
          background: '#141210',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 3,
            color: '#d4a843',
          }}
        >
          LOADING...
        </span>
      </div>
    )
  }

  return <FrameworkPage data={data} heroImg={HERO_IMAGES[slug]} />
}

const DESTINATIONS = [
  'dublin',
  'spain',
  'rome',
  'australia',
  'iceland',
  'prague',
  'munich',
  'poland',
  'michigan',
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense fallback={<div style={{ background: '#141210', height: '100vh' }} />}>
        <RouteBoundary>
          <Routes>
            <Route path="/" element={<App />} />
            {/* Four-collection spine */}
            <Route path="/global" element={<ExplorePage />} />
            <Route path="/outdoors" element={<OutdoorsPage />} />
            <Route path="/bucket-list" element={<BucketListPage />} />
            <Route path="/local" element={<LocalPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/shop" element={<ShopPage />} />
            {/* Kept reachable (out of nav) */}
            <Route path="/good-news" element={<GoodNews />} />
            <Route path="/when" element={<WhenPage />} />
            <Route path="/lads" element={<LadsPage />} />
            <Route path="/gift/michigan" element={<GiftPage />} />
            {/* Old-path redirects */}
            <Route path="/explore" element={<Navigate to="/global" replace />} />
            <Route path="/adventure" element={<Navigate to="/outdoors" replace />} />
            <Route path="/plan" element={<Navigate to="/" replace />} />
            <Route path="/story" element={<Navigate to="/" replace />} />
            {DESTINATIONS.map((slug) => (
              <Route key={slug} path={`/${slug}`} element={<LazyFramework slug={slug} />} />
            ))}
          </Routes>
        </RouteBoundary>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </HelmetProvider>
)

reportWebVitals()
