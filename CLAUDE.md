# Zynx.uk Website

Marketing site for Zynx targeting SMB clients. Sells UX design, software development, AI, data analysis, dashboards, automation and systems integration. The differentiator on the AI offer is "where AI actually moves the needle" — Zynx leads with an opportunity audit rather than selling AI-for-AI's-sake.

Primary domain: **zynx.uk** (canonical). `zynx.co` still resolves but isn't the marketing URL. Email is `hello@zynx.co` — that's intentional, kept on the `.co` domain even though the website is on `.uk`. Do not change the email address to `@zynx.uk` without explicit confirmation.

## Tech stack

- **Framework**: Vite 7 + React 19
- **Styling**: Tailwind CSS v4 (CSS-first config via `@theme` in `src/index.css`)
- **Routing**: React Router v7
- **AI**: Anthropic Claude Haiku 4.5 via the official SDK, called from Netlify Functions
- **Markdown rendering (chat replies)**: `markdown-to-jsx` (link-aware, swaps internal paths to react-router `Link`)
- **Booking**: booq.now API, slug `consultation`. Both the on-page widget (`src/components/sections/BookingWidget.jsx`) and the chatbot's booking tools talk to it.
- **Lead handoff**: Slack incoming webhook (auto-confirmation email via Resend is wired up but disabled — `EMAIL_FROM` env unset)
- **Deployment**: Netlify (auto-deploys from `main`)

## Development commands

```bash
npm run dev      # Vite dev server on port 3006
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

The dev server includes a small Vite middleware (`vite.config.js`) that handles `POST /api/chat` locally using the same handler as the Netlify Function — so `npm run dev` exercises the real chatbot code path. If `CLAUDE_API_KEY` isn't in `.env`, the handler falls back to a stub echo so the UI still works without API credits.

## Port Authority

- **Port**: 3006
- **Host**: Mac.lan
- **Project**: zynx-corp
- **Description**: Zynx.uk marketing site — Vite dev server

## Environment variables

Set in Netlify (production) and optionally in `.env` (local — gitignored). `.env.example` documents the full set. Server-side only; never expose to client.

| Var | Purpose | Required |
|---|---|---|
| `CLAUDE_API_KEY` | Anthropic API key for the chatbot (Haiku 4.5). Note: the SDK defaults to `ANTHROPIC_API_KEY`; handler passes it explicitly. | Required for the bot |
| `BOOQ_API_KEY` | booq.now bearer token (`bkr_...`). Used by the chatbot booking tools AND the on-page BookingWidget — both go through Netlify Functions (`/api/chat` and `/api/booking`). Key never reaches the client. | Required for any booking |
| `SLACK_WEBHOOK` | Slack incoming webhook URL for lead-handoff notifications. | Required for the human-handoff flow |
| `RESEND_API_KEY` | Resend API key for visitor auto-confirmation emails on lead capture. | Optional |
| `EMAIL_FROM` | Sender address for Resend auto-confirmation (e.g. `noreply@send.zynx.uk`). If unset, the chatbot still captures leads to Slack but skips the visitor email. | Optional |

Secrets locally live in `*-chat.txt` files in the repo root — these are gitignored. **Never commit anything matching `*-chat.txt`, `.env`, `*-secrets.txt`, or `*.secret`.**

## Project structure

```
src/
├── components/
│   ├── layout/        # Header, Footer, Layout, ScrollToHash
│   ├── ui/            # Button, Card, Container
│   └── sections/      # Hero, HeroBackground, ServiceCards,
│                      # BookingWidget, ChatWidget
├── pages/             # Home, Services, About, Contact,
│                      # Privacy, Terms
├── App.jsx            # Router setup
├── main.jsx           # Entry point
└── index.css          # Tailwind @theme + base layer + skip link

netlify/
└── functions/
    ├── chat.mjs            # Netlify Function entry (POST /api/chat)
    └── chat-handler.mjs    # Shared handler — system prompt, tool
                            # definitions, agentic loop. Imported by
                            # both chat.mjs and the Vite dev
                            # middleware.

public/
├── favicon.svg
├── og-image.svg       # 1200x630 social card
├── robots.txt
└── sitemap.xml
```

## Design system

Defined in `src/index.css` under `@theme`.

- **Background**: `#282828` (`--color-background`)
- **Background-light** (cards / panels): `#333333`
- **Text**: `#d5d5d5` (`--color-text`) — passes WCAG AA on bg (~10:1)
- **Text muted**: `#a5a5a5` (`--color-text-muted`) — bumped from `#838383` to pass AA (~6:1)
- **Accent**: `#6417a3` (Zynx purple). Use as a background colour (with white text) only — purple-on-dark as text colour fails contrast.
- **Accent hover** (button backgrounds): `#7a1fc4`
- **Accent light** (for use as link/text on dark): `#b986e5` — passes AA (~4.8:1)
- **Font**: Montserrat (300, 400, 700 weights)

**Font size scale tier-shifted for readability** — minimum body size is 16px:
- `--text-xs`: 14px (was 12px)
- `--text-sm`: 16px (was 14px)
- `--text-base`: 18px (was 16px)
- `text-lg` and above unchanged

## Accessibility patterns to maintain

- **Global `<a>` styling** lives inside `@layer base` so Tailwind utilities like `no-underline` win the cascade. **Don't move it out of the layer** — that bug bit us hard once.
- Bare `<a>` tags inherit body text colour + underline. Buttons, header/footer nav, and Card-wrapping links opt out with `no-underline`.
- All animation/transition is wrapped in a global `prefers-reduced-motion: reduce` override in `index.css`; component-level micro-interactions also use `motion-reduce:` utilities.
- `Layout` includes a skip link (`.skip-link` in CSS) and the `<main>` element has `id="main-content"` + `tabIndex={-1}`.
- `ScrollToHash` handles both hash anchors (with retries to survive layout shifts on mobile) and scroll-to-top on plain page changes.
- ChatWidget on mobile uses `window.visualViewport` to fit above the soft keyboard — important; iOS Safari doesn't shrink position-fixed bounds when the keyboard opens.
- Chat panel has `role="dialog"`, `aria-labelledby`, `aria-live` on messages, Escape-to-close + focus return.

## Chatbot

Floating widget bottom-right on every page (`src/components/sections/ChatWidget.jsx`). Talks to `/api/chat` which is `netlify/functions/chat.mjs` in production and a Vite middleware in dev.

The handler (`netlify/functions/chat-handler.mjs`) runs an agentic loop:
1. Sends conversation + system prompt to Claude Haiku 4.5.
2. If Claude returns tool_use blocks, executes them server-side, feeds results back, repeats. Cap of 6 iterations.
3. Returns the final assistant text to the widget.

Tools:
- `list_available_days(month)` — booq.now availability for a calendar month. Returns pre-formatted day labels.
- `list_slots(date)` — booq.now slots for a specific date. Returns `localTime` labels in the visitor's timezone.
- `create_booking(startTime, visitorName, visitorEmail, notes)` — creates the booking. booq.now handles the confirmation email.
- `capture_lead(name, email, summary)` — POSTs to Slack with a transcript excerpt. Optionally fires a Resend auto-confirmation if `EMAIL_FROM` is set.

System prompt is split into a cacheable static block (services info, behaviour rules, formatting rules, booking rules) and a small dynamic block (today's date + weekday, visitor timezone, conversation length hint). The Haiku 4.5 cache minimum is 4096 tokens — the static block currently sits just under that, so caching kicks in once the prefix grows further.

Hard cap of 30 user turns per chat (server-side check). From turn 25 the bot is told to wind down. Hitting the cap returns a canned wrap-up that points to /contact and hello@zynx.co.

Chat persists across page nav via localStorage (`zynx-chat-v1`). "New chat" button in the panel header resets it.

## Deployment

Configured for Netlify via `netlify.toml`. The Functions live under `netlify/functions/`. Pushes to `main` auto-deploy.

The chat widget calls `/api/chat`. Netlify routes it to `chat.mjs` via `export const config = { path: '/api/chat' }`. The catch-all SPA redirect (`/*` → `/index.html`) still works because function routes take precedence.

## Domains

- `zynx.uk` — canonical site (Cloudflare DNS, Netlify hosting)
- `zynx.co` — also resolves but treat zynx.uk as primary
- Email on `@zynx.co` — leave alone

## What's deferred / important context

- **Booq.now calls all go through Netlify Functions** (chatbot via `/api/chat`, on-page widget via `/api/booking`). The key only lives in Netlify env vars — never shipped to the browser.
- **Privacy + Terms pages drafted but not legally reviewed.** UK GDPR-aware defaults; should be eyeballed by a solicitor before being treated as final.
- **No rate limiting** on `/api/chat` beyond the 30-turn cap. Per-IP throttle is a planned backlog item.
- **No durable lead store** — chatbot leads only land in Slack right now. A CRM project is in the backlog.
