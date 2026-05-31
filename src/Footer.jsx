import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const COLLECTIONS = [
  { label: 'Global', path: '/global' },
  { label: 'Outdoors', path: '/outdoors' },
  { label: 'Bucket List', path: '/bucket-list' },
  { label: 'Local', path: '/local' },
]

const SOCIALS = [
  { label: 'Instagram', href: '#' },
  { label: 'TikTok', href: '#' },
  { label: 'YouTube', href: '#' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer id="footer" className="lads-footer">
      <div className="lads-footer-inner">
        <div className="lads-footer-brand">
          <div className="lads-footer-mark">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.2" />
              <ellipse cx="16" cy="16" rx="14" ry="6" stroke="currentColor" strokeWidth="1.2" />
              <line x1="2" y1="16" x2="30" y2="16" stroke="currentColor" strokeWidth="1.2" />
              <line x1="16" y1="2" x2="16" y2="30" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span className="lads-footer-name">The Lads Travel Co.</span>
          </div>
          <p className="lads-footer-tag">A travel intelligence company. Launching Fall 2026.</p>
        </div>

        <div className="lads-footer-cols">
          <div className="lads-footer-col">
            <div className="lads-footer-h">Explore</div>
            <ul>
              {COLLECTIONS.map((c) => (
                <li key={c.path}>
                  <Link to={c.path}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lads-footer-col" id="follow-along">
            <div className="lads-footer-h">Follow Along</div>
            <ul>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer noopener">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="lads-footer-note">We launch Fall 2026 — follow the build.</p>
          </div>

          <div className="lads-footer-col">
            <div className="lads-footer-h">The Lads</div>
            <ul>
              <li>
                <Link to="/#team">About the team</Link>
              </li>
              <li>
                <a href="mailto:brady@ladstravel.com">brady@ladstravel.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="lads-footer-base">
        <span>&copy; {year} The Lads Travel Co.</span>
        <span>ladstravel.com</span>
      </div>
    </footer>
  )
}
