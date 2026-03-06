import { useState, useEffect } from 'react'

const API_BASE = 'https://booq.now'
const API_KEY = 'bkr_3cb7642e6240fb9d514cd065ed83dae4cae32d205245238949b140536573552e'

export default function BookingWidget({ slug }) {
  const [step, setStep] = useState('date')
  const [timezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [availableDays, setAvailableDays] = useState([])
  const [slots, setSlots] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [booking, setBooking] = useState(null)

  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  }

  useEffect(() => {
    const now = new Date()
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    setLoading(true)
    fetch(
      `${API_BASE}/api/v1/availability?slug=${slug}&timezone=${timezone}&month=${month}`,
      { headers }
    )
      .then((r) => r.json())
      .then((data) => setAvailableDays(data.days || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug, timezone])

  useEffect(() => {
    if (!selectedDate) return
    setLoading(true)
    fetch(
      `${API_BASE}/api/v1/availability?slug=${slug}&timezone=${timezone}&date=${selectedDate}`,
      { headers }
    )
      .then((r) => r.json())
      .then((data) => {
        setSlots(data.slots || [])
        setStep('time')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [selectedDate, slug, timezone])

  function handleSelectSlot(slot) {
    setSelectedSlot(slot)
    setStep('form')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/v1/bookings`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          slug,
          startTime: selectedSlot.start,
          visitorName: name,
          visitorEmail: email,
          visitorTimezone: timezone,
          notes: notes || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      setBooking(data)
      setStep('confirmed')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function formatTime(iso) {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function formatDateLabel(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  if (step === 'confirmed' && booking) {
    return (
      <div className="p-8 text-center">
        <div className="text-accent text-4xl mb-4">&#10003;</div>
        <h3 className="text-xl text-text mb-2">Booking Confirmed</h3>
        <p className="text-text-muted">
          {new Date(booking.startTime).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}{' '}
          at {formatTime(booking.startTime)} &ndash; {formatTime(booking.endTime)}
        </p>
        <p className="text-text-muted text-sm mt-2">
          A confirmation email has been sent to {email}.
        </p>
      </div>
    )
  }

  return (
    <div className="p-8 min-h-[400px]">
      {error && (
        <div className="mb-4 p-3 rounded bg-red-900/30 border border-red-800 text-red-300 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-400 hover:text-red-200"
          >
            &times;
          </button>
        </div>
      )}

      {step === 'date' && (
        <div>
          <h3 className="text-xl text-text mb-6">Select a Date</h3>
          {loading && <p className="text-text-muted">Loading availability...</p>}
          {!loading && availableDays.length === 0 && (
            <p className="text-text-muted">No availability this month.</p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {availableDays.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDate(day)}
                className="px-4 py-3 rounded-lg border border-background text-text-muted
                  hover:border-accent hover:text-text transition-colors text-sm text-left"
              >
                {formatDateLabel(day)}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'time' && (
        <div>
          <button
            onClick={() => { setStep('date'); setSlots([]); setSelectedDate(null) }}
            className="text-sm text-text-muted hover:text-text transition-colors mb-4 inline-block"
          >
            &larr; Back
          </button>
          <h3 className="text-xl text-text mb-2">Select a Time</h3>
          <p className="text-sm text-text-muted mb-6">{formatDateLabel(selectedDate)}</p>
          {loading && <p className="text-text-muted">Loading times...</p>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {slots.map((slot) => (
              <button
                key={slot.start}
                onClick={() => handleSelectSlot(slot)}
                className="px-4 py-3 rounded-lg border border-background text-text-muted
                  hover:border-accent hover:text-text transition-colors text-sm"
              >
                {formatTime(slot.start)} &ndash; {formatTime(slot.end)}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'form' && (
        <div>
          <button
            type="button"
            onClick={() => setStep('time')}
            className="text-sm text-text-muted hover:text-text transition-colors mb-4 inline-block"
          >
            &larr; Back
          </button>
          <h3 className="text-xl text-text mb-2">Your Details</h3>
          <p className="text-sm text-text-muted mb-6">
            {formatDateLabel(selectedDate)} at {formatTime(selectedSlot.start)}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-background border border-background
                  text-text placeholder-text-muted/50 focus:border-accent focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-lg bg-background border border-background
                  text-text placeholder-text-muted/50 focus:border-accent focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-background border border-background
                  text-text placeholder-text-muted/50 focus:border-accent focus:outline-none transition-colors resize-none"
                placeholder="Tell us about your project..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent text-white font-normal
                hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
