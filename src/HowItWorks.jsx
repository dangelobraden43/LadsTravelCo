import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AGENT_ROSTER } from './utils/siteStats.js'
import './HowItWorks.css'

/* HOW IT WORKS — the homepage explanation of the research pipeline.
 *
 * Designed with Brady on Sept 29 2026 (four plain steps, click an icon to go
 * deeper). Replaces the five bare words "Research / Validate / Rate / Build /
 * Deliver" that sat here before.
 *
 * Every specialist name, lane and description is read from the agent files
 * in .claude/agents/ (lads-label, lads-group, lads-summary) through
 * virtual:lads-stats. So is every count: "Twelve" and "thirteenth" are
 * derived, never typed. Add or remove an agent and this section follows. */

const WORDS = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
  'twenty',
]
const ORDINALS = [
  'zeroth',
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
  'tenth',
  'eleventh',
  'twelfth',
  'thirteenth',
  'fourteenth',
  'fifteenth',
  'sixteenth',
  'seventeenth',
  'eighteenth',
  'nineteenth',
  'twentieth',
]
const word = (n) => WORDS[n] || String(n)
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const LANES = [
  { id: 'where', name: 'Where' },
  { id: 'when', name: 'When' },
  { id: 'move', name: 'Getting there & around' },
  { id: 'money', name: 'Cost & savings' },
  { id: 'before', name: 'Before you go' },
]

const researchers = AGENT_ROSTER.filter((a) => a.group !== 'verify')
const checkers = AGENT_ROSTER.filter((a) => a.group === 'verify')
const N = researchers.length
const checkerOrdinal = ORDINALS[N + 1] || `${N + 1}th`

function Icon({ id }) {
  const paths = {
    brief: (
      <>
        <path d="M4 5h16v11H8l-4 4z" />
        <path d="M8 9h8M8 12h5" />
      </>
    ),
    research: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="M20 20l-4.5-4.5" />
        <path d="M8.5 11h5M11 8.5v5" />
      </>
    ),
    verify: (
      <>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
        <path d="M8.5 12l2.5 2.5 4.5-5" />
      </>
    ),
    plan: (
      <>
        <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
        <path d="M9 4v14M15 6v14" />
      </>
    ),
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[id]}
    </svg>
  )
}

const STEPS = [
  {
    icon: 'brief',
    title: 'Share your trip',
    more: 'Learn more',
    text: "Tell us where you want to go, when, who's traveling and what you want to spend.",
  },
  {
    icon: 'research',
    title: 'We research everything',
    more: 'Meet the specialists',
    text: `${cap(word(N))} specialized AI agents cover flights, lodging, getting around, costs, timing, points and deals at the same time.`,
  },
  {
    icon: 'verify',
    title: 'Every detail is verified',
    more: 'How we verify',
    text: "An independent fact-checker confirms each finding against its original source. Anything we can't confirm is left out.",
  },
  {
    icon: 'plan',
    title: 'Your plan, tailored',
    more: 'What you receive',
    text: 'Our founders shape it around your group and budget, with the savings and booking deadlines already worked out.',
  },
]

function Detail({ i, onPlan }) {
  const [agent, setAgent] = useState(null)
  if (i === 0) {
    return (
      <div className="hw-detail">
        <span className="hw-k">Step 01 &middot; Share your trip</span>
        <h4>Everything we need to plan it properly.</h4>
        <p className="hw-lead">
          A few details up front let us research the trip you actually want to take, not a generic
          version of it.
        </p>
        <div className="hw-cols">
          {[
            [
              'Where and when',
              "A destination, or a few you're weighing. Your dates, or how flexible they are.",
            ],
            [
              "Who's traveling",
              'How many of you, and anything that shapes the trip: first visit, a celebration, a mix of interests.',
            ],
            [
              'Your budget',
              'A comfortable range for the trip. We plan to it and show you where it goes.',
            ],
            [
              'Your home airport',
              'So flight options and timing start from where you actually leave.',
            ],
            [
              "What you're into",
              'Food, the outdoors, nightlife, culture, sport. The must-dos and the hard passes.',
            ],
            [
              'Points and memberships',
              'Any airline or hotel programs you already use, so we can put them to work.',
            ],
          ].map(([b, s]) => (
            <div className="hw-tile" key={b}>
              <b>{b}</b>
              <span>{s}</span>
            </div>
          ))}
        </div>
        <div className="hw-panel-cta">
          <button className="hw-btn" onClick={onPlan}>
            Start planning &rarr;
          </button>
        </div>
      </div>
    )
  }
  if (i === 1) {
    return (
      <div className="hw-detail">
        <span className="hw-k">Step 02 &middot; We research everything</span>
        <h4>{cap(word(N))} specialists, working in parallel.</h4>
        <p className="hw-lead">
          Each agent owns one part of the trip and researches it in depth. Select one to see what it
          covers.
        </p>
        <div className="hw-lanes">
          {LANES.map((lane) => {
            const members = researchers.filter((a) => a.group === lane.id)
            if (!members.length) return null
            return (
              <div className="hw-lane" key={lane.id}>
                <span className="hw-ln">{lane.name}</span>
                {members.map((a) => (
                  <button
                    key={a.label}
                    className="hw-agent"
                    aria-pressed={agent === a}
                    onClick={() => setAgent(a)}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )
          })}
        </div>
        <div className="hw-agent-desc" aria-live="polite">
          {agent ? (
            <>
              <b>{agent.label}.</b> {agent.summary}
            </>
          ) : (
            <>
              <b>Select a specialist</b> to see what it researches.
            </>
          )}
        </div>
        <p className="hw-srcline">
          They work from primary sources first: operators, transit authorities, park services and
          government sites.
        </p>
      </div>
    )
  }
  if (i === 2) {
    return (
      <div className="hw-detail">
        <span className="hw-k">Step 03 &middot; Every detail is verified</span>
        <h4>A second set of eyes on every fact.</h4>
        <p className="hw-lead">
          {checkers.length === 1
            ? `A ${checkerOrdinal} agent, dedicated to fact-checking, reviews the research independently.`
            : 'Dedicated fact-checking agents review the research independently.'}{' '}
          It opens the original source behind each finding and decides one of three things.
        </p>
        <div className="hw-flow">
          <div className="hw-tile">
            <i className="hw-i-ok">{'✓'}</i>
            <b>Confirmed</b>
            <span>
              The source says exactly this. It goes into your plan with the date it was checked.
            </span>
          </div>
          <div className="hw-tile">
            <i className="hw-i-fix">{'✎'}</i>
            <b>Corrected</b>
            <span>
              Close, but not quite. It&apos;s rewritten to match the source before it goes any
              further.
            </span>
          </div>
          <div className="hw-tile">
            <i className="hw-i-out">{'–'}</i>
            <b>Left out</b>
            <span>If it can&apos;t be confirmed, it doesn&apos;t reach your plan.</span>
          </div>
        </div>
        <div className="hw-example">
          <span className="hw-k">From a recent research run</span>
          <p>
            A widely shared figure put the Museum of Anthropology in Vancouver at{' '}
            <s>about 530,000 objects</s>. The museum&apos;s own page says <em>nearly 50,000</em>.
            The plan uses the museum&apos;s number.
          </p>
          <small>
            Checked against moa.ubc.ca on September 29, 2026. Prices are shown as ranges with the
            date they were checked, and re-checked before you travel.
          </small>
        </div>
      </div>
    )
  }
  return (
    <div className="hw-detail">
      <span className="hw-k">Step 04 &middot; Your plan, tailored</span>
      <h4>A plan you can book with confidence.</h4>
      <p className="hw-lead">
        We turn the verified research into a plan built around your group, your pace and your
        budget.
      </p>
      <ul className="hw-recv">
        {[
          ['A day-by-day itinerary', 'Organized so each day flows'],
          ['A clear budget', 'Honest price ranges, not guesses'],
          ['Every saving we found', 'Deals, passes, points and timing'],
          ['What to book, and when', 'So nothing sells out on you'],
          ['Getting there and around', 'Flights, transfers and transit'],
          ['Where to stay', 'The right neighborhood for your group'],
        ].map(([b, s]) => (
          <li key={b}>
            <Icon id="check" />
            <div>
              {b}
              <span>{s}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="hw-founders">
        <div className="hw-av">
          <span>B</span>
          <span>D</span>
        </div>
        <div>
          <b>Reviewed by Brady and Dawson.</b> Every plan is shaped by our founders before it
          reaches you.
        </div>
      </div>
      <div className="hw-panel-cta">
        <button className="hw-btn" onClick={onPlan}>
          Plan your trip &rarr;
        </button>
      </div>
    </div>
  )
}

export default function HowItWorks() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(-1)
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches
  )
  const [seen, setSeen] = useState(
    () => typeof window === 'undefined' || !('IntersectionObserver' in window)
  )
  const rootRef = useRef(null)
  const panelRef = useRef(null)
  const iconRefs = useRef([])
  const [caret, setCaret] = useState(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)')
    const on = () => setNarrow(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  useEffect(() => {
    const el = rootRef.current
    if (!el || seen) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  /* Closing returns keyboard focus to the step's icon, so a keyboard user is
   * not dropped to the top of the page (review, Sept 29). */
  const openRef = useRef(-1)
  useEffect(() => {
    openRef.current = open
  }, [open])
  const close = () => {
    const i = openRef.current
    setOpen(-1)
    if (i > -1) window.requestAnimationFrame(() => iconRefs.current[i]?.focus())
  }
  const closeRef = useRef(close)
  useEffect(() => {
    closeRef.current = close
  })
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && openRef.current > -1) closeRef.current()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* The caret points from the open panel up to its icon. Measured after
   * layout on the next frame, and re-measured on resize. */
  useLayoutEffect(() => {
    if (narrow || open < 0) return
    const place = () => {
      const icon = iconRefs.current[open]
      const pan = panelRef.current
      if (!icon || !pan) return
      const ic = icon.getBoundingClientRect()
      const pr = pan.getBoundingClientRect()
      setCaret(ic.left + ic.width / 2 - pr.left - 8)
    }
    const raf = window.requestAnimationFrame(place)
    window.addEventListener('resize', place)
    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', place)
    }
  }, [open, narrow])

  const toggle = (i) => {
    const opening = open !== i
    setOpen((cur) => (cur === i ? -1 : i))
    if (narrow && opening) {
      setTimeout(
        () => iconRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        60
      )
    }
  }
  const plan = () => navigate('/join')

  const panel = (
    <div
      className={`hw-panel${open > -1 ? ' open' : ''}`}
      id="hw-panel"
      ref={panelRef}
      role="region"
      aria-label="Step details"
      inert={open < 0}
      aria-hidden={open < 0}
    >
      {!narrow && open > -1 && caret != null && (
        <span className="hw-caret" style={{ left: caret }} />
      )}
      <div className="hw-inner">
        <div className="hw-pad">
          {open > -1 && (
            <button className="hw-close" aria-label="Close details" onClick={close}>
              &times;
            </button>
          )}
          {open > -1 && <Detail i={open} onPlan={plan} key={open} />}
        </div>
      </div>
    </div>
  )

  return (
    <section className={`hw${seen ? ' hw-seen' : ''}`} ref={rootRef} aria-labelledby="hw-title">
      <div className="hw-eyebrow">How it works</div>
      <h2 id="hw-title">Every trip, planned in four steps.</h2>
      <p className="hw-sub">
        We pair a team of specialized AI research agents with independent fact-checking and hands-on
        planning from our founders, so your trip is thorough, accurate and built around you.
      </p>

      <div className="hw-steps">
        {STEPS.map((s, i) => (
          <div className="hw-step" key={s.title}>
            <button
              className="hw-ico"
              ref={(el) => {
                iconRefs.current[i] = el
              }}
              aria-expanded={open === i}
              aria-controls={!narrow || open === i ? 'hw-panel' : undefined}
              aria-label={`Step ${i + 1}, ${s.title}: more detail`}
              onClick={() => toggle(i)}
            >
              <Icon id={s.icon} />
              <span className="hw-plus" aria-hidden="true">
                +
              </span>
            </button>
            <div className="hw-txt">
              <div className="hw-n">STEP 0{i + 1}</div>
              <h3>{s.title}</h3>
              <p className="hw-d">{s.text}</p>
              <button className="hw-more" onClick={() => toggle(i)} aria-expanded={open === i}>
                {s.more}
              </button>
            </div>
            {narrow && open === i && panel}
          </div>
        ))}
      </div>

      {!narrow && panel}

      <div className="hw-cta">
        <button className="hw-btn" onClick={plan}>
          Plan your trip &rarr;
        </button>
      </div>
    </section>
  )
}
