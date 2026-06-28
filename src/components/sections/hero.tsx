'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Bot, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedNumber, Sparkline } from '@/components/sparkline'

const HERO_STATS = [
  { label: 'Alpha Factors', value: 456, suffix: '+', icon: Zap },
  { label: 'AI Tools', value: 68, suffix: '', icon: Bot },
  { label: 'Swarm Presets', value: 29, suffix: '', icon: Sparkles },
  { label: 'Data Sources', value: 18, suffix: '', icon: TrendingUp },
]

const SPARKS = [
  { name: 'NVDA', data: [120, 124, 122, 128, 135, 132, 138, 142, 138], change: 15.0 },
  { name: 'BTC', data: [60, 62, 58, 64, 67, 65, 68, 67, 67], change: 11.7 },
  { name: 'AAPL', data: [220, 222, 218, 224, 228, 230, 232, 234, 234], change: 6.4 },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-chart-2/10 blur-3xl" />

      <div className="relative container mx-auto px-4 pt-20 pb-16 md:pt-28 md:pb-24 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <Badge variant="secondary" className="mb-6 gap-1.5 py-1.5 px-3">
            <span className="w-1.5 h-1.5 rounded-full bg-foreground animate-pulse" />
            Open-source · MIT Licensed · Vercel-ready
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance max-w-4xl mb-6">
            Your personal{' '}
            <span className="bg-gradient-to-r from-foreground via-foreground/70 to-foreground/40 bg-clip-text text-transparent animate-gradient">
              AI trading agent
            </span>{' '}
            in the browser
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 text-balance">
            Chat with an autonomous agent, explore 456+ alpha factors, run paper
            trades, dissect your broker journal, and orchestrate multi-agent
            swarms — all from one fast, interactive workspace.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-12">
            <Button asChild size="lg" className="gap-2 text-base h-12 px-6">
              <a href="#agent">
                <Bot className="w-5 h-5" />
                Try the Agent
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 text-base h-12 px-6"
            >
              <a href="#dashboard">View Dashboard</a>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-4xl">
            {HERO_STATS.map((s, i) => {
              const Icon = s.icon
              return (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                >
                  <Card className="p-4 hover:border-primary/40 transition-colors group">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <TrendingUp className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-2xl font-bold tabular-nums">
                      <AnimatedNumber value={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {s.label}
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto"
        >
          {SPARKS.map((s, i) => (
            <motion.div
              key={s.name}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            >
              <Card className="p-4 backdrop-blur-sm bg-card/80">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm">{s.name}</span>
                  <span
                    className={`text-xs font-medium ${
                      s.change >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {s.change >= 0 ? '+' : ''}
                    {s.change.toFixed(2)}%
                  </span>
                </div>
                <Sparkline data={s.data} width={260} height={48} strokeWidth={2} />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
