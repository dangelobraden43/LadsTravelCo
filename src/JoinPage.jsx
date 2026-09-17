import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import EarlyAccess from './EarlyAccess'
import { LAUNCH_LABEL } from './utils/launch.js'
import { TOTAL_SPOTS, VALIDATED_CITIES, COUNTRIES } from './utils/siteStats.js'

/* /join — the front door.
 *
 * Every count on this page is DERIVED from virtual:lads-stats, which is walked
 * out of the real data files at build time. Nothing here is typed, for the same
 * reason nothing anywhere else is: a number in a string goes stale silently and
 * nobody notices until an audit finds it.
 *
 * ⛔ The copy rules for this page live at the top of EarlyAccess.jsx. Short
 * version: no "free", no price, nothing sold or reserved. Read them before
 * editing a word of this. */
export default function JoinPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Early Access &mdash; The Lads Travel Co.</title>
        <meta
          name="description"
          content={`The Lads Travel Club opens ${LAUNCH_LABEL} with a capped founding group. Join the list, or tell us about a trip you have coming up this year.`}
        />
        <link rel="canonical" href="https://ladstravel.com/join" />
        <meta property="og:title" content="Early Access — The Lads Travel Co." />
        <meta
          property="og:description"
          content={`The Club opens ${LAUNCH_LABEL} and the founding group is capped. Join the list.`}
        />
        <meta property="og:url" content="https://ladstravel.com/join" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Nav scrolled={true} />

      <div style={{ background: '#141210', minHeight: '100vh', paddingTop: 80 }}>
        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: 'clamp(48px, 7vw, 88px) clamp(16px, 4vw, 32px) 20px',
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 3,
              color: '#b8886e',
              textTransform: 'uppercase',
              marginBottom: 14,
            }}
          >
            Preview &middot; the Club opens {LAUNCH_LABEL}
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 'clamp(2.3rem, 5.5vw, 3.9rem)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#e8dcc8',
              lineHeight: 1.1,
              margin: '0 0 18px',
              textWrap: 'balance',
            }}
          >
            AI guesses. We went.
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16.5,
              lineHeight: 1.75,
              color: '#b8ad9a',
              maxWidth: '62ch',
              margin: 0,
            }}
          >
            {TOTAL_SPOTS} places across {VALIDATED_CITIES} cities and {COUNTRIES} countries, and the
            rule behind all of them is the same: if we have not stood in it, we say so. That is the
            whole product, and it is why there is a list rather than a checkout on this page today.
          </p>
        </section>

        <section
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 clamp(16px, 4vw, 32px) clamp(56px, 8vw, 96px)',
          }}
        >
          <EarlyAccess variant="full" source="/join" />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: 20,
              marginTop: 34,
            }}
          >
            {[
              [
                'What you are joining',
                'A list. When the Club opens you hear from us first, and the founding group is capped because we would rather do a few trips properly.',
              ],
              [
                'What we do with it',
                'Your email, and whatever you chose to tell us about where you want to go. Nothing is sold on, and you can ask us to delete it any time.',
              ],
              [
                'Travelling this year',
                'Tell us about the trip when you join. We are advising a handful of trips this autumn while we build, and we will come back to you.',
              ],
            ].map(([h, b]) => (
              <div
                key={h}
                style={{
                  background: '#1c1915',
                  border: '1px solid rgba(232,220,200,0.10)',
                  borderRadius: 16,
                  padding: '22px 24px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 1.8,
                    color: '#d4a843',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  {h}
                </div>
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: '#8a8070',
                    margin: 0,
                  }}
                >
                  {b}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
