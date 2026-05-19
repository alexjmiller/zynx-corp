import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const chatHandlerUrl = new URL('./netlify/functions/chat-handler.mjs', import.meta.url)
const bookingHandlerUrl = new URL('./netlify/functions/booking-handler.mjs', import.meta.url)

// Server-only env vars that must be exposed to the dev middleware (which
// runs in Node). Anything in this list is loaded from .env / .env.local and
// pushed onto process.env so the handler can read it just like in production.
const SERVER_ENV_VARS = [
  'CLAUDE_API_KEY',
  'ANTHROPIC_API_KEY',
  'BOOQ_API_KEY',
  'SLACK_WEBHOOK',
  'RESEND_API_KEY',
  'EMAIL_FROM',
]

// Import a handler module fresh so edits are picked up without restart.
async function loadHandler(handlerUrl) {
  await readFile(fileURLToPath(handlerUrl))
  return import(`${handlerUrl.href}?t=${Date.now()}`)
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function chatApiDevMiddleware() {
  return {
    name: 'chat-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        try {
          const raw = await readBody(req)
          const body = JSON.parse(raw || '{}')
          const mod = await loadHandler(chatHandlerUrl)
          const result = await mod.handleChat(body)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err?.message || err) }))
        }
      })
    },
  }
}

function bookingApiDevMiddleware() {
  return {
    name: 'booking-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/booking', async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }
        try {
          const mod = await loadHandler(bookingHandlerUrl)
          let result
          if (req.method === 'GET') {
            const url = new URL(req.url, 'http://localhost')
            result = await mod.getAvailability({
              month: url.searchParams.get('month') || undefined,
              date: url.searchParams.get('date') || undefined,
              timezone: url.searchParams.get('timezone') || undefined,
            })
          } else {
            const raw = await readBody(req)
            const body = JSON.parse(raw || '{}')
            result = await mod.createBooking(body)
          }
          res.statusCode = result.status || 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result.data || {}))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err?.message || err) }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const name of SERVER_ENV_VARS) {
    if (env[name] && !process.env[name]) {
      process.env[name] = env[name]
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      chatApiDevMiddleware(),
      bookingApiDevMiddleware(),
    ],
    server: {
      port: 3006,
    },
  }
})
