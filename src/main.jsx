import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import dublinData from './data/dublin'
import spainData from './data/spain'
import romeData from './data/rome'
import australiaData from './data/australia'
import icelandData from './data/iceland'
import pragueData from './data/prague'
import munichData from './data/munich'
import polandData from './data/poland'
import thailandData from './data/thailand'
import michiganData from './data/michigan'
import charlestonData from './data/charleston'
import { IMAGES, BATCH3_IMAGES } from './images-paths'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { reportWebVitals } from './utils/vitals'
import './index.css'

const FrameworkPage = lazy(() => import('./FrameworkPage'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <Suspense fallback={<div style={{ background: '#141210', height: '100vh' }} />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/dublin"
            element={<FrameworkPage data={dublinData} heroImg={IMAGES.cliffs} />}
          />
          <Route
            path="/spain"
            element={<FrameworkPage data={spainData} heroImg={IMAGES.sagrada} />}
          />
          <Route
            path="/rome"
            element={<FrameworkPage data={romeData} heroImg={IMAGES.colosseum} />}
          />
          <Route
            path="/australia"
            element={<FrameworkPage data={australiaData} heroImg={IMAGES.opera} />}
          />
          <Route
            path="/iceland"
            element={<FrameworkPage data={icelandData} heroImg={IMAGES.iceland} />}
          />
          <Route
            path="/prague"
            element={<FrameworkPage data={pragueData} heroImg={IMAGES.stvitus} />}
          />
          <Route
            path="/munich"
            element={
              <FrameworkPage data={munichData} heroImg={BATCH3_IMAGES.munichMarienplatz} />
            }
          />
          <Route path="/poland" element={<FrameworkPage data={polandData} />} />
          <Route path="/thailand" element={<FrameworkPage data={thailandData} />} />
          <Route path="/michigan" element={<FrameworkPage data={michiganData} />} />
          <Route path="/charleston" element={<FrameworkPage data={charlestonData} />} />
        </Routes>
      </Suspense>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  </HelmetProvider>
)

reportWebVitals()
