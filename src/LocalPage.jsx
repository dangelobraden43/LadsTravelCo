/* /local — Lads Local: the Midwest on one model, and what is on there.
 *
 * The stage is a 3D relief of the six states and the Great Lakes (LocalMap). Cities are
 * found in the data and offered as fly-ins; a column of light stands on every venue with a
 * dated event in the chosen dates. Everything the canvas shows is also reachable below it
 * as ordinary lists, with 44px targets and a keyboard.
 *
 * ⛔ Every number on this page is counted from src/data/localIndex.js at render. Never type one.
 * ⛔ Gold is a place a founder has been. Copper is everything else, and says so.
 * ⛔ No ticket prices, anywhere.
 */
import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import EarlyAccess from './EarlyAccess'
import {
  LAYERS,
  KIND_LABELS,
  LOCAL_PLACES,
  PINNED,
  WALKED_TOTAL,
  OTHER_TOTAL,
  UNPINNED_WALKED,
  HUBS,
  hubIdOf,
  hubById,
  placeById,
  LOCAL_EVENTS,
  EVENT_TYPES,
  EVENT_GROUPS,
  EVENTS_META,
  eventsBetween,
  dateWindows,
  localISO,
} from './data/localIndex'
import { GOLF_SLATE, GOLF_SOURCE } from './data/localBestOf'
import { MIDWEST_RELIEF } from './data/midwestRelief'
import './LocalPage.css'

const LocalMap = lazy(() => import('./LocalMap'))

const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ')
const DAYS = 'Sun Mon Tue Wed Thu Fri Sat'.split(' ')
const parse = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const shortDate = (iso) => {
  const d = parse(iso)
  return `${DAYS[d.getDay()]} ${MONTHS[d.getMonth()]} ${d.getDate()}`
}
const longDate = (iso) => {
  const d = parse(iso)
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
const eventWhen = (e) =>
  e.endDate && e.endDate !== e.date
    ? `${shortDate(e.date)} to ${shortDate(e.endDate)}`
    : shortDate(e.date)

/* 100 world units span the frame's width; this is how many kilometres one of them is. */
const B = MIDWEST_RELIEF.bounds
const KM_PER_UNIT =
  ((B.east - B.west) * 111.2 * Math.cos((((B.north + B.south) / 2) * Math.PI) / 180)) / 100
const hubDist = (hub) => Math.min(20, Math.max(3.6, (hub.spreadKm / KM_PER_UNIT) * 3.6 + 3))

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

function EventRow({ e, onPlace, showPlace = true }) {
  const place = e.placeId ? placeById(e.placeId) : null
  return (
    <li className="lp-event">
      <span className="lp-event-date">{eventWhen(e)}</span>
      <span className="lp-event-main">
        <span className="lp-event-title">{e.title}</span>
        {showPlace && (
          <span className="lp-event-where">
            {place && place.pinned ? (
              <button type="button" onClick={() => onPlace(place.id)}>
                {e.venue}
              </button>
            ) : (
              e.venue
            )}
            {e.city ? `, ${e.city}` : ''}
          </span>
        )}
      </span>
      {e.note && <span className="lp-event-note">{e.note}</span>}
      <span className="lp-event-type">{EVENT_TYPES[e.type] || 'Event'}</span>
      <a
        className="lp-event-link"
        href={e.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${e.title}: details on the organiser's own page`}
      >
        Details
      </a>
    </li>
  )
}

function PlaceCard({ place, events, onClose, onPlace }) {
  const walked = place.tier === 'walked'
  return (
    <aside className="lp-card" aria-label={place.name}>
      <button type="button" className="lp-card-close" onClick={onClose} aria-label="Close">
        &times;
      </button>
      <p className="lp-card-eyebrow">
        {KIND_LABELS[place.kind] || 'Place'}
        {place.city || place.area ? ` · ${place.city || place.area}` : ''}
        {place.state && place.city ? `, ${place.state}` : ''}
      </p>
      <h2 className="lp-card-title">{place.name}</h2>
      <p className={`lp-chip ${walked ? 'lp-chip--gold' : 'lp-chip--copper'}`}>{place.status}</p>
      {place.what && <p className="lp-card-what">{place.what}</p>}
      {place.caution && <p className="lp-card-caution">{place.caution}</p>}
      {place.capacity && (
        <p className="lp-card-fact">Holds about {place.capacity.toLocaleString()} people.</p>
      )}
      {place.google && (
        <p className="lp-card-fact">
          Google rates it {place.google.rating}
          {place.google.reviews ? ` across ${place.google.reviews.toLocaleString()} reviews` : ''}.
          That is Google&rsquo;s number, not ours.
        </p>
      )}
      {!place.pinned && (
        <p className="lp-card-fact">
          Not on the map: we do not hold a recorded coordinate for it, and we do not look one up
          from a name.
        </p>
      )}
      {events.length > 0 && (
        <>
          <h3 className="lp-card-h">On here</h3>
          <ul className="lp-events lp-events--card">
            {events.slice(0, 8).map((e) => (
              <EventRow key={e.id} e={e} onPlace={onPlace} showPlace={false} />
            ))}
          </ul>
          {events.length > 8 && (
            <p className="lp-card-fact">And {events.length - 8} more in the list below.</p>
          )}
        </>
      )}
      <div className="lp-card-actions">
        {place.url && (
          <a className="lp-btn" href={place.url} target="_blank" rel="noopener noreferrer">
            {place.urlLabel || 'Open the official site'}
          </a>
        )}
        {place.link && (
          <Link className="lp-btn" to={place.link.to}>
            {place.link.label}
          </Link>
        )}
        <Link className="lp-btn lp-btn--quiet" to="/plan-your-trip">
          Plan a trip around it
        </Link>
      </div>
      <p className="lp-card-credit">Source: {place.source}</p>
    </aside>
  )
}

function HubCard({ hub, places, events, onClose, onPlace }) {
  const byLayer = LAYERS.map((l) => [l, places.filter((p) => p.layer === l.id)]).filter(
    ([, list]) => list.length
  )
  return (
    <aside className="lp-card" aria-label={hub.name}>
      <button type="button" className="lp-card-close" onClick={onClose} aria-label="Close">
        &times;
      </button>
      <p className="lp-card-eyebrow">City</p>
      <h2 className="lp-card-title">{hub.name}</h2>
      <p className="lp-card-what">
        {plural(places.length, 'place')} on the map here
        {events.length ? `, and ${plural(events.length, 'event')} in the dates you chose` : ''}.
      </p>
      {events.length > 0 && (
        <>
          <h3 className="lp-card-h">On in these dates</h3>
          <ul className="lp-events lp-events--card">
            {events.slice(0, 6).map((e) => (
              <EventRow key={e.id} e={e} onPlace={onPlace} />
            ))}
          </ul>
          {events.length > 6 && (
            <p className="lp-card-fact">And {events.length - 6} more in the list below.</p>
          )}
        </>
      )}
      {byLayer.map(([layer, list]) => (
        <div key={layer.id}>
          <h3 className="lp-card-h">{layer.long}</h3>
          <ul className="lp-card-places">
            {list.map((p) => (
              <li key={p.id}>
                <button type="button" onClick={() => onPlace(p.id)}>
                  <span className={`lp-dot lp-dot--${p.tier === 'walked' ? 'gold' : 'copper'}`} />
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  )
}

export default function LocalPage() {
  const windows = useMemo(() => dateWindows(), [])
  const [windowId, setWindowId] = useState('week')
  const [layers, setLayers] = useState(() => new Set(LAYERS.map((l) => l.id)))
  const [hubId, setHubId] = useState(null)
  const [selected, setSelected] = useState(null)
  const [group, setGroup] = useState('all')
  const [city, setCity] = useState('all')
  const [more, setMore] = useState(false)
  const [query, setQuery] = useState('')
  const stageRef = useRef(null)
  // ?poster renders the model alone, for the still picture shown when a browser has no 3D
  const poster = useMemo(() => /[?&]poster(?![a-z])/.test(window.location.search), [])

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])
  useEffect(() => {
    const esc = (e) => {
      if (e.key !== 'Escape') return
      setSelected((s) => {
        if (!s) setHubId(null)
        return null
      })
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])

  const win = windows.find((w) => w.id === windowId) || windows[0]
  const inWindow = useMemo(() => eventsBetween(win.from, win.to), [win])
  const place = selected ? placeById(selected) : null
  const hub = hubId ? hubById(hubId) : null

  /* what the canvas draws */
  const shown = useMemo(() => {
    const zoomed = Boolean(hubId || selected)
    return new Set(
      PINNED.filter(
        (p) => layers.has(p.layer) && (zoomed || !hubIdOf(p.id) || p.id === selected)
      ).map((p) => p.id)
    )
  }, [layers, hubId, selected])
  const beams = useMemo(() => {
    const tally = new Map()
    inWindow.forEach((e) => {
      const p = e.placeId && placeById(e.placeId)
      if (p && p.pinned) tally.set(p.id, (tally.get(p.id) || 0) + 1)
    })
    return [...tally.entries()].map(([id, count]) => {
      const p = placeById(id)
      return { id, lat: p.lat, lng: p.lng, count }
    })
  }, [inWindow])
  const hubs = useMemo(
    () =>
      HUBS.map((h) => ({
        id: h.id,
        name: h.name,
        lat: h.lat,
        lng: h.lng,
        walked: h.walked,
        count: h.memberIds.filter((id) => layers.has(placeById(id).layer)).length,
        events: inWindow.filter((e) => e.placeId && h.memberIds.includes(e.placeId)).length,
      })).filter((h) => h.count > 0),
    [layers, inWindow]
  )
  const focus = useMemo(() => {
    if (place && place.pinned) {
      const h = hubById(hubIdOf(place.id))
      return { lat: place.lat, lng: place.lng, dist: h ? Math.min(hubDist(h), 9) : 15 }
    }
    if (hub) return { lat: hub.lat, lng: hub.lng, dist: hubDist(hub) }
    return null
  }, [place, hub])

  const toStage = () => {
    if (stageRef.current) stageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const choosePlace = useCallback((id) => {
    setSelected(id)
    setHubId(hubIdOf(id))
  }, [])
  const choosePlaceFromList = (id) => {
    choosePlace(id)
    toStage()
  }
  const chooseHub = useCallback((id) => {
    setSelected(null)
    setHubId(id)
  }, [])
  const home = () => {
    setSelected(null)
    setHubId(null)
  }
  const toggleLayer = (id) =>
    setLayers((cur) => {
      const next = new Set(cur)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next.size ? next : new Set(LAYERS.map((l) => l.id))
    })

  /* the board under the map */
  const types = EVENT_GROUPS.find((g) => g.id === group).types
  const cities = useMemo(() => {
    const tally = new Map()
    inWindow.forEach((e) => e.city && tally.set(e.city, (tally.get(e.city) || 0) + 1))
    return [...tally.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c)
  }, [inWindow])
  const board = inWindow.filter(
    (e) => (!types || types.includes(e.type)) && (city === 'all' || e.city === city)
  )
  const boardShown = more ? board : board.slice(0, 40)

  const hubEvents = hub
    ? inWindow.filter((e) => e.placeId && hub.memberIds.includes(e.placeId))
    : []
  const hubPlaces = hub ? hub.memberIds.map(placeById).filter((p) => layers.has(p.layer)) : []
  const placeEvents = place
    ? LOCAL_EVENTS.filter((e) => e.placeId === place.id && e.last >= localISO())
    : []

  /* the index */
  const q = query.trim().toLowerCase()
  const hit = (p) =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    (p.city || p.area || '').toLowerCase().includes(q) ||
    (KIND_LABELS[p.kind] || '').toLowerCase().includes(q)
  const indexGroups = [
    ...HUBS.map((h) => [h.name, h.memberIds.map(placeById).filter(hit)]),
    ['Across the region', LOCAL_PLACES.filter((p) => p.pinned && !hubIdOf(p.id) && hit(p))],
    ['Places we have been that are not on the map yet', UNPINNED_WALKED.filter(hit)],
  ].filter(([, list]) => list.length)

  const checked = EVENTS_META.checkedOn ? longDate(EVENTS_META.checkedOn) : null
  const description = `A 3D map of the Midwest and the Great Lakes: ${WALKED_TOTAL} places we have been, ${OTHER_TOTAL} more researched and marked as not visited, and dated events at the region's venues read from each venue's own calendar.`

  return (
    <div className="lp-page">
      <Helmet>
        <title>Lads Local: what&rsquo;s on across the Midwest | The Lads Travel Co.</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://ladstravel.com/local" />
        <meta property="og:title" content="Lads Local: Good Brews · Good Views · Good News" />
        <meta property="og:description" content={description} />
        <meta property="og:url" content="https://ladstravel.com/local" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Lads Local: Good Brews · Good Views · Good News',
            url: 'https://ladstravel.com/local',
            description,
            isPartOf: {
              '@type': 'WebSite',
              name: 'The Lads Travel Co.',
              url: 'https://ladstravel.com',
            },
          })}
        </script>
      </Helmet>
      <Nav scrolled={true} />

      <section
        className={`lm-stage${place || hub ? ' has-card' : ''}${poster ? ' is-poster' : ''}`}
        ref={stageRef}
        aria-label="The Midwest map"
      >
        <Suspense
          fallback={
            <div className="lm-loading" role="status">
              Drawing the map&hellip;
            </div>
          }
        >
          <LocalMap
            places={PINNED}
            shown={shown}
            hubs={poster ? [] : hubs}
            beams={beams}
            focus={focus}
            selected={selected}
            onSelect={choosePlace}
            onHub={chooseHub}
          />
        </Suspense>

        <header className="lm-title">
          <p className="lm-eyebrow">Lads Local · Good Brews · Good Views · Good News</p>
          <h1>
            <span className="lm-line">
              <span>Find what&rsquo;s on</span>
            </span>
            <span className="lm-line">
              <span>in the Midwest.</span>
            </span>
          </h1>
          <p className="lm-lede">
            Pick a city to fly in. A column of light means something is on there in the dates you
            choose.
          </p>
          <ul className="lm-key" aria-label="What the marks mean">
            <li>
              <span className="lp-dot lp-dot--gold" />
              {WALKED_TOTAL} we have been to
            </li>
            <li>
              <span className="lp-dot lp-dot--copper" />
              {OTHER_TOTAL} researched, not visited
            </li>
          </ul>
        </header>

        {(hub || place) && (
          <button type="button" className="lm-home" onClick={home}>
            &larr; The whole Midwest
          </button>
        )}

        <div className="lm-dock">
          <div className="lm-seg" role="group" aria-label="Which dates to show">
            {windows.map((w) => (
              <button
                key={w.id}
                type="button"
                aria-pressed={w.id === windowId}
                className={w.id === windowId ? 'is-on' : undefined}
                onClick={() => setWindowId(w.id)}
              >
                {w.label}
              </button>
            ))}
          </div>
          <div className="lm-layers" role="group" aria-label="Which places to show">
            {LAYERS.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={layers.has(l.id)}
                className={layers.has(l.id) ? 'is-on' : undefined}
                onClick={() => toggleLayer(l.id)}
                title={l.long}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="lm-count" role="status">
            {inWindow.length
              ? `${plural(inWindow.length, 'event')} at ${plural(beams.length, 'venue')}, ${shortDate(win.from)} to ${shortDate(win.to)}`
              : `No dated events on our list between ${shortDate(win.from)} and ${shortDate(win.to)}`}
          </p>
        </div>

        {place ? (
          <PlaceCard
            place={place}
            events={placeEvents}
            onClose={() => setSelected(null)}
            onPlace={choosePlace}
          />
        ) : hub ? (
          <HubCard
            hub={hub}
            places={hubPlaces}
            events={hubEvents}
            onClose={home}
            onPlace={choosePlace}
          />
        ) : null}
      </section>

      <section className="lp-section" aria-labelledby="lp-on-h">
        <div className="lp-head">
          <h2 id="lp-on-h">What&rsquo;s on</h2>
          <p>
            {win.label}: {shortDate(win.from)} to {shortDate(win.to)}. Each line was read from the
            venue&rsquo;s, team&rsquo;s or organiser&rsquo;s own page, which is where
            &ldquo;Details&rdquo; takes you. Dates move, so check there before you travel.
            {checked ? ` Last read ${checked}.` : ''}
          </p>
        </div>
        <div className="lp-filters">
          <div className="lm-seg lm-seg--flat" role="group" aria-label="Which dates to show">
            {windows.map((w) => (
              <button
                key={w.id}
                type="button"
                aria-pressed={w.id === windowId}
                className={w.id === windowId ? 'is-on' : undefined}
                onClick={() => {
                  setWindowId(w.id)
                  setMore(false)
                }}
              >
                {w.label}
              </button>
            ))}
          </div>
          <div className="lm-layers" role="group" aria-label="Which kind of event">
            {EVENT_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={g.id === group}
                className={g.id === group ? 'is-on' : undefined}
                onClick={() => setGroup(g.id)}
              >
                {g.label}
              </button>
            ))}
          </div>
          {cities.length > 1 && (
            <label className="lp-select">
              <span className="lp-sr">City</span>
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option value="all">Every city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        {board.length ? (
          <ul className="lp-events">
            {boardShown.map((e) => (
              <EventRow key={e.id} e={e} onPlace={choosePlaceFromList} />
            ))}
          </ul>
        ) : (
          <p className="lp-note">
            Nothing on our list matches that. Try a longer stretch of dates.
          </p>
        )}
        {board.length > boardShown.length && (
          <button type="button" className="lp-btn lp-btn--quiet" onClick={() => setMore(true)}>
            Show all {board.length}
          </button>
        )}
      </section>

      <section className="lp-section" aria-labelledby="lp-index-h">
        <div className="lp-head lp-head--row">
          <h2 id="lp-index-h">Every place</h2>
          <label>
            <span className="lp-sr">Search places by name, city or kind</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Place, city or kind"
            />
          </label>
        </div>
        {indexGroups.map(([title, list]) => (
          <div key={title} className="lp-index-group">
            <h3>
              {title} <span>{list.length}</span>
            </h3>
            <ul>
              {list.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={p.id === selected ? 'is-active' : undefined}
                    aria-pressed={p.id === selected}
                    onClick={() => choosePlaceFromList(p.id)}
                  >
                    <span className={`lp-dot lp-dot--${p.tier === 'walked' ? 'gold' : 'copper'}`} />
                    <span className="lp-index-name">{p.name}</span>
                    <span className="lp-index-kind">{KIND_LABELS[p.kind] || ''}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {indexGroups.length === 0 && <p className="lp-note">No place matches that search.</p>}
      </section>

      <section className="lp-section lp-two" aria-label="More from Lads Local">
        <Link to="/michigan" className="lp-feature">
          <p className="lp-card-eyebrow">Home turf</p>
          <h2>Michigan</h2>
          <p>
            The guide behind the gold marks: breweries, golf and road trips across both peninsulas,
            all places we have been.
          </p>
          <span className="lp-feature-cta">Open the Michigan guide &rarr;</span>
        </Link>
        <details className="lp-golf">
          <summary>
            <span className="lp-card-eyebrow">Golf</span>
            <span className="lp-golf-h">
              Golfweek&rsquo;s top {GOLF_SLATE.length} public courses in Michigan
            </span>
          </summary>
          <ol>
            {GOLF_SLATE.map((g) => (
              <li key={g.rank}>
                <span className={`lp-dot lp-dot--${g.ladsPlayed ? 'gold' : 'copper'}`} />
                {g.name}, {g.town}
                {g.ladsPlayed ? ' (we have played it)' : ''}
              </li>
            ))}
          </ol>
          <p className="lp-card-credit">
            The ranking is{' '}
            <a href={GOLF_SOURCE.url} target="_blank" rel="noopener noreferrer">
              Golfweek&rsquo;s
            </a>
            , not ours. Read {longDate(GOLF_SOURCE.checkedOn)}.
          </p>
        </details>
      </section>

      <section className="lp-section lp-sources" aria-labelledby="lp-how-h">
        <h2 id="lp-how-h">How this page is built</h2>
        <div className="lp-how">
          <div>
            <h3>Two kinds of mark, never mixed</h3>
            <p>
              Gold is a place one of us has been. Copper is a place we have researched or saved and
              have not visited, and the page says so on every one. We do not rate or describe in our
              own voice a place we have not been to.
            </p>
          </div>
          <div>
            <h3>Every pin stands on a record</h3>
            <p>
              Coordinates come from our own saved places or from a published record for that exact
              place, such as its Wikidata entry. We never look a location up from a name. A place
              with no record is listed and left off the map.
            </p>
          </div>
          <div>
            <h3>Events come from the venue</h3>
            <p>
              Each event was read from the venue&rsquo;s, team&rsquo;s or organiser&rsquo;s own
              calendar and links back to it. An event that has passed leaves the page by itself. We
              show no ticket prices.
            </p>
          </div>
        </div>
        <p className="lp-credit">
          The terrain is measured elevation from the open Terrarium tiles (USGS, SRTM and others).
          State outlines and lake shores are from Natural Earth. Place identities and coordinates
          for researched places are from Wikidata. The model is stylised: the Midwest is flat, so
          heights are exaggerated a great deal to make the land readable. The Hop Passport is a
          third-party Michigan brewery programme, not ours.
        </p>
      </section>

      <section className="lp-section">
        <EarlyAccess variant="compact" source="/local" />
      </section>

      <Footer />
    </div>
  )
}
