/* /deals — Holiday Travel Sales 2026.
 * Spec: docs/superpowers/specs/2026-10-12-deals-page-design.md. Rebuilt Oct 12 2026 after
 * Brady's review: lead with what to do for your trip, then five rules, then a short list of
 * sales. Every state is computed from dates in src/data/holidayDeals.js (src/utils/deals.js);
 * nothing is typed as "on now" or counted by hand. */
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import {
  todayISO,
  saleStatus,
  currentSales,
  lastYearSales,
  coversTrip,
  blackoutHits,
  heroState,
  shiftYears,
} from './utils/deals.js'
import {
  EDITION,
  PLANS,
  RULES,
  RIGHTS,
  PROOF,
  HABIT,
  GROUPS,
  SALES,
  CHECKED_ON,
} from './data/holidayDeals.js'
import './DealsPage.css'

const fmt = (d, opts = { month: 'short', day: 'numeric' }) =>
  new Date(`${d}T12:00:00`).toLocaleDateString('en-US', opts)
const fmtLong = (d) => fmt(d, { month: 'long', day: 'numeric', year: 'numeric' })
const blackoutText = (b) => (Array.isArray(b) ? `${fmt(b[0])} to ${fmt(b[1])}` : fmt(b))
const host = (href) => {
  try {
    return new URL(href).hostname.replace(/^www\./, '')
  } catch {
    return 'source'
  }
}

function Sources({ list }) {
  return (
    <p className="dl-sources">
      Sources:{' '}
      {list.map((href, i) => (
        <span key={href}>
          {i > 0 && ', '}
          <a href={href} target="_blank" rel="noopener noreferrer">
            {host(href)}
          </a>
        </span>
      ))}
    </p>
  )
}

function Hero({ today }) {
  const hs = heroState(EDITION, SALES, today)
  const { blackFriday, cyberMonday, travelTuesday } = EDITION.dates
  const now = {
    before: `Nothing worth buying is on sale yet. Use the next ${hs.daysToGo} days to look up what your trip costs today, so you’ll know a real deal when you see one.`,
    week: 'The sales are on. Check the travel dates and blackouts before you look at the percentage.',
    tail: 'The big days are over, but a few sales run into mid-December. The ones still open are at the top of the list below.',
    over: 'This year’s sales are over. The next big round is the first week of January.',
  }[hs.state]
  return (
    <header className="dl-hero">
      <div className="dl-wrap">
        <p className="dl-eyebrow">Holiday travel sales {EDITION.year}</p>
        <h1>
          The travel sales are coming. <em>Here’s how to use them.</em>
        </h1>
        <p className="dl-lede">
          When they run, whether they’ll cover the trip you want, and what to check before you pay.
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
        <div className="dl-now" role="status">
          <span>Right now</span>
          <p>{now}</p>
        </div>
      </div>
    </header>
  )
}

function Plans() {
  const [active, setActive] = useState(PLANS[0].id)
  const plan = PLANS.find((p) => p.id === active)
  return (
    <section id="plan-it" className="dl-section">
      <div className="dl-wrap">
        <h2 className="dl-h2">What are you planning?</h2>
        <div className="dl-tabs" role="tablist" aria-label="Choose your trip">
          {PLANS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              id={`tab-${p.id}`}
              aria-selected={p.id === active}
              aria-controls="plan-panel"
              onClick={() => setActive(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="dl-plan" id="plan-panel" role="tabpanel" aria-labelledby={`tab-${plan.id}`}>
          <p className="dl-verdict">{plan.verdict}</p>
          <ol className="dl-steps">
            {plan.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <div className="dl-plan-foot">
            {plan.tool && (
              <a className="dl-link" href="#check">
                Check your dates against last year’s sales
              </a>
            )}
            {plan.link && (
              <Link className="dl-link" to={plan.link.to}>
                {plan.link.label}
              </Link>
            )}
          </div>
          <Sources list={plan.sources} />
        </div>
      </div>
    </section>
  )
}

function Rules() {
  return (
    <section id="rules" className="dl-section">
      <div className="dl-wrap">
        <h2 className="dl-h2">Five rules before you buy</h2>
        <ol className="dl-rules">
          {RULES.map((r) => (
            <li key={r.id}>
              <h3>{r.title}</h3>
              <p>
                {r.body}{' '}
                <a className="dl-cite" href={r.src} target="_blank" rel="noopener noreferrer">
                  Source
                </a>
              </p>
            </li>
          ))}
        </ol>
        <p className="dl-rights">
          {RIGHTS.body}{' '}
          <a className="dl-cite" href={RIGHTS.src} target="_blank" rel="noopener noreferrer">
            Source
          </a>
        </p>
      </div>
    </section>
  )
}

function Proof() {
  return (
    <section id="real" className="dl-section">
      <div className="dl-wrap">
        <h2 className="dl-h2">Are the deals real?</h2>
        <div className="dl-proof">
          {PROOF.map((p) => (
            <div key={p.id}>
              <h3>{p.title}</h3>
              <p>
                {p.body}{' '}
                <a className="dl-cite" href={p.src} target="_blank" rel="noopener noreferrer">
                  Source
                </a>
              </p>
            </div>
          ))}
        </div>
        <p className="dl-habit">{HABIT}</p>
      </div>
    </section>
  )
}

function Checker({ today }) {
  const [from, setFrom] = useState('2027-03-13')
  const [to, setTo] = useState('2027-03-20')
  const [region, setRegion] = useState('us')
  const dated = (s) => s.travelStart && s.travelEnd
  const current = currentSales(SALES, EDITION, today).filter(dated)
  const usingLastYear = current.length === 0
  const pool = (usingLastYear ? lastYearSales(SALES, EDITION).filter(dated) : current).filter(
    (s) => region === 'all' || s.region === region
  )
  const valid = from && to && from <= to
  const back = (d) => (usingLastYear ? shiftYears(d, -1) : d)
  const rows = valid
    ? pool
        .map((s) => ({
          s,
          ok: coversTrip(s, back(from), back(to)),
          hits: blackoutHits(s, back(from), back(to)),
        }))
        .sort((a, b) => Number(b.ok) - Number(a.ok) || a.s.brand.localeCompare(b.s.brand))
    : []
  const yes = rows.filter((r) => r.ok).length

  return (
    <section id="check" className="dl-section dl-check">
      <div className="dl-wrap">
        <h2 className="dl-h2">Would a sale cover your dates?</h2>
        <p className="dl-sub">
          Each sale only covers trips inside its own dates.
          {usingLastYear &&
            ' This year’s haven’t been announced, so put in your dates and see which of last year’s sales would have covered the same week.'}
        </p>
        <div className="dl-controls">
          <label>
            Leave
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </label>
          <label>
            Come back
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <div className="dl-seg" role="group" aria-label="Which sales">
            {[
              ['us', 'Flying from the U.S.'],
              ['all', 'Everything'],
            ].map(([k, label]) => (
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
          <p className="dl-answer">Pick a return date on or after the day you leave.</p>
        ) : (
          <>
            <p className="dl-answer" aria-live="polite">
              {usingLastYear && 'Last year, '}
              <b>
                {yes} of {rows.length}
              </b>{' '}
              {usingLastYear ? 'sales would have covered' : 'sales cover'} {fmt(from)} to {fmt(to)}.
            </p>
            <ul className="dl-results">
              {rows.map(({ s, ok, hits }) => (
                <li key={s.id} className={ok ? 'is-yes' : 'is-no'}>
                  <span className="dl-mark" aria-hidden="true">
                    {ok ? '✓' : '✕'}
                  </span>
                  <span className="dl-r-brand">{s.brand}</span>
                  <span className="dl-r-why">
                    {ok
                      ? s.summary
                      : hits.length
                        ? `Blacked out ${hits.map(blackoutText).join(', ')}`
                        : `Only covered ${fmt(s.travelStart)} to ${fmt(s.travelEnd)}`}
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

function SaleRow({ sale, today }) {
  const status = saleStatus(sale, EDITION, today)
  const covers =
    sale.travelStart && sale.travelEnd
      ? `${fmt(sale.travelStart)} to ${fmt(sale.travelEnd)}`
      : sale.travelEnd
        ? `Until ${fmt(sale.travelEnd)}`
        : null
  const booking =
    status === 'last-year'
      ? sale.bookStart
        ? `${fmt(sale.bookStart)} to ${fmt(sale.bookBy)}`
        : `Until ${fmt(sale.bookBy)}`
      : sale.bookStart && status === 'announced'
        ? `Opens ${fmt(sale.bookStart)}`
        : sale.bookBy
          ? `Ends ${fmt(sale.bookBy)}`
          : 'On now, no end date given'
  return (
    <li className="dl-row">
      <details>
        <summary>
          <span className="dl-row-brand">{sale.brand}</span>
          <span className="dl-row-what">{sale.summary}</span>
          <span className="dl-row-meta">
            {covers && (
              <span>
                <i>Trips</i>
                {covers}
              </span>
            )}
            <span>
              <i>{status === 'last-year' ? 'Sale ran' : 'Booking'}</i>
              {booking}
            </span>
          </span>
        </summary>
        <div className="dl-row-more">
          <ul>
            {sale.fineprint.map((f) => (
              <li key={f}>{f}</li>
            ))}
            {sale.blackouts?.length > 0 && (
              <li>Blacked out: {sale.blackouts.map(blackoutText).join(', ')}.</li>
            )}
          </ul>
          <a href={sale.src} target="_blank" rel="noopener noreferrer">
            Source: {host(sale.src)}
          </a>
        </div>
      </details>
    </li>
  )
}

function SalesList({ today }) {
  const current = currentSales(SALES, EDITION, today)
  const past = lastYearSales(SALES, EDITION)
  return (
    <section id="sales" className="dl-section">
      <div className="dl-wrap">
        <h2 className="dl-h2">The sales to watch</h2>
        {current.length > 0 && (
          <>
            <h3 className="dl-h3">Announced for {EDITION.year}</h3>
            <ul className="dl-rows dl-rows-now">
              {current.map((s) => (
                <SaleRow key={s.id} sale={s} today={today} />
              ))}
            </ul>
          </>
        )}
        <h3 className="dl-h3">What ran last year</h3>
        <p className="dl-sub">
          Most brands repeat the same kind of sale each year, so last year’s is the best guide to
          what’s coming. Tap any line for the fine print.
        </p>
        {GROUPS.map(([g, label]) => {
          const rows = past.filter((s) => s.group === g)
          if (!rows.length) return null
          return (
            <div key={g} className="dl-group">
              <h4>{label}</h4>
              <ul className="dl-rows">
                {rows.map((s) => (
                  <SaleRow key={s.id} sale={s} today={today} />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default function DealsPage() {
  const today = useMemo(() => todayISO(), [])
  const description = `When the ${EDITION.year} Black Friday, Cyber Monday and Travel Tuesday travel sales run, whether they cover your trip, and five things to check before you pay.`
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
        <Plans />
        <Rules />
        <Checker today={today} />
        <Proof />
        <SalesList today={today} />

        <section id="plan" className="dl-section dl-ask">
          <div className="dl-wrap">
            <h2 className="dl-h2">Found a good fare? We’ll build the trip.</h2>
            <p className="dl-sub">
              Tell us your dates, who’s coming and what you’re into. We’ll research where to go,
              where to stay and what to book first.
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
        </section>

        <section className="dl-section dl-method">
          <div className="dl-wrap">
            <p>
              No brand pays to be on this page, and none of these links earn us anything. Every fact
              was checked against the brand’s own page or a named source on {fmtLong(CHECKED_ON)}.
              Sales drop off this page when they end.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
