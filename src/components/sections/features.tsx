'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Bot,
  Brain,
  CandlestickChart,
  Database,
  GitBranch,
  Globe,
  Layers,
  LineChart,
  Network,
  Shield,
  Zap,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FEATURES = [
  {
    icon: Bot,
    title: 'Autonomous ReAct Agent',
    desc: 'A tool-heavy reasoning loop that plans, fetches market data, drafts strategy code, and validates results — with persistent cross-session memory.',
    color: 'oklch(0.96 0.002 240)',
  },
  {
    icon: Network,
    title: 'Multi-Agent Swarms',
    desc: '29 preset trading teams — investment committee, quant desk, crypto desk, macro desk, risk committee — that run as parallel DAGs.',
    color: 'oklch(0.70 0.005 240)',
  },
  {
    icon: Layers,
    title: '456-Factor Alpha Zoo',
    desc: 'Qlib158, WorldQuant alpha101, GTJA191, and academic factors — all AST-validated, lookahead-banned, and IC/IR-benchmarked.',
    color: 'oklch(0.55 0.005 240)',
  },
  {
    icon: Database,
    title: '18-Source Data Layer',
    desc: 'US, HK, CN equities, crypto, futures, and forex — with automatic IP-ban-aware fallback chains. No mandatory API keys.',
    color: 'oklch(0.65 0.22 16)',
  },
  {
    icon: Brain,
    title: 'Shadow Account',
    desc: 'Upload your broker journal. The agent profiles your behavior, surfaces biases (disposition, overtrading, anchoring), and extracts a rule-based strategy.',
    color: 'oklch(0.40 0.005 240)',
  },
  {
    icon: LineChart,
    title: 'Backtesting Engine',
    desc: '7 engines with Monte Carlo, Bootstrap, and Walk-Forward validation. Reproducible run cards. Portfolio optimizers included.',
    color: 'oklch(0.85 0.002 240)',
  },
  {
    icon: GitBranch,
    title: 'MCP-Native',
    desc: 'Plug VibeTrading into Claude Desktop, Cursor, or any MCP-compatible client. Or consume external MCP servers from inside the agent.',
    color: 'oklch(0.50 0.005 240)',
  },
  {
    icon: Shield,
    title: 'Fail-Closed Risk Gates',
    desc: 'Autonomous trading is opt-in and mandate-gated. Filesystem kill-switch, pre-trade gates, and full audit ledger.',
    color: 'oklch(0.78 0.002 240)',
  },
  {
    icon: Globe,
    title: 'Vercel-Ready',
    desc: 'Deploys as a serverless Next.js app. No Docker, no persistent backend required. Free-tier friendly.',
    color: 'oklch(0.30 0.005 240)',
  },
]

const TECH = ['Next.js 16', 'TypeScript 5', 'Tailwind CSS 4', 'shadcn/ui', 'Recharts', 'Framer Motion', 'z-ai-web-dev-sdk', 'Vercel Edge']

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-2 gap-1">
            <Zap className="w-3 h-3" /> Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Built for serious trading research
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Everything you need to go from a vague thesis to a backtested,
            risk-checked, multi-asset strategy — without leaving the browser.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="p-5 h-full hover:border-primary/40 transition-colors group">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                    style={{ background: `color-mix(in srgb, ${f.color} 15%, transparent)` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-semibold mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Built with</div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TECH.map((t) => (
              <Badge key={t} variant="secondary" className="py-1.5 px-3 text-xs">
                {t}
              </Badge>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
