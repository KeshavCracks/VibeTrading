'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ArrowRight,
  Boxes,
  Braces,
  Calculator,
  CheckCircle2,
  Loader2,
  Play,
  Plus,
  Settings2,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

type BlockType = 'entry' | 'exit' | 'risk' | 'filter' | 'position'

interface Block {
  id: string
  type: BlockType
  name: string
  param: string
  value: string
}

const BLOCK_LIBRARY: Array<{ type: BlockType; name: string; param: string; default: string; description: string }> = [
  { type: 'entry', name: 'SMA Crossover', param: 'fast / slow', default: '5 / 20', description: 'Buy when fast SMA crosses above slow SMA' },
  { type: 'entry', name: 'RSI Overshoot', param: 'threshold', default: '30', description: 'Buy when RSI crosses below threshold' },
  { type: 'entry', name: 'Breakout', param: 'lookback', default: '20', description: 'Buy on N-day high breakout' },
  { type: 'exit', name: 'SMA Crossunder', param: 'fast / slow', default: '5 / 20', description: 'Sell when fast SMA crosses below slow SMA' },
  { type: 'exit', name: 'RSI Overbought', param: 'threshold', default: '70', description: 'Sell when RSI crosses above threshold' },
  { type: 'exit', name: 'Trailing Stop', param: '% trail', default: '8', description: 'Sell when price falls X% from peak' },
  { type: 'risk', name: 'Stop Loss', param: '% loss', default: '5', description: 'Hard stop at -X% from entry' },
  { type: 'risk', name: 'Take Profit', param: '% gain', default: '15', description: 'Exit at +X% from entry' },
  { type: 'risk', name: 'Max Position', param: '% NAV', default: '10', description: 'Cap any single position to X% of NAV' },
  { type: 'filter', name: 'Volume Filter', param: 'min ratio', default: '1.5', description: 'Only enter when volume > X × 20-day avg' },
  { type: 'filter', name: 'Volatility Filter', param: 'max ATR%', default: '4', description: 'Skip trades when ATR% > X' },
  { type: 'filter', name: 'Market Regime', param: 'SMA period', default: '200', description: 'Only long when price > N-day SMA' },
  { type: 'position', name: 'Equal Weight', param: '—', default: '—', description: 'Allocate equally across signals' },
  { type: 'position', name: 'Volatility Target', param: 'target vol', default: '15', description: 'Size positions to hit X% annualized vol' },
  { type: 'position', name: 'Kelly Fraction', param: 'fraction', default: '0.5', description: 'Half-Kelly position sizing' },
]

const TYPE_META: Record<BlockType, { color: string; icon: typeof Boxes; label: string }> = {
  entry: { color: 'oklch(0.96 0.002 240)', icon: ArrowRight, label: 'Entry' },
  exit: { color: 'oklch(0.70 0.005 240)', icon: ArrowRight, label: 'Exit' },
  risk: { color: 'oklch(0.55 0.005 240)', icon: Settings2, label: 'Risk' },
  filter: { color: 'oklch(0.85 0.002 240)', icon: Braces, label: 'Filter' },
  position: { color: 'oklch(0.40 0.005 240)', icon: Boxes, label: 'Position' },
}

interface BacktestResult {
  summary: string
  metrics: {
    totalReturn: number
    annualReturn: number
    sharpe: number
    sortino: number
    maxDrawdown: number
    winRate: number
    profitFactor: number
    beta: number
    alpha: number
    volatility: number
    turnover: number
  }
  monthlyReturns: Array<{ month: string; return: number }>
  equityCurve: Array<{ month: string; value: number }>
  trades: Array<{ date: string; symbol: string; side: string; qty: number; price: number; pnl: number; holdingDays: number }>
  observations: string[]
  recommendation: string
}

export function StrategyBuilder() {
  const [blocks, setBlocks] = React.useState<Block[]>([
    { id: 'b1', type: 'filter', name: 'Market Regime', param: 'SMA period', value: '200' },
    { id: 'b2', type: 'entry', name: 'SMA Crossover', param: 'fast / slow', value: '5 / 20' },
    { id: 'b3', type: 'risk', name: 'Stop Loss', param: '% loss', value: '5' },
    { id: 'b4', type: 'risk', name: 'Take Profit', param: '% gain', value: '15' },
    { id: 'b5', type: 'position', name: 'Volatility Target', param: 'target vol', value: '15' },
  ])
  const [universe, setUniverse] = React.useState('AAPL, NVDA, MSFT, GOOGL, AMZN, META, TSLA')
  const [capital, setCapital] = React.useState('100000')
  const [result, setResult] = React.useState<BacktestResult | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  function addBlock(lib: typeof BLOCK_LIBRARY[number]) {
    setBlocks((cur) => [
      ...cur,
      { id: `b${Date.now()}`, type: lib.type, name: lib.name, param: lib.param, value: lib.default },
    ])
  }

  function removeBlock(id: string) {
    setBlocks((cur) => cur.filter((b) => b.id !== id))
  }

  function updateBlock(id: string, value: string) {
    setBlocks((cur) => cur.map((b) => (b.id === id ? { ...b, value } : b)))
  }

  async function runBacktest() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const strategy = `
Strategy specification:
- Universe: ${universe}
- Initial capital: $${capital}
- Blocks:
${blocks.map((b) => `  • [${b.type.toUpperCase()}] ${b.name} (${b.param} = ${b.value})`).join('\n')}
`.trim()

      const res = await fetch('/api/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ strategy }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Backtest failed')
      setResult(data as BacktestResult)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="builder" className="py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8"
        >
          <Badge variant="outline" className="mb-2 gap-1">
            <Calculator className="w-3 h-3" /> Strategy Builder
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Compose a strategy, then backtest instantly
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Drag-and-drop building blocks — entries, exits, risk rules,
            position sizing — and the agent runs a 12-month backtest with
            realistic metrics.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Block library */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Block Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
                {(Object.keys(TYPE_META) as BlockType[]).map((type) => {
                  const meta = TYPE_META[type]
                  const Icon = meta.icon
                  const items = BLOCK_LIBRARY.filter((b) => b.type === type)
                  if (items.length === 0) return null
                  return (
                    <div key={type}>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1.5">
                        <Icon className="w-3 h-3" style={{ color: meta.color }} />
                        {meta.label}
                      </div>
                      <div className="space-y-1">
                        {items.map((b) => (
                          <button
                            key={b.name}
                            onClick={() => addBlock(b)}
                            className="w-full text-left p-2 rounded-md border border-border hover:border-primary/40 hover:bg-muted/30 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{b.name}</span>
                              <Plus className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                            </div>
                            <div className="text-xs text-muted-foreground">{b.description}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Canvas */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-base">
                <span>Strategy Canvas</span>
                <span className="text-xs font-normal text-muted-foreground">{blocks.length} blocks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Universe (comma-separated tickers)</Label>
                  <Input
                    value={universe}
                    onChange={(e) => setUniverse(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Initial Capital ($)</Label>
                  <Input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {blocks.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
                    Add blocks from the library to start composing.
                  </div>
                ) : (
                  blocks.map((b, i) => {
                    const meta = TYPE_META[b.type]
                    const Icon = meta.icon
                    return (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-2 p-3 rounded-lg border-2 border-border bg-card hover:border-primary/30 transition-colors"
                        style={{ borderLeftColor: meta.color, borderLeftWidth: 4 }}
                      >
                        <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: `color-mix(in srgb, ${meta.color} 15%, transparent)` }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{b.name}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">{b.type}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">{b.param}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Input
                            value={b.value}
                            onChange={(e) => updateBlock(b.id, e.target.value)}
                            className="h-8 w-24 text-xs font-mono"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-rose-500"
                            onClick={() => removeBlock(b.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>

              <Button
                onClick={runBacktest}
                disabled={loading || blocks.length === 0}
                className="w-full gap-2"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running 12-month backtest…
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Backtest
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
        </div>

        {/* Backtest results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Equity Curve (12 months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={result.equityCurve} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad-bt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
                    />
                    <Area type="monotone" dataKey="value" stroke="var(--foreground)" strokeWidth={2} fill="url(#grad-bt)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Metrics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <MetricBox label="Total Return" value={`${result.metrics.totalReturn.toFixed(1)}%`} positive={result.metrics.totalReturn >= 0} />
                <MetricBox label="Annual Return" value={`${result.metrics.annualReturn.toFixed(1)}%`} positive={result.metrics.annualReturn >= 0} />
                <MetricBox label="Sharpe" value={result.metrics.sharpe.toFixed(2)} positive={result.metrics.sharpe >= 1} />
                <MetricBox label="Sortino" value={result.metrics.sortino.toFixed(2)} positive={result.metrics.sortino >= 1} />
                <MetricBox label="Max DD" value={`${result.metrics.maxDrawdown.toFixed(1)}%`} positive={result.metrics.maxDrawdown >= -15} />
                <MetricBox label="Volatility" value={`${result.metrics.volatility.toFixed(1)}%`} positive={result.metrics.volatility <= 20} />
                <MetricBox label="Win Rate" value={`${result.metrics.winRate.toFixed(1)}%`} positive={result.metrics.winRate >= 50} />
                <MetricBox label="Profit Factor" value={result.metrics.profitFactor.toFixed(2)} positive={result.metrics.profitFactor >= 1.5} />
                <MetricBox label="Beta" value={result.metrics.beta.toFixed(2)} positive />
                <MetricBox label="Alpha" value={`${result.metrics.alpha.toFixed(1)}%`} positive={result.metrics.alpha >= 0} />
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Summary &amp; Observations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed mb-4">{result.summary}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground mb-2">Observations</div>
                    <ul className="space-y-1.5">
                      {result.observations.map((o, i) => (
                        <li key={i} className="text-xs flex items-start gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                    <div className="text-xs font-semibold text-primary mb-1">Recommendation</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{result.recommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Sample Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
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
                      {result.trades.map((t, i) => (
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
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function MetricBox({ label, value, positive }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className={cn('p-2 rounded-md border', positive ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-border bg-muted/30')}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn('text-sm font-mono font-semibold tabular-nums', positive ? 'text-emerald-600 dark:text-emerald-400' : '')}>
        {value}
      </div>
    </div>
  )
}
