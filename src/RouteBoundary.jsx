import React from 'react'
import { Link } from 'react-router-dom'

/* Route-level error boundary.
   Added Aug 17 after /michigan shipped as a fully blank black page: one
   unguarded `data.logistics.flights` on a framework whose logistics was null
   threw during render, React unmounted the entire tree, and the page served
   zero text with no visible error. A blank page is the worst possible failure
   — it looks like a dead site rather than a broken section.

   This does NOT excuse unguarded data access; it is the seatbelt. Fix the
   underlying field, and this stays invisible. */
export default class RouteBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error, info) {
    // Surfaced in Clarity / Vercel logs rather than swallowed silently.
    console.error('[route error]', error, info?.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children

    return (
      <div className="route-error">
        <div className="route-error-inner">
          <div className="route-error-label">THIS PAGE BROKE</div>
          <h1 className="route-error-title">Something on this page didn&rsquo;t load.</h1>
          <p className="route-error-text">
            That&rsquo;s on us, not you. The rest of the site is fine &mdash; and if you tell us
            what you were looking at, we&rsquo;ll fix it faster.
          </p>
          <div className="route-error-actions">
            <Link className="route-error-btn" to="/">
              BACK TO HOME
            </Link>
            <a className="route-error-link" href="mailto:brady@ladstravel.com">
              brady@ladstravel.com
            </a>
          </div>
        </div>
      </div>
    )
  }
}
