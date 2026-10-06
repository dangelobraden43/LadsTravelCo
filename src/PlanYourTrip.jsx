/* /plan-your-trip — the intake quiz. Spec: docs/superpowers/specs/2026-10-06-intake-to-guide-design.md
 * Hidden (noindex, unlinked) until INTAKE_LIVE: the route ships before the
 * Airtable credentials exist so it can be click-tested on a real phone. */
import { useEffect, useReducer, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import './PlanYourTrip.css'
import { emptyIntake, validateIntake } from './intake/schema.js'
import { reduceIntake, serializeDraft, parseDraft } from './intake/draft.js'
import { INTAKE_LIVE, DRAFT_KEY, CAL_URL } from './intake/config.js'
import {
  BoardingPass,
  StepStart,
  StepTrip,
  StepCrew,
  StepBudget,
  StepStyle,
  StepDetails,
  StepWishes,
  StepReview,
  StepSent,
} from './intake/OrganiserSteps.jsx'
import CompanionFlow from './intake/CompanionFlow.jsx'

const STEPS = [
  { label: 'Start', stamp: 'Hello', View: StepStart },
  { label: 'The trip', stamp: 'Trip', View: StepTrip },
  { label: 'Your crew', stamp: 'Crew', View: StepCrew },
  { label: 'Budget', stamp: 'Budget', View: StepBudget },
  { label: 'Your style', stamp: 'Style', View: StepStyle },
  { label: 'The details', stamp: 'Details', View: StepDetails },
  { label: 'Your wishes', stamp: 'Wishes', View: StepWishes },
]
const REVIEW = 7
const SENT = 8
const ROT = ['-7deg', '5deg', '-3deg', '8deg', '-6deg', '4deg', '-5deg']

/* Field errors from the shared validator, in plain words, with the step that owns them. */
const FRIENDLY = [
  [/^name/, 0, 'Add your first name.'],
  [/^email/, 0, 'Check your email address.'],
  [/^dest/, 1, 'Tell us where you want to go, or pick "Help me choose".'],
  [/^feels/, 1, 'Pick at least one feel so we can suggest places.'],
  [/^dates: both/, 1, 'Add both travel dates.'],
  [/^dates: return/, 1, 'Your return date is before your departure date.'],
  [/^length/, 1, 'Pick roughly how long the trip is.'],
  [/^airport/, 1, 'Pick your home airport.'],
  [/^adults/, 2, 'At least one adult is travelling.'],
  [/^budget/, 3, 'Pick a budget range.'],
  [/^top3/, 4, 'Pick your top interests (one to three).'],
]
const explain = (errs) =>
  errs.map((e) => {
    const hit = FRIENDLY.find(([re]) => re.test(e))
    return hit ? { step: hit[1], text: hit[2] } : { step: 6, text: e }
  })

function loadDraft() {
  try {
    return parseDraft(window.localStorage.getItem(DRAFT_KEY) || '')
  } catch {
    return null
  }
}

function Organiser() {
  const [params] = useSearchParams()
  const draft = loadDraft()
  const [s, d] = useReducer(reduceIntake, null, () => ({
    ...emptyIntake(),
    ...(draft?.data || {}),
  }))
  const [step, setStep] = useState(() => Math.min(draft?.step ?? 0, REVIEW))
  const [resume, setResume] = useState(draft?.resume || '')
  const [startedAt] = useState(() => draft?.startedAt || Date.now())
  const [invites, setInvites] = useState(() =>
    Object.fromEntries(
      (draft?.data?.companions || []).filter((c) => c.invite).map((c) => [c.name, c.invite])
    )
  )
  const [fresh, setFresh] = useState(-1)
  const [saved, setSaved] = useState('')
  const [problems, setProblems] = useState([])
  const [sending, setSending] = useState(false)
  const [stored, setStored] = useState(true)
  const [honeypot, setHoneypot] = useState('')
  const [copied, setCopied] = useState('')

  /* ?resume=<token>: load the server copy, which wins over this device's. */
  useEffect(() => {
    const r = params.get('resume')
    if (!r || !/^[0-9a-f]{32}$/.test(r)) return
    fetch(`/api/intake?resume=${r}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((j) => {
        if (!j?.data) return
        d({ type: 'load', state: j.data })
        setResume(r)
        setInvites(
          Object.fromEntries(
            (j.data.companions || []).filter((c) => c.invite).map((c) => [c.name, c.invite])
          )
        )
      })
      .catch(() => {})
  }, [params])

  useEffect(() => {
    if (step === SENT) return
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        serializeDraft({
          data: { ...s, companions: withInvites(s.companions, invites) },
          step,
          resume,
          startedAt,
        })
      )
    } catch {
      /* storage blocked: the server draft still saves on each step */
    }
  }, [s, step, resume, startedAt, invites])

  async function post(final) {
    const body = {
      resume: resume || undefined,
      data: { ...s, companions: withInvites(s.companions, invites) },
      final,
      meta: { honeypot, startedAt },
    }
    const res = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const j = await res.json().catch(() => ({}))
    return { res, j }
  }

  async function saveDraft() {
    if (!validateIntake(s, { final: false }).ok) return
    try {
      const { res, j } = await post(false)
      if (!res.ok) return
      if (j.resume) setResume(j.resume)
      if (j.invites)
        setInvites((m) => ({
          ...m,
          ...Object.fromEntries(j.invites.map((x) => [x.name, x.invite])),
        }))
      setSaved(j.stored ? 'Saved ✓' : 'Saved on this device')
    } catch {
      setSaved('Saved on this device')
    }
  }

  function go(n) {
    if (n > step && step >= 1 && step <= 6) setFresh(step)
    setStep(n)
    setProblems([])
    window.scrollTo({ top: 0 })
  }

  function next() {
    if (step === 0) {
      const v = validateIntake(s, { final: false })
      if (!v.ok) {
        setProblems(explain(v.errors))
        return
      }
    }
    if (step === REVIEW) return submit()
    saveDraft()
    go(step + 1)
  }

  async function submit() {
    const v = validateIntake(s, { final: true })
    if (!v.ok) {
      setProblems(explain(v.errors))
      return
    }
    setSending(true)
    try {
      const { res, j } = await post(true)
      if (res.status === 400) setProblems(explain(j.errors || []))
      else if (res.status === 422)
        setProblems([
          {
            step: REVIEW,
            text: 'That was quicker than we expected. Please check your answers and send again.',
          },
        ])
      else if (!res.ok) throw new Error(String(res.status))
      else {
        setStored(Boolean(j.stored))
        try {
          window.localStorage.removeItem(DRAFT_KEY)
        } catch {
          /* ignore */
        }
        go(SENT)
      }
    } catch {
      setProblems([
        {
          step: REVIEW,
          text: "Couldn't reach us. Your answers are saved on this device; try again in a moment.",
        },
      ])
    } finally {
      setSending(false)
    }
  }

  async function copy(url) {
    try {
      await window.navigator.clipboard.writeText(url)
      setCopied(url)
    } catch {
      setCopied('select')
    }
  }

  const ink = step >= 1 && step <= 6 ? `var(--pyt-ink-${step})` : 'var(--gold)'
  const View = STEPS[step]?.View
  const label =
    step < REVIEW
      ? `Step ${step + 1} of 7 · ${STEPS[step].label}`
      : step === REVIEW
        ? 'Check your pass'
        : 'Sent'

  return (
    <div className="pyt-shell" style={{ '--pyt-ink': ink }}>
      <header className="pyt-bar">
        <div className="pyt-brand">
          <Link to="/">The Lads Travel Co</Link>
          <span>{label}</span>
        </div>
        {step < SENT && (
          <div className="pyt-stamps">
            {STEPS.slice(1).map((st, j) => {
              const i = j + 1
              const done = i < step
              return (
                <button
                  key={st.stamp}
                  type="button"
                  className={`pyt-stamp${done ? ' is-done' : i === step ? ' is-now' : ''}${i === fresh ? ' is-fresh' : ''}`}
                  style={{ '--s': `var(--pyt-ink-${i})`, '--r': ROT[i] }}
                  disabled={!done && i !== step}
                  aria-label={`${st.label}${done ? ', done' : ''}`}
                  onClick={() => done && go(i)}
                >
                  {st.stamp}
                </button>
              )
            })}
          </div>
        )}
        {step >= 1 && step <= 6 && <BoardingPass s={s} mini />}
      </header>

      <main className="pyt-main" key={step}>
        {step < REVIEW && <View s={s} d={d} invites={invites} onCopy={copy} />}
        {step === REVIEW && <StepReview s={s} onGoto={go} errors={problems.map((p) => p.text)} />}
        {step === SENT && <StepSent s={s} stored={stored} calUrl={CAL_URL} />}
        {step !== REVIEW && problems.length > 0 && (
          <div className="pyt-alert" role="alert">
            {problems.map((p) => (
              <p key={p.text}>{p.text}</p>
            ))}
          </div>
        )}
        {step === REVIEW && problems.some((p) => p.step < REVIEW) && (
          <button
            type="button"
            className="pyt-link"
            onClick={() => go(problems.find((p) => p.step < REVIEW).step)}
          >
            Fix the first one
          </button>
        )}
        {copied && copied !== 'select' && (
          <p className="pyt-hint" role="status">
            Link copied. Send it to them however you like.
          </p>
        )}
        {copied === 'select' && (
          <p className="pyt-hint" role="status">
            Press and hold the link to copy it.
          </p>
        )}
        <input
          className="pyt-hp"
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </main>

      {step !== SENT && (
        <nav className="pyt-foot" aria-label="Quiz navigation">
          <div className="pyt-foot-in">
            {step > 0 && (
              <button type="button" className="pyt-back" onClick={() => go(step - 1)}>
                Back
              </button>
            )}
            <span className="pyt-saved" aria-live="polite">
              {saved}
            </span>
            <button type="button" className="pyt-next" disabled={sending} onClick={next}>
              {step === 0
                ? "Let's go"
                : step === 6
                  ? 'Check my pass'
                  : step === REVIEW
                    ? sending
                      ? 'Sending…'
                      : 'Send to the Lads'
                    : 'Stamp it'}
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}

const withInvites = (companions, invites) =>
  companions.map((c) => ({ ...c, invite: invites[c.name] || c.invite }))

export default function PlanYourTrip({ companion = false }) {
  const { invite } = useParams()
  return (
    <>
      <Helmet>
        <title>Plan your trip · The Lads Travel Co.</title>
        <meta
          name="description"
          content="Tell us about your trip and we research it for you: where to go, when, where to stay and what to book, checked and sourced."
        />
        {!INTAKE_LIVE && <meta name="robots" content="noindex, nofollow" />}
        {!companion && <link rel="canonical" href="https://ladstravel.com/plan-your-trip" />}
      </Helmet>
      <div className="pyt-page">
        {companion ? <CompanionFlow invite={invite} /> : <Organiser />}
      </div>
    </>
  )
}
