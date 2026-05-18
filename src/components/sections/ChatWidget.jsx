import { useState, useEffect, useRef, useCallback } from 'react'

const STORAGE_KEY = 'zynx-chat-v1'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content:
    "Hi — I'm the Zynx assistant. I can answer questions about our services, help you figure out where AI or automation might fit your business, and book a free consultation. What brings you here?",
}

function loadState() {
  if (typeof window === 'undefined') return { messages: [WELCOME_MESSAGE], open: false }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { messages: [WELCOME_MESSAGE], open: false }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.messages) || parsed.messages.length === 0) {
      return { messages: [WELCOME_MESSAGE], open: !!parsed.open }
    }
    return { messages: parsed.messages, open: !!parsed.open }
  } catch {
    return { messages: [WELCOME_MESSAGE], open: false }
  }
}

function saveState(state) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore quota errors
  }
}

export default function ChatWidget() {
  const initial = loadState()
  const [open, setOpen] = useState(initial.open)
  const [messages, setMessages] = useState(initial.messages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    saveState({ messages, open })
  }, [messages, open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const reply = data?.message?.content
      if (typeof reply === 'string' && reply.length > 0) {
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      } else {
        throw new Error('Empty reply')
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Sorry — I'm having trouble reaching the server. Try again in a moment, or email hello@zynx.co.",
        },
      ])
    } finally {
      setSending(false)
    }
  }, [input, messages, sending])

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const reset = () => {
    setMessages([WELCOME_MESSAGE])
    setInput('')
  }

  return (
    <>
      {/* Floating toggle bubble */}
      <button
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-accent hover:bg-accent-hover text-text shadow-lg flex items-center justify-center transition-colors"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[380px] h-[min(560px,calc(100vh-8rem))] bg-background-light border border-background rounded-lg shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-background flex items-center justify-between">
            <div>
              <div className="text-sm font-normal text-text">Zynx assistant</div>
              <div className="text-xs text-text-muted">Usually replies instantly</div>
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-xs text-text-muted hover:text-text transition-colors"
              aria-label="Start a new conversation"
            >
              New chat
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-accent text-text'
                      : 'bg-background text-text-muted'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start">
                <div className="bg-background text-text-muted px-3 py-2 rounded-lg text-sm">
                  <span className="inline-flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-pulse" />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-text-muted animate-pulse"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-text-muted animate-pulse"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-background flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message…"
              rows={1}
              className="flex-1 resize-none bg-background text-text placeholder:text-text-muted text-sm px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-accent max-h-32"
              disabled={sending}
            />
            <button
              type="button"
              onClick={send}
              disabled={sending || !input.trim()}
              className="bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed text-text text-sm px-3 py-2 rounded-md transition-colors"
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
