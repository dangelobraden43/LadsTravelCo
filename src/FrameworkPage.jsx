import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './FrameworkPage.css';

export default function FrameworkPage({ data, heroImg }) {
  const [activeNav, setActiveNav] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${data.name} — The Lads Travel Co.`;
  }, [data.name]);

  const style = {
    '--fw-bg': data.palette.bg,
    '--fw-surface': data.palette.surface,
    '--fw-elevated': data.palette.elevated,
    '--fw-accent': data.palette.accent,
  };

  const scrollTo = (id) => {
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const totalSpots = data.categories.reduce((sum, cat) => sum + cat.spots.length, 0);

  return (
    <div className="fw-page" style={style}>
      {/* ===== HERO ===== */}
      <section className="fw-hero">
        {heroImg && (
          <div className="fw-hero-bg">
            <img src={heroImg} alt={data.name} loading="eager" />
          </div>
        )}
        <div className="fw-hero-overlay" />
        <Link to="/" className="fw-hero-back">&larr; Back to The Lads Travel Co.</Link>
        <div className="fw-hero-content">
          <div className="fw-hero-badge">PERSONALLY VALIDATED</div>
          <h1 className="fw-hero-name">{data.name}</h1>
          <p className="fw-hero-tagline">{data.tagline}</p>
          <div className="fw-hero-stats">
            {data.heroStats.map((s, i) => (
              <div key={i} className="fw-hero-stat">
                <span className="fw-hero-stat-val">{s.value}</span>
                <span className="fw-hero-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== NAV ===== */}
      <nav className="fw-nav">
        <div className="fw-nav-inner">
          {data.navSections.map(s => {
            const id = s.toLowerCase().replace(/\s+/g, '-');
            return (
              <button
                key={id}
                className={`fw-nav-pill${activeNav === id ? ' active' : ''}`}
                onClick={() => scrollTo(id)}
              >{s}</button>
            );
          })}
        </div>
      </nav>

      {/* ===== OVERVIEW ===== */}
      <section id="overview" className="fw-section">
        <div className="fw-section-label">OVERVIEW</div>
        <h2 className="fw-section-title">{totalSpots} Spots Across {data.categories.length} Categories</h2>
        <div className="fw-overview-grid">
          <div className="fw-overview-card">
            <div className="fw-overview-card-label">AT A GLANCE</div>
            <p className="fw-overview-card-text">{data.overview.quickRead}</p>
          </div>
          <div className="fw-overview-card">
            <div className="fw-overview-card-label">BUDGET</div>
            <p className="fw-overview-card-text">{data.overview.budget}</p>
          </div>
          <div className="fw-overview-card">
            <div className="fw-overview-card-label">THE FRAMEWORK</div>
            <p className="fw-overview-card-text">{data.overview.framework}</p>
          </div>
        </div>
        {data.overview.ladsBothKnow && (
          <div className="fw-callout">
            <div className="fw-callout-label">BOTH LADS KNOW THIS</div>
            <p className="fw-callout-text">{data.overview.ladsBothKnow}</p>
          </div>
        )}
      </section>

      {/* ===== SPOTS BY CATEGORY ===== */}
      {data.categories.map(cat => (
        <section key={cat.id} id={cat.id} className="fw-section" style={{ paddingTop: 40 }}>
          <div className="fw-category-header">
            <h3 className="fw-category-name">{cat.name}</h3>
            <span className="fw-category-count">{cat.spots.length} spots</span>
          </div>
          <div className="fw-spots-grid">
            {cat.spots.map((spot, i) => {
              const isLads = spot.validator && spot.validator !== 'Research';
              return (
                <div key={i} className="fw-spot">
                  <div className="fw-spot-name">{spot.name}</div>
                  <div className="fw-spot-area">{spot.area}</div>
                  <p className="fw-spot-desc">{spot.description}</p>
                  <div className="fw-spot-meta">
                    <span className={`fw-spot-badge ${isLads ? 'validated' : 'research'}`}>
                      {isLads ? spot.validator : 'RESEARCH'}
                    </span>
                    {spot.rating && <span className="fw-spot-rating">{spot.rating}&#9733;</span>}
                    {spot.price && <span className="fw-spot-price">{spot.price}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* ===== DAY TRIPS ===== */}
      <section id="day-trips" className="fw-section">
        <div className="fw-section-label">DAY TRIPS</div>
        <h2 className="fw-section-title">{data.dayTrips.length} Day Trips We Recommend</h2>
        <div className="fw-trips-grid">
          {data.dayTrips.map((trip, i) => (
            <div key={i} className="fw-trip">
              <div className="fw-trip-header">
                <div>
                  <div className="fw-trip-name">{trip.name}</div>
                  <div className="fw-trip-from">FROM {trip.from.toUpperCase()}</div>
                </div>
                {trip.ladsRating && <div className="fw-trip-rating">Lads: {trip.ladsRating}</div>}
              </div>
              <p className="fw-trip-desc">{trip.description}</p>
              {trip.bookingUrl && (
                <a href={trip.bookingUrl} target="_blank" rel="noopener noreferrer" className="fw-trip-book">
                  Book on {trip.bookingPlatform} &rarr;
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ===== MAPS ===== */}
      <section id="maps" className="fw-section">
        <div className="fw-section-label">GOOGLE MAPS</div>
        <h2 className="fw-section-title">Drop These Into Your Phone</h2>
        <p className="fw-section-desc">Open in Google Maps, hit save, and navigate like you live there. Every pub, restaurant, and attraction pinned.</p>
        <div className="fw-maps-grid">
          {data.mapsLinks.map((m, i) => (
            <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className="fw-map-card">
              <div className="fw-map-icon">&#128205;</div>
              <div className="fw-map-name">{m.name}</div>
              <div className="fw-map-cta">Open in Google Maps &rarr;</div>
            </a>
          ))}
        </div>
      </section>

      {/* ===== LOGISTICS ===== */}
      <section id="logistics" className="fw-section">
        <div className="fw-section-label">LOGISTICS</div>
        <h2 className="fw-section-title">Getting There &amp; Getting Around</h2>
        <div className="fw-logistics-grid">
          <div className="fw-logistics-card">
            <div className="fw-logistics-label">FLIGHTS</div>
            <p className="fw-logistics-text">{data.logistics.flights}</p>
          </div>
          <div className="fw-logistics-card">
            <div className="fw-logistics-label">IN-COUNTRY</div>
            <p className="fw-logistics-text">{data.logistics.inCountry}</p>
          </div>
          <div className="fw-logistics-card">
            <div className="fw-logistics-label">GETTING AROUND</div>
            <p className="fw-logistics-text">{data.logistics.gettingAround}</p>
          </div>
          <div className="fw-logistics-card">
            <div className="fw-logistics-label">TIPPING</div>
            <p className="fw-logistics-text">{data.logistics.tipping}</p>
          </div>
        </div>

        {data.costModel && (
          <>
            <h3 className="fw-section-title" style={{ fontSize: '1.4rem', marginTop: 48 }}>Cost Model (Per Person, Group of 4)</h3>
            <table className="fw-cost-table">
              <thead>
                <tr>{data.costModel.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {data.costModel.rows.map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
                ))}
                <tr>{data.costModel.totals.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
              </tbody>
            </table>
            {data.costModel.lean && <p className="fw-cost-lean">{data.costModel.lean}</p>}
          </>
        )}
      </section>

      {/* ===== LADS TAKE ===== */}
      <div className="fw-lads-take">
        <p className="fw-lads-take-quote">&ldquo;{data.ladsTake}&rdquo;</p>
        <div className="fw-lads-take-attr">THE LADS&rsquo; TAKE</div>
      </div>

      {/* ===== FOOTER NAV ===== */}
      <div className="fw-footer-nav">
        <Link to="/" className="fw-footer-link">&larr; Back to all destinations</Link>
      </div>
    </div>
  );
}
