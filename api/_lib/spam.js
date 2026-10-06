/* Three cheap checks before a human ever reads an intake: a hidden field only bots
 * fill, a floor on how fast a person can finish, and Cloudflare Turnstile when its
 * secret is configured. Founder triage is the fourth. */
/* 45 s rejected a founder's real run on Oct 6: skipping the optional questions is fast. */
export const MIN_MS = { intake: 20_000, companion: 8_000 }

export async function checkSpam({ honeypot, startedAt, now, kind, turnstile, ip }, env, fetchImpl = fetch) {
  if (honeypot) return { ok: false, reason: 'honeypot' }
  if (!(now - startedAt >= MIN_MS[kind])) return { ok: false, reason: 'too-fast' }
  /* Enforced only once the client widget exists and both are set: a secret alone
   * would reject every submission (Oct 6 review). */
  if (env.TURNSTILE_SECRET && env.TURNSTILE_ENFORCE === '1') {
    try {
      const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: turnstile || '', remoteip: ip || '' })
      const res = await fetchImpl('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body })
      const out = await res.json()
      if (!out.success) return { ok: false, reason: 'turnstile' }
    } catch {
      return { ok: false, reason: 'turnstile' }
    }
  }
  return { ok: true, reason: null }
}
