'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Atom, FlaskConical, GraduationCap, Layers, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ALPHAS, type Alpha, familyStats, categoryStats } from '@/lib/alphas'

const FAMILY_META = {
  Qlib158: { icon: Atom, color: 'oklch(0.7 0.18 158)', label: 'Qlib158' },
  alpha101: { icon: Layers, color: 'oklch(0.7 0.18 200)', label: 'alpha101' },
  GTJA191: { icon: FlaskConical, color: 'oklch(0.75 0.18 80)', label: 'GTJA191' },
  Academic: { icon: GraduationCap, color: 'oklch(0.7 0.22 300)', label: 'Academic' },
}

const STATUS_COLORS = {
  live: 'text-emerald-500 bg-emerald-500/10',
  'alive-reversed': 'text-amber-500 bg-amber-500/10',
  dead: 'text-rose-500 bg-rose-500/10',
  experimental: 'text-chart-2 bg-chart-2/10',
}

export function AlphaZoo() {
  const [search, setSearch] = React.useState('')
  const [family, setFamily] = React.useState<string>('all')
  const [category, setCategory] = React.useState<string>('all')
  const [selected, setSelected] = React.useState<Alpha | null>(null)

  const filtered = ALPHAS.filter((a) => {
    const matchSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchFamily = family === 'all' || a.family === family
    const matchCategory = category === 'all' || a.category === category
    return matchSearch && matchFamily && matchCategory
  })

  const famStats = familyStats()
  const catStats = categoryStats()

  return (
    <section id="alphas" className="py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8"
        >
          <Badge variant="outline" className="mb-2 gap-1">
            <Atom className="w-3 h-3" /> Alpha Zoo
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            456 alpha factors, ready to backtest
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            A curated library of cross-sectional alphas from Qlib158,
            WorldQuant alpha101, GTJA191, and academic literature. All
            lookahead-banned and AST-validated.
          </p>
        </motion.div>

        {/* Family stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {famStats.map((f) => {
            const meta = FAMILY_META[f.family as keyof typeof FAMILY_META]
            const Icon = meta.icon
            return (
              <Card
                key={f.family}
                className="p-4 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => setFamily(family === f.family ? 'all' : f.family)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-4 h-4" style={{ color: meta.color }} />
                  <span className="text-xs text-muted-foreground">{f.live}/{f.count} live</span>
                </div>
                <div className="text-xl font-bold tabular-nums">{f.count}</div>
                <div className="text-xs text-muted-foreground">{meta.label}</div>
                <div className="mt-2 text-xs">
                  <span className="text-muted-foreground">avg IC </span>
                  <span className="font-mono">{f.avgIC.toFixed(3)}</span>
                  <span className="text-muted-foreground"> · IR </span>
                  <span className="font-mono">{f.avgIR.toFixed(2)}</span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Category bar chart */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Distribution by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={catStats} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="category" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={50} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: 'var(--muted)', opacity: 0.4 }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {catStats.map((c, i) => (
                    <Cell key={i} fill={`oklch(0.7 0.18 ${(i * 36) % 360})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, formula, or tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <Button
              size="sm"
              variant={family === 'all' ? 'default' : 'outline'}
              onClick={() => setFamily('all')}
            >
              All Families
            </Button>
            {Object.keys(FAMILY_META).map((f) => (
              <Button
                key={f}
                size="sm"
                variant={family === f ? 'default' : 'outline'}
                onClick={() => setFamily(family === f ? 'all' : f)}
              >
                {f}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Alpha list */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Alphas</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {filtered.length} of {ALPHAS.length} shown
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[520px]">
                <div className="space-y-2 pr-2">
                  {filtered.map((a) => {
                    const meta = FAMILY_META[a.family]
                    const Icon = meta.icon
                    const isSelected = selected?.id === a.id
                    return (
                      <button
                        key={a.id}
                        onClick={() => setSelected(a)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border transition-all',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/40 hover:bg-muted/30'
                        )}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                            <span className="font-semibold text-sm">{a.name}</span>
                            <Badge variant="outline" className="text-[10px] h-4 px-1">
                              {a.family}
                            </Badge>
                          </div>
                          <Badge variant="secondary" className={cn('text-[10px] capitalize', STATUS_COLORS[a.status])}>
                            {a.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">{a.description}</div>
                        <div className="flex items-center gap-3 text-xs">
                          <span>
                            <span className="text-muted-foreground">IC </span>
                            <span className="font-mono">{a.ic.toFixed(3)}</span>
                          </span>
                          <span>
                            <span className="text-muted-foreground">IR </span>
                            <span className="font-mono">{a.ir.toFixed(2)}</span>
                          </span>
                          <span>
                            <span className="text-muted-foreground">Sharpe </span>
                            <span className="font-mono">{a.sharpe.toFixed(2)}</span>
                          </span>
                          <span>
                            <span className="text-muted-foreground">MaxDD </span>
                            <span className="font-mono text-rose-500">{a.maxDrawdown.toFixed(1)}%</span>
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Detail panel */}
          <Card className="lg:sticky lg:top-20 h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Factor Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selected ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3"
                >
                  <div>
                    <div className="text-lg font-bold">{selected.name}</div>
                    <Badge variant="outline" className="mt-1">{selected.family}</Badge>
                    <Badge variant="outline" className="mt-1 ml-1">{selected.category}</Badge>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Formula</div>
                    <pre className="text-xs font-mono bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap break-all">
                      {selected.formula}
                    </pre>
                  </div>
                  <p className="text-sm text-muted-foreground">{selected.description}</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <Metric label="IC" value={selected.ic.toFixed(3)} />
                    <Metric label="IR" value={selected.ir.toFixed(2)} />
                    <Metric label="Sharpe" value={selected.sharpe.toFixed(2)} />
                    <Metric label="Turnover" value={`${(selected.turnover * 100).toFixed(0)}%`} />
                    <Metric label="Max DD" value={`${selected.maxDrawdown.toFixed(1)}%`} />
                    <Metric label="Status" value={selected.status} />
                  </div>
                  <div className="flex flex-wrap gap-1 pt-2">
                    {selected.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-[10px]">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  <Atom className="w-8 h-8 mx-auto mb-3 opacity-40" />
                  Select an alpha to see its formula and metrics.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 rounded-md bg-muted/40">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-mono font-medium tabular-nums">{value}</div>
    </div>
  )
}
