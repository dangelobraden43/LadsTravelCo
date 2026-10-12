/* /deals — Holiday Travel Sales 2026.
 * Spec: docs/superpowers/specs/2026-10-12-deals-page-design.md (approved by Brady Oct 12 2026).
 * The honest alternative to deal sites: the catch printed first, a finder that answers "will
 * this sale cover my trip?", and every state computed from dates in src/data/holidayDeals.js
 * (src/utils/deals.js). Nothing here is typed as "on now" or counted by hand. */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import { resolveBooking } from './utils/affiliate.js'
import {
  todayISO,
  saleStatus,
  currentSales,
  lastYearSales,
  coversTrip,
  blackoutHits,
  missesSpringBreak,
  heroState,
} from './utils/deals.js'
import {
  EDITION,
  EVIDENCE,
  TRAPS,
  SALES,
  SEASONAL,
  KINDS,
  CHECKED_ON,
} from './data/holidayDeals.js'
import './DealsPage.css'

const fmt = (d, opts = { month: 'short', day: 'numeric' }) =>
  new Date(`${d}T12:00:00`).toLocaleDateString('en-US', opts)
const fmtY = (d) => fmt(d, { month: 'short', day: 'numeric', year: 'numeric' })
const fmtLong = (d) => fmt(d, { month: 'long', day: 'numeric', year: 'numeric' })
const span = (a, b) => (a && b ? `${fmtY(a)} – ${fmtY(b)}` : null)
const blackoutText = (b) => (Array.isArray(b) ? `${fmt(b[0])}–${fmt(b[1])}` : fmt(b))

const REGIONS = [
  ['world', 'Worldwide'],
  ['us', 'From the US'],
]

function Src({ href, checkedOn }) {
  if (!href) return null
  let host = 'source'
  try {
    host = new URL(href).hostname.replace(/^www\./, '')
  } catch {
    /* keep the fallback */
  }
  return (
    <span className="dl-src">
      <a href={href} target="_blank" rel="noopener noreferrer">
        Source: {host}
      </a>
      {checkedOn && <> · checked {fmtY(checkedOn)}</>}
    </span>
  )
}

function Hero({ today }) {
  const hs = heroState(EDITION, SALES, today)
  const { blackFriday, cyberMonday, travelTuesday } = EDITION.dates
  const line = {
    before: `${hs.daysToGo} ${hs.daysToGo === 1 ? 'day' : 'days'} until Black Friday.`,
    week: 'Sale week is on. Read the catch before the percentage.',
    tail: 'The main days are over. A few sales are still bookable below.',
    over: `The ${EDITION.year} sales are over. Below is what ran, to plan for next year.`,
  }[hs.state]
  return (
    <header className="dl-hero">
      <div className="dl-wrap">
        <div className="dl-eyebrow">{EDITION.eyebrow}</div>
        <h1>
          Holiday travel sales, <em>with the catch printed first.</em>
        </h1>
        <p className="dl-lede">
          When the {EDITION.year} sales run, how to tell a real deal from a normal fare with a
          banner on it, and which sales actually cover the trip you want. Every offer is in the
          brand&rsquo;s own words, with its source and the date we checked it.
        </p>
        <ol className="dl-dates" aria-label={`${EDITION.year} sale dates`}>
          <li>
            <b>{fmt(blackFriday)}</b>Black Friday
          </li>
          <li>
            <b>{fmt(cyberMonday)}</b>Cyber Monday
          </li>
          <li>
            <b>{fmt(travelTuesday)}</b>Travel Tuesday
          </li>
        </ol>
        <p className="dl-state" role="status">
          {line}
        </p>
        <div className="dl-ctas">
          <a className="dl-btn dl-btn-main" href="#finder">
            Will a sale cover my trip?
          </a>
          <a className="dl-btn dl-btn-ghost" href="#traps">
            Read the traps
          </a>
        </div>
      </div>
    </header>
  )
}

function Evidence() {
  return (
    <section id="evidence" className="dl-section">
      <div className="dl-wrap">
        <span className="dl-tag">Researched · the evidence</span>
        <h2 className="dl-h2">
          Is it actually <em>a deal?</em>
        </h2>
        <p className="dl-sub">
          Sometimes. The evidence that holiday sales beat normal prices is thinner than the
          advertising suggests.
        </p>
        <div className="dl-grid dl-grid-2">
          {EVIDENCE.map((e) => (
            <article key={e.id} className="dl-panel">
              <span className="dl-k">{e.kicker}</span>
              <h3>{e.title}</h3>
              <p>{e.body}</p>
              <Src href={e.src} checkedOn={e.checkedOn} />
            </article>
          ))}
        </div>
        <div className="dl-habit">
          <span className="dl-k">The one habit that works</span>
          <p>{EDITION.habit}</p>
        </div>
      </div>
    </section>
  )
}

function Traps() {
  return (
    <section id="traps" className="dl-section">
      <div className="dl-wrap">
        <span className="dl-tag">Researched · quoted from the brands&rsquo; own terms</span>
        <h2 className="dl-h2">
          The traps, <em>in their own fine print.</em>
        </h2>
        <div className="dl-grid dl-grid-3">
          {TRAPS.map((t) => (
            <article key={t.id} className="dl-panel dl-trap">
              <h3>{t.name}</h3>
              {t.quote && (
                <blockquote>
                  <mark>&ldquo;{t.quote}&rdquo;</mark>
                  <cite>{t.who}</cite>
                </blockquote>
              )}
              <p>{t.explain}</p>
              <Src href={t.src} checkedOn={t.checkedOn} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SaleCard({ sale, today }) {
  const status = saleStatus(sale, EDITION, today)
  const travel = span(sale.travelStart, sale.travelEnd)
  const viator = sale.viator ? resolveBooking(sale.viator) : null
  const [catchLine, ...rest] = sale.fineprint || []
  return (
    <article className={`dl-card dl-card-${status}`}>
      {catchLine && (
        <p className="dl-catch">
          <span>The catch</span>
          {catchLine}
        </p>
      )}
      <div className="dl-card-head">
        <h4>{sale.brand}</h4>
        {status === 'last-year' && <span className="dl-chip">{sale.year} · last year</span>}
        {status === 'announced' && (
          <span className="dl-chip dl-chip-on">Opens {fmt(sale.bookStart)}</span>
        )}
        {status === 'live' && <span className="dl-chip dl-chip-on">Bookable now</span>}
      </div>
      <p className="dl-offer">&ldquo;{sale.offer}&rdquo;</p>
      <dl className="dl-terms">
        {sale.appliesTo && (
          <>
            <dt>Applies to</dt>
            <dd>{sale.appliesTo}</dd>
          </>
        )}
        {sale.bookBy && (
          <>
            <dt>Book by</dt>
            <dd>{fmtY(sale.bookBy)}</dd>
          </>
        )}
        {travel && (
          <>
            <dt>Travel</dt>
            <dd>{travel}</dd>
          </>
        )}
        {sale.blackouts?.length > 0 && (
          <>
            <dt>Blackouts</dt>
            <dd>{sale.blackouts.map(blackoutText).join(', ')}</dd>
          </>
        )}
      </dl>
      {rest.length > 0 && (
        <ul className="dl-fine">
          {rest.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      {missesSpringBreak(sale) && (
        <p className="dl-flag">
          Travel window ends {fmt(sale.travelEnd)}: it misses most US spring breaks.
        </p>
      )}
      <div className="dl-card-foot">
        <Src href={sale.src} checkedOn={sale.checkedOn} />
        {viator && (
          <a
            className="dl-viator"
            href={viator.href}
            target="_blank"
            rel="sponsored noopener noreferrer"
          >
            See it on {viator.platform} · we earn a commission
          </a>
        )}
      </div>
    </article>
  )
}

function Finder({ today }) {
  const [from, setFrom] = useState('2027-01-18')
  const [to, setTo] = useState('2027-01-25')
  const [region, setRegion] = useState('all')
  const current = currentSales(SALES, EDITION, today)
  const usingLastYear = current.length === 0
  const pool = (usingLastYear ? lastYearSales(SALES, EDITION) : current).filter(
    (s) => (region === 'all' || s.region === region) && s.travelStart && s.travelEnd
  )
  const valid = from && to && from <= to
  const rows = valid
    ? pool
        .map((s) => ({ s, ok: coversTrip(s, from, to), hits: blackoutHits(s, from, to) }))
        .sort((a, b) => Number(b.ok) - Number(a.ok) || a.s.brand.localeCompare(b.s.brand))
    : []
  const yes = rows.filter((r) => r.ok).length

  return (
    <section id="finder" className="dl-section dl-finder">
      <div className="dl-wrap">
        <span className="dl-tag">Tool</span>
        <h2 className="dl-h2">
          Will a sale <em>cover my trip?</em>
        </h2>
        <p className="dl-sub">
          Most holiday sales only cover travel in a fixed window, with blackout dates on the busiest
          days. Put in your dates and see which ones fit.
          {usingLastYear &&
            ` Until the ${EDITION.year} terms are published, this uses last year's sales as a guide.`}
        </p>
        <div className="dl-controls">
          <label>
            Leave
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            Return
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <div className="dl-seg" role="group" aria-label="Region">
            {[['all', 'All'], ...REGIONS].map(([k, label]) => (
              <button
                key={k}
                type="button"
                aria-pressed={region === k}
                onClick={() => setRegion(k)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {!valid ? (
          <p className="dl-note">Pick a return date on or after the day you leave.</p>
        ) : (
          <>
            <p className="dl-note" aria-live="polite">
              {yes} of {rows.length} {usingLastYear ? `${EDITION.year - 1} sales` : 'sales'} would
              have covered {fmt(from)} – {fmt(to)}.
            </p>
            <ul className="dl-results">
              {rows.map(({ s, ok, hits }) => (
                <li key={s.id} className={ok ? 'is-yes' : 'is-no'}>
                  <b>{ok ? 'Fits' : 'No'}</b>
                  <span className="dl-r-brand">{s.brand}</span>
                  <span className="dl-r-why">
                    {ok
                      ? `Travel ${fmt(s.travelStart)} – ${fmt(s.travelEnd)}`
                      : hits.length
                        ? `Blackout: ${hits.map(blackoutText).join(', ')}`
                        : `Travel window is ${fmt(s.travelStart)} – ${fmt(s.travelEnd)}`}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  )
}

function SalesSection({ region, label, today }) {
  const mine = SALES.filter((s) => s.region === region)
  const current = currentSales(mine, EDITION, today)
  const past = lastYearSales(mine, EDITION)
  const kinds = KINDS.filter(([k]) => past.some((s) => s.kind === k))
  return (
    <section id={`sales-${region}`} className="dl-section">
      <div className="dl-wrap">
        <span className="dl-tag">Researched · {label}</span>
        <h2 className="dl-h2">
          {region === 'us' ? (
            <>
              The sales, <em>from the US.</em>
            </>
          ) : (
            <>
              The sales, <em>worldwide.</em>
            </>
          )}
        </h2>
        <p className="dl-sub">{EDITION.intro[region]}</p>
        {current.length > 0 && (
          <>
            <h3 className="dl-h3">{EDITION.year} sales</h3>
            <div className="dl-grid dl-grid-3">
              {current.map((s) => (
                <SaleCard key={s.id} sale={s} today={today} />
              ))}
            </div>
          </>
        )}
        {past.length > 0 && (
          <>
            <h3 className="dl-h3">
              What ran last year <span>({EDITION.year - 1}), the pattern to expect</span>
            </h3>
            {kinds.map(([k, kindLabel]) => (
              <div key={k} className="dl-kind">
                <h4 className="dl-kind-h">{kindLabel}</h4>
                <div className="dl-grid dl-grid-3">
                  {past
                    .filter((s) => s.kind === k)
                    .map((s) => (
                      <SaleCard key={s.id} sale={s} today={today} />
                    ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  )
}

function Seasonal({ today }) {
  const items = SEASONAL.filter((s) => !s.until || today <= s.until)
  return (
    <section id="seasonal" className="dl-section">
      <div className="dl-wrap">
        <span className="dl-tag">Researched · the calendar</span>
        <h2 className="dl-h2">
          The deals that <em>aren&rsquo;t on Black Friday.</em>
        </h2>
        <div className="dl-grid dl-grid-2">
          {items.map((s) => (
            <article key={s.id} className="dl-panel">
              <span className="dl-k">{s.when}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              {s.href && (
                <Link className="dl-inline" to={s.href}>
                  {s.hrefLabel}
                </Link>
              )}
              <Src href={s.src} checkedOn={s.checkedOn} />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function DealsPage() {
  const today = useMemo(() => todayISO(), [])
  const description = `When the ${EDITION.year} Black Friday, Cyber Monday and Travel Tuesday travel sales run, the catch in each one's fine print, and which sales cover the dates you want to travel.`
  return (
    <>
      <Helmet>
        <title>{`${EDITION.name} · The Lads Travel Co.`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://ladstravel.com/deals" />
        <meta property="og:title" content={`${EDITION.name} · The Lads Travel Co.`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://ladstravel.com/deals" />
      </Helmet>
      <Nav scrolled={true} />
      <main className="dl-page">
        <Hero today={today} />
        <Evidence />
        <Traps />
        <Finder today={today} />
        {REGIONS.map(([r, label]) => (
          <SalesSection key={r} region={r} label={label} today={today} />
        ))}
        <Seasonal today={today} />

        <section id="plan" className="dl-section dl-ask">
          <div className="dl-wrap">
            <h2 className="dl-h2">
              Found the sale? <em>We&rsquo;ll build the trip around it.</em>
            </h2>
            <div className="dl-ask-box">
              <p>
                Tell us your dates, who&rsquo;s coming and what you like. We research where to go,
                where to stay and what to book first, checked against official sources, so a sale
                fare turns into a trip worth taking.
              </p>
              <div className="dl-ctas">
                <Link className="dl-btn dl-btn-main" to="/plan-your-trip">
                  Plan my trip
                </Link>
                <Link className="dl-btn dl-btn-ghost" to="/join">
                  Join the founding list
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="dl-section dl-method">
          <div className="dl-wrap">
            <p>
              <b>Nobody paid to be on this page.</b> Brands do not pay for placement and we rank
              nothing. Links to airlines, hotels, rail and ski passes go to the brand&rsquo;s own
              page and earn us nothing; only a Viator link can earn us a commission, and it says so
              where it appears.
            </p>
            <p>
              Researched, not endorsed: every offer is quoted from the brand&rsquo;s own page where
              it publishes one, checked by our research agents and an independent fact-checker. Last
              full check {fmtLong(CHECKED_ON)}. Sales disappear from this page after their book-by
              date.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
