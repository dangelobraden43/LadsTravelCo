import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import michiganData from './data/michigan'

/* ─── palette ─── */
const C = {
  bg: '#141210',
  surface: '#1c1915',
  elevated: '#242019',
  gold: '#c9a84c',
  copper: '#b8886e',
  cream: '#e8dcc8',
  cream2: '#b8ad9a',
  muted: '#8a8070',
  dim: '#5a5550',
  border: 'rgba(201,168,76,0.10)',
  border2: 'rgba(201,168,76,0.20)',
}

const TIER_STYLES = {
  'Must-Hit': { bg: C.gold, color: '#141210', label: 'MUST-HIT' },
  'Lads Pick': { bg: C.copper, color: '#141210', label: 'LADS PICK' },
  'Also Good': { bg: C.dim, color: C.cream, label: 'ALSO GOOD' },
}

/* ─── intersection observer hook ─── */
function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

/* ─── gold particles (CSS only, pre-computed) ─── */
// Pre-compute particle positions outside render to avoid impure Math.random calls
const PARTICLE_DATA = Array.from({ length: 40 }, (_, i) => {
  // Seeded pseudo-random based on index for deterministic output
  const seed = (i * 2654435761) >>> 0
  const r1 = (seed & 0xff) / 255
  const r2 = ((seed >> 8) & 0xff) / 255
  const r3 = ((seed >> 16) & 0xff) / 255
  const r4 = ((seed >> 24) & 0xff) / 255
  const r5 = ((seed * 31) & 0xff) / 255
  const r6 = ((seed * 73) & 0xff) / 255
  return {
    size: 1.5 + r1 * 2.5,
    left: r2 * 100,
    delay: r3 * 12,
    duration: 8 + r4 * 10,
    opacity: 0.15 + r5 * 0.35,
    bottom: r6 * 20,
  }
})

function GoldParticles() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <style>{`
        @keyframes gp-float {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(40px) scale(0.5); opacity: 0; }
        }
      `}</style>
      {PARTICLE_DATA.map((p, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            bottom: `-${p.bottom}%`,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${C.gold}, transparent)`,
            opacity: p.opacity,
            animation: `gp-float ${p.duration}s ${p.delay}s infinite ease-in`,
          }}
        />
      ))}
    </div>
  )
}

/* ─── scroll indicator ─── */
function ScrollIndicator() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
      }}
    >
      <style>{`
        @keyframes gi-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(8px); opacity: 1; }
        }
      `}</style>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          letterSpacing: 3,
          color: C.muted,
          marginBottom: 12,
          textTransform: 'uppercase',
        }}
      >
        Scroll to explore
      </div>
      <div style={{ animation: 'gi-bounce 2s ease-in-out infinite' }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M4 7 L10 13 L16 7"
            stroke={C.gold}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

/* ─── cover section ─── */
function Cover() {
  const [ref, visible] = useReveal()
  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse at 50% 30%, #1e1b16 0%, ${C.bg} 70%)`,
        overflow: 'hidden',
        padding: '40px 24px',
      }}
    >
      <GoldParticles />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'opacity 1.2s ease, transform 1.2s ease',
        }}
      >
        {/* brand label */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: 5,
            color: C.gold,
            marginBottom: 48,
            textTransform: 'uppercase',
          }}
        >
          The Lads Travel Co.
        </div>

        {/* main title */}
        <h1
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 'clamp(56px, 10vw, 96px)',
            fontWeight: 400,
            fontStyle: 'italic',
            color: C.cream,
            margin: 0,
            lineHeight: 1.05,
          }}
        >
          Michigan
        </h1>
        <div
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 'clamp(20px, 3.5vw, 32px)',
            fontWeight: 400,
            color: C.cream2,
            marginTop: 8,
            letterSpacing: 2,
          }}
        >
          Local Intelligence
        </div>

        {/* stats */}
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 2,
            color: C.muted,
            marginTop: 32,
          }}
        >
          42+ venues &middot; 5 regions &middot; Personally validated
        </div>

        {/* divider */}
        <div
          style={{
            width: 60,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
            margin: '32px auto',
          }}
        />

        {/* curator */}
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            color: C.cream2,
            letterSpacing: 0.5,
          }}
        >
          Curated by Brady &mdash; M.S. Applied Statistics, GVSU
        </div>
      </div>

      <ScrollIndicator />
    </section>
  )
}

/* ─── sticky nav ─── */
function StickyNav({ categories, activeId, onSelect }) {
  const [stuck, setStuck] = useState(false)
  const navRef = useRef(null)
  const sentinelRef = useRef(null)

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const obs = new IntersectionObserver(([entry]) => setStuck(!entry.isIntersecting), {
      threshold: 0,
    })
    obs.observe(sentinel)
    return () => obs.disconnect()
  }, [])

  const allCount = categories.reduce((sum, c) => sum + c.spots.length, 0)

  const pills = [
    { id: 'all', label: 'All', count: allCount },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name.replace('Grand Rapids Breweries', 'Grand Rapids'),
      count: c.spots.length,
    })),
  ]

  return (
    <>
      <div ref={sentinelRef} style={{ height: 1 }} />
      <nav
        ref={navRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: stuck ? 'rgba(20, 18, 16, 0.95)' : 'transparent',
          backdropFilter: stuck ? 'blur(12px)' : 'none',
          borderBottom: stuck ? `1px solid ${C.border}` : '1px solid transparent',
          transition: 'background 0.3s, border-bottom 0.3s, backdrop-filter 0.3s',
          padding: '16px 24px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            justifyContent: 'center',
            flexWrap: 'nowrap',
            minWidth: 'max-content',
            margin: '0 auto',
          }}
        >
          {pills.map((p) => {
            const isActive = activeId === p.id
            return (
              <button
                key={p.id}
                onClick={() => onSelect(p.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 24,
                  border: `1px solid ${isActive ? C.gold : C.border2}`,
                  background: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                  color: isActive ? C.gold : C.cream2,
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                {p.label}
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    color: isActive ? C.gold : C.dim,
                    opacity: 0.8,
                  }}
                >
                  {p.count}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}

/* ─── spot card ─── */
function SpotCard({ spot, index }) {
  const [ref, visible] = useReveal()
  const [hovered, setHovered] = useState(false)
  const tier = TIER_STYLES[spot.tier] || TIER_STYLES['Also Good']
  const isValidated = spot.validated && spot.validator !== 'Research'

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: C.surface,
        border: `1px solid ${hovered ? C.border2 : C.border}`,
        borderRadius: 12,
        padding: 28,
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered
            ? 'translateY(-3px) scale(1.008)'
            : 'translateY(0) scale(1)'
          : 'translateY(24px) scale(0.98)',
        transition:
          'opacity 0.6s ease, transform 0.4s ease, border 0.3s ease, box-shadow 0.3s ease',
        transitionDelay: visible ? `${(index % 4) * 80}ms` : '0ms',
        boxShadow: hovered ? '0 12px 40px rgba(0,0,0,0.35)' : '0 2px 8px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* tier + rating row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: 4,
            background: tier.bg,
            color: tier.color,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.5,
          }}
        >
          {tier.label}
        </span>
        {spot.rating && (
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                fontFamily: "'EB Garamond', serif",
                fontSize: 28,
                fontWeight: 500,
                color: C.gold,
                lineHeight: 1,
              }}
            >
              {spot.rating}
            </span>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: C.dim,
              }}
            >
              /10
            </span>
          </div>
        )}
      </div>

      {/* name */}
      <h3
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: 22,
          fontWeight: 500,
          color: C.cream,
          margin: 0,
          lineHeight: 1.2,
        }}
      >
        {spot.name}
      </h3>

      {/* area */}
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 1.5,
          color: C.muted,
          textTransform: 'uppercase',
          marginTop: -6,
        }}
      >
        {spot.area}
      </div>

      {/* description */}
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14.5,
          lineHeight: 1.7,
          color: C.cream2,
          margin: 0,
          flex: 1,
        }}
      >
        {spot.description}
      </p>

      {/* price (golf) */}
      {spot.price && (
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            color: C.gold,
            padding: '6px 0',
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {spot.price}
          {spot.note && (
            <span style={{ color: C.muted, fontSize: 11, marginLeft: 10 }}>{spot.note}</span>
          )}
        </div>
      )}

      {/* validation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingTop: 8,
          borderTop: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: isValidated ? C.copper : '#8a9ab0',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: isValidated ? C.copper : '#8a9ab0',
            letterSpacing: 1,
          }}
        >
          {isValidated ? 'Brady' : 'Research'}
        </span>
      </div>
    </div>
  )
}

/* ─── category section ─── */
function CategorySection({ category }) {
  const [ref, visible] = useReveal()
  return (
    <section
      ref={ref}
      id={`section-${category.id}`}
      style={{
        padding: '64px 24px 32px',
        maxWidth: 900,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          marginBottom: 36,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
        }}
      >
        <h2
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 'clamp(28px, 4vw, 36px)',
            fontWeight: 400,
            color: C.cream,
            margin: 0,
          }}
        >
          {category.name}
        </h2>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: 1,
            color: C.gold,
            background: 'rgba(201,168,76,0.08)',
            border: `1px solid ${C.border2}`,
            borderRadius: 20,
            padding: '4px 12px',
          }}
        >
          {category.spots.length} spots
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(380px, 100%), 1fr))',
          gap: 20,
        }}
      >
        {category.spots.map((spot, i) => (
          <SpotCard key={spot.name} spot={spot} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ─── lads take section ─── */
function LadsTake() {
  const [ref, visible] = useReveal()
  return (
    <section
      ref={ref}
      style={{
        padding: '80px 24px',
        background: `linear-gradient(180deg, ${C.bg} 0%, #16140f 50%, ${C.bg} 100%)`,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 0.8s ease, transform 0.8s ease',
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: 4,
            color: C.gold,
            textTransform: 'uppercase',
            marginBottom: 32,
          }}
        >
          The Lads Take
        </div>
        <blockquote
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: 'clamp(22px, 3.5vw, 30px)',
            fontStyle: 'italic',
            color: C.cream,
            lineHeight: 1.6,
            margin: 0,
            padding: 0,
          }}
        >
          &ldquo;{michiganData.ladsTake}&rdquo;
        </blockquote>
        <div
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            color: C.copper,
            marginTop: 28,
            letterSpacing: 0.5,
          }}
        >
          &mdash; Brady, The Lads Travel Co.
        </div>
      </div>
    </section>
  )
}

/* ─── footer ─── */
function GiftFooter() {
  return (
    <footer
      style={{
        padding: '48px 24px 40px',
        textAlign: 'center',
        borderTop: `1px solid ${C.border}`,
      }}
    >
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          color: C.muted,
          margin: '0 0 16px',
          lineHeight: 1.6,
        }}
      >
        This guide was built with firsthand experience, data science, and AI research.
      </p>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 3,
          color: C.dim,
          marginBottom: 12,
          textTransform: 'uppercase',
        }}
      >
        The Lads Travel Co.
      </div>
      <a
        href="mailto:brady@ladstravel.com"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: C.gold,
          textDecoration: 'none',
          letterSpacing: 1,
        }}
      >
        brady@ladstravel.com
      </a>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 13,
          color: C.copper,
          marginTop: 20,
          fontStyle: 'italic',
        }}
      >
        Free through 2026. Seriously.
      </p>
    </footer>
  )
}

/* ─── main gift page ─── */
export default function GiftPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const { categories } = michiganData

  const handleSelect = useCallback(
    (id) => {
      setActiveFilter(id)
      if (id === 'all') {
        const firstSection = document.getElementById(`section-${categories[0].id}`)
        if (firstSection) firstSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        const el = document.getElementById(`section-${id}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    [categories]
  )

  const visibleCategories =
    activeFilter === 'all' ? categories : categories.filter((c) => c.id === activeFilter)

  return (
    <div
      style={{
        background: C.bg,
        minHeight: '100vh',
        color: C.cream,
        scrollBehavior: 'smooth',
      }}
    >
      <Cover />
      <StickyNav categories={categories} activeId={activeFilter} onSelect={handleSelect} />
      {visibleCategories.map((cat) => (
        <CategorySection key={cat.id} category={cat} />
      ))}
      <LadsTake />
      <GiftFooter />
    </div>
  )
}
