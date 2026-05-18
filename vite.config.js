import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const handlerUrl = new URL('./netlify/functions/chat-handler.mjs', import.meta.url)

// Server-only env vars that must be exposed to the dev middleware (which
// runs in Node). Anything in this list is loaded from .env / .env.local and
// pushed onto process.env so the handler can read it just like in production.
const SERVER_ENV_VARS = [
  'CLAUDE_API_KEY',
  'ANTHROPIC_API_KEY',
  'BOOQ_API_KEY',
  'SLACK_WEBHOOK_URL',
  'RESEND_API_KEY',
]

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
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
          await readFile(fileURLToPath(handlerUrl))
          const mod = await import(`${handlerUrl.href}?t=${Date.now()}`)
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

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const name of SERVER_ENV_VARS) {
    if (env[name] && !process.env[name]) {
      process.env[name] = env[name]
    }
  }

  return {
    plugins: [react(), tailwindcss(), chatApiDevMiddleware()],
    server: {
      port: 3006,
    },
  }
})
