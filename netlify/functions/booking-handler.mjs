// Shared booking handler. Used by both the Netlify Function (prod) at
// /api/booking and the Vite dev middleware (local). Wraps booq.now so the
// API key stays server-side.
//
// Slug is hardcoded to BOOQ_SLUG below — the client can't query for
// arbitrary booking types.

const BOOQ_BASE = 'https://booq.now'
const BOOQ_SLUG = 'consultation'

async function callBooq(path, init = {}) {
  const apiKey = process.env.BOOQ_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      status: 500,
      data: { error: 'BOOQ_API_KEY not configured' },
    }
  }
  let res
  try {
    res = await fetch(`${BOOQ_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    })
  } catch (err) {
    return {
      ok: false,
      status: 502,
      data: { error: String(err?.message || err) },
    }
  }
  const data = await res.json().catch(() => null)
  return { ok: res.ok, status: res.status, data }
}

export async function getAvailability({ month, date, timezone } = {}) {
  const tz = String(timezone || 'Europe/London')
  const search = new URLSearchParams({ slug: BOOQ_SLUG, timezone: tz })
  if (date) {
    search.set('date', String(date))
  } else if (month) {
    search.set('month', String(month))
  } else {
    return {
      ok: false,
      status: 400,
      data: { error: 'month or date required' },
    }
  }
  return callBooq(`/api/v1/availability?${search.toString()}`, { method: 'GET' })
}

export async function createBooking(body = {}) {
  const required = ['startTime', 'visitorName', 'visitorEmail', 'visitorTimezone']
  const missing = required.filter((k) => !body[k])
  if (missing.length > 0) {
    return {
      ok: false,
      status: 400,
      data: { error: `missing fields: ${missing.join(', ')}` },
    }
  }
  return callBooq('/api/v1/bookings', {
    method: 'POST',
    body: JSON.stringify({
      slug: BOOQ_SLUG,
      startTime: body.startTime,
      visitorName: body.visitorName,
      visitorEmail: body.visitorEmail,
      visitorTimezone: body.visitorTimezone,
      notes: body.notes || undefined,
    }),
  })
}
