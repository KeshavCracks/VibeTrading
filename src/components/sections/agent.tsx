'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, User, Loader2, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Message {
  role: 'user' | 'assistant'
  content: string
  ts: number
}

const SUGGESTED_PROMPTS = [
  'Analyze NVDA — should I trim my position?',
  'Design a momentum strategy for large-cap tech',
  'Explain the disposition effect and how to fix it',
  'What alpha factors work best in high-vol regimes?',
  'Stress-test my portfolio for a 2008-style scenario',
]

export function Agent() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm **VibeAgent**, your AI trading research assistant. Ask me about market analysis, strategy design, alpha factors, or portfolio risk. Try one of the prompts below to get started.",
      ts: Date.now(),
    },
  ])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  async function send(prompt?: string) {
    const text = (prompt ?? input).trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text, ts: Date.now() }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to fetch')
      setMessages((cur) => [
        ...cur,
        { role: 'assistant', content: data.content, ts: Date.now() },
      ])
    } catch (e) {
      setMessages((cur) => [
        ...cur,
        {
          role: 'assistant',
          content: `Sorry, I hit an error: ${e instanceof Error ? e.message : 'unknown'}. Please retry.`,
          ts: Date.now(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setMessages([
      {
        role: 'assistant',
        content: 'Conversation cleared. What would you like to explore next?',
        ts: Date.now(),
      },
    ])
  }

  return (
    <section id="agent" className="py-16 md:py-24 scroll-mt-16 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
        >
          <div>
            <Badge variant="outline" className="mb-2 gap-1">
              <Bot className="w-3 h-3" /> AI Agent
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Chat with VibeAgent
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              An autonomous ReAct-style agent with 68 tools — market data,
              factor research, backtesting, and portfolio analytics.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={reset}
            className="gap-1.5 self-start md:self-end"
          >
            <Trash2 className="w-4 h-4" /> Clear
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
          {/* Chat panel */}
          <Card className="lg:col-span-3 flex flex-col overflow-hidden">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="flex items-center gap-2 text-base">
                <div className="relative shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
                </div>
                <div className="min-w-0">
                  <div>VibeAgent</div>
                  <div className="text-xs font-normal text-muted-foreground flex items-center gap-1 truncate">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span className="truncate">Online · 68 tools · 456 alphas</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 p-4 pt-0">
              {/* Message list — plain div + overflow for reliable scrolling */}
              <div
                ref={scrollRef}
                className="h-[440px] overflow-y-auto scrollbar-thin pr-1 pl-1 -ml-1 -mr-1"
              >
                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {messages.map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          'flex gap-2.5',
                          m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        )}
                      >
                        <div
                          className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                            m.role === 'user'
                              ? 'bg-foreground text-background'
                              : 'bg-primary/10'
                          )}
                        >
                          {m.role === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div
                          className={cn(
                            'px-3.5 py-2.5 text-sm leading-relaxed min-w-0',
                            'rounded-2xl max-w-[calc(100%-2.75rem)]',
                            'break-words [overflow-wrap:anywhere]',
                            m.role === 'user'
                              ? 'bg-foreground text-background rounded-tr-sm'
                              : 'bg-muted rounded-tl-sm'
                          )}
                        >
                          <MarkdownLite content={m.content} userSide={m.role === 'user'} />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {loading && (
                    <div className="flex gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Agent is reasoning…
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input row — wraps cleanly on small screens */}
              <div className="flex gap-2 shrink-0">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      send()
                    }
                  }}
                  placeholder="Ask about a stock, strategy, risk, or alpha factor…"
                  className="min-h-[44px] max-h-32 resize-none flex-1"
                  rows={1}
                />
                <Button
                  onClick={() => send()}
                  disabled={loading || !input.trim()}
                  size="icon"
                  className="h-11 w-11 shrink-0 self-end"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Suggested prompts */}
          <Card className="lg:sticky lg:top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Try asking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  disabled={loading}
                  className="w-full text-left text-sm p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/40 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3 inline-block mr-1.5 text-primary align-text-bottom" />
                  {p}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

// Tiny markdown renderer for **bold** and `code` and bullet lists
function MarkdownLite({
  content,
  userSide = false,
}: {
  content: string
  userSide?: boolean
}) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (line.trim() === '') return <div key={i} className="h-1" />
        const isBullet = /^\s*[-*]\s+/.test(line)
        const text = line.replace(/^\s*[-*]\s+/, '')
        const parts = parseInline(text, userSide)
        if (isBullet) {
          return (
            <div key={i} className="flex gap-2">
              <span className={userSide ? 'opacity-70' : 'text-primary'}>•</span>
              <span className="min-w-0">{parts}</span>
            </div>
          )
        }
        return <div key={i}>{parts}</div>
      })}
    </div>
  )
}

function parseInline(text: string, userSide = false): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g
  let last = 0
  let m: RegExpExecArray | null
  let key = 0
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) {
      parts.push(<strong key={key++}>{tok.slice(2, -2)}</strong>)
    } else if (tok.startsWith('`')) {
      parts.push(
        <code
          key={key++}
          className={cn(
            'px-1 py-0.5 rounded text-xs font-mono break-all',
            userSide ? 'bg-background/20' : 'bg-background/80 text-foreground'
          )}
        >
          {tok.slice(1, -1)}
        </code>
      )
    } else {
      parts.push(<em key={key++}>{tok.slice(1, -1)}</em>)
    }
    last = m.index + tok.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}
