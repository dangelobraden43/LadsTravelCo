/* The organiser's seven steps, review and sent screens. Copy, options and
 * branching are ported from the prototype Brady approved on Oct 6 2026
 * (docs/superpowers/specs/2026-10-06-intake-prototype.html). */
import * as O from './options.js'
import { hardLimits } from './limits.js'
import { Chips, Seg, TilePair, Counter, Ranker, ListAdd, Typeahead } from './Controls.jsx'

const INTEREST_NAMES = Object.keys(O.INTERESTS)
const AIRPORT_ITEMS = O.AIRPORTS.map(([c, l]) => [l, c])
export const outdoorsPicked = (s) =>
  s.top3.includes('Outdoors & hiking') || s.also.includes('Outdoors & hiking')

function useActions(d) {
  return {
    set: (key) => (value) => d({ type: 'set', key, value }),
    tog: (key, max) => (value) => d({ type: 'toggle', key, value, max }),
    add: (key) => (value) => d({ type: 'listAdd', key, value }),
    del: (key) => (index) => d({ type: 'listDel', key, index }),
  }
}

function Q({ label, hint, opt, htmlFor, children, className = '' }) {
  const head = (
    <>
      {label}
      {opt && <span className="pyt-opt"> (optional)</span>}
      {hint && <span className="pyt-hint"> {hint}</span>}
    </>
  )
  return (
    <div className={`pyt-q ${className}`}>
      {htmlFor ? <label htmlFor={htmlFor}>{head}</label> : <div className="pyt-ql">{head}</div>}
      {children}
    </div>
  )
}

function Head({ kicker, children, lede }) {
  return (
    <>
      <div className="pyt-kicker">{kicker}</div>
      <h1 className="pyt-h1">{children}</h1>
      {lede && <p className="pyt-lede">{lede}</p>}
    </>
  )
}

export const destCode = (s) => {
  if (s.destMode === 'help') return '???'
  const hit = O.DESTINATIONS.find(([l]) => l === s.dest)
  return hit
    ? hit[1]
    : (s.dest || '???')
        .replace(/[^A-Za-z]/g, '')
        .slice(0, 3)
        .toUpperCase() || '???'
}

export function BoardingPass({ s, mini }) {
  const when = s.dateMode === 'flex' ? s.months.join('/') || 'Any month' : s.start || '—'
  const len = s.dateMode === 'flex' ? s.length || '—' : 'Fixed dates'
  return (
    <div className={`pyt-pass${mini ? ' is-mini' : ''}`}>
      <div className="pyt-pass-main">
        <div className="pyt-route">
          <span>{s.airport || '???'}</span>
          <i aria-hidden="true">→</i>
          <span className="pyt-to">{destCode(s)}</span>
        </div>
        {!mini && (
          <div className="pyt-meta">
            <span>
              <b>Passenger</b>
              {s.name || '—'}
            </span>
            <span>
              <b>When</b>
              {when}
            </span>
            <span>
              <b>Length</b>
              {len}
            </span>
            <span>
              <b>Budget</b>
              {s.budget ? `${s.budget} ${s.budgetMode === 'day' ? 'a day' : 'total'}` : '—'}
            </span>
            <span>
              <b>Occasion</b>
              {s.occasion || '—'}
            </span>
          </div>
        )}
        {s.top3.length > 0 && (
          <div className="pyt-tags">
            {s.top3.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        )}
      </div>
      <div className="pyt-stub">
        Party<strong>{s.adults + s.kids}</strong>
        {s.rel || 'Crew'}
      </div>
    </div>
  )
}

export function StepStart({ s, d }) {
  const a = useActions(d)
  return (
    <>
      <Head
        kicker="Your trip, researched"
        lede="About 10 minutes. Everything saves as you go, and the rest of your group can add their own answers from their phones."
      >
        Tell us about the trip. <em>We&rsquo;ll do the research.</em>
      </Head>
      <Q label="Your first name" htmlFor="pyt-name">
        <input
          id="pyt-name"
          type="text"
          autoComplete="given-name"
          maxLength={60}
          value={s.name}
          onChange={(e) => a.set('name')(e.target.value)}
        />
      </Q>
      <Q label="Email" hint="So we can reply about your trip." htmlFor="pyt-email">
        <input
          id="pyt-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={120}
          value={s.email}
          onChange={(e) => a.set('email')(e.target.value)}
        />
      </Q>
      <Q label="Phone" opt hint="Only if you'd like a call." htmlFor="pyt-phone">
        <input
          id="pyt-phone"
          type="tel"
          autoComplete="tel"
          maxLength={30}
          value={s.phone}
          onChange={(e) => a.set('phone')(e.target.value)}
        />
      </Q>
      <Q label="What's the occasion?">
        <Chips
          options={O.OCCASIONS}
          value={s.occasion}
          multi={false}
          onSet={a.set('occasion')}
          label="Occasion"
        />
      </Q>
      <Q label="How did you find us?" opt>
        <Chips
          options={O.HEARD}
          value={s.heard}
          multi={false}
          onSet={a.set('heard')}
          label="How you found us"
        />
      </Q>
      <label className="pyt-check">
        <input
          type="checkbox"
          checked={s.optIn}
          onChange={(e) => a.set('optIn')(e.target.checked)}
        />
        <span>Send me the occasional Lads email: new guides and the founding-member offer.</span>
      </label>
    </>
  )
}

export function StepTrip({ s, d }) {
  const a = useActions(d)
  return (
    <>
      <Head kicker="Stamp 1 · The trip">
        Where are you <em>headed?</em>
      </Head>
      <div className="pyt-q">
        <Seg
          options={[
            ['know', 'I know where'],
            ['help', 'Help me choose'],
          ]}
          value={s.destMode}
          onSet={a.set('destMode')}
          label="Destination"
        />
      </div>
      {s.destMode === 'know' ? (
        <>
          <Q label="Destination" htmlFor="pyt-dest">
            <Typeahead
              id="pyt-dest"
              value={s.dest}
              items={O.DESTINATIONS}
              onChange={a.set('dest')}
              onPick={(l) => a.set('dest')(l)}
              placeholder="A city, country or region"
            />
          </Q>
          <Q label="Open to nearby places we'd recommend?">
            <Seg
              options={['Yes, show us', 'No, just there']}
              value={s.nearby}
              onSet={a.set('nearby')}
            />
          </Q>
          <Q label="One base or on the move?">
            <Chips options={O.BASES} value={s.bases} multi={false} onSet={a.set('bases')} />
          </Q>
        </>
      ) : (
        <>
          <Q label="What should it feel like?" hint="Pick any.">
            <Chips options={O.FEELS} value={s.feels} onToggle={a.tog('feels')} />
          </Q>
          <Q label="How far will you fly?">
            <Chips options={O.FLY_FAR} value={s.flyFar} multi={false} onSet={a.set('flyFar')} />
          </Q>
        </>
      )}
      <Q label="Dates">
        <Seg
          options={[
            ['fixed', 'I have dates'],
            ['flex', "I'm flexible"],
          ]}
          value={s.dateMode}
          onSet={a.set('dateMode')}
        />
      </Q>
      {s.dateMode === 'fixed' ? (
        <>
          <div className="pyt-row2">
            <Q label="Leave" htmlFor="pyt-start">
              <input
                id="pyt-start"
                type="date"
                value={s.start}
                onChange={(e) => a.set('start')(e.target.value)}
              />
            </Q>
            <Q label="Return" htmlFor="pyt-end">
              <input
                id="pyt-end"
                type="date"
                value={s.end}
                min={s.start || undefined}
                onChange={(e) => a.set('end')(e.target.value)}
              />
            </Q>
          </div>
          <Q label="Could they move a few days for a better price?">
            <Seg
              options={['Yes, a few days', 'No, fixed']}
              value={s.flexDays}
              onSet={a.set('flexDays')}
            />
          </Q>
        </>
      ) : (
        <>
          <Q label="How long?">
            <Chips options={O.LENGTHS} value={s.length} multi={false} onSet={a.set('length')} />
          </Q>
          <Q label="Which months could work?" hint="Pick any.">
            <Chips options={O.MONTHS} value={s.months} onToggle={a.tog('months')} />
          </Q>
        </>
      )}
      <Q label="Home airport" hint="Type a code, city or name." htmlFor="pyt-air">
        <Typeahead
          id="pyt-air"
          codeFirst
          value={
            s.airportQ ??
            (s.airport
              ? `${s.airport} · ${(O.AIRPORTS.find(([c]) => c === s.airport) || ['', ''])[1]}`
              : '')
          }
          items={AIRPORT_ITEMS}
          onChange={(v) => {
            a.set('airportQ')(v)
            const m = v.trim().toUpperCase()
            a.set('airport')(/^[A-Z]{3}$/.test(m) ? m : '')
          }}
          onPick={(l, c) => {
            a.set('airport')(c)
            a.set('airportQ')(`${c} · ${l}`)
          }}
        />
      </Q>
    </>
  )
}

export function StepCrew({ s, d, invites, onCopy }) {
  const a = useActions(d)
  return (
    <>
      <Head kicker="Stamp 2 · Your crew">
        Who&rsquo;s <em>coming?</em>
      </Head>
      <div className="pyt-q">
        <Counter
          label="Adults"
          value={s.adults}
          min={1}
          onDelta={(n) => d({ type: 'count', key: 'adults', delta: n, min: 1 })}
        />
        <Counter
          label="Kids under 18"
          value={s.kids}
          onDelta={(n) => d({ type: 'count', key: 'kids', delta: n, min: 0 })}
        />
      </div>
      <Q label="Ages in the group" hint="Pick any.">
        <Chips options={O.AGES} value={s.ages} onToggle={a.tog('ages')} />
      </Q>
      <Q label="Who's going?">
        <Chips options={O.RELATIONS} value={s.rel} multi={false} onSet={a.set('rel')} />
      </Q>
      <Q label="How much has the group travelled?">
        <Chips
          options={O.EXPERIENCE}
          value={s.experience}
          multi={false}
          onSet={a.set('experience')}
        />
      </Q>
      <Q label="Is this anyone's first trip abroad?">
        <Seg
          options={['Yes, for someone', 'No']}
          value={s.firstAbroad}
          onSet={a.set('firstAbroad')}
        />
      </Q>
      <Q label="Passports">
        <Chips options={O.PASSPORTS} value={s.passport} multi={false} onSet={a.set('passport')} />
      </Q>
      <Q
        label="How are you splitting costs?"
        hint="Money is the top cause of group-trip arguments. This helps us plan around it."
      >
        <Chips options={O.SPLITS} value={s.split} multi={false} onSet={a.set('split')} />
      </Q>
      <Q
        label="Invite your group"
        hint="Each person answers their own diet, limits and style on their own phone. About 3 minutes. You can send yours without waiting."
      >
        <div className="pyt-companions">
          {s.companions.map((c, i) => {
            const inv = invites[c.name]
            const url = inv ? `https://ladstravel.com/plan-your-trip/join/${inv}` : ''
            return (
              <div className="pyt-comp" key={`${c.name}-${i}`}>
                <span className="pyt-avatar" aria-hidden="true">
                  {c.name[0]}
                </span>
                <b>{c.name}</b>
                <button
                  type="button"
                  className="pyt-link"
                  aria-label={`Remove ${c.name}`}
                  onClick={() => a.set('companions')(s.companions.filter((_, j) => j !== i))}
                >
                  Remove
                </button>
                <span className="pyt-lnk">{url || 'Their link appears when you continue.'}</span>
                {url && (
                  <button type="button" className="pyt-small pyt-copy" onClick={() => onCopy(url)}>
                    Copy link
                  </button>
                )}
              </div>
            )
          })}
        </div>
        <ListAdd
          id="pyt-add-comp"
          items={[]}
          placeholder="Their first name"
          onAdd={(name) =>
            a.set('companions')([...s.companions, { name: name.trim().slice(0, 60) }])
          }
          onDel={() => {}}
        />
      </Q>
    </>
  )
}

export function StepBudget({ s, d }) {
  const a = useActions(d)
  const day = s.budgetMode === 'day'
  return (
    <>
      <Head kicker="Stamp 3 · Budget">
        What should it <em>cost?</em>
      </Head>
      <div className="pyt-q">
        <Seg
          options={[
            ['day', 'Per person, per day'],
            ['trip', 'Per person, whole trip'],
          ]}
          value={s.budgetMode}
          onSet={(v) => {
            a.set('budgetMode')(v)
            a.set('budget')('')
          }}
        />
        <p className="pyt-hint">
          {day
            ? 'Everything except flights: where you sleep, food, drinks, getting around, tickets.'
            : 'Everything, including flights.'}
        </p>
      </div>
      <div className="pyt-q">
        <Chips
          options={day ? O.BUDGET_DAY : O.BUDGET_TRIP}
          value={s.budget}
          multi={false}
          onSet={a.set('budget')}
          label="Budget"
        />
        <label htmlFor="pyt-bx" className="pyt-hint">
          Or type an exact amount <span className="pyt-opt">(optional)</span>
        </label>
        <input
          id="pyt-bx"
          type="text"
          maxLength={60}
          value={s.budgetExact}
          placeholder={day ? 'e.g. about $220 a day' : 'e.g. about $3,000'}
          onChange={(e) => a.set('budgetExact')(e.target.value)}
        />
      </div>
      <Q label="How firm is that?">
        <Seg options={O.FIRMNESS} value={s.firm} onSet={a.set('firm')} />
      </Q>
      <Q label="Where should the money go?" hint="Pick up to 2.">
        <Chips options={O.SPEND_ON} value={s.splurge} onToggle={a.tog('splurge', 2)} />
      </Q>
      <Q label="Where can we save?" hint="Pick any.">
        <Chips options={O.SPEND_ON} value={s.save} onToggle={a.tog('save')} />
      </Q>
    </>
  )
}

export function StepStyle({ s, d }) {
  const a = useActions(d)
  return (
    <>
      <Head kicker="Stamp 4 · Your style" lede="One tap each. Go with your gut.">
        This <em>or</em> that?
      </Head>
      {O.PAIRS.map((p) => (
        <TilePair
          key={p.key}
          a={p.a}
          b={p.b}
          value={s.pairs[p.key] ?? null}
          allowNoPref
          onSet={(v) => d({ type: 'pair', key: p.key, value: v })}
        />
      ))}
      <Q
        label="Your top 3, in order"
        hint="Tap in order of how much it matters. Tap again to remove."
      >
        <Ranker
          options={INTEREST_NAMES}
          value={s.top3}
          onRank={(v) => d({ type: 'rank', key: 'top3', value: v })}
        />
      </Q>
      {s.top3.map((t, i) => (
        <div className="pyt-q pyt-more" key={t}>
          <span className="pyt-why">
            #{i + 1} · {t}
          </span>
          <div className="pyt-ql">
            Which kind? <span className="pyt-hint">Pick any.</span>
          </div>
          <Chips
            options={O.INTERESTS[t]}
            value={s.more[t] || []}
            onToggle={(v) => d({ type: 'more', interest: t, value: v })}
          />
        </div>
      ))}
      <Q label="Also into" opt>
        <Chips
          options={INTEREST_NAMES.filter((i) => !s.top3.includes(i))}
          value={s.also}
          onToggle={a.tog('also')}
        />
      </Q>
      <Q label="Describe a perfect day there, in a line" opt htmlFor="pyt-pd">
        <textarea
          id="pyt-pd"
          maxLength={600}
          value={s.perfectDay}
          onChange={(e) => a.set('perfectDay')(e.target.value)}
        />
      </Q>
    </>
  )
}

export function StepDetails({ s, d }) {
  const a = useActions(d)
  return (
    <>
      <Head
        kicker="Stamp 5 · The details"
        lede="Anything marked as a limit becomes a rule we plan around."
      >
        The things that <em>make or break</em> a trip.
      </Head>
      <section className="pyt-sub">
        <h2>Food and drink</h2>
        <Q label="Any dietary needs?">
          <Chips options={O.DIETS} value={s.diet} onToggle={a.tog('diet')} />
        </Q>
        {s.diet.includes('Allergy') && (
          <div className="pyt-q pyt-hard">
            <span className="pyt-why">Hard limit</span>
            <label htmlFor="pyt-al">Allergic to</label>
            <input
              id="pyt-al"
              type="text"
              maxLength={120}
              value={s.allergy}
              onChange={(e) => a.set('allergy')(e.target.value)}
            />
            <div className="pyt-ql">How serious?</div>
            <Chips
              options={O.SEVERITY}
              value={s.severity}
              multi={false}
              onSet={a.set('severity')}
            />
            <div className="pyt-ql">Does cross-contact matter (shared fryers, kitchens)?</div>
            <Seg options={['Yes', 'No']} value={s.crossContact} onSet={a.set('crossContact')} />
          </div>
        )}
        <TilePair
          a={['squid', 'Adventurous', 'Bring on the local dishes']}
          b={['bowl', 'Familiar', 'Good versions of what we know']}
          value={s.adventurous}
          onSet={a.set('adventurous')}
        />
        <Q label="Drinking">
          <Chips options={O.DRINKING} value={s.drinking} multi={false} onSet={a.set('drinking')} />
        </Q>
        <Q label="One big dinner worth booking ahead?">
          <Seg options={['Yes', 'No']} value={s.bigDinner} onSet={a.set('bigDinner')} />
        </Q>
      </section>
      <section className="pyt-sub">
        <h2>Where you sleep</h2>
        <Q label="What kind of place?" hint="Pick any.">
          <Chips options={O.LODGING} value={s.lodging} onToggle={a.tog('lodging')} />
        </Q>
        <Q label="The area should be">
          <Chips options={O.VIBES} value={s.vibe} onToggle={a.tog('vibe')} />
        </Q>
        <Q label="Rooms">
          <Chips options={O.SHARING} value={s.sharing} multi={false} onSet={a.set('sharing')} />
        </Q>
        <Q label="Any light sleepers?">
          <Seg options={['Yes', 'No']} value={s.lightSleepers} onSet={a.set('lightSleepers')} />
        </Q>
      </section>
      <section className="pyt-sub">
        <h2>Getting around</h2>
        <Q label="Happy to use" hint="Pick any.">
          <Chips options={O.AROUND} value={s.around} onToggle={a.tog('around')} />
        </Q>
        <Q label="Most walking in a day">
          <Chips options={O.WALK} value={s.walk} multi={false} onSet={a.set('walk')} />
        </Q>
        <Q label="Longest travel day you'd accept between stops">
          <Chips
            options={O.TRAVEL_DAY}
            value={s.travelDay}
            multi={false}
            onSet={a.set('travelDay')}
          />
        </Q>
        <Q label="Early flights or overnight trains?">
          <Seg
            options={['Yes, if it saves a day', 'Avoid them']}
            value={s.earlyTransit}
            onSet={a.set('earlyTransit')}
          />
        </Q>
        <Q label="Anyone comfortable driving abroad?">
          <Seg options={['Yes', 'No']} value={s.drive} onSet={a.set('drive')} />
        </Q>
        <Q label="Does anyone get motion sick (boats, winding roads)?">
          <Seg options={['Yes', 'No']} value={s.motion} onSet={a.set('motion')} />
        </Q>
        <Q label="Any mobility or accessibility needs?">
          <Seg options={['Yes', 'No']} value={s.access} onSet={a.set('access')} />
        </Q>
        {s.access === 'Yes' && (
          <div className="pyt-q pyt-hard">
            <span className="pyt-why">Hard limit</span>
            <Chips options={O.ACCESS_NEEDS} value={s.accessNeeds} onToggle={a.tog('accessNeeds')} />
          </div>
        )}
      </section>
      {outdoorsPicked(s) && (
        <section className="pyt-sub">
          <span className="pyt-why">Shown because you picked Outdoors</span>
          <h2>Active limits</h2>
          <p className="pyt-hint">Plan to the least keen person in the group.</p>
          <Q label="Longest hike the whole group would enjoy">
            <Chips options={O.HIKE_ORDER} value={s.hike} multi={false} onSet={a.set('hike')} />
          </Q>
          <Q label="Altitude">
            <Chips
              options={O.ALT_ORDER}
              value={s.altitude}
              multi={false}
              onSet={a.set('altitude')}
            />
          </Q>
          <TilePair
            a={['sun', 'Heat is fine', "30°C (86°F) doesn't bother us"]}
            b={['snow', 'Keep it mild', 'We wilt in the heat']}
            value={s.heat}
            onSet={a.set('heat')}
          />
        </section>
      )}
      <section className="pyt-sub">
        <h2>
          Points and cards <span className="pyt-opt">(optional)</span>
        </h2>
        <Q label="Programmes and cards you hold">
          <Chips options={O.POINTS} value={s.points} onToggle={a.tog('points')} />
        </Q>
        <Q label="Open to hearing about card options?">
          <Seg options={['Yes', 'No']} value={s.openCards} onSet={a.set('openCards')} />
        </Q>
      </section>
    </>
  )
}

export function StepWishes({ s, d }) {
  const a = useActions(d)
  return (
    <>
      <Head kicker="Stamp 6 · Your wishes">
        Make it a <em>ten out of ten.</em>
      </Head>
      <Q label="What would make this trip a 10 out of 10?" htmlFor="pyt-ten">
        <textarea
          id="pyt-ten"
          maxLength={600}
          value={s.tenOutOfTen}
          onChange={(e) => a.set('tenOutOfTen')(e.target.value)}
        />
      </Q>
      <Q label="Must-dos" opt>
        <ListAdd
          id="pyt-must"
          items={s.mustDo}
          placeholder="e.g. A day trip to the coast"
          onAdd={a.add('mustDo')}
          onDel={a.del('mustDo')}
        />
      </Q>
      <Q label="Please avoid" opt>
        <ListAdd
          id="pyt-avoid"
          items={s.avoid}
          placeholder="e.g. Long bus transfers"
          onAdd={a.add('avoid')}
          onDel={a.del('avoid')}
        />
      </Q>
      <Q label="Already booked" opt>
        <ListAdd
          id="pyt-booked"
          items={s.booked}
          placeholder="e.g. Flights, Apr 18 to 26"
          onAdd={a.add('booked')}
          onDel={a.del('booked')}
        />
      </Q>
      <Q label="A trip you loved, and why" opt htmlFor="pyt-loved">
        <input
          id="pyt-loved"
          type="text"
          maxLength={300}
          value={s.loved}
          onChange={(e) => a.set('loved')(e.target.value)}
        />
      </Q>
      <Q label="A trip you didn't, and why" opt htmlFor="pyt-hated">
        <input
          id="pyt-hated"
          type="text"
          maxLength={300}
          value={s.hated}
          onChange={(e) => a.set('hated')(e.target.value)}
        />
      </Q>
      <section className="pyt-sub">
        <h2>Getting it to you</h2>
        <Q label="Who else gets the guide link?" opt>
          <ListAdd
            id="pyt-share"
            items={s.shareWith}
            placeholder="their@email.com"
            onAdd={a.add('shareWith')}
            onDel={a.del('shareWith')}
          />
        </Q>
        <Q label="When do you need the guide by?" htmlFor="pyt-need">
          <input
            id="pyt-need"
            type="date"
            value={s.needBy}
            onChange={(e) => a.set('needBy')(e.target.value)}
          />
        </Q>
        <Q label="Format">
          <Chips options={O.FORMATS} value={s.pdf} multi={false} onSet={a.set('pdf')} />
        </Q>
        <Q label="Best way to reach you with questions">
          <Seg options={O.CONTACT} value={s.contact} onSet={a.set('contact')} />
        </Q>
      </section>
    </>
  )
}

const lower = (x) => (x || '').toLowerCase()
const pairText = (pairs) =>
  O.PAIRS.map((p) => (pairs[p.key] === 0 ? p.a[1] : pairs[p.key] === 1 ? p.b[1] : null))
    .filter(Boolean)
    .map(lower)
    .join(', ')

function Rv({ title, step, onGoto, children }) {
  return (
    <div className="pyt-rv" style={{ '--s': `var(--pyt-ink-${step})` }}>
      <div className="pyt-rv-head">
        <span>{title}</span>
        <button type="button" className="pyt-link" onClick={() => onGoto(step)}>
          Change
        </button>
      </div>
      {children}
    </div>
  )
}

export function StepReview({ s, onGoto, errors }) {
  const limits = hardLimits(s, [])
  const style = pairText(s.pairs)
  return (
    <>
      <Head
        kicker="Last check"
        lede="This is what our research starts from. Tap Change on anything that isn't right."
      >
        Here&rsquo;s your <em>boarding pass.</em>
      </Head>
      <BoardingPass s={s} />
      {errors.length > 0 && (
        <div className="pyt-alert" role="alert">
          {errors.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </div>
      )}
      <div className="pyt-review">
        {limits.length > 0 && (
          <div className="pyt-rv pyt-hard">
            <span className="pyt-why">We will never plan…</span>
            <ul>
              {limits.map((l) => (
                <li key={l.text}>{l.text}</li>
              ))}
            </ul>
            <p className="pyt-hint">Is anything missing? Change it in the section it came from.</p>
          </div>
        )}
        <Rv title="The trip" step={1} onGoto={onGoto}>
          <p>
            {s.destMode === 'know'
              ? `${s.dest || 'No destination yet'}${s.bases ? `, ${lower(s.bases)}` : ''}${s.nearby.startsWith('Yes') ? ', open to nearby places' : ''}`
              : `Help us choose: ${lower(s.feels.join(', ')) || 'no feel picked yet'}${s.flyFar ? `, ${lower(s.flyFar)} away` : ''}`}
            .{' '}
            {s.dateMode === 'flex'
              ? `${s.length || 'Length not set'}${s.months.length ? ` in ${s.months.join(' or ')}` : ''}`
              : `${s.start || '?'} to ${s.end || '?'}`}
            , flying from {s.airport || 'an airport not chosen yet'}.
            {s.occasion && ` Occasion: ${lower(s.occasion)}.`}
          </p>
        </Rv>
        <Rv title="Your crew" step={2} onGoto={onGoto}>
          <p>
            {s.adults} adult{s.adults === 1 ? '' : 's'}
            {s.kids ? ` and ${s.kids} kid${s.kids === 1 ? '' : 's'}` : ''}
            {s.rel && `, ${lower(s.rel)}`}
            {s.ages.length > 0 && `, aged ${s.ages.join(', ')}`}.{s.split && ` ${s.split}.`}
            {s.passport && ` Passports: ${lower(s.passport)}.`}
          </p>
          {s.companions.length > 0 && (
            <p className="pyt-hint">
              Companions invited: {s.companions.map((c) => c.name).join(', ')}.
            </p>
          )}
        </Rv>
        <Rv title="Budget" step={3} onGoto={onGoto}>
          <p>
            {s.budget
              ? `${s.budget} per person ${s.budgetMode === 'day' ? 'per day, before flights' : 'for the whole trip'}`
              : 'No budget picked yet'}
            {s.firm && `, ${lower(s.firm)}`}.
            {s.splurge.length > 0 && ` Spend on ${lower(s.splurge.join(' and '))}.`}
            {s.save.length > 0 && ` Save on ${lower(s.save.join(', '))}.`}
          </p>
        </Rv>
        <Rv title="Your style" step={4} onGoto={onGoto}>
          <p>
            {style && `You like ${style}. `}
            {s.top3.length > 0 &&
              `Top 3: ${s.top3.map((t, i) => `${i + 1}. ${t}${s.more[t]?.length ? ` (${lower(s.more[t].join(', '))})` : ''}`).join('; ')}.`}
          </p>
          {s.perfectDay && (
            <p>
              <em>&ldquo;{s.perfectDay}&rdquo;</em>
            </p>
          )}
        </Rv>
        <Rv title="The details" step={5} onGoto={onGoto}>
          <p>
            {[
              s.drinking,
              s.lodging.length &&
                `${s.lodging.join(' or ')}${s.vibe.length ? ` in a ${lower(s.vibe.join(', '))} area` : ''}`,
              s.around.length && `getting around by ${lower(s.around.join(' and '))}`,
              s.walk && `up to ${lower(s.walk)} a day`,
              s.points.length && `points: ${s.points.join(', ')}`,
            ]
              .filter(Boolean)
              .join('. ') || 'Nothing added yet.'}
          </p>
        </Rv>
        <Rv title="Your wishes" step={6} onGoto={onGoto}>
          {s.tenOutOfTen && (
            <p>
              A ten out of ten: <em>&ldquo;{s.tenOutOfTen}&rdquo;</em>
            </p>
          )}
          <p>
            Must-do: {s.mustDo.join('; ') || 'none'}. Avoid: {s.avoid.join('; ') || 'none'}. Booked:{' '}
            {s.booked.join('; ') || 'nothing yet'}.
          </p>
          <p>
            {s.needBy ? `Guide by ${s.needBy}. ` : ''}
            {s.pdf}. Reach you by {lower(s.contact)}.
          </p>
        </Rv>
      </div>
    </>
  )
}

export function StepSent({ s, stored, calUrl }) {
  const how = s.contact === 'Text' ? 'text' : s.contact === 'Call' ? 'call' : 'email'
  return (
    <div className="pyt-done">
      <div className="pyt-bigstamp">
        <span>
          Received<b>{destCode(s)}</b>
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
      <h1 className="pyt-h1">
        Got it, {s.name}. <em>Your trip is with us.</em>
      </h1>
      {stored ? (
        <p className="pyt-lede">
          A founder reads every request. We&rsquo;ll {how} you within two days with next steps, or
          with a question if something needs clearing up.
        </p>
      ) : (
        <p className="pyt-lede">
          We couldn&rsquo;t save this automatically. Email it to{' '}
          <span className="pyt-select">brady@ladstravel.com</span> and we&rsquo;ll take it from
          there.
        </p>
      )}
      <div className="pyt-card">
        <b>Rather talk it through?</b>
        <p className="pyt-hint">
          Book a 15 to 20 minute call. We&rsquo;ll already have your answers, so it starts where the
          quiz left off.
        </p>
        {calUrl ? (
          <a className="pyt-small pyt-cta" href={calUrl} target="_blank" rel="noopener noreferrer">
            Book a call
          </a>
        ) : (
          <p className="pyt-hint">Reply to our email and we&rsquo;ll set up a time.</p>
        )}
      </div>
    </div>
  )
}
