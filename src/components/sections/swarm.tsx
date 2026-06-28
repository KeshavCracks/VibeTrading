'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Clock,
  Loader2,
  Network,
  Play,
  RotateCcw,
  Users,
  XCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { SWARM_PRESETS, type SwarmPreset, type SwarmWorker } from '@/lib/mock-data'

const STATUS_META = {
  waiting: { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Waiting' },
  running: { icon: Loader2, color: 'text-chart-2', bg: 'bg-chart-2/10', label: 'Running', spin: true },
  done: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Done' },
  failed: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-500/10', label: 'Failed' },
  blocked: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', label: 'Blocked' },
  retrying: { icon: RefreshCw, color: 'text-chart-5', bg: 'bg-chart-5/10', label: 'Retrying', spin: true },
} as const

export function Swarm() {
  const [activePreset, setActivePreset] = React.useState<SwarmPreset>(SWARM_PRESETS[0])
  const [workers, setWorkers] = React.useState<SwarmPreset['workers']>(SWARM_PRESETS[0].workers)
  const [running, setRunning] = React.useState(false)
  const [selectedWorker, setSelectedWorker] = React.useState<SwarmWorker | null>(null)

  React.useEffect(() => {
    setWorkers(activePreset.workers)
    setSelectedWorker(null)
  }, [activePreset])

  // Simulate swarm execution
  async function runSwarm() {
    setRunning(true)
    const fresh = activePreset.workers.map((w) => ({ ...w, status: 'waiting' as const, output: undefined }))
    setWorkers(fresh)

    for (let i = 0; i < fresh.length; i++) {
      const w = fresh[i]
      // Check deps done
      const depsDone = w.dependencies.every((d) =>
        fresh.find((x) => x.id === d)?.status === 'done'
      )
      if (!depsDone) {
        // mark blocked then continue (shouldn't happen in our DAG)
        fresh[i] = { ...w, status: 'blocked' }
        setWorkers([...fresh])
        continue
      }
      fresh[i] = { ...w, status: 'running' }
      setWorkers([...fresh])
      await sleep(900 + Math.random() * 800)
      fresh[i] = { ...w, status: 'done', output: w.output ?? '(no output captured)' }
      setWorkers([...fresh])
      await sleep(200)
    }
    setRunning(false)
  }

  function reset() {
    setWorkers(activePreset.workers.map((w) => ({ ...w, status: 'waiting' as const, output: undefined })))
    setSelectedWorker(null)
  }

  return (
    <section id="swarm" className="py-16 md:py-24 scroll-mt-16 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8"
        >
          <Badge variant="outline" className="mb-2 gap-1">
            <Network className="w-3 h-3" /> Multi-Agent Swarm
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Watch a trading team debate in real time
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Each swarm is a directed acyclic graph of specialized agents — bull
            analyst, bear analyst, risk reviewer, PM — that reason over grounded
            market data and produce a final decision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {SWARM_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePreset(p)}
              className={cn(
                'text-left p-4 rounded-lg border transition-all',
                activePreset.id === p.id
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/40 hover:bg-muted/30'
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <Users className="w-4 h-4 text-primary" />
                <Badge variant="outline" className="text-[10px]">{p.category}</Badge>
              </div>
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {p.description}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {p.workers.length} agents
              </div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* DAG visualizer */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-base">
                {activePreset.name} · DAG
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={reset}
                  disabled={running}
                  className="gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </Button>
                <Button
                  size="sm"
                  onClick={runSwarm}
                  disabled={running}
                  className="gap-1.5"
                >
                  {running ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                  {running ? 'Running…' : 'Run Swarm'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* SVG layer for edges */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                  <defs>
                    <marker id="arrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                      <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity="0.5" />
                    </marker>
                  </defs>
                  {workers.map((w, i) => {
                    const deps = w.dependencies
                    return deps.map((depId) => {
                      const depIdx = workers.findIndex((x) => x.id === depId)
                      if (depIdx < 0) return null
                      const from = nodePos(depIdx, workers.length)
                      const to = nodePos(i, workers.length)
                      return (
                        <line
                          key={`${depId}-${w.id}`}
                          x1={from.x}
                          y1={from.y}
                          x2={to.x}
                          y2={to.y}
                          stroke="var(--muted-foreground)"
                          strokeOpacity="0.35"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                          markerEnd="url(#arrow)"
                        />
                      )
                    })
                  })}
                </svg>

                {/* Nodes */}
                <div
                  className="relative grid gap-3 py-2"
                  style={{
                    gridTemplateColumns: `repeat(${Math.min(workers.length, 4)}, minmax(0, 1fr))`,
                    zIndex: 1,
                  }}
                >
                  {workers.map((w, i) => {
                    const meta = STATUS_META[w.status]
                    const Icon = meta.icon
                    const pos = nodePos(i, workers.length)
                    return (
                      <motion.button
                        key={w.id}
                        onClick={() => setSelectedWorker(w)}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.03 }}
                        className={cn(
                          'relative p-3 rounded-lg border-2 text-left transition-colors bg-card',
                          selectedWorker?.id === w.id
                            ? 'border-primary'
                            : 'border-border hover:border-primary/40',
                          w.status === 'running' && 'border-chart-2/50 shadow-lg shadow-chart-2/20',
                          w.status === 'done' && 'border-emerald-500/30'
                        )}
                        style={{ minHeight: 88 }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className={cn('w-7 h-7 rounded-full flex items-center justify-center', meta.bg)}>
                            <Icon className={cn('w-3.5 h-3.5', meta.color, meta.spin && 'animate-spin')} />
                          </div>
                          <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
                        </div>
                        <div className="text-xs font-semibold leading-tight mb-1">{w.name}</div>
                        <div className="text-[10px] text-muted-foreground leading-tight">{w.role}</div>
                        <div className={cn('text-[10px] mt-1.5 font-medium', meta.color)}>
                          {meta.label}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                {Object.entries(STATUS_META).map(([k, v]) => {
                  const Icon = v.icon
                  return (
                    <div key={k} className="flex items-center gap-1.5 text-muted-foreground">
                      <Icon className={cn('w-3 h-3', v.color, v.spin && 'animate-spin')} />
                      {v.label}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Worker detail */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Worker Output</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {selectedWorker ? (
                  <motion.div
                    key={selectedWorker.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-3"
                  >
                    <div>
                      <div className="text-lg font-bold">{selectedWorker.name}</div>
                      <div className="text-xs text-muted-foreground">{selectedWorker.role}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className={cn('text-[10px]', STATUS_META[selectedWorker.status].bg, STATUS_META[selectedWorker.status].color)}>
                        {STATUS_META[selectedWorker.status].label}
                      </Badge>
                      {selectedWorker.dependencies.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          depends on: {selectedWorker.dependencies.map((d) => `#${workers.findIndex((w) => w.id === d) + 1}`).join(', ')}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Output</div>
                      <div className="p-3 rounded-md bg-muted/40 text-sm leading-relaxed">
                        {selectedWorker.output || 'Worker has not produced output yet.'}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    <Network className="w-8 h-8 mx-auto mb-3 opacity-40" />
                    Click a worker node to inspect its role and output.
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function nodePos(idx: number, total: number) {
  // Approximate center of each grid cell — used for SVG edges
  const cols = Math.min(total, 4)
  const rows = Math.ceil(total / cols)
  const col = idx % cols
  const row = Math.floor(idx / cols)
  const cellW = 100 / cols
  const cellH = 100 / Math.max(rows, 1)
  return {
    x: col * cellW + cellW / 2,
    y: row * cellH + cellH / 2,
  }
}

// Convert percentage coords → we use viewBox via SVG width 100%. Simpler: use absolute pixel-free approach.
// To keep it simple, edges use percentage coordinates scaled by SVG viewBox 0..100 x 0..100
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
