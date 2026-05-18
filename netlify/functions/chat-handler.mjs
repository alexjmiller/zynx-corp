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

# Booking tools

You have three tools for handling consultation bookings. The consultation is 30 minutes, free of charge.

- **list_available_days(month)** — returns the days in a YYYY-MM month that have at least one free slot. Use this FIRST when a visitor wants to book.
- **list_slots(date)** — returns the specific time slots on a YYYY-MM-DD date. Use this AFTER the visitor has picked a day.
- **create_booking(startTime, visitorName, visitorEmail, notes)** — creates the booking. Only call this after explicit confirmation.

# Booking rules — these are strict

- **NEVER state a time you have not received from list_slots.** Do not invent times, guess times, or quote times from memory. If you have not just called list_slots in this conversation, do not give specific times.
- Always follow the two-step flow: list_available_days → list_slots. Don't skip to slots without first checking days.
- Render slot times in the visitor's local timezone (see RUNTIME CONTEXT below). Pass the raw UTC start string verbatim to create_booking — do NOT modify it.
- Before calling create_booking, confirm one last time: name, email, and the specific slot. Wait for explicit "yes" / "book it" / "confirm" from the visitor. Don't book on ambiguity.
- If create_booking returns \`slot_unavailable\` (409), tell the visitor the slot was just taken and re-fetch list_slots for the same date. Never retry with a different time you invented.
- If the visitor wants to book outside available days, suggest the closest alternatives. Don't promise anything you can't book.
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

function dynamicContext({ timezone, currentDate }) {
  return `RUNTIME CONTEXT
- Today's date: ${currentDate} (use this when the visitor says "this week", "next month", etc.)
- Visitor's local timezone: ${timezone}
- Availability and booking calls automatically use this timezone — slot times come back in UTC, but render them to the visitor in their local time.`
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
      return { days: r.data?.days ?? [], month: input.month, timezone }
    }
    if (name === 'list_slots') {
      const params = new URLSearchParams({
        slug: BOOQ_SLUG,
        date: String(input?.date || ''),
        timezone,
      })
      const r = await callBooq(`/api/v1/availability?${params}`, { method: 'GET' }, booqKey)
      if (!r.ok) return { error: 'unavailable', status: r.status, message: r.data?.error || 'Could not fetch slots.' }
      return { slots: r.data?.slots ?? [], date: input.date, timezone }
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
        bookingId: r.data?.id,
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
