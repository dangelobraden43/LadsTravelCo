import React, { Suspense, lazy, useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { IMAGES, BATCH3_IMAGES } from './images-paths'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { reportWebVitals } from './utils/vitals'
import { initSmoothScroll } from './utils/animations'
import Clarity from '@microsoft/clarity'
import './index.css'

const FrameworkPage = lazy(() => import('./FrameworkPage'))
const ExplorePage = lazy(() => import('./ExplorePage'))
const AdventurePage = lazy(() => import('./AdventurePage'))
const WhenPage = lazy(() => import('./WhenPage'))
const PlanPage = lazy(() => import('./PlanPage'))
const LadsPage = lazy(() => import('./LadsPage'))

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
  'thailand',
  'michigan',
  'charleston',
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense fallback={<div style={{ background: '#141210', height: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/adventure" element={<AdventurePage />} />
          <Route path="/when" element={<WhenPage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/lads" element={<LadsPage />} />
          {DESTINATIONS.map((slug) => (
            <Route key={slug} path={`/${slug}`} element={<LazyFramework slug={slug} />} />
          ))}
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </HelmetProvider>
)

reportWebVitals()
initSmoothScroll()
