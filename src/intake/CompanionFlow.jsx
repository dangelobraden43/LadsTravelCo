/* The companion's three-minute flow, opened from an invite link. Only their own
 * limits and tastes; the organiser owns everything else. */
import { useEffect, useReducer, useState } from 'react'
import * as O from './options.js'
import { emptyCompanion, validateCompanion } from './schema.js'
import { reduceIntake } from './draft.js'
import { Chips, TilePair, Ranker } from './Controls.jsx'

const STEPS = ['Hello', 'Limits', 'Style']
const INTEREST_NAMES = Object.keys(O.INTERESTS)

export default function CompanionFlow({ invite }) {
  const key = `lads-companion-${invite}`
  const [c, d] = useReducer(reduceIntake, null, () => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(key) || 'null')
      if (saved) return { ...emptyCompanion(), ...saved }
    } catch {
      /* storage blocked: start fresh */
    }
    return emptyCompanion()
  })
  const [step, setStep] = useState(0)
  const [meta, setMeta] = useState(null)
  const [state, setState] = useState('loading')
  const [startedAt] = useState(() => Date.now())
  const [error, setError] = useState('')
  const [honeypot, setHoneypot] = useState('')

  const [attempt, setAttempt] = useState(0)
  useEffect(() => {
    /* A 404 is a dead link; anything else is a blip worth retrying (review #16). */
    fetch(`/api/companion?invite=${encodeURIComponent(invite)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        setMeta(j)
        setState('ready')
      })
      .catch((status) => setState(status === 404 ? 'missing' : 'offline'))
  }, [invite, attempt])

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(c))
    } catch {
      /* ignore */
    }
  }, [c, key])

  const set = (k) => (v) => d({ type: 'set', key: k, value: v })
  const tog = (k) => (v) => d({ type: 'toggle', key: k, value: v })

  async function send() {
    const v = validateCompanion(c)
    if (!v.ok) {
      setStep(0)
      setError('Add your first name so the planners know who these answers belong to.')
      return
    }
    setState('sending')
    try {
      const r = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite, data: c, meta: { honeypot, startedAt } }),
      })
      const j = await r.json().catch(() => ({}))
      if (r.status === 422) {
        setState('ready')
        setError(
          j.reason === 'too-fast'
            ? 'That was quicker than we expected. Please check your answers and send again.'
            : "We couldn't send this. Your answers are saved on this phone; email brady@ladstravel.com and we'll sort it out."
        )
        return
      }
      if (r.status === 502) {
        setState('ready')
        setError(
          "We couldn't save that just now. Your answers are kept on this phone; try again in a minute."
        )
        return
      }
      if (!r.ok) throw new Error(String(r.status))
      setState(j.stored ? 'done' : 'unsaved')
      if (j.stored) {
        try {
          window.localStorage.removeItem(key)
        } catch {
          /* ignore */
        }
      }
    } catch {
      setState('ready')
      setError("Couldn't reach us. Your answers are saved on this phone; try again in a moment.")
    }
  }

  if (state === 'loading') return <p className="pyt-lede pyt-pad">Loading your invite…</p>
  if (state === 'offline')
    return (
      <div className="pyt-done pyt-pad">
        <h1 className="pyt-h1">We couldn&rsquo;t load your invite.</h1>
        <p className="pyt-lede">Check your connection and try again.</p>
        <button
          type="button"
          className="pyt-small"
          onClick={() => {
            setState('loading')
            setAttempt((n) => n + 1)
          }}
        >
          Try again
        </button>
      </div>
    )
  if (state === 'missing')
    return (
      <div className="pyt-done pyt-pad">
        <h1 className="pyt-h1">This invite link isn&rsquo;t active.</h1>
        <p className="pyt-lede">Ask whoever sent it for a new one.</p>
      </div>
    )
  if (state === 'done' || state === 'unsaved')
    return (
      <div className="pyt-done pyt-pad">
        <div className="pyt-bigstamp" style={{ '--s': 'var(--pyt-ink-2)' }}>
          <span>
            Added<b>{c.name}</b>to the trip
          </span>
        </div>
        <h1 className="pyt-h1">Thanks, {c.name}.</h1>
        {state === 'done' ? (
          <p className="pyt-lede">
            Your answers are with {meta.organiser}&rsquo;s request. We plan to everyone&rsquo;s
            limits and flag where the group&rsquo;s tastes differ.
          </p>
        ) : (
          <p className="pyt-lede">
            We couldn&rsquo;t save this automatically. Send your answers to{' '}
            <span className="pyt-select">brady@ladstravel.com</span>.
          </p>
        )}
      </div>
    )

  const last = step === STEPS.length - 1
  return (
    <div className="pyt-shell" style={{ '--pyt-ink': `var(--pyt-ink-${step + 2})` }}>
      <header className="pyt-bar">
        <div className="pyt-brand">
          <span>The Lads Travel Co</span>
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
        </div>
        <div className="pyt-stamps pyt-stamps-3">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`pyt-stamp${i < step ? ' is-done' : i === step ? ' is-now' : ''}`}
              style={{ '--s': `var(--pyt-ink-${i + 2})`, '--r': ['-7deg', '5deg', '-3deg'][i] }}
            >
              {s}
            </span>
          ))}
        </div>
      </header>
      <main className="pyt-main" key={step}>
        {step === 0 && (
          <>
            <div className="pyt-kicker">You&rsquo;re invited</div>
            <h1 className="pyt-h1">
              {meta.organiser || 'Your friend'} is planning{' '}
              {meta.dest ? <em>{meta.dest}</em> : 'a trip'}, and wants your input.
            </h1>
            <p className="pyt-lede">
              About 3 minutes. Just your own needs and tastes, so the plan works for you too. Only
              the planners see your answers.
            </p>
            <div className="pyt-q">
              <label htmlFor="pyc-name">Your first name</label>
              <input
                id="pyc-name"
                type="text"
                autoComplete="given-name"
                maxLength={60}
                value={c.name}
                onChange={(e) => set('name')(e.target.value)}
              />
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div className="pyt-kicker">Your limits</div>
            <h1 className="pyt-h1">
              What should we <em>plan around?</em>
            </h1>
            <div className="pyt-q">
              <div className="pyt-ql">Any dietary needs?</div>
              <Chips options={O.DIETS} value={c.diet} onToggle={tog('diet')} />
            </div>
            {c.diet.includes('Allergy') && (
              <div className="pyt-q pyt-hard">
                <span className="pyt-why">Hard limit</span>
                <label htmlFor="pyc-al">Allergic to</label>
                <input
                  id="pyc-al"
                  type="text"
                  maxLength={120}
                  value={c.allergy}
                  onChange={(e) => set('allergy')(e.target.value)}
                />
                <div className="pyt-ql">How serious?</div>
                <Chips
                  options={O.SEVERITY}
                  value={c.severity}
                  multi={false}
                  onSet={set('severity')}
                />
              </div>
            )}
            <div className="pyt-q">
              <div className="pyt-ql">Drinking</div>
              <Chips
                options={['Yes', 'Sometimes', "I don't drink"]}
                value={c.drinking}
                multi={false}
                onSet={set('drinking')}
              />
            </div>
            <div className="pyt-q">
              <div className="pyt-ql">Longest hike you&rsquo;d enjoy</div>
              <Chips options={O.HIKE_ORDER} value={c.hike} multi={false} onSet={set('hike')} />
            </div>
            <div className="pyt-q">
              <div className="pyt-ql">Altitude</div>
              <Chips
                options={O.ALT_ORDER}
                value={c.altitude}
                multi={false}
                onSet={set('altitude')}
              />
            </div>
            <div className="pyt-q pyt-hard">
              <span className="pyt-why">Anything we must plan around?</span>
              <label htmlFor="pyc-note" className="pyt-hint">
                Injuries, fears, medical needs. Only the planners see this.
              </label>
              <input
                id="pyc-note"
                type="text"
                maxLength={300}
                value={c.note}
                onChange={(e) => set('note')(e.target.value)}
              />
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="pyt-kicker">Your style</div>
            <h1 className="pyt-h1">
              This <em>or</em> that?
            </h1>
            {O.PAIRS.map((p) => (
              <TilePair
                key={p.key}
                a={p.a}
                b={p.b}
                value={c.pairs[p.key] ?? null}
                allowNoPref
                onSet={(v) => d({ type: 'pair', key: p.key, value: v })}
              />
            ))}
            <div className="pyt-q">
              <div className="pyt-ql">Your top 3, in order</div>
              <Ranker
                options={INTEREST_NAMES}
                value={c.top3}
                onRank={(v) => d({ type: 'rank', key: 'top3', value: v })}
              />
            </div>
            <div className="pyt-q">
              <label htmlFor="pyc-must">
                One thing you&rsquo;d hate to miss <span className="pyt-opt">(optional)</span>
              </label>
              <input
                id="pyc-must"
                type="text"
                maxLength={200}
                value={c.mustDo}
                onChange={(e) => set('mustDo')(e.target.value)}
              />
            </div>
          </>
        )}
        {error && (
          <p className="pyt-alert" role="alert">
            {error}
          </p>
        )}
        <input
          className="pyt-hp"
          type="text"
          name="lads_hp_x"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </main>
      <nav className="pyt-foot">
        <div className="pyt-foot-in">
          {step > 0 && (
            <button type="button" className="pyt-back" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          <button
            type="button"
            className="pyt-next"
            disabled={state === 'sending'}
            onClick={() => {
              setError('')
              if (last) send()
              else if (step === 0 && !c.name.trim())
                setError('Add your first name so the planners know who these answers belong to.')
              else {
                setStep(step + 1)
                window.scrollTo({ top: 0 })
              }
            }}
          >
            {last ? (state === 'sending' ? 'Sending…' : 'Send my answers') : 'Continue'}
          </button>
        </div>
      </nav>
    </div>
  )
}
