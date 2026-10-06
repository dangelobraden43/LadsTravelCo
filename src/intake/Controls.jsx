/* The quiz's input controls. Phone-first by rule (Oct 6 2026 intake research):
 * every target is at least 44px, nothing is dragged, no plain <select>, and every
 * choice is a real <button type="button"> carrying aria-pressed. */
import { useState } from 'react'

const PATHS = {
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  leaf: 'M5 19c0-8 6-14 15-14 0 9-6 15-14 15M5 19l7-7',
  calendar: 'M4 6h16v14H4zM4 10h16M9 3v4M15 3v4',
  dice: 'M5 5h14v14H5zM9 9h.01M15 15h.01M15 9h.01M9 15h.01',
  sunrise: 'M4 18h16M7 18a5 5 0 0 1 10 0M12 6v3M5.6 11.6l1.8 1.2M18.4 11.6l-1.8 1.2',
  moon: 'M19 14.5A8 8 0 1 1 9.5 5a6.5 6.5 0 0 0 9.5 9.5z',
  columns: 'M4 20h16M5 9h14M12 4 4 9h16zM7 9v11M12 9v11M17 9v11',
  key: 'M14 10a4 4 0 1 1-1.2-2.8L20 14v3h-3v-2h-2v-2',
  ticket: 'M4 8a2 2 0 0 0 0 4v4h16v-4a2 2 0 0 0 0-4V4H4zM14 4v12',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
  people:
    'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20a6 6 0 0 1 12 0M17 11a3 3 0 1 0-1-5.8M21 20a6 6 0 0 0-4-5.7',
  door: 'M6 21V3h10v18M16 21h3M13 12h.01M3 21h3',
  squid: 'M12 3a5 5 0 0 1 5 5v4H7V8a5 5 0 0 1 5-5zM8 12l-2 8M11 12l-1 8M13 12l1 8M16 12l2 8',
  bowl: 'M4 11h16a8 8 0 0 1-16 0zM8 7c0-2 2-2 2-4M13 7c0-2 2-2 2-4',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5',
  snow: 'M12 2v20M4 7l16 10M4 17 20 7M9 4l3 2 3-2M9 20l3-2 3 2',
}

export function Icon({ name, size = 22 }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      className="pyt-icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

/* value: an array (multi) or a string (single). */
export function Chips({ options, value, multi = true, onToggle, onSet, label }) {
  return (
    <div className="pyt-chips" role="group" aria-label={label}>
      {options.map((o) => {
        const sel = multi ? (value || []).includes(o) : value === o
        return (
          <button
            key={o}
            type="button"
            className="pyt-chip"
            aria-pressed={sel}
            onClick={() => (multi ? onToggle(o) : onSet(o))}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

/* options: strings or [value, label] pairs. */
export function Seg({ options, value, onSet, label }) {
  return (
    <div className="pyt-seg" role="group" aria-label={label}>
      {options.map((o) => {
        const [v, l] = Array.isArray(o) ? o : [o, o]
        return (
          <button key={v} type="button" aria-pressed={value === v} onClick={() => onSet(v)}>
            {l}
          </button>
        )
      })}
    </div>
  )
}

/* a, b: [iconName, title, subtitle]. value: 0, 1, -1 (no preference) or null. */
export function TilePair({ a, b, value, onSet, allowNoPref = false }) {
  const tile = (t, v) => (
    <button type="button" className="pyt-tile" aria-pressed={value === v} onClick={() => onSet(v)}>
      <Icon name={t[0]} />
      <b>{t[1]}</b>
      <small>{t[2]}</small>
    </button>
  )
  return (
    <div className="pyt-q">
      <div className="pyt-pair">
        {tile(a, 0)}
        {tile(b, 1)}
        <span className="pyt-or" aria-hidden="true">
          or
        </span>
      </div>
      {allowNoPref && (
        <button
          type="button"
          className="pyt-link"
          aria-pressed={value === -1}
          onClick={() => onSet(-1)}
        >
          No preference
        </button>
      )}
    </div>
  )
}

export function Counter({ label, value, onDelta, min = 0 }) {
  return (
    <div className="pyt-counter">
      <span>{label}</span>
      <span className="pyt-ctl">
        <button
          type="button"
          aria-label={`Fewer ${label.toLowerCase()}`}
          disabled={value <= min}
          onClick={() => onDelta(-1)}
        >
          −
        </button>
        <span className="pyt-n" aria-live="polite">
          {value}
        </span>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} onClick={() => onDelta(1)}>
          +
        </button>
      </span>
    </div>
  )
}

/* Tap in order to rank up to three; tap again to remove. */
export function Ranker({ options, value, onRank }) {
  return (
    <div className="pyt-chips" role="group" aria-label="Your top three, in order">
      {options.map((o) => {
        const r = value.indexOf(o)
        return (
          <button
            key={o}
            type="button"
            className="pyt-chip"
            aria-pressed={r > -1}
            onClick={() => onRank(o)}
          >
            {r > -1 && (
              <span className="pyt-rank" aria-label={`ranked ${r + 1}`}>
                {r + 1}
              </span>
            )}
            {o}
          </button>
        )
      })}
    </div>
  )
}

/* max: entries allowed (the server caps lists at 20). check(text) returns an error
 * message to refuse an entry, e.g. a duplicate companion name. */
export function ListAdd({ id, items, placeholder, onAdd, onDel, max = 20, check }) {
  const [text, setText] = useState('')
  const [err, setErr] = useState('')
  const full = items.length >= max
  const add = () => {
    if (!text.trim() || full) return
    const problem = check ? check(text.trim()) : ''
    if (problem) {
      setErr(problem)
      return
    }
    setErr('')
    onAdd(text)
    setText('')
  }
  return (
    <>
      {items.length > 0 && (
        <div className="pyt-list">
          {items.map((v, i) => (
            <span className="pyt-tag" key={`${v}-${i}`}>
              {v}
              <button type="button" aria-label={`Remove ${v}`} onClick={() => onDel(i)}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <div className="pyt-addrow">
        <input
          id={id}
          type="text"
          value={text}
          placeholder={placeholder}
          maxLength={200}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              add()
            }
          }}
        />
        <button type="button" className="pyt-small" onClick={add} disabled={full}>
          Add
        </button>
      </div>
      {(err || full) && (
        <p className="pyt-hint" role="status">
          {err || "That's the most we can take here."}
        </p>
      )}
    </>
  )
}

/* items: [[label, code], ...]; filters on either; the free text is kept too, so a
 * destination we do not list is never refused. */
export function Typeahead({ id, value, items, onChange, onPick, codeFirst = false, placeholder }) {
  const [open, setOpen] = useState(false)
  const q = value.trim().toLowerCase()
  const hits = q ? items.filter(([l, c]) => `${c} ${l}`.toLowerCase().includes(q)).slice(0, 5) : []
  return (
    <div className="pyt-typeahead">
      <input
        id={id}
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        maxLength={120}
        onChange={(e) => {
          onChange(e.target.value)
          setOpen(true)
        }}
      />
      {open && hits.length > 0 && (
        <div className="pyt-sugg" role="listbox">
          {hits.map(([l, c]) => (
            <button
              key={c + l}
              type="button"
              role="option"
              aria-selected="false"
              onClick={() => {
                onPick(l, c)
                setOpen(false)
              }}
            >
              {codeFirst ? (
                <>
                  <code>{c}</code>
                  {l}
                </>
              ) : (
                <>
                  {l}
                  <code>{c}</code>
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
