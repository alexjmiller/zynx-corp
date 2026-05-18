// Shared chat handler. Used by both the Netlify Function (prod) and the
// Vite dev middleware (local). Calls Claude Haiku 4.5 via the official SDK
// and exposes three tools backed by the booq.now API for live booking.
//
// Falls back to a stub if CLAUDE_API_KEY is absent so local dev still works
// without keys. If BOOQ_API_KEY is absent the bot can still chat but the
// booking tools will return an error result, which Claude handles
// gracefully (suggesting email instead).

import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-haiku-4-5'
const MAX_TOKENS = 1024
const MAX_TOOL_ITERATIONS = 6

const BOOQ_BASE = 'https://booq.now'
const BOOQ_SLUG = 'consultation'

const STATIC_SYSTEM_PROMPT = `You are the Zynx assistant — the AI helper on zynx.uk. Zynx helps small and medium businesses build custom software, put AI to work where it actually moves the needle, unlock the patterns in their data, and automate the everyday.

# Services Zynx offers

- **UX Design & Prototyping** — user research, rapid prototyping, usability testing, interface design, design systems.
- **Custom Software Development** — web apps, internal tools, customer platforms, API development.
- **AI Skills** — practical AI woven into tools teams already use. Differentiator: most AI projects don't move the needle because no one asked where AI actually fits. Zynx starts with an opportunity audit (where it pays off, where it doesn't), then implements with guardrails, evaluation, and human-in-the-loop. Use cases: assistants for staff/customers, document understanding, smart search across business data, drafting/triage.
- **Data Analysis** — segmentation, customer lifetime value, churn/risk signals, sales and demand forecasting, cohort/funnel analysis.
- **Business Monitoring & Dashboards** — always-on KPI dashboards, ops/team performance views, alerting when thresholds are crossed, unified view across systems.
- **Process Automation** — workflow automation, data-driven customer notifications, lifecycle/onboarding emails, escalation rules, scheduled tasks. Uses customer data to send the right message at the right moment, not generic batch emails.
- **Systems Integration** — CRM, accounting, e-commerce, third-party APIs, data sync between tools.

# How to behave

- Be conversational, direct, and concise. Match the visitor's energy — short reply for short question.
- Don't lecture. Don't use buzzwords ("synergy", "leverage", "solutions" as a noun). Plain English.
- When someone describes a problem, react to the specifics. Suggest which Zynx service(s) would fit. Ask clarifying questions when useful — but never more than one at a time.
- Recommend booking a free 30-minute consultation when (a) the visitor's problem is non-trivial, (b) they ask about pricing/timelines/process, or (c) they explicitly want to talk to someone.
- Don't ask for an email up front. Let the conversation happen. Ask for it only when there's clear intent: they want to book, they want a quote, or the conversation has clearly drifted toward "interested in working together".

# Formatting

- Replies are rendered as Markdown in the chat. Use proper Markdown formatting.
- When pointing to a page or section on this site, use a Markdown link. Prefer the deep-link anchors over the page-level URL — they scroll directly to the relevant section:
  - Services overview: \`[services](/services)\`
  - UX Design: \`[UX Design](/services#ux-design)\`
  - Custom Software Development: \`[Custom Software Development](/services#custom-software)\`
  - AI Skills: \`[AI Skills](/services#ai-skills)\`
  - Data Analysis: \`[Data Analysis](/services#data-analysis)\`
  - Business Monitoring & Dashboards: \`[Business Monitoring & Dashboards](/services#monitoring)\`
  - Process Automation: \`[Process Automation](/services#automation)\`
  - Systems Integration: \`[Systems Integration](/services#integration)\`
  - About Zynx: \`[about](/about)\`
  - Contact / general: \`[contact page](/contact)\`
  - Direct to the booking widget on the contact page: \`[the booking page](/contact#booking)\`
  - Email link: \`[hello@zynx.co](mailto:hello@zynx.co)\`
- Never write a path in bold or in plain text — the visitor needs a clickable link.
- **Use bold very sparingly** — at most one phrase per message, only for the single most important detail (e.g. the booked time). Never use label-style bold patterns like \`**Date:** ...\`, \`**Time:** ...\`, \`**Confirmation details:**\` — they look form-like and over-busy. Never bold URLs, paths, or every value in a list.
- Avoid headings, blockquotes, and tables — they don't render well in a narrow chat panel. Short paragraphs and small bullet lists only.

# Dates and times

- The booking tools return pre-formatted labels. Use them verbatim:
  - \`list_available_days\` → each day has a \`label\` like \`"Tuesday 19 May"\`. Quote it as-is.
  - \`list_slots\` → each slot has a \`localTime\` like \`"9:00am"\` already in the visitor's timezone.
- Never compute weekdays yourself, and never convert UTC to local time yourself. The tool already did it.
- Pass the raw UTC \`start\` from \`list_slots\` verbatim to \`create_booking\`. Never reformat it.
- For confirmations, lead with a short warm sentence containing the booked time in bold, then mention the email confirmation in plain text. Example: *"Done — you're booked for **Tuesday 19 May at 9:00am**. A calendar invite is on its way to your inbox."* Keep it under three sentences. No "Confirmation details:" header, no booking IDs, no formal labels.

# Booking tools

You have three tools for handling consultation bookings. The consultation is 30 minutes, free of charge.

- **list_available_days(month)** — returns the days in a YYYY-MM month that have at least one free slot. Use this FIRST when a visitor wants to book.
- **list_slots(date)** — returns the specific time slots on a YYYY-MM-DD date. Use this AFTER the visitor has picked a day.
- **create_booking(startTime, visitorName, visitorEmail, notes)** — creates the booking. Only call this after explicit confirmation. booq.now sends a confirmation email automatically, so you don't need to promise to email them — just confirm in-chat.

# Booking flow

- When a visitor wants to book, ask **which week works best — this one or next?**. Don't ask "what month?" — most people want something soon.
- Call list_available_days for the current month. If their preferred week spans into the next month, call list_available_days again for that month too.
- When showing days, **list the actual dates the tool returned**, in order. Pick the soonest 3–5 that match the visitor's preference. Render them human-readably (e.g. "Tuesday 20 May").
- When the visitor picks a day, call list_slots for that date and present the times the tool returned (rendered in the visitor's local timezone — see RUNTIME CONTEXT below). Show 3–5 options.
- For confirmations, render the slot as e.g. "Wednesday 21 May at 3:00pm" — never as a raw UTC string.

# Booking rules — these are strict

- **Never invent or infer dates or times.** Only quote dates and times that came back from list_available_days or list_slots in this conversation. If today's date isn't in list_available_days, today is **not** bookable — say so plainly and offer the soonest available day from the result. Same goes for "tomorrow" and any other date.
- Don't pre-emptively suggest "today or tomorrow" based on the visitor saying "soon" or "ASAP". Run the tool, read the result, quote what's in the result.
- Always follow the two-step flow: list_available_days → list_slots → create_booking.
- Pass the raw UTC startTime from list_slots verbatim to create_booking — do NOT reformat or convert it.
- Before calling create_booking, confirm one last time: name, email, and the specific slot. Wait for explicit "yes" / "book it" / "confirm". Don't book on ambiguity.
- If create_booking returns \`slot_unavailable\` (409), tell the visitor the slot was just taken and re-fetch list_slots for the same date. Never retry with a different time you invented.
- Slot duration is fixed at 30 minutes. Don't try to book partial or longer slots.

# What you don't do

- Don't invent prices, timelines, team sizes, or case-study details. If asked, say you don't have that information and offer to book a consultation.
- Don't pretend to be human. If asked, say you're an AI assistant built by Zynx — and that this chatbot is itself an example of the kind of AI work Zynx does.
- Don't make up service offerings beyond the list above.`

const TOOLS = [
  {
    name: 'list_available_days',
    description:
      'Get the days in a calendar month that have at least one bookable consultation slot. Call this first when a visitor wants to book.',
    input_schema: {
      type: 'object',
      properties: {
        month: {
          type: 'string',
          description:
            'The month to check, in YYYY-MM format (e.g. "2026-05" for May 2026).',
        },
      },
      required: ['month'],
    },
  },
  {
    name: 'list_slots',
    description:
      'Get the specific time slots available on a given date. Call this after the visitor picks a day from list_available_days. Returns slots with UTC ISO-8601 start/end times.',
    input_schema: {
      type: 'object',
      properties: {
        date: {
          type: 'string',
          description: 'The date to check, in YYYY-MM-DD format.',
        },
      },
      required: ['date'],
    },
  },
  {
    name: 'create_booking',
    description:
      "Book a consultation slot for the visitor. Only call this AFTER explicit confirmation. Pass the exact UTC startTime from list_slots verbatim — do not reformat or convert it.",
    input_schema: {
      type: 'object',
      properties: {
        startTime: {
          type: 'string',
          description:
            'The exact UTC ISO-8601 start time received from list_slots, unchanged.',
        },
        visitorName: {
          type: 'string',
          description: "The visitor's full name (1-100 characters).",
        },
        visitorEmail: {
          type: 'string',
          description: "The visitor's email address.",
        },
        notes: {
          type: 'string',
          description:
            'A short summary (1-2 sentences) of what they want to discuss.',
        },
      },
      required: ['startTime', 'visitorName', 'visitorEmail'],
    },
  },
]

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

function weekdayFor(dateStr) {
  // dateStr is "YYYY-MM-DD". new Date(dateStr) parses it as UTC midnight,
  // and getUTCDay() returns the correct weekday for that calendar date.
  return WEEKDAYS[new Date(dateStr).getUTCDay()]
}

function dayLabel(dateStr) {
  const [, m, d] = dateStr.split('-').map(Number)
  return `${weekdayFor(dateStr)} ${d} ${MONTHS[m - 1]}`
}

function localTimeLabel(utcStart, timezone) {
  try {
    const formatted = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone,
    }).format(new Date(utcStart))
    return formatted.replace(/\s+/g, '').toLowerCase()
  } catch {
    return utcStart
  }
}

function dynamicContext({ timezone, currentDate }) {
  return `RUNTIME CONTEXT
- Today is **${weekdayFor(currentDate)} ${dayLabel(currentDate).split(' ').slice(1).join(' ')} ${currentDate.slice(0, 4)}** (ISO: ${currentDate}). Use this to interpret "this week", "next week", "today", "tomorrow", etc.
- Visitor's local timezone: ${timezone}.
- The booking tools return pre-formatted human labels (\`label\` for days, \`localTime\` for slots). Use those labels verbatim — do not compute weekdays or convert times yourself.`
}

async function callBooq(path, init, booqKey) {
  if (!booqKey) {
    return { ok: false, status: 0, data: { error: 'BOOQ_API_KEY not configured' } }
  }
  let res
  try {
    res = await fetch(`${BOOQ_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${booqKey}`,
        'Content-Type': 'application/json',
        ...(init?.headers || {}),
      },
    })
  } catch (err) {
    return { ok: false, status: 0, data: { error: String(err?.message || err) } }
  }
  const data = await res.json().catch(() => null)
  return { ok: res.ok, status: res.status, data }
}

async function executeTool(name, input, ctx) {
  const { booqKey, timezone } = ctx
  try {
    if (name === 'list_available_days') {
      const params = new URLSearchParams({
        slug: BOOQ_SLUG,
        month: String(input?.month || ''),
        timezone,
      })
      const r = await callBooq(`/api/v1/availability?${params}`, { method: 'GET' }, booqKey)
      if (!r.ok) return { error: 'unavailable', status: r.status, message: r.data?.error || 'Could not fetch days.' }
      const rawDays = Array.isArray(r.data?.days) ? r.data.days : []
      const days = rawDays.map((d) => ({
        date: d,
        weekday: weekdayFor(d),
        label: dayLabel(d),
      }))
      return { days, month: input.month, timezone }
    }
    if (name === 'list_slots') {
      const params = new URLSearchParams({
        slug: BOOQ_SLUG,
        date: String(input?.date || ''),
        timezone,
      })
      const r = await callBooq(`/api/v1/availability?${params}`, { method: 'GET' }, booqKey)
      if (!r.ok) return { error: 'unavailable', status: r.status, message: r.data?.error || 'Could not fetch slots.' }
      const rawSlots = Array.isArray(r.data?.slots) ? r.data.slots : []
      const slots = rawSlots.map((s) => ({
        start: s.start,
        end: s.end,
        localTime: localTimeLabel(s.start, timezone),
      }))
      return { slots, date: input.date, dayLabel: dayLabel(input.date), timezone }
    }
    if (name === 'create_booking') {
      const body = {
        slug: BOOQ_SLUG,
        startTime: input.startTime,
        visitorName: input.visitorName,
        visitorEmail: input.visitorEmail,
        visitorTimezone: timezone,
        notes: input.notes ?? '',
      }
      const r = await callBooq('/api/v1/bookings', { method: 'POST', body: JSON.stringify(body) }, booqKey)
      if (r.status === 409) {
        return { error: 'slot_unavailable', message: 'That slot was just taken. Please pick another.' }
      }
      if (!r.ok) {
        return { error: 'booking_failed', status: r.status, message: r.data?.error || r.data?.message || 'Unknown error.' }
      }
      return {
        ok: true,
        startTime: r.data?.startTime,
        endTime: r.data?.endTime,
      }
    }
    return { error: 'unknown_tool', message: `Unknown tool: ${name}` }
  } catch (err) {
    return { error: 'tool_exception', message: String(err?.message || err) }
  }
}

function stubReply(messages) {
  const last = messages[messages.length - 1]
  const userText = last?.role === 'user' ? String(last.content || '') : ''
  return userText
    ? `[stub — set CLAUDE_API_KEY to enable Claude] You said: "${userText.slice(0, 200)}".`
    : '[stub — no user message received]'
}

function extractText(contentBlocks) {
  return contentBlocks
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim()
}

export async function handleChat(body) {
  const rawMessages = Array.isArray(body?.messages) ? body.messages : []
  const cleaned = rawMessages
    .filter(
      (m) =>
        m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string',
    )
    .map((m) => ({ role: m.role, content: m.content }))

  // Strip leading assistant turns — the widget's welcome message is UI, not
  // a real assistant turn, and the API requires the conversation to start
  // with a user message.
  while (cleaned.length > 0 && cleaned[0].role === 'assistant') {
    cleaned.shift()
  }

  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { message: { role: 'assistant', content: stubReply(cleaned) } }
  }

  if (cleaned.length === 0) {
    return {
      message: {
        role: 'assistant',
        content: "I didn't catch that — could you say it again?",
      },
    }
  }

  const timezone =
    typeof body?.timezone === 'string' && body.timezone.trim()
      ? body.timezone.trim()
      : 'Europe/London'
  const currentDate = new Date().toISOString().slice(0, 10)
  const booqKey = process.env.BOOQ_API_KEY
  const ctx = { booqKey, timezone }

  const client = new Anthropic({ apiKey })
  const conversation = [...cleaned]
  let lastResponse = null

  try {
    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: [
          {
            type: 'text',
            text: STATIC_SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
          {
            type: 'text',
            text: dynamicContext({ timezone, currentDate }),
          },
        ],
        tools: TOOLS,
        messages: conversation,
      })

      lastResponse = response

      if (response.stop_reason !== 'tool_use') break

      const toolUses = response.content.filter((b) => b.type === 'tool_use')
      conversation.push({ role: 'assistant', content: response.content })

      const toolResults = []
      for (const tu of toolUses) {
        const result = await executeTool(tu.name, tu.input, ctx)
        toolResults.push({
          type: 'tool_result',
          tool_use_id: tu.id,
          content: JSON.stringify(result),
        })
      }
      conversation.push({ role: 'user', content: toolResults })
    }

    const text = lastResponse ? extractText(lastResponse.content) : ''
    return {
      message: {
        role: 'assistant',
        content:
          text ||
          "Sorry — I didn't have a response for that. Try rephrasing, or email hello@zynx.co.",
      },
    }
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return {
        message: {
          role: 'assistant',
          content:
            "I'm getting more chat requests than I can keep up with right now — try again in a minute, or email hello@zynx.co.",
        },
      }
    }
    if (err instanceof Anthropic.APIError) {
      console.error('[chat] Anthropic API error:', err.status, err.message)
    } else {
      console.error('[chat] Unexpected error:', err)
    }
    return {
      message: {
        role: 'assistant',
        content:
          "Something went wrong on my end. Try again in a moment, or email hello@zynx.co.",
      },
    }
  }
}
