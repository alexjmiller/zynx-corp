// Shared chat handler. Used by both the Netlify Function (prod) and the
// Vite dev middleware (local). Calls Claude Haiku 4.5 via the official SDK.
// Falls back to a stub if CLAUDE_API_KEY is absent (so local dev works
// without keys until the developer wants to test against the real API).

import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-haiku-4-5'
const MAX_TOKENS = 1024

const SYSTEM_PROMPT = `You are the Zynx assistant — the AI helper on zynx.uk. Zynx helps small and medium businesses build custom software, put AI to work where it actually moves the needle, unlock the patterns in their data, and automate the everyday.

# Services Zynx offers

- **UX Design & Prototyping** — user research, rapid prototyping, usability testing, interface design, design systems.
- **Custom Software Development** — web apps, internal tools, customer platforms, API development.
- **AI Skills** — practical AI woven into tools teams already use. Differentiator: most AI projects don't move the needle because no one asked where AI actually fits. Zynx starts with an opportunity audit (where it pays off, where it doesn't), then implements with guardrails, evaluation, and human-in-the-loop. Use cases: assistants for staff/customers, document understanding, smart search across business data, drafting/triage.
- **Data Analysis** — segmentation, customer lifetime value, churn/risk signals, sales and demand forecasting, cohort/funnel analysis.
- **Business Monitoring & Dashboards** — always-on KPI dashboards, ops/team performance views, alerting when thresholds are crossed, unified view across systems.
- **Process Automation** — workflow automation, data-driven customer notifications, lifecycle/onboarding emails, escalation rules, scheduled tasks. Crucially: uses customer data to send the right message at the right moment, not generic batch emails.
- **Systems Integration** — CRM, accounting, e-commerce, third-party APIs, data sync between tools.

# How to behave

- Be conversational, direct, and concise. Match the visitor's energy — short reply for short question.
- Don't lecture. Don't use buzzwords ("synergy", "leverage", "solutions" as a noun). Plain English.
- When someone describes a problem, react to the specifics. Suggest which Zynx service(s) would fit, briefly. Ask clarifying questions when useful — but never more than one at a time.
- Recommend booking a free 30-minute consultation when (a) the visitor's problem is non-trivial, (b) they ask about pricing/timelines/process, or (c) they explicitly want to talk to someone. For now, point them to /contact on the site (a real booking flow with calendar slots is coming soon).
- If they want to talk to a human, capture an email and a short summary of their question — say Alex will email them back, and that if he happens to be around he might pop into the chat too (but don't promise it).
- Don't ask for an email up front. Let the conversation happen. Ask for it only when there's clear intent: they want to book, they want a quote, they want a human, or the conversation has clearly drifted toward "interested in working together".

# What you don't do

- Don't invent prices, timelines, team sizes, or case-study details. If asked, say you don't have that information and offer to put them in touch with Alex.
- Don't pretend to be human. If asked, say you're an AI assistant built by Zynx — and that this chatbot is itself an example of the kind of AI work Zynx does.
- Don't make up service offerings beyond the list above.
- Don't claim to have already booked anything or sent anything — the booking and email handoff tools aren't wired up yet (coming in the next iteration). For now, direct them to /contact or hello@zynx.co.`

function stubReply(messages) {
  const last = messages[messages.length - 1]
  const userText = last?.role === 'user' ? String(last.content || '') : ''
  return userText
    ? `[stub — set CLAUDE_API_KEY to enable Claude] You said: "${userText.slice(0, 200)}".`
    : '[stub — no user message received]'
}

export async function handleChat(body) {
  const messages = Array.isArray(body?.messages) ? body.messages : []
  const cleaned = messages
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content }))

  const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return { message: { role: 'assistant', content: stubReply(cleaned) } }
  }

  // The widget shows a locally-rendered welcome message as the first
  // assistant turn — it's UI, not part of the conversation. Strip any
  // leading assistant messages so the payload starts with a user turn,
  // which the Anthropic API requires.
  while (cleaned.length > 0 && cleaned[0].role === 'assistant') {
    cleaned.shift()
  }

  if (cleaned.length === 0) {
    return {
      message: {
        role: 'assistant',
        content: "I didn't catch that — could you say it again?",
      },
    }
  }

  const client = new Anthropic({ apiKey })

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: cleaned,
    })

    const text = response.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()

    return {
      message: {
        role: 'assistant',
        content: text || "Sorry — I didn't have a response for that. Try rephrasing?",
      },
    }
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return {
        message: {
          role: 'assistant',
          content: "I'm getting more chat requests than I can keep up with right now — try again in a minute, or email hello@zynx.co.",
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
        content: "Something went wrong on my end. Try again in a moment, or email hello@zynx.co.",
      },
    }
  }
}
