'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import {
  ArrowDownRight,
  ArrowUpRight,
  CandlestickChart,
  CircleDollarSign,
  History,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { INITIAL_ORDERS, PORTFOLIO_HISTORY, WATCHLIST, type Order } from '@/lib/mock-data'

interface TradeMessage {
  type: 'success' | 'error' | 'info'
  text: string
}

export function PaperTrading() {
  const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS)
  const [cash, setCash] = React.useState(48_520.34)
  const [symbol, setSymbol] = React.useState('AAPL')
  const [side, setSide] = React.useState<'buy' | 'sell'>('buy')
  const [qty, setQty] = React.useState('10')
  const [orderType, setOrderType] = React.useState<'market' | 'limit'>('market')
  const [limitPrice, setLimitPrice] = React.useState('')
  const [msg, setMsg] = React.useState<TradeMessage | null>(null)
  const [history, setHistory] = React.useState(PORTFOLIO_HISTORY)

  const asset = WATCHLIST.find((w) => w.symbol === symbol) ?? WATCHLIST[0]
  const portfolioValue = cash + 103_826.86 // mock held positions value
  const totalValue = portfolioValue

  function submitOrder() {
    const q = parseInt(qty, 10)
    if (!q || q <= 0) {
      setMsg({ type: 'error', text: 'Enter a valid quantity.' })
      return
    }
    const price = orderType === 'limit' ? parseFloat(limitPrice) : asset.price
    if (!price || price <= 0) {
      setMsg({ type: 'error', text: 'Enter a valid limit price.' })
      return
    }
    const cost = q * price
    if (side === 'buy' && cost > cash) {
      setMsg({ type: 'error', text: `Insufficient buying power. Need $${cost.toFixed(2)}, have $${cash.toFixed(2)}.` })
      return
    }

    const order: Order = {
      id: `ord-${String(orders.length + 1).padStart(3, '0')}`,
      symbol,
      side,
      qty: q,
      price,
      type: orderType,
      status: 'filled',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
    }
    setOrders((cur) => [order, ...cur])
    setCash((c) => (side === 'buy' ? c - cost : c + cost))
    setHistory((cur) => [
      ...cur,
      { date: '2025-01', value: side === 'buy' ? totalValue : totalValue + cost * 0.001 },
    ])
    setMsg({
      type: 'success',
      text: `${side.toUpperCase()} ${q} ${symbol} @ $${price.toFixed(2)} filled. ${side === 'buy' ? '-' : '+'}$${cost.toFixed(2)} cash.`,
    })
    setTimeout(() => setMsg(null), 4000)
  }

  return (
    <section id="paper-trading" className="py-16 md:py-24 scroll-mt-16 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="mb-8"
        >
          <Badge variant="outline" className="mb-2 gap-1">
            <CandlestickChart className="w-3 h-3" /> Paper Trading
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Practice with $100K of virtual capital
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Place market and limit orders against live prices. No real money at
            risk — perfect for testing strategies before going live.
          </p>
        </motion.div>

        {/* Account summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-1">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">Total Value</span>
            </div>
            <div className="text-xl font-bold tabular-nums">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-1">
              <CircleDollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Cash</span>
            </div>
            <div className="text-xl font-bold tabular-nums">
              ${cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-1">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Day P&L</span>
            </div>
            <div className="text-xl font-bold tabular-nums text-emerald-500">
              +$2,847.55
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-1">
              <ArrowUpRight className="w-4 h-4 text-emerald-500" />
              <span className="text-xs text-muted-foreground">Total Return</span>
            </div>
            <div className="text-xl font-bold tabular-nums text-emerald-500">
              +52.35%
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Order ticket */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Order Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs">Symbol</Label>
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="mt-1 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                >
                  {WATCHLIST.map((w) => (
                    <option key={w.symbol} value={w.symbol}>
                      {w.symbol} — {w.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={side === 'buy' ? 'default' : 'outline'}
                  className={cn(side === 'buy' && 'bg-emerald-600 hover:bg-emerald-700 text-white')}
                  onClick={() => setSide('buy')}
                >
                  BUY
                </Button>
                <Button
                  variant={side === 'sell' ? 'default' : 'outline'}
                  className={cn(side === 'sell' && 'bg-rose-600 hover:bg-rose-700 text-white')}
                  onClick={() => setSide('sell')}
                >
                  SELL
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={orderType === 'market' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setOrderType('market')}
                >
                  Market
                </Button>
                <Button
                  variant={orderType === 'limit' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setOrderType('limit')}
                >
                  Limit
                </Button>
              </div>

              <div>
                <Label className="text-xs">Quantity (shares)</Label>
                <Input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  className="mt-1"
                  min="1"
                />
              </div>

              {orderType === 'limit' && (
                <div>
                  <Label className="text-xs">Limit Price ($)</Label>
                  <Input
                    type="number"
                    value={limitPrice}
                    onChange={(e) => setLimitPrice(e.target.value)}
                    placeholder={asset.price.toFixed(2)}
                    className="mt-1"
                  />
                </div>
              )}

              <div className="p-3 rounded-md bg-muted/40 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current Price</span>
                  <span className="font-mono">${asset.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Cost</span>
                  <span className="font-mono">
                    ${(parseInt(qty || '0') * (orderType === 'limit' ? parseFloat(limitPrice || '0') || asset.price : asset.price)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buying Power</span>
                  <span className="font-mono">${cash.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={submitOrder} className="w-full">
                Submit {side.toUpperCase()} Order
              </Button>

              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'p-2.5 rounded-md text-xs',
                    msg.type === 'success' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                    msg.type === 'error' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                    msg.type === 'info' && 'bg-muted text-muted-foreground'
                  )}
                >
                  {msg.text}
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Order history + equity curve */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="w-4 h-4 text-primary" />
                  Order History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-72">
                  <table className="w-full text-sm">
                    <thead className="text-xs text-muted-foreground sticky top-0 bg-card">
                      <tr>
                        <th className="text-left font-medium pb-2">Time</th>
                        <th className="text-left font-medium pb-2">Symbol</th>
                        <th className="text-left font-medium pb-2">Side</th>
                        <th className="text-right font-medium pb-2">Qty</th>
                        <th className="text-right font-medium pb-2">Price</th>
                        <th className="text-left font-medium pb-2 pl-3">Type</th>
                        <th className="text-left font-medium pb-2 pl-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-t border-border">
                          <td className="py-2 text-xs text-muted-foreground tabular-nums">{o.time}</td>
                          <td className="py-2 font-semibold">{o.symbol}</td>
                          <td className="py-2">
                            <span className={cn('text-xs font-medium', o.side === 'buy' ? 'text-emerald-500' : 'text-rose-500')}>
                              {o.side.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 text-right tabular-nums">{o.qty}</td>
                          <td className="py-2 text-right tabular-nums">${o.price.toFixed(2)}</td>
                          <td className="py-2 pl-3 text-xs capitalize text-muted-foreground">{o.type}</td>
                          <td className="py-2 pl-3">
                            <Badge
                              variant="secondary"
                              className={cn(
                                'text-[10px] capitalize',
                                o.status === 'filled' && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                                o.status === 'pending' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                                o.status === 'cancelled' && 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              )}
                            >
                              {o.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Account Equity Curve</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={history} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="grad-equity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.7 0.18 158)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="oklch(0.7 0.18 158)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 0 })}`}
                    />
                    <Area type="monotone" dataKey="value" stroke="oklch(0.7 0.18 158)" strokeWidth={2} fill="url(#grad-equity)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
