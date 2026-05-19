import { getAvailability, createBooking } from './booking-handler.mjs'

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export default async (req) => {
  try {
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const result = await getAvailability({
        month: url.searchParams.get('month') || undefined,
        date: url.searchParams.get('date') || undefined,
        timezone: url.searchParams.get('timezone') || undefined,
      })
      return jsonResponse(result.status || 500, result.data || {})
    }

    if (req.method === 'POST') {
      let body
      try {
        body = await req.json()
      } catch {
        return jsonResponse(400, { error: 'Invalid JSON' })
      }
      const result = await createBooking(body)
      return jsonResponse(result.status || 500, result.data || {})
    }

    return new Response('Method Not Allowed', { status: 405 })
  } catch (err) {
    console.error('[booking] unhandled error:', err)
    return jsonResponse(500, { error: 'server_error' })
  }
}

export const config = { path: '/api/booking' }
