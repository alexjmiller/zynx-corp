import { useState, useEffect, useId } from 'react'

// All booq.now calls go through our own /api/booking endpoint. The
// bearer token stays server-side; the client never sees it.
const API_ENDPOINT = '/api/booking'

const WEEKDAY_LABELS = [
  { short: 'Su', full: 'Sunday' },
  { short: 'Mo', full: 'Monday' },
  { short: 'Tu', full: 'Tuesday' },
  { short: 'We', full: 'Wednesday' },
  { short: 'Th', full: 'Thursday' },
  { short: 'Fr', full: 'Friday' },
  { short: 'Sa', full: 'Saturday' },
]

export default function BookingWidget() {
  const [step, setStep] = useState('date')
  const [timezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })
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

  // Stable ids so the form labels can associate with their inputs.
  const nameId = useId()
  const emailId = useId()
  const notesId = useId()

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ month, timezone })
    fetch(`${API_ENDPOINT}?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        const today = new Date().toISOString().split('T')[0]
        const days = (data.days || []).filter((d) => d >= today)
        // When a month has no bookable days, booq.now returns the next date
        // with availability. Jump the calendar forward to that month rather
        // than dead-ending on an empty grid. Only advance to a *different*
        // month so we can't loop; keep loading on until the refetch lands.
        if (days.length === 0 && data.nextAvailableDate) {
          const nextMonth = data.nextAvailableDate.slice(0, 7)
          if (nextMonth !== month) {
            setMonth(nextMonth)
            return
          }
        }
        setAvailableDays(days)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [month, timezone])

  useEffect(() => {
    if (!selectedDate) return
    setLoading(true)
    const params = new URLSearchParams({ date: selectedDate, timezone })
    fetch(`${API_ENDPOINT}?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setSlots(data.slots || [])
        setStep('time')
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [selectedDate, timezone])

  function handleSelectSlot(slot) {
    setSelectedSlot(slot)
    setStep('form')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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

  function fullDateLabel(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  function buildCalendar() {
    const [yearStr, monthStr] = month.split('-')
    const year = Number(yearStr)
    const monthIndex = Number(monthStr) - 1
    const firstDay = new Date(year, monthIndex, 1).getDay()
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    const availableSet = new Set(availableDays)
    const now = new Date()
    const isCurrentMonth =
      year === now.getFullYear() && monthIndex === now.getMonth()
    const today = now.getDate()

    const cells = []
    for (let i = 0; i < firstDay; i++) {
      cells.push({ day: null })
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      cells.push({
        day: d,
        dateStr,
        available: availableSet.has(dateStr),
        past: isCurrentMonth && d < today,
      })
    }
    return { cells, label: new Date(year, monthIndex).toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) }
  }

  if (step === 'confirmed' && booking) {
    return (
      <div className="p-8 text-center">
        <div className="text-accent text-4xl mb-4" aria-hidden="true">&#10003;</div>
        <h2 className="text-xl text-text mb-2">Booking confirmed</h2>
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
        <div
          role="alert"
          className="mb-4 p-3 rounded bg-red-900/30 border border-red-800 text-red-300 text-sm flex items-start justify-between gap-3"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
            className="text-red-400 hover:text-red-200 shrink-0"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      )}

      {step === 'date' && (() => {
        const { cells, label } = buildCalendar()
        return (
          <div>
            <h2 className="text-xl text-text mb-1">Select a date</h2>
            <p className="text-sm text-text-muted mb-4">{label}</p>
            {loading && <p className="text-text-muted">Loading availability&hellip;</p>}
            {!loading && availableDays.length === 0 && (
              <p className="text-text-muted">No availability this month.</p>
            )}
            {!loading && availableDays.length > 0 && (
              <div>
                <div className="grid grid-cols-7 gap-1 mb-1" aria-hidden="true">
                  {WEEKDAY_LABELS.map(({ short }) => (
                    <div key={short} className="text-center text-xs text-text-muted py-1">{short}</div>
                  ))}
                </div>
                <div
                  className="grid grid-cols-7 gap-1"
                  role="group"
                  aria-label={`Available dates in ${label}`}
                >
                  {cells.map((cell, i) =>
                    cell.day === null ? (
                      <div key={`empty-${i}`} aria-hidden="true" />
                    ) : cell.available && !cell.past ? (
                      <button
                        type="button"
                        key={cell.dateStr}
                        onClick={() => setSelectedDate(cell.dateStr)}
                        aria-label={fullDateLabel(cell.dateStr)}
                        className="aspect-square flex items-center justify-center rounded-lg text-sm text-text hover:bg-accent hover:text-white transition-colors"
                      >
                        {cell.day}
                      </button>
                    ) : (
                      <div
                        key={cell.dateStr}
                        aria-hidden="true"
                        className="aspect-square flex items-center justify-center rounded-lg text-sm text-text-muted/40"
                      >
                        {cell.day}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })()}

      {step === 'time' && (
        <div>
          <button
            type="button"
            onClick={() => { setStep('date'); setSlots([]); setSelectedDate(null) }}
            className="text-sm text-text-muted hover:text-text transition-colors mb-4 inline-block"
            aria-label="Back to date selection"
          >
            <span aria-hidden="true">&larr;</span> Back
          </button>
          <h2 className="text-xl text-text mb-2">Select a time</h2>
          <p className="text-sm text-text-muted mb-6">{formatDateLabel(selectedDate)}</p>
          {loading && <p className="text-text-muted">Loading times&hellip;</p>}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            role="group"
            aria-label={`Available times on ${formatDateLabel(selectedDate)}`}
          >
            {slots.map((slot) => (
              <button
                type="button"
                key={slot.start}
                onClick={() => handleSelectSlot(slot)}
                aria-label={`${formatTime(slot.start)} to ${formatTime(slot.end)}`}
                className="px-4 py-3 rounded-lg border border-background text-text-muted hover:border-accent hover:text-text transition-colors text-sm"
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
            aria-label="Back to time selection"
          >
            <span aria-hidden="true">&larr;</span> Back
          </button>
          <h2 className="text-xl text-text mb-2">Your details</h2>
          <p className="text-sm text-text-muted mb-6">
            {formatDateLabel(selectedDate)} at {formatTime(selectedSlot.start)}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor={nameId} className="block text-sm text-text-muted mb-1">
                Name
              </label>
              <input
                id={nameId}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
                className="w-full px-4 py-2 rounded-lg bg-background border border-background text-text placeholder-text-muted/50 focus:border-accent transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor={emailId} className="block text-sm text-text-muted mb-1">
                Email
              </label>
              <input
                id={emailId}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-2 rounded-lg bg-background border border-background text-text placeholder-text-muted/50 focus:border-accent transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor={notesId} className="block text-sm text-text-muted mb-1">
                Notes <span className="text-text-muted">(optional)</span>
              </label>
              <textarea
                id={notesId}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-background border border-background text-text placeholder-text-muted/50 focus:border-accent transition-colors resize-none"
                placeholder="Tell us about your project..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-accent text-white font-normal hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking…' : 'Confirm booking'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
