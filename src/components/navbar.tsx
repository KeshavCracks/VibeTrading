'use client'

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Activity, Github, Moon, Sun, TrendingUp } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { TICKER_ITEMS } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function TickerTape() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="border-y border-border bg-muted/30 overflow-hidden">
      <div className="flex items-center">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold shrink-0">
          <Activity className="w-3 h-3" />
          LIVE
        </div>
        <div className="overflow-hidden flex-1">
          <div className="flex ticker-track whitespace-nowrap">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-1.5 text-xs">
                <span className="font-semibold">{it.sym}</span>
                <span className="tabular-nums text-muted-foreground">
                  {it.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span
                  className={cn(
                    'tabular-nums font-medium',
                    it.chg >= 0 ? 'text-emerald-500' : 'text-rose-500'
                  )}
                >
                  {it.chg >= 0 ? '+' : ''}{it.chg.toFixed(2)}%
                </span>
                <span className="text-muted-foreground/40">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const links = [
    { href: '#dashboard', label: 'Dashboard' },
    { href: '#agent', label: 'AI Agent' },
    { href: '#alphas', label: 'Alpha Zoo' },
    { href: '#paper-trading', label: 'Paper Trade' },
    { href: '#shadow', label: 'Shadow Account' },
    { href: '#swarm', label: 'Swarm' },
    { href: '#builder', label: 'Strategy Builder' },
  ]

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md"
    >
      <div className="flex h-14 items-center px-4 gap-4">
        <Link href="#" className="flex items-center gap-2 font-bold">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-base tracking-tight">
            Vibe<span className="text-primary">Trading</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 text-sm">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          )}
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <a
              href="https://github.com/KeshavCracks/VibeTrading"
              target="_blank"
              rel="noreferrer"
            >
              <Github className="w-4 h-4" />
              <span className="hidden sm:inline">Star</span>
            </a>
          </Button>
          <Button asChild size="sm" className="gap-1.5">
            <a href="#agent">
              <Activity className="w-3.5 h-3.5" />
              Launch Agent
            </a>
          </Button>
        </div>
      </div>
    </motion.header>
  )
}
