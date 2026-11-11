/* /outdoors/parks — The Parks Map.
 *
 * The map is the page: a full-bleed 3D relief of the lower 48 under a dusk sky, with a
 * light on every national park, and a typeset index underneath that reaches every park
 * (including the ones off the canvas: Alaska, Hawaii, American Samoa, the Virgin Islands).
 *
 * PREVIEW: noindex and out of the sitemap until Brady approves the design.
 * Honesty: everything here is the Park Service's own record, labelled as theirs. No Lads
 * voice, no walked claims. Entrance fees are government-set official fees, shown exactly
 * with their source and check date (ruled Oct 12, 2026). Dusk palette: /outdoors only.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Nav } from './App'
import Footer from './Footer'
import { PARKS, PARKS_SOURCE } from './data/nationalParks'
import { PARK_HIKES, HIKES_SOURCE } from './data/parkHikes'
import ParksMap, { REGIONS, shortName } from './ParksMap'
import './ParksMapPage.css'

const STATE_NAMES = {
  AK: 'Alaska',
  AR: 'Arkansas',
  AS: 'American Samoa',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  FL: 'Florida',
  HI: 'Hawaii',
  ID: 'Idaho',
  IN: 'Indiana',
  KY: 'Kentucky',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NM: 'New Mexico',
  NV: 'Nevada',
  OH: 'Ohio',
  OR: 'Oregon',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VI: 'U.S. Virgin Islands',
  WA: 'Washington',
  WV: 'West Virginia',
  WY: 'Wyoming',
}
const stateList = (p) => p.states.map((s) => STATE_NAMES[s] || s).join(', ')

const checked = new Date(PARKS_SOURCE.checkedOn + 'T12:00:00').toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function fee(f) {
  return {
    what:
      f.title.replace(/^Entrance\s*-\s*/i, '').replace(/^Entrance Fee\s*-?\s*/i, '') || 'Entrance',
    cost: f.cost === 0 ? 'No fee' : `$${Number.isInteger(f.cost) ? f.cost : f.cost.toFixed(2)}`,
  }
}

/* The Park Service lists activities alphabetically, shop and bookstore included. Show the
 * ones a traveller plans around, in this order, and only if the Service lists them. */
const PLAN_AROUND = [
  'Hiking',
  'Backcountry Hiking',
  'Camping',
  'Wildlife Watching',
  'Climbing',
  'Caving',
  'Canyoneering',
  'Paddling',
  'Whitewater Rafting',
  'Snorkeling',
  'SCUBA Diving',
  'Boating',
  'Fishing',
  'Swimming',
  'Skiing',
  'Snowshoeing',
  'Stargazing',
  'Scenic Driving',
  'Biking',
  'Horse Trekking',
  'Guided Tours',
]
const thingsToDo = (park) => PLAN_AROUND.filter((a) => park.activities.includes(a)).slice(0, 6)

const hikesChecked = new Date(HIKES_SOURCE.checkedOn + 'T12:00:00').toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

function ParkCard({ park, onClose }) {
  const ref = useRef(null)
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0
  }, [park.code])
  const fees = park.entranceFees.slice(0, 4).map(fee)
  const hikes = PARK_HIKES[park.code] || []
  return (
    <aside className="pk-card" ref={ref} aria-live="polite" aria-label={park.name}>
      <button type="button" className="pk-card-close" onClick={onClose}>
        Whole map
      </button>
      <h2 className="pk-card-title">{shortName(park)}</h2>
      <p className="pk-card-where">{stateList(park)}</p>
      {park.npsDescription && (
        <>
          <p className="pk-card-body">{park.npsDescription}</p>
          <p className="pk-card-credit">Description from the National Park Service</p>
        </>
      )}
      {hikes.length > 0 && (
        <section className="pk-trails" aria-label="Hikes the Park Service lists">
          <h3>Hikes the Park Service lists</h3>
          <ol>
            {hikes.map((h) => (
              <li key={h.id}>
                <a href={h.url} target="_blank" rel="noopener noreferrer">
                  {h.title}
                </a>
                {h.duration && <span>{h.duration.toLowerCase()}</span>}
              </li>
            ))}
          </ol>
          <p className="pk-card-credit">From the National Park Service, checked {hikesChecked}</p>
        </section>
      )}
      {fees.length > 0 && (
        <table className="pk-fees">
          <caption>Entrance fees</caption>
          <tbody>
            {fees.map((f) => (
              <tr key={f.what}>
                <th scope="row">{f.what}</th>
                <td>{f.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {thingsToDo(park).length > 0 && (
        <p className="pk-card-do">
          <span>Things to do there include </span>
          {thingsToDo(park).join(', ').toLowerCase()}.
        </p>
      )}
      <div className="pk-card-actions">
        <a className="pk-btn" href={park.url} target="_blank" rel="noopener noreferrer">
          Open the official park page
        </a>
        <Link className="pk-btn pk-btn--quiet" to="/plan-your-trip">
          Plan a trip around it
        </Link>
      </div>
      {fees.length > 0 && <p className="pk-card-credit">Official fees, checked {checked}</p>}
    </aside>
  )
}

export default function ParksMapPage() {
  const [selected, setSelected] = useState(null)
  const [region, setRegion] = useState('lower48')
  const [query, setQuery] = useState('')
  const [hinted, setHinted] = useState(null)
  const stageRef = useRef(null)
  const park = PARKS.find((p) => p.code === selected) || null

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const hit = (p) =>
      !q || p.name.toLowerCase().includes(q) || stateList(p).toLowerCase().includes(q)
    return [
      ...REGIONS.map((r) => [r.label, PARKS.filter((p) => p.region === r.id && hit(p))]),
      ['Island parks', PARKS.filter((p) => !p.region && hit(p))],
    ]
  }, [query])

  const chooseFromIndex = (code) => {
    const chosen = PARKS.find((p) => p.code === code)
    // a park in another region brings its own map with it
    if (chosen && chosen.region) setRegion(chosen.region)
    setSelected(code)
    if (stageRef.current) stageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="pk-page">
      <Helmet>
        <title>The Parks Map: every U.S. national park on real terrain | The Lads Travel Co.</title>
        <meta
          name="description"
          content="A 3D relief map of every U.S. national park, built from the National Park Service's own records: where each park is, what it is known for and what it charges at the gate."
        />
        <link rel="canonical" href="https://ladstravel.com/outdoors/parks" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Nav scrolled={true} />

      <section
        className={`pk-stage${park ? ' has-park' : ''}`}
        ref={stageRef}
        aria-label="The parks map"
      >
        <ParksMap
          parks={PARKS}
          region={region}
          selected={selected}
          onSelect={setSelected}
          hinted={hinted}
        />
        <header className="pk-title">
          <h1>
            <span className="pk-line">
              <span>Find your</span>
            </span>
            <span className="pk-line">
              <span>national park.</span>
            </span>
          </h1>
          <p>
            Every U.S. national park is on this map. Pick a marker to see what the park is known for
            and what it costs at the gate.
          </p>
        </header>
        <div className="pk-regions" role="group" aria-label="Which map to show">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={region === r.id}
              className={region === r.id ? 'is-on' : undefined}
              onClick={() => {
                setRegion(r.id)
                setSelected(null)
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
        {park && <ParkCard park={park} onClose={() => setSelected(null)} />}
      </section>

      <section className="pk-index" aria-label="Index of national parks">
        <div className="pk-index-head">
          <h2>Find a park</h2>
          <label>
            <span className="pk-sr">Search parks by name or state</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Park or state"
            />
          </label>
        </div>
        {groups.map(([title, list]) =>
          list.length === 0 ? null : (
            <div key={title} className="pk-index-group">
              <h3>{title}</h3>
              <ul>
                {list.map((p) => (
                  <li key={p.code}>
                    <button
                      type="button"
                      className={p.code === selected ? 'is-active' : undefined}
                      aria-pressed={p.code === selected}
                      onClick={() => chooseFromIndex(p.code)}
                      onPointerEnter={() => setHinted(p.code)}
                      onPointerLeave={() => setHinted(null)}
                      onFocus={() => setHinted(p.code)}
                      onBlur={() => setHinted(null)}
                    >
                      <span className="pk-index-name">{shortName(p)}</span>
                      <span className="pk-index-dots" aria-hidden="true" />
                      <span className="pk-index-state">{p.states.join(' ')}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
        {groups.every(([, l]) => l.length === 0) && (
          <p className="pk-note">No park matches that search.</p>
        )}
      </section>

      <section className="pk-sources" aria-label="Sources">
        <p>
          Park names, locations, descriptions, activities and entrance fees are the{' '}
          <a href={PARKS_SOURCE.url} target="_blank" rel="noopener noreferrer">
            National Park Service
          </a>
          &rsquo;s own records, read on {checked}. The terrain is measured elevation from the open
          Terrarium tiles (USGS, SRTM and others), with lakes and borders from Natural Earth. State
          lines are from Natural Earth too, and each park outline is the Park Service&rsquo;s own
          boundary record. The model is stylised: heights are exaggerated so mountains read at this
          scale, and snow is drawn above a set line that drops toward the north. It is not a snow
          report.
        </p>
      </section>

      <Footer />
    </div>
  )
}
