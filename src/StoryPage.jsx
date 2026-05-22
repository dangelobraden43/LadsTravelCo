import React, { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async'
import { Nav } from './App'
import './StoryPage.css'

/* ===== Local Reveal — IntersectionObserver, matches App.jsx pattern ===== */
function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.classList.add('sp-visible')
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('sp-visible')
          obs.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const ref = useReveal()
  const style = delay ? { transitionDelay: `${delay}ms` } : undefined
  return (
    <Tag ref={ref} className={`sp-reveal ${className}`.trim()} style={style} {...rest}>
      {children}
    </Tag>
  )
}

/* ===== STORY HERO ===== */
function StoryHero() {
  return (
    <header className="sp-hero">
      <div className="sp-hero-inner">
        <div className="sp-eyebrow sp-hero-anim sp-hero-anim-1">THE LADS TRAVEL CO</div>
        <h1 className="sp-hero-title sp-hero-anim sp-hero-anim-2">
          Built in 20 days. From a broken hand and a $40 subscription.
        </h1>
        <p className="sp-hero-lede sp-hero-anim sp-hero-anim-3">
          The Lads Travel Co is a travel consulting company built in twenty days by one person with
          AI tools after he broke his hand surfing in Costa Rica. Co-founded by two friends from
          Michigan who believe the product isn&rsquo;t flights and hotels &mdash; it&rsquo;s
          presence. Operating as a non-profit blueprint through 2026. All merchandise proceeds go to
          four charitable causes that matter to us personally.
        </p>
        <a href="#origin" className="sp-hero-cta sp-hero-anim sp-hero-anim-4">
          Read the full story <span aria-hidden="true">&darr;</span>
        </a>
      </div>
    </header>
  )
}

/* ===== ORNAMENT (between long-form sections) ===== */
function Ornament() {
  return (
    <div className="sp-ornament" aria-hidden="true">
      <span />
      <span />
      <span />
    </div>
  )
}

/* ===== LONG-FORM CONTENT (verbatim, do not edit) ===== */
const SECTIONS = [
  {
    id: 'origin',
    title: 'The broken hand',
    paragraphs: [
      'In December 2025 I went to Costa Rica with my best friend Dawson and broke my hand surfing. He had the flu and Covid at the same time. We still had a blast \u2014 which is most of what you need to know about the company we\u2019d build three months later.',
      'The cast meant I couldn\u2019t lift. Couldn\u2019t do most of what filled my time. So I sat with my laptop and learned what Claude could actually do.',
      'I\u2019d been doing data work all year \u2014 an ML pipeline at my Farmers Insurance internship, prompt engineering experiments, the kind of thing a statistics-and-economics double major picks up when nobody\u2019s watching. But the broken hand collapsed the time horizon. I went deep. I built a stock sentiment tracker that captured news flow and scored positions. Three months later, every position is still performing through serious market volatility. Then I built a sportsbook promotion optimizer that found arbitrage between promotional offers. Neither project was the point. The point was the pattern: capture data, build a model, find the edge. That\u2019s what I\u2019m good at.',
    ],
  },
  {
    id: 'barcelona',
    title: 'Barcelona',
    paragraphs: [
      'March 2026 I flew to Barcelona with my girlfriend. Senior year spring break.',
      'A few things happened in that week that I didn\u2019t know how to weigh at the time. We walked into the Sagrada Familia one week after it had received its final cross \u2014 we\u2019d booked the tickets on Travel Tuesday without knowing. We walked through the Vatican\u2019s holy doors during the Jubilee Year. We saw Pope Francis\u2019s body lying in state. We met a Montserrat tour guide named Jordi who took us out for a free day on e-bikes through Barcelona, paid for our meal, refused payment, and is still texting me restaurant recommendations like we\u2019re old friends.',
      'The flights we\u2019d booked on Spirit Airlines were canceled mid-trip because Spirit went under. I rebooked a rooftop hotel reservation by emailing the Sercotel front desk in scrambled Spanish from the airport. They squeezed us in. We got the single best photo of the Sagrada Familia anyone in our circle has ever taken. That photo became our hero image.',
      'Walking back to the hotel one of those nights I started counting. Every trip I\u2019d ever planned. The moms we\u2019d befriended in Ireland. The soccer fans we\u2019d met in Jaco. Australia for two months with my Sydney boss. Vancouver. Prague. Rome during the Jubilee Year. Hawaii. Every single one of them happened because the boring stuff was already handled \u2014 and the boring stuff was handled because I\u2019d handled it.',
      'I didn\u2019t know what it was going to become yet. But I knew the planning wasn\u2019t a habit. It was a skill. And it was worth something.',
    ],
  },
  {
    id: 'charleston',
    title: 'Charleston',
    paragraphs: [
      'I came home from Barcelona and pulled up my onboarding for Outside Agents. I\u2019d certified before the trip \u2014 passed the courses, ready to go, genuinely excited. Then I actually looked at the work. Insurance commissions. Cruise upsells. Products anyone can find on Google in four minutes. The whole industry is selling packaging.',
      'I quit Outside Agents.',
      'A week later I was at Kiawah with Dawson\u2019s family. The day we got there I met one of Dawson\u2019s friends who was leaving for Madrid study abroad the next morning. I dumped everything I knew on him for an hour \u2014 neighborhoods, transit, day trips, restaurants, the things you can\u2019t find on a checklist. His face changed.',
      'He said the thing I was already thinking: \u201CI wish someone had told me this stuff earlier.\u201D',
      'That\u2019s the moment the business existed. Not when we named it. Not when the site went live. That conversation on the porch in Charleston, with a guy leaving for Spain the next morning. I told Dawson the idea that night. He\u2019d already had similar conversations a dozen times. Two best friends with overlapping travel knowledge and zero overlap on which destinations. He\u2019d never said no to a trip. I\u2019d planned every trip I\u2019d ever been on.',
      'The Lads Travel Co was my idea. Dawson is the partner it had to be.',
    ],
  },
  {
    id: 'build',
    title: 'The 20-day build',
    paragraphs: [
      'I came home, bought a $40 Claude Pro subscription, and started building.',
      'Twenty days. One person primary builder. Six AI research agents \u2014 different models running in parallel for different verticals: flights, neighborhoods, food, safety, day trips, photography. 650+ curated spots validated by hand against the AI output. Twelve city frameworks: Barcelona, Rome, Iceland, Thailand, Munich, Poland, Costa Rica, Prague, Vienna, Dresden, and more. A live website at ladstravel.com \u2014 React, Vite, a 3D Three.js globe, Airtable-synced data, Vercel auto-deploy from GitHub. The whole stack.',
      'Total starting capital: $160. My brother Ashton gave me $120 as a Christmas gift to try the first agency. My Claude subscription is $40.',
      'Twelve hours a day for twenty days, then it kept going. The website broke completely on day 28 \u2014 white screen, the design too ambitious for the infrastructure. Instead of reverting I migrated to Vite in twenty minutes and the site came back stronger. That\u2019s the moment the project stopped being a prototype and started being a product.',
      'I taught myself things in those twenty days I\u2019d been told would take months. Claude Code from a cold start to a deployed React app. GitHub workflows. Vercel. Three.js. The kind of thing that makes you understand exactly what AI changes about what one person can build in a room alone.',
      'Then we made one decision that reset the whole company: free through December 2026. All merchandise proceeds to charity. Paid services launch January 2027. Four causes, all personal. Trust before transaction.',
    ],
  },
  {
    id: 'now',
    title: 'Where we are now',
    paragraphs: [
      'May 2026.',
      'I leave for Peru in days. The Salkantay Trek to Machu Picchu with my college roommate \u2014 a trip I\u2019ve been picturing my whole life. The flights were canceled mid-Barcelona when Spirit went under, so the route is Miami to Lima to Cusco to Salkantay to Machu Picchu and back through three separate booking chains I planned myself using the system we built. If it works, it\u2019s the first case study and the best trip of my life in one. If it doesn\u2019t, that\u2019s also a story worth telling.',
      'I start at Ford Motor Company as a data scientist on May 18, five days after I land in Detroit. I\u2019m also finishing my M.S. in Applied Statistics at Grand Valley next year. The Lads will run on evenings and weekends and Dawson\u2019s increasing bandwidth. We have a Poland trip with the friend group in August.',
      'The summer asks the question: does this thing work when nobody\u2019s building it every day?',
      'The fall asks the question after that.',
      'We\u2019ll let you know.',
    ],
  },
]

function StoryLong() {
  return (
    <div className="sp-long">
      {SECTIONS.map((s, i) => (
        <React.Fragment key={s.id}>
          {i > 0 && <Ornament />}
          <Reveal as="section" id={s.id} className="sp-long-section">
            <h2 className="sp-long-title">{s.title}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j} className="sp-long-p">
                {p}
              </p>
            ))}
          </Reveal>
        </React.Fragment>
      ))}
    </div>
  )
}

/* ===== TIMELINE — 14 entries, verbatim ===== */
const timeline = [
  {
    date: 'Dec 2025',
    title: 'Costa Rica',
    body: 'Broke my hand surfing. Came home with a cast and a lot of unfilled time. Spent it learning what Claude could actually do.',
  },
  {
    date: 'Dec 2025 \u2013 Feb 2026',
    title: 'The Experiments',
    body: 'Built a stock sentiment tracker and a sportsbook arbitrage tool. Neither was the point. The pattern was: capture data, build a model, find the edge.',
  },
  {
    date: 'Feb 2026',
    title: 'Outside Agents',
    body: 'Certified for a traditional travel agency before Barcelona. Looked at the actual work and watched my passion die in their onboarding portal. Quit before doing a single booking.',
  },
  {
    date: 'March 2026',
    title: 'Barcelona \u2014 The Spark',
    body: 'Sagrada Familia one week after the final cross. Vatican holy doors during the Jubilee Year. A Montserrat tour guide named Jordi gave us a free day, paid for our meal, refused payment. Spirit Airlines went under mid-trip. I rebooked a rooftop hotel in scrambled Spanish and got the photo that became our hero image.',
  },
  {
    date: 'Late March 2026',
    title: 'Charleston \u2014 The Founding',
    body: 'At Kiawah with Dawson\u2019s family. Briefed a friend leaving for Madrid the next morning. He said: \u201CI wish someone had told me this stuff earlier.\u201D That conversation was the founding moment. Told Dawson the idea that night.',
  },
  {
    date: 'March 24, 2026',
    title: 'Day 1',
    body: 'Bought a $40 Claude Pro subscription. Started building.',
  },
  {
    date: 'Late March \u2013 Mid April 2026',
    title: 'The 20-Day Build',
    body: 'Six AI research agents. 650+ curated spots across four continents. Twelve city frameworks. A live React site with a 3D globe, Airtable sync, Vercel auto-deploy. Total starting capital: $160. One primary builder.',
  },
  {
    date: 'April 2026',
    title: 'The Model',
    body: 'Free through December 2026. All merch proceeds to four charitable causes. Paid services launch January 2027. Trust before transaction.',
  },
  {
    date: 'April 19, 2026',
    title: 'Jordi Says Yes',
    body: 'First international partner. He used the word partners before I did. Tribute page in development.',
  },
  {
    date: 'May 1, 2026',
    title: 'Peru',
    body: 'Salkantay Trek to Machu Picchu with my college roommate. First live case study. Following our own guide in the real world.',
  },
  {
    date: 'May 18, 2026',
    title: 'Ford',
    body: 'Starts as a data scientist five days after I land. The summer becomes evenings and weekends.',
  },
  {
    date: 'Aug 2026',
    title: 'Poland',
    body: 'Group trip with the lads. Stress-test the model with the people who know me best.',
  },
  {
    date: 'Sept \u2013 Dec 2026',
    title: 'The Push',
    body: 'Site relaunch. First merch drop. Client acquisition begins. Does this become a business or a pivot?',
  },
  {
    date: 'Jan 2027',
    title: 'Paid Services Launch',
    body: 'With a portfolio. With a track record. With the trust built first.',
  },
]

function Timeline() {
  return (
    <section className="sp-timeline-section" aria-labelledby="sp-timeline-heading">
      <Reveal>
        <div className="sp-eyebrow">TIMELINE</div>
        <h2 id="sp-timeline-heading" className="sp-timeline-h">
          Dec 2025 &rarr; Jan 2027
        </h2>
      </Reveal>
      <ol className="sp-timeline">
        {timeline.map((t, i) => (
          <Reveal as="li" key={i} delay={i * 100} className="sp-timeline-item">
            <div className="sp-timeline-marker" aria-hidden="true" />
            <div className="sp-timeline-body">
              <div className="sp-timeline-date">{t.date}</div>
              <div className="sp-timeline-title">{t.title}</div>
              <p className="sp-timeline-text">{t.body}</p>
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

/* ===== STORY ANCHORS — 3 pull-quote cards ===== */
const anchors = [
  {
    quote: 'Product is presence, not flights and hotels.',
    sub: 'The mission, locked since day one.',
  },
  {
    quote: 'Free through December 2026. All merch proceeds to charity.',
    sub: 'Trust before transaction.',
  },
  {
    quote: 'AI handles research. Humans decide what it means.',
    sub: 'The technical philosophy.',
  },
]

function StoryAnchors() {
  return (
    <section className="sp-anchors-section" aria-label="Pull quotes">
      <div className="sp-anchors-grid">
        {anchors.map((a, i) => (
          <Reveal as="figure" key={i} delay={i * 100} className="sp-anchor-card">
            <blockquote className="sp-anchor-blockquote">
              <span className="sp-anchor-mark" aria-hidden="true">
                &ldquo;
              </span>
              <p className="sp-anchor-q">{a.quote}</p>
              <cite className="sp-anchor-sub">{a.sub}</cite>
            </blockquote>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ===== PAGE ===== */
export default function StoryPage() {
  useEffect(() => {
    // Only scroll to top on fresh load, not on in-page anchor navigation
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Helmet>
        <title>Our Story &mdash; The Lads Travel Co.</title>
        <meta
          name="description"
          content="The Lads Travel Co — a travel consulting company built in twenty days by one person with AI tools after he broke his hand surfing in Costa Rica."
        />
        <meta property="og:title" content="Our Story — The Lads Travel Co." />
        <meta
          property="og:description"
          content="Built in 20 days. From a broken hand and a $40 subscription. The origin story of The Lads Travel Co."
        />
        <meta property="og:image" content="https://ladstravel.com/images/jordi/best-sagrada.webp" />
        <meta property="og:url" content="https://ladstravel.com/story" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Story — The Lads Travel Co." />
        <meta
          name="twitter:description"
          content="Built in 20 days. From a broken hand and a $40 subscription."
        />
        <link rel="canonical" href="https://ladstravel.com/story" />
      </Helmet>

      <Nav scrolled={true} />

      <main className="sp-page">
        <StoryHero />
        <StoryLong />
        <Timeline />
        <StoryAnchors />
      </main>
    </>
  )
}
