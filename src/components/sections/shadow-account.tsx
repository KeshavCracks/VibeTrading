'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  FileUp,
  Loader2,
  Sparkles,
  Upload,
  XCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SAMPLE_TRADES, SAMPLE_BEHAVIOR_PROFILE } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

interface BiasRow {
  name: string
  severity: 'low' | 'moderate' | 'high'
  evidence: string
  fix: string
}
interface ExtractedRule {
  type: 'entry' | 'exit' | 'risk' | 'filter'
  rule: string
  frequency: string
}
interface AnalysisResult {
  summary: string
  metrics: Array<{
    metric: string
    value: string
    benchmark: string
    status: 'good' | 'warning' | 'bad'
    description: string
  }>
  biases: BiasRow[]
  extractedRules: ExtractedRule[]
  recommendation: string
}

const SAMPLE_CSV = `date,symbol,side,qty,price,pnl,holdingDays
2024-11-12,NVDA,BUY,20,145.20,0,0
2024-11-15,NVDA,SELL,20,141.80,-68.00,3
2024-11-18,TSLA,BUY,15,348.50,0,0
2024-11-22,TSLA,SELL,15,352.10,54.00,4
2024-11-25,AAPL,BUY,30,228.40,0,0
2024-11-28,AAPL,SELL,30,231.85,103.50,3
2024-12-02,META,BUY,10,588.30,0,0
2024-12-05,META,SELL,10,575.20,-131.00,3
2024-12-09,AMD,BUY,25,138.50,0,0
2024-12-12,AMD,SELL,25,144.80,157.50,3`

function parseCsv(text: string) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const vals = line.split(',').map((v) => v.trim())
    const obj: Record<string, string | number> = {}
    headers.forEach((h, i) => {
      const v = vals[i] ?? ''
      obj[h] = isNaN(Number(v)) ? v : Number(v)
    })
    return obj
  })
}

const STATUS_STYLES = {
  good: { icon: CheckCircle2, color: 'text-emerald-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-500' },
  bad: { icon: XCircle, color: 'text-rose-500' },
}

const SEVERITY_STYLES = {
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  moderate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

const TYPE_COLORS = {
  entry: 'bg-chart-1/10 text-chart-1',
  exit: 'bg-chart-4/10 text-chart-4',
  risk: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  filter: 'bg-chart-2/10 text-chart-2',
}

export function ShadowAccount() {
  const [csv, setCsv] = React.useState(SAMPLE_CSV)
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<AnalysisResult | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const fileRef = React.useRef<HTMLInputElement>(null)

  async function analyze() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const trades = parseCsv(csv)
      if (trades.length === 0) {
        setError('CSV appears empty or malformed. Use the sample format.')
        setLoading(false)
        return
      }
      const res = await fetch('/api/analyze-trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data as AnalysisResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setCsv(String(reader.result || ''))
    reader.readAsText(file)
  }

  return (
    <section id="shadow" className="py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8"
        >
          <Badge variant="outline" className="mb-2 gap-1">
            <Brain className="w-3 h-3" /> Shadow Account
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Reverse-engineer your trading behavior
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Upload your broker trade journal (CSV). The agent profiles your
            behavior, surfaces behavioral biases, and extracts a rule-based
            strategy you can backtest.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* CSV input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileUp className="w-4 h-4 text-primary" />
                Trade Journal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  className="gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload CSV
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFile}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCsv(SAMPLE_CSV)}
                  className="gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Sample
                </Button>
              </div>

              <textarea
                value={csv}
                onChange={(e) => setCsv(e.target.value)}
                spellCheck={false}
                className="w-full h-72 p-3 rounded-md border border-input bg-background font-mono text-xs resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />

              <div className="text-xs text-muted-foreground">
                Required columns: <code className="font-mono">date, symbol, side, qty, price, pnl, holdingDays</code>
              </div>

              <Button
                onClick={analyze}
                disabled={loading}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing behavior…
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4" />
                    Run Behavioral Analysis
                  </>
                )}
              </Button>

              {error && (
                <div className="p-2.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Behavior Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <p className="text-sm text-muted-foreground mb-4">{result.summary}</p>
                    <ScrollArea className="max-h-72">
                      <div className="space-y-2">
                        {result.metrics.map((m) => {
                          const s = STATUS_STYLES[m.status]
                          const Icon = s.icon
                          return (
                            <div key={m.metric} className="flex items-start gap-2 p-2.5 rounded-md bg-muted/30">
                              <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', s.color)} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-medium">{m.metric}</span>
                                  <span className="text-sm font-mono">{m.value}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">{m.description}</div>
                                <div className="text-[10px] text-muted-foreground mt-0.5">Benchmark: {m.benchmark}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground mb-3">Preview using sample data:</div>
                    {SAMPLE_BEHAVIOR_PROFILE.slice(0, 4).map((m) => {
                      const s = STATUS_STYLES[m.status]
                      const Icon = s.icon
                      return (
                        <div key={m.metric} className="flex items-start gap-2 p-2.5 rounded-md bg-muted/30">
                          <Icon className={cn('w-4 h-4 mt-0.5 shrink-0', s.color)} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{m.metric}</span>
                              <span className="text-sm font-mono">{m.value}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">{m.description}</div>
                          </div>
                        </div>
                      )
                    })}
                    <div className="text-xs text-muted-foreground text-center pt-2">
                      Click <strong>Run Behavioral Analysis</strong> for the full report.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Biases + Rules (full width) */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4"
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Detected Biases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-80">
                  <div className="space-y-3">
                    {result.biases.map((b) => (
                      <div key={b.name} className="p-3 rounded-md border border-border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{b.name}</span>
                          <Badge variant="secondary" className={cn('text-[10px] capitalize', SEVERITY_STYLES[b.severity])}>
                            {b.severity}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">{b.evidence}</div>
                        <div className="text-xs p-2 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                          <strong>Fix:</strong> {b.fix}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Extracted Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-80">
                  <div className="space-y-2">
                    {result.extractedRules.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 p-2.5 rounded-md bg-muted/30">
                        <Badge variant="secondary" className={cn('text-[10px] capitalize shrink-0', TYPE_COLORS[r.type])}>
                          {r.type}
                        </Badge>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm">{r.rule}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{r.frequency}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/20">
                  <div className="text-xs font-semibold text-primary mb-1">Coach Recommendation</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{result.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Sample trades table */}
        {!result && (
          <Card className="mt-4">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Sample Trade History</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-64">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr>
                      <th className="text-left font-medium pb-2">Date</th>
                      <th className="text-left font-medium pb-2">Symbol</th>
                      <th className="text-left font-medium pb-2">Side</th>
                      <th className="text-right font-medium pb-2">Qty</th>
                      <th className="text-right font-medium pb-2">Price</th>
                      <th className="text-right font-medium pb-2">P&L</th>
                      <th className="text-right font-medium pb-2">Hold Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_TRADES.map((t, i) => (
                      <tr key={i} className="border-t border-border">
                        <td className="py-2 text-xs tabular-nums">{t.date}</td>
                        <td className="py-2 font-semibold">{t.symbol}</td>
                        <td className="py-2">
                          <span className={cn('text-xs font-medium', t.side === 'BUY' ? 'text-emerald-500' : 'text-rose-500')}>
                            {t.side}
                          </span>
                        </td>
                        <td className="py-2 text-right tabular-nums">{t.qty}</td>
                        <td className="py-2 text-right tabular-nums">${t.price.toFixed(2)}</td>
                        <td className={cn('py-2 text-right tabular-nums', t.pnl > 0 ? 'text-emerald-500' : t.pnl < 0 ? 'text-rose-500' : 'text-muted-foreground')}>
                          {t.pnl === 0 ? '—' : `${t.pnl >= 0 ? '+' : ''}$${t.pnl.toFixed(2)}`}
                        </td>
                        <td className="py-2 text-right tabular-nums text-muted-foreground">{t.holdingDays || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
