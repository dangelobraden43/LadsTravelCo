import React, { useState } from 'react'
import { FRAMEWORKS } from './data/canonical.js'
import { LAUNCH_LABEL } from './utils/launch.js'
import './EarlyAccess.css'

/* EARLY ACCESS — the site's first real call to action.
 *
 * WHY IT EXISTS. Until Sept 17 2026 the only way to reach us from the site was
 * a Formspree form inside /lads, a page that is not in the nav. So a stranger
 * who liked what they saw had nowhere to go. The plan opens a capped founding
 * cohort on January 1 2027, and a capped cohort with no audience in front of it
 * is the single largest business risk on the board.
 *
 * ⛔ THE COPY RULES THIS COMPONENT LIVES UNDER, and they are not negotiable:
 *   1. No "free", no "no cost", no "complimentary". That string has been purged
 *      from this codebase three times (May 31, Aug 25 in the JSON-LD, Sept 2 in
 *      seo.js). Brady ruled on Sept 17 2026 that the autumn advising is offered
 *      WITHOUT a cost claim on the site — what it costs is said in the reply,
 *      not on the page. Do not add the word back.
 *   2. No price, ever. Pricing is a founder decision locked in December.
 *   3. Nothing is sold, reserved or guaranteed here. Joining a list is joining
 *      a list, and the page says exactly that.
 *   4. The launch date renders from LAUNCH_LABEL. If it slips, it slips once.
 *
 * THE SHAPE. Email first, everything after it optional. One field and a button
 * is the whole commitment; the useful questions only appear once someone is
 * already on the list, so a person who answers nothing is still captured. The
 * two tracks then self-select: people with a trip this year fall into a fuller
 * intake, people without go on the founding list.
 */

const ENDPOINT = 'https://formspree.io/f/xvzvekkk'

/* Destination chips are DERIVED from the canonical table, so the list of places
 * we ask about can never drift from the list we actually cover. Adding a
 * framework adds its country here with no edit. */
const DESTINATIONS = [...new Set(FRAMEWORKS.flatMap((f) => f.countries))].sort()

const WHEN = ['Next 3 months', 'Within 6 months', 'Sometime in 2027', 'Just dreaming for now']
const WHO = ['Solo', 'Couple', 'Group of mates', 'Family', 'Bigger group']
const GROUP_SIZE = ['2', '3–4', '5–8', '9–15', '16+']

function Chip({ on, children, ...rest }) {
  return (
    <button type="button" className="ea-chip" aria-pressed={on} {...rest}>
      {children}
    </button>
  )
}

export default function EarlyAccess({ variant = 'full', source = 'unknown' }) {
  const [stage, setStage] = useState('email') // email -> details -> done
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const [where, setWhere] = useState([])
  const [when, setWhen] = useState('')
  const [who, setWho] = useState('')

  const [hasTrip, setHasTrip] = useState(false)
  const [tripWhere, setTripWhere] = useState('')
  const [tripWhen, setTripWhen] = useState('')
  const [tripSize, setTripSize] = useState('')
  const [tripHardest, setTripHardest] = useState('')

  /* Functional update, deliberately. Reading `where` from the render closure
   * loses a selection when two chips are tapped before React commits the
   * first — found in testing on Sept 17 2026, when Ireland and Peru were both
   * tapped and only Peru reached the payload. */
  const toggle = (setList, value) =>
    setList((prev) => (prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]))

  async function post(fields) {
    const fd = new FormData()
    Object.entries(fields).forEach(([k, v]) => {
      if (v !== '' && v != null) fd.set(k, Array.isArray(v) ? v.join(', ') : v)
    })
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) throw new Error('rejected')
  }

  /* The email goes on its own submission the moment it is given. If someone
   * abandons the optional questions we still have the only field that matters,
   * which is the entire reason the form is split. */
  async function submitEmail(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await post({
        Form: 'Early access — list',
        Email: email,
        Source: source,
        _subject: 'New early-access signup',
      })
      setStage('details')
    } catch {
      setError('That did not send. Check the address and try again, or email brady@ladstravel.com.')
    }
    setBusy(false)
  }

  async function submitDetails(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await post({
        Form: hasTrip ? 'Early access — trip enquiry' : 'Early access — preferences',
        Email: email,
        Source: source,
        'Wants to go': where,
        Timing: when,
        'Travelling as': who,
        'Trip this year': hasTrip ? 'Yes' : 'No',
        'Trip — where': tripWhere,
        'Trip — when': tripWhen,
        'Trip — group size': tripSize,
        'Trip — hardest part': tripHardest,
        _subject: hasTrip ? 'Trip enquiry — 2026 advising' : 'Early-access preferences',
      })
      setStage('done')
    } catch {
      setError('That did not send. Try again, or email brady@ladstravel.com.')
    }
    setBusy(false)
  }

  const compact = variant === 'compact'

  return (
    <section className={'ea' + (compact ? ' ea-compact' : '')} id="early-access">
      <div className="ea-inner">
        {stage === 'email' && (
          <>
            <div className="ea-eyebrow">Early access</div>
            <h2 className="ea-title">
              Be first <em>through the door.</em>
            </h2>
            <p className="ea-lede">
              The Lads Travel Club opens {LAUNCH_LABEL}, and the founding group is capped. We would
              rather look after a small number of people properly than a lot of people badly. Leave
              your email and you will hear from us before it opens.
            </p>

            <form className="ea-form" onSubmit={submitEmail}>
              <label className="sr-only" htmlFor="ea-email">
                Email address
              </label>
              <input
                id="ea-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="ea-input"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="ea-btn" type="submit" disabled={busy}>
                {busy ? 'Sending…' : 'Join the list'}
              </button>
            </form>

            <p className="ea-fine">
              One email, nothing else required. We are not selling anything today and nothing here
              reserves a place.
            </p>
            {error && (
              <p className="ea-error" role="alert">
                {error}
              </p>
            )}
          </>
        )}

        {stage === 'details' && (
          <>
            <div className="ea-eyebrow ea-good">You are on the list</div>
            <h2 className="ea-title">
              Three quick ones, <em>if you have a minute.</em>
            </h2>
            <p className="ea-lede">
              All optional. It helps us build the right things first, and it means the first thing
              we send you is something you actually care about.
            </p>

            <form className="ea-form-block" onSubmit={submitDetails}>
              <fieldset className="ea-set">
                <legend className="ea-legend">Where do you want to go?</legend>
                <div className="ea-chips">
                  {DESTINATIONS.map((d) => (
                    <Chip key={d} on={where.includes(d)} onClick={() => toggle(setWhere, d)}>
                      {d}
                    </Chip>
                  ))}
                  <Chip
                    on={where.includes('Somewhere else')}
                    onClick={() => toggle(setWhere, 'Somewhere else')}
                  >
                    Somewhere else
                  </Chip>
                </div>
              </fieldset>

              <fieldset className="ea-set">
                <legend className="ea-legend">When are you thinking?</legend>
                <div className="ea-chips">
                  {WHEN.map((w) => (
                    <Chip key={w} on={when === w} onClick={() => setWhen(when === w ? '' : w)}>
                      {w}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              <fieldset className="ea-set">
                <legend className="ea-legend">Who would you be travelling with?</legend>
                <div className="ea-chips">
                  {WHO.map((w) => (
                    <Chip key={w} on={who === w} onClick={() => setWho(who === w ? '' : w)}>
                      {w}
                    </Chip>
                  ))}
                </div>
              </fieldset>

              {/* TRACK TWO. The autumn advising offer. Stated without any cost
                  claim, per the rule at the top of this file. */}
              <div className="ea-trip">
                <button
                  type="button"
                  className="ea-trip-toggle"
                  aria-expanded={hasTrip}
                  onClick={() => setHasTrip(!hasTrip)}
                >
                  <span className="ea-tick" aria-hidden="true">
                    {hasTrip ? '✓' : ''}
                  </span>
                  <span>
                    <strong>I have a trip coming up before the end of the year.</strong>
                    <span className="ea-trip-sub">
                      We are advising a handful of trips this autumn while we build. Tell us about
                      yours and we will come back to you.
                    </span>
                  </span>
                </button>

                {hasTrip && (
                  <div className="ea-trip-form">
                    <div className="ea-field">
                      <label className="ea-label" htmlFor="ea-tw">
                        Where are you going?
                      </label>
                      <input
                        id="ea-tw"
                        className="ea-input ea-input-full"
                        placeholder="Dublin and Galway, a week"
                        value={tripWhere}
                        onChange={(e) => setTripWhere(e.target.value)}
                      />
                    </div>

                    <div className="ea-field">
                      <label className="ea-label" htmlFor="ea-td">
                        Roughly when?
                      </label>
                      <input
                        id="ea-td"
                        className="ea-input ea-input-full"
                        placeholder="Late October, dates not fixed"
                        value={tripWhen}
                        onChange={(e) => setTripWhen(e.target.value)}
                      />
                    </div>

                    <fieldset className="ea-set">
                      <legend className="ea-legend">How many of you?</legend>
                      <div className="ea-chips">
                        {GROUP_SIZE.map((g) => (
                          <Chip
                            key={g}
                            on={tripSize === g}
                            onClick={() => setTripSize(tripSize === g ? '' : g)}
                          >
                            {g}
                          </Chip>
                        ))}
                      </div>
                    </fieldset>

                    <div className="ea-field">
                      <label className="ea-label" htmlFor="ea-th">
                        What is the hardest part so far?
                      </label>
                      <textarea
                        id="ea-th"
                        className="ea-textarea"
                        rows={3}
                        placeholder="Everything says the same ten places and we cannot tell which are actually worth it."
                        value={tripHardest}
                        onChange={(e) => setTripHardest(e.target.value)}
                      />
                      <p className="ea-fine">
                        This is the most useful thing you can tell us. It is what the whole company
                        is built to fix.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="ea-actions">
                <button className="ea-btn" type="submit" disabled={busy}>
                  {busy ? 'Sending…' : hasTrip ? 'Send this over' : 'Send these'}
                </button>
                <button type="button" className="ea-skip" onClick={() => setStage('done')}>
                  Skip for now
                </button>
              </div>
              {error && (
                <p className="ea-error" role="alert">
                  {error}
                </p>
              )}
            </form>
          </>
        )}

        {stage === 'done' && (
          <div role="status">
            <div className="ea-eyebrow ea-good">Got it</div>
            <h2 className="ea-title">
              We will be <em>in touch.</em>
            </h2>
            <p className="ea-lede">
              {hasTrip
                ? 'We have your trip. One of us will read it properly and come back to you — it will be a person, not an autoresponder.'
                : `You are on the list. The next time you hear from us it will be worth opening, and the Club opens ${LAUNCH_LABEL}.`}
            </p>
            <p className="ea-fine">
              Anything else, we are at{' '}
              <a className="ea-mail" href="mailto:brady@ladstravel.com">
                brady@ladstravel.com
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
