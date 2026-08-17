import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import Footer from './Footer'
import './PrivacyPage.css'

const EFFECTIVE = 'August 17, 2026'

function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useReveal()
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined
  return (
    <div ref={ref} className={`reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}

// Every third party the site actually loads or sends data to, audited from
// index.html + src/ on August 17, 2026. Keep this table in sync with the code —
// if a service is added or removed, it changes here in the same commit.
const THIRD_PARTIES = [
  {
    name: 'Vercel',
    role: 'Hosting',
    detail:
      'Serves the site. Keeps standard server logs (IP address, browser, requested page) and provides the site’s performance and traffic analytics.',
  },
  {
    name: 'Umami',
    role: 'Analytics',
    detail:
      'Privacy-focused, cookie-free traffic analytics. Counts page views and referrers in aggregate. Does not track you across other websites.',
  },
  {
    name: 'Microsoft Clarity',
    role: 'Session analytics',
    detail:
      'Records how pages are used — clicks, scrolling, and session replays — so we can see what is confusing and fix it. Uses cookies.',
  },
  {
    name: 'Formspree',
    role: 'Form delivery',
    detail:
      'Receives the trip intake form and emails it to us. Only runs when you actually submit the form.',
  },
  {
    name: 'Cal.com',
    role: 'Booking',
    detail:
      'Powers the call-booking widget. Only receives information if you open it and book a time.',
  },
  {
    name: 'Cloudinary',
    role: 'Media delivery',
    detail: 'Hosts and delivers the videos and some images on the site.',
  },
  {
    name: 'Google Fonts',
    role: 'Typography',
    detail:
      'Serves the fonts the site is set in. Loading them means Google receives your IP address.',
  },
  {
    name: 'Shopify',
    role: 'Store & checkout',
    detail:
      'Our store and all checkout happen on Shopify, not on this site. Anything you enter there is governed by Shopify’s privacy policy, not this one.',
  },
  {
    name: 'GetYourGuide · Viator',
    role: 'Tour booking partners',
    detail:
      'Some tour links point to these sites. If you follow one, they know you arrived from us.',
  },
]

const COLLECTED = [
  {
    h: 'What you type into the intake form',
    p: 'Your name and email, plus whatever trip details you choose to fill in — trip type, destination, travel dates, group size, budget, savings priority, cities you have visited, how you heard about us, and any notes. This only reaches us if you press submit.',
  },
  {
    h: 'What gets collected automatically',
    p: 'Standard web analytics: pages viewed, roughly where in the world you are, what browser and device you used, what site referred you, and how you moved around the page. This is behavioural, not personal — we are not attaching your name to it.',
  },
  {
    h: 'What we never see',
    p: 'Payment details. There is no checkout on ladstravel.com — buying anything happens on Shopify, and card information goes to them and their payment processor, never to us.',
  },
]

const NOT_DONE = [
  'We do not sell, rent, or trade your information. Not to anyone, not ever.',
  'We do not run ads on this site, and there are no advertising or retargeting networks on it.',
  'We do not have accounts, logins, or passwords — there is nothing to breach.',
  'We do not send marketing email. If you write to us, we write back; that is the whole system.',
  'We do not set any cookies of our own. Some of the third parties listed below do.',
]

export default function PrivacyPage() {
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Privacy &mdash; The Lads Travel Co.</title>
        <meta
          name="description"
          content="What The Lads Travel Co. collects, what we don't, and every third-party service the site uses. Plain language, no lawyer padding."
        />
        <link rel="canonical" href="https://ladstravel.com/privacy" />
      </Helmet>

      <Nav scrolled={true} />

      <main className="privacy-page">
        <header className="privacy-hero">
          <Reveal>
            <div className="privacy-eyebrow">PRIVACY</div>
            <h1 className="privacy-h1">
              What we collect, <em>and what we don&rsquo;t.</em>
            </h1>
            <p className="privacy-lede">
              This is a small site run by two people. We collect very little, we sell nothing, and
              everything below is a plain description of what actually happens &mdash; not a
              template.
            </p>
            <div className="privacy-date">Effective {EFFECTIVE}</div>
          </Reveal>
        </header>

        <div className="privacy-body">
          <Reveal>
            <section className="privacy-section" aria-labelledby="collect-h">
              <h2 id="collect-h" className="privacy-h2">
                What we collect
              </h2>
              {COLLECTED.map((c) => (
                <div key={c.h} className="privacy-block">
                  <h3 className="privacy-h3">{c.h}</h3>
                  <p className="privacy-p">{c.p}</p>
                </div>
              ))}
            </section>
          </Reveal>

          <Reveal>
            <section className="privacy-section" aria-labelledby="use-h">
              <h2 id="use-h" className="privacy-h2">
                How we use it
              </h2>
              <p className="privacy-p">
                Form submissions are used to reply to you and plan the trip you asked about.
                Analytics are used to work out which pages are worth building on and which are
                broken. That is the entire list of purposes.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="privacy-section" aria-labelledby="never-h">
              <h2 id="never-h" className="privacy-h2">
                What we don&rsquo;t do
              </h2>
              <ul className="privacy-list">
                {NOT_DONE.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section className="privacy-section" aria-labelledby="third-h">
              <h2 id="third-h" className="privacy-h2">
                Third-party services
              </h2>
              <p className="privacy-p">
                These are every outside service the site loads or sends data to. Each one has its
                own privacy policy that governs what it does with what it receives.
              </p>
              <div className="privacy-table">
                {THIRD_PARTIES.map((t) => (
                  <div key={t.name} className="privacy-row">
                    <div className="privacy-row-head">
                      <span className="privacy-row-name">{t.name}</span>
                      <span className="privacy-row-role">{t.role}</span>
                    </div>
                    <p className="privacy-row-detail">{t.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="privacy-section" aria-labelledby="cookies-h">
              <h2 id="cookies-h" className="privacy-h2">
                Cookies &amp; analytics
              </h2>
              <p className="privacy-p">
                We don&rsquo;t set cookies ourselves. Microsoft Clarity does, in order to recognise
                a returning session. Umami is deliberately cookie-free. Blocking cookies or using a
                tracker blocker will not break anything on this site &mdash; every page works
                exactly the same with all of it blocked, and we would rather you browse the way you
                prefer than see one more heatmap.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="privacy-section" aria-labelledby="affiliate-h">
              <h2 id="affiliate-h" className="privacy-h2">
                Affiliate links
              </h2>
              <p className="privacy-p">
                Some links to tours, experiences, and booking sites are affiliate links. If you book
                through one, we may earn a commission &mdash;{' '}
                <strong>at no extra cost to you</strong>. It never changes the price you pay.
              </p>
              <p className="privacy-p">
                It also doesn&rsquo;t change what we recommend. We only link to things we have
                actually done, and a place earns its spot in a framework by being good, not by
                paying us. Where we haven&rsquo;t been somewhere ourselves, we say so on the page.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="privacy-section" aria-labelledby="choices-h">
              <h2 id="choices-h" className="privacy-h2">
                Your choices
              </h2>
              <p className="privacy-p">
                Email <a href="mailto:brady@ladstravel.com">brady@ladstravel.com</a> and ask us to
                delete anything you have sent us, or to tell you what we hold. We will do it, and we
                won&rsquo;t make you prove you have a legal right to ask. Depending on where you
                live you may formally have that right anyway &mdash; we would rather just honour the
                request than argue about jurisdiction.
              </p>
              <p className="privacy-p">
                The site is not intended for children under 13, and we don&rsquo;t knowingly collect
                anything from them.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="privacy-section" aria-labelledby="changes-h">
              <h2 id="changes-h" className="privacy-h2">
                Changes
              </h2>
              <p className="privacy-p">
                If we add a service or change what we collect, we update this page and move the
                effective date. We are a preview site heading toward a Fall 2026 launch, so this
                will change as things get built.
              </p>
            </section>
          </Reveal>

          <Reveal>
            <section className="privacy-section privacy-contact" aria-labelledby="contact-h">
              <h2 id="contact-h" className="privacy-h2">
                Contact
              </h2>
              <p className="privacy-p">
                Questions about any of this go to{' '}
                <a href="mailto:brady@ladstravel.com">brady@ladstravel.com</a>. A real person reads
                it.
              </p>
              <p className="privacy-back">
                <Link to="/">&larr; Back to The Lads Travel Co.</Link>
              </p>
            </section>
          </Reveal>
        </div>
      </main>

      <Footer />
    </>
  )
}
