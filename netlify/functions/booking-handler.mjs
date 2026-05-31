// Shared booking handler. Used by both the Netlify Function (prod) at
// /api/booking and the Vite dev middleware (local). Wraps booq.now so the
// API key stays server-side.
//
// Slug is hardcoded to BOOQ_SLUG below — the client can't query for
// arbitrary booking types.

const BOOQ_BASE = 'https://booq.now'
const BOOQ_SLUG = 'consultation'

// After this hour (local to the visitor) we drop 'today' from the
// available-days result. booq.now technically still returns today
// because there's calendar time left, but a consultation can't be
// realistically arranged at 23:00.
const SAME_DAY_CUTOFF_HOUR = 17

function visitorNowParts(timezone) {
  try {
    const now = new Date()
    const date = new Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(now)
    const hour = parseInt(
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: timezone,
      }).format(now),
      10,
    )
    return { date, hour }
  } catch {
    return { date: new Date().toISOString().slice(0, 10), hour: 12 }
  }
}

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
  const r = await callBooq(`/api/v1/availability?${search.toString()}`, { method: 'GET' })
  // For month queries, drop today from the days list if it's past the
  // same-day cutoff — too late for the visitor to book today.
  if (r.ok && month && Array.isArray(r.data?.days)) {
    const { date: todayStr, hour } = visitorNowParts(tz)
    if (hour >= SAME_DAY_CUTOFF_HOUR && r.data.days.includes(todayStr)) {
      const days = r.data.days.filter((d) => d !== todayStr)
      r.data = { ...r.data, days }
      // booq.now only sets nextAvailableDate when a month has no days, so it's
      // null here (the month did have today). If dropping today empties the
      // month, that pointer is now stale and the calendar would dead-end —
      // peek the next month to restore the jump-ahead.
      if (days.length === 0 && !r.data.nextAvailableDate) {
        r.data.nextAvailableDate = await peekNextAvailableDate(String(month), tz)
      }
    }
  }
  return r
}

// Returns the next bookable date at or after the month following `month`,
// or null if there's none in the booking window. Used to recover a forward
// pointer when the same-day cutoff empties the current month.
function nextMonthOf(month) {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(y, m, 1) // m (1-based) as a 0-based index = next month
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

async function peekNextAvailableDate(month, tz) {
  const next = nextMonthOf(month)
  const search = new URLSearchParams({ slug: BOOQ_SLUG, timezone: tz, month: next })
  const r = await callBooq(`/api/v1/availability?${search.toString()}`, { method: 'GET' })
  if (!r.ok) return null
  return r.data?.days?.[0] || r.data?.nextAvailableDate || null
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
