import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Markdown from 'markdown-to-jsx'

const STORAGE_KEY = 'zynx-chat-v1'

function MarkdownLink({ href, children, ...rest }) {
  if (!href) return <span>{children}</span>
  const isExternal =
    /^https?:\/\//.test(href) ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:')
  const className = 'underline text-text hover:text-accent-light transition-colors'
  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className} {...rest}>
      {children}
    </Link>
  )
}

function MarkdownParagraph({ children }) {
  return <p className="m-0 mt-2 first:mt-0">{children}</p>
}

const MARKDOWN_OPTIONS = {
  forceBlock: true,
  overrides: {
    a: { component: MarkdownLink },
    p: { component: MarkdownParagraph },
    h1: { component: MarkdownParagraph },
    h2: { component: MarkdownParagraph },
    h3: { component: MarkdownParagraph },
    h4: { component: MarkdownParagraph },
    h5: { component: MarkdownParagraph },
    h6: { component: MarkdownParagraph },
    img: { component: () => null },
    iframe: { component: () => null },
    script: { component: () => null },
    ul: { props: { className: 'list-disc pl-5 my-2 space-y-1' } },
    ol: { props: { className: 'list-decimal pl-5 my-2 space-y-1' } },
    code: { props: { className: 'px-1 py-0.5 rounded bg-background-light text-text text-xs' } },
  },
}

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

// Only auto-focus the textarea on devices that won't pop a software keyboard
// when we do — i.e. devices with a real pointer / hover, not touch-only.
function shouldAutoFocusOnOpen() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export default function ChatWidget() {
  const initial = loadState()
  const [open, setOpen] = useState(initial.open)
  const [messages, setMessages] = useState(initial.messages)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const bubbleRef = useRef(null)
  const prevOpen = useRef(initial.open)

  useEffect(() => {
    saveState({ messages, open })
  }, [messages, open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  // Auto-focus the input on open, but only on devices where a soft keyboard
  // won't immediately cover the welcome message.
  useEffect(() => {
    if (open && inputRef.current && shouldAutoFocusOnOpen()) {
      inputRef.current.focus()
    }
  }, [open])

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // When transitioning from open → closed, return focus to the bubble so
  // keyboard users don't lose their place.
  useEffect(() => {
    if (prevOpen.current && !open && bubbleRef.current) {
      bubbleRef.current.focus()
    }
    prevOpen.current = open
  }, [open])

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)
    try {
      const tz =
        typeof Intl !== 'undefined' &&
        Intl.DateTimeFormat().resolvedOptions().timeZone
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
          timezone: tz || 'Europe/London',
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
      {/* Floating toggle bubble. Hidden when the panel is open on mobile
          (the panel goes fullscreen and covers it); replaced by the in-panel
          close button. On desktop the bubble stays visible alongside the
          floating panel as a secondary close target. */}
      <button
        ref={bubbleRef}
        type="button"
        aria-label={open ? 'Close chat' : 'Open chat'}
        aria-expanded={open}
        aria-controls="chat-panel"
        onClick={() => setOpen((v) => !v)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-accent hover:bg-accent-hover text-text shadow-lg flex items-center justify-center transition-colors ${open ? 'hidden sm:flex' : ''}`}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel — fullscreen on mobile, floating on sm+. Using `dvh`
          (dynamic viewport height) helps the panel respect the visible
          viewport rather than the layout viewport (still imperfect on iOS
          when the soft keyboard is open, but better than `vh`). */}
      {open && (
        <div
          id="chat-panel"
          role="dialog"
          aria-labelledby="chat-heading"
          className="fixed z-50 inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] h-[100dvh] sm:h-[min(560px,calc(100dvh-8rem))] bg-background-light sm:border sm:border-background sm:rounded-lg sm:shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-background flex items-center justify-between gap-3">
            <div>
              <h2 id="chat-heading" className="text-sm font-normal text-text">
                Zynx assistant
              </h2>
              <p className="text-xs text-text-muted m-0">Usually replies instantly</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={reset}
                className="text-xs text-text-muted hover:text-text transition-colors px-2 py-1"
                aria-label="Start a new conversation"
              >
                New chat
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="h-9 w-9 -mr-1 rounded-md flex items-center justify-center text-text-muted hover:text-text hover:bg-background transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages — aria-live announces new assistant replies to screen
              readers. aria-atomic=false so only the new bubble is announced,
              not the entire transcript. */}
          <div
            ref={scrollRef}
            aria-live="polite"
            aria-atomic="false"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-accent text-text whitespace-pre-wrap'
                      : 'bg-background text-text-muted'
                  }`}
                >
                  {m.role === 'user' ? (
                    m.content
                  ) : (
                    <Markdown options={MARKDOWN_OPTIONS}>{m.content}</Markdown>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex justify-start" aria-label="Zynx assistant is typing">
                <div className="bg-background text-text-muted px-3 py-2 rounded-lg text-sm">
                  <span className="inline-flex gap-1" aria-hidden="true">
                    <span className="h-1.5 w-1.5 rounded-full bg-text-muted animate-pulse motion-reduce:animate-none" />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-text-muted animate-pulse motion-reduce:animate-none"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="h-1.5 w-1.5 rounded-full bg-text-muted animate-pulse motion-reduce:animate-none"
                      style={{ animationDelay: '0.4s' }}
                    />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input — global :focus-visible provides the focus ring, no need
              for the low-contrast ring-accent. */}
          <div className="px-3 py-3 border-t border-background flex items-end gap-2">
            <label htmlFor="chat-input" className="sr-only">
              Type your message
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type your message…"
              rows={1}
              className="flex-1 resize-none bg-background text-text placeholder:text-text-muted text-sm px-3 py-2 rounded-md outline-none max-h-32"
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
