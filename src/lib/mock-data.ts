// ============================================================
// VibeTrading Mock Data — realistic synthetic trading data
// ============================================================

export type Trend = 'up' | 'down' | 'flat'

export interface Asset {
  symbol: string
  name: string
  market: 'US' | 'HK' | 'CN' | 'Crypto' | 'Forex'
  price: number
  change: number
  changePct: number
  volume: number
  marketCap: number
  sparkline: number[]
}

// Deterministic pseudo-random for reproducibility
function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export function genSparkline(seed: number, points = 30, drift = 0): number[] {
  const rand = seededRandom(seed)
  let v = 100
  const out: number[] = []
  for (let i = 0; i < points; i++) {
    v += (rand() - 0.5) * 4 + drift * 0.5
    out.push(Number(v.toFixed(2)))
  }
  return out
}

export const WATCHLIST: Asset[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', market: 'US', price: 234.45, change: 3.21, changePct: 1.39, volume: 48_213_000, marketCap: 3_540_000_000_000, sparkline: genSparkline(1, 30, 0.3) },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', market: 'US', price: 138.62, change: 4.12, changePct: 3.06, volume:215_400_000, marketCap: 3_410_000_000_000, sparkline: genSparkline(2, 30, 1.2) },
  { symbol: 'TSLA', name: 'Tesla Inc.', market: 'US', price: 412.88, change: -8.45, changePct: -2.01, volume: 89_120_000, marketCap: 1_310_000_000_000, sparkline: genSparkline(3, 30, -0.6) },
  { symbol: 'MSFT', name: 'Microsoft Corp.', market: 'US', price: 428.91, change: 1.85, changePct: 0.43, volume: 22_440_000, marketCap: 3_180_000_000_000, sparkline: genSparkline(4, 30, 0.2) },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'US', price: 174.55, change: 2.41, changePct: 1.40, volume: 31_200_000, marketCap: 2_150_000_000_000, sparkline: genSparkline(5, 30, 0.5) },
  { symbol: 'META', name: 'Meta Platforms', market: 'US', price: 565.34, change: 6.78, changePct: 1.21, volume: 18_330_000, marketCap: 1_430_000_000_000, sparkline: genSparkline(6, 30, 0.8) },
  { symbol: 'AMZN', name: 'Amazon.com', market: 'US', price: 186.32, change: -1.42, changePct: -0.76, volume: 41_880_000, marketCap: 1_950_000_000_000, sparkline: genSparkline(7, 30, -0.3) },
  { symbol: 'BTC-USD', name: 'Bitcoin', market: 'Crypto', price: 67_412.55, change: 1245.32, changePct: 1.88, volume: 28_400_000_000, marketCap: 1_330_000_000_000, sparkline: genSparkline(8, 30, 1.0) },
  { symbol: 'ETH-USD', name: 'Ethereum', market: 'Crypto', price: 3_284.18, change: 87.45, changePct: 2.74, volume: 14_200_000_000, marketCap: 395_000_000_000, sparkline: genSparkline(9, 30, 1.5) },
  { symbol: '0700.HK', name: 'Tencent', market: 'HK', price: 412.80, change: 5.20, changePct: 1.28, volume: 22_100_000, marketCap: 3_890_000_000_000, sparkline: genSparkline(10, 30, 0.4) },
  { symbol: '9988.HK', name: 'Alibaba', market: 'HK', price: 84.35, change: -1.05, changePct: -1.23, volume: 18_400_000, marketCap: 1_610_000_000_000, sparkline: genSparkline(11, 30, -0.4) },
  { symbol: '600519.SS', name: 'Kweichow Moutai', market: 'CN', price: 1_487.50, change: 12.30, changePct: 0.83, volume: 2_140_000, marketCap: 1_870_000_000_000, sparkline: genSparkline(12, 30, 0.3) },
]

// ----- OHLC candlestick data -----
export interface Candle {
  time: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export function genCandles(seed: number, count = 60, start = 100): Candle[] {
  const rand = seededRandom(seed)
  let prev = start
  const out: Candle[] = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const open = prev
    const drift = (rand() - 0.48) * 4
    const close = Number((open + drift).toFixed(2))
    const high = Number((Math.max(open, close) + rand() * 2).toFixed(2))
    const low = Number((Math.min(open, close) - rand() * 2).toFixed(2))
    const volume = Math.floor(rand() * 5_000_000) + 1_000_000
    const time = new Date(now - (count - i) * 24 * 3600 * 1000).toISOString().slice(0, 10)
    out.push({ time, open, high, low, close, volume })
    prev = close
  }
  return out
}

// ----- Portfolio -----
export interface Position {
  symbol: string
  name: string
  qty: number
  avgPrice: number
  currentPrice: number
  pnl: number
  pnlPct: number
  weight: number
}

export const PORTFOLIO: Position[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', qty: 120, avgPrice: 198.50, currentPrice: 234.45, pnl: 4_314.0, pnlPct: 18.11, weight: 0.281 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', qty: 80, avgPrice: 102.30, currentPrice: 138.62, pnl: 2_905.6, pnlPct: 35.50, weight: 0.111 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', qty: 45, avgPrice: 392.10, currentPrice: 428.91, pnl: 1_656.45, pnlPct: 9.39, weight: 0.193 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', qty: 95, avgPrice: 161.20, currentPrice: 174.55, pnl: 1_268.25, pnlPct: 8.29, weight: 0.166 },
  { symbol: 'TSLA', name: 'Tesla Inc.', qty: 30, avgPrice: 245.60, currentPrice: 412.88, pnl: 5_018.40, pnlPct: 68.04, weight: 0.124 },
  { symbol: 'BTC-USD', name: 'Bitcoin', qty: 0.85, avgPrice: 52_400, currentPrice: 67_412.55, pnl: 12_760.67, pnlPct: 28.65, weight: 0.125 },
]

export const PORTFOLIO_HISTORY = [
  { date: '2024-01', value: 100_000 },
  { date: '2024-02', value: 103_200 },
  { date: '2024-03', value: 108_500 },
  { date: '2024-04', value: 104_300 },
  { date: '2024-05', value: 112_700 },
  { date: '2024-06', value: 118_900 },
  { date: '2024-07', value: 115_200 },
  { date: '2024-08', value: 124_500 },
  { date: '2024-09', value: 132_800 },
  { date: '2024-10', value: 128_400 },
  { date: '2024-11', value: 141_700 },
  { date: '2024-12', value: 152_300 },
]

export const BENCHMARK_HISTORY = [
  { date: '2024-01', value: 100_000 },
  { date: '2024-02', value: 101_500 },
  { date: '2024-03', value: 103_200 },
  { date: '2024-04', value: 101_800 },
  { date: '2024-05', value: 105_400 },
  { date: '2024-06', value: 107_900 },
  { date: '2024-07', value: 106_200 },
  { date: '2024-08', value: 109_800 },
  { date: '2024-09', value: 113_200 },
  { date: '2024-10', value: 110_900 },
  { date: '2024-11', value: 117_500 },
  { date: '2024-12', value: 121_800 },
]

export const PORTFOLIO_STATS = {
  totalValue: 152_347.20,
  dayChange: 2_847.55,
  dayChangePct: 1.90,
  totalPnl: 52_347.20,
  totalPnlPct: 52.35,
  unrealizedPnl: 28_922.37,
  realizedPnl: 23_424.83,
  sharpe: 1.84,
  sortino: 2.41,
  maxDrawdown: -12.4,
  volatility: 18.6,
  beta: 1.12,
  alpha: 8.7,
  winRate: 64.2,
  profitFactor: 2.18,
}

// ----- Market Indexes -----
export const INDEXES = [
  { name: 'S&P 500', value: 5_874.32, change: 18.45, changePct: 0.31 },
  { name: 'NASDAQ', value: 18_983.47, change: 142.31, changePct: 0.76 },
  { name: 'Dow Jones', value: 42_115.78, change: -87.21, changePct: -0.21 },
  { name: 'Hang Seng', value: 19_576.61, change: 234.55, changePct: 1.21 },
  { name: 'Shanghai', value: 3_289.48, change: 12.84, changePct: 0.39 },
  { name: 'VIX', value: 14.32, change: -0.45, changePct: -3.04 },
]

// ----- Sector Performance -----
export const SECTORS = [
  { name: 'Technology', change: 1.84, weight: 0.32 },
  { name: 'Financials', change: 0.62, weight: 0.13 },
  { name: 'Healthcare', change: -0.32, weight: 0.12 },
  { name: 'Consumer Disc.', change: 1.21, weight: 0.10 },
  { name: 'Communication', change: 0.89, weight: 0.09 },
  { name: 'Industrials', change: 0.45, weight: 0.08 },
  { name: 'Energy', change: -1.84, weight: 0.04 },
  { name: 'Utilities', change: -0.12, weight: 0.03 },
  { name: 'Materials', change: 0.34, weight: 0.03 },
  { name: 'Real Estate', change: -0.78, weight: 0.02 },
  { name: 'Staples', change: 0.18, weight: 0.04 },
]

// ----- News / Sentiment -----
export interface NewsItem {
  id: string
  title: string
  source: string
  time: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  tickers: string[]
  summary: string
}

export const NEWS_FEED: NewsItem[] = [
  {
    id: '1',
    title: 'NVIDIA unveils next-gen Blackwell Ultra GPU with 3.4x inference performance',
    source: 'Bloomberg',
    time: '12m ago',
    sentiment: 'bullish',
    tickers: ['NVDA'],
    summary: 'CEO Jensen Huang revealed the Blackwell Ultra at GTC Asia, claiming 3.4x inference speedup over Hopper. Major cloud providers have already placed $42B in pre-orders through 2026.',
  },
  {
    id: '2',
    title: 'Fed signals two more rate cuts in 2026 amid cooling inflation data',
    source: 'Reuters',
    time: '34m ago',
    sentiment: 'bullish',
    tickers: ['SPY', 'QQQ'],
    summary: 'FOMC minutes released today suggest growing consensus around additional easing. Markets responded positively with the 10-year yield dropping 8bps to 4.12%.',
  },
  {
    id: '3',
    title: 'Tesla recalls 14,000 Cybertrucks over windshield wiper defect',
    source: 'CNBC',
    time: '1h ago',
    sentiment: 'bearish',
    tickers: ['TSLA'],
    summary: 'The NHTSA recall covers 2024-2025 model year vehicles. Tesla will replace the front wiper motor governor free of charge. Shares down 2.01% in afternoon trading.',
  },
  {
    id: '4',
    title: 'Bitcoin breaks $67K as spot ETF inflows hit 4-month high',
    source: 'CoinDesk',
    time: '2h ago',
    sentiment: 'bullish',
    tickers: ['BTC-USD'],
    summary: 'Spot Bitcoin ETFs absorbed $1.2B in net inflows this week, the largest weekly total since August. BlackRock IBIT alone accounted for $487M of the demand.',
  },
  {
    id: '5',
    title: 'Apple supplier Foxconn reports record holiday-quarter revenue',
    source: 'Wall Street Journal',
    time: '3h ago',
    sentiment: 'bullish',
    tickers: ['AAPL'],
    summary: 'Hon Hai Precision Industry posted NT$2.1T ($64B) in Q4 revenue, up 12% YoY, signaling strong iPhone 16 Pro demand. Apple shares rose 1.39% on the news.',
  },
  {
    id: '6',
    title: 'Alibaba faces regulatory probe over cloud pricing practices',
    source: 'Financial Times',
    time: '4h ago',
    sentiment: 'bearish',
    tickers: ['9988.HK'],
    summary: "China's State Administration for Market Regulation is examining whether Alibaba Cloud engaged in below-cost pricing to squeeze competitors. Alibaba denied wrongdoing.",
  },
  {
    id: '7',
    title: 'Tencent Music surges 8% after beating subscriber growth estimates',
    source: 'MarketWatch',
    time: '5h ago',
    sentiment: 'bullish',
    tickers: ['0700.HK'],
    summary: 'Tencent Music added 11.6M paying users in Q3, far exceeding Street estimates of 7.2M. ARPU grew 4.2% QoQ to RMB 11.2.',
  },
]

// ----- Risk Metrics -----
export const RISK_METRICS = {
  var95: -2_847.55,
  var99: -4_512.18,
  cvar95: -3_842.20,
  beta: 1.12,
  correlation: 0.78,
  treynor: 14.65,
  jensen: 6.84,
  information: 0.92,
  calmar: 1.45,
}

// ----- Paper Trading Engine State -----
export interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  qty: number
  price: number
  type: 'market' | 'limit' | 'stop'
  status: 'filled' | 'pending' | 'cancelled'
  time: string
}

export const INITIAL_ORDERS: Order[] = [
  { id: 'ord-001', symbol: 'AAPL', side: 'buy', qty: 50, price: 232.10, type: 'limit', status: 'filled', time: '09:31:24' },
  { id: 'ord-002', symbol: 'NVDA', side: 'buy', qty: 30, price: 135.50, type: 'market', status: 'filled', time: '09:42:08' },
  { id: 'ord-003', symbol: 'TSLA', side: 'sell', qty: 20, price: 415.00, type: 'limit', status: 'pending', time: '10:15:32' },
  { id: 'ord-004', symbol: 'MSFT', side: 'buy', qty: 15, price: 425.00, type: 'limit', status: 'pending', time: '11:02:18' },
  { id: 'ord-005', symbol: 'GOOGL', side: 'sell', qty: 40, price: 176.50, type: 'stop', status: 'cancelled', time: '11:48:55' },
]

// ----- Swarm Presets -----
export interface SwarmPreset {
  id: string
  name: string
  description: string
  category: string
  workers: SwarmWorker[]
}

export interface SwarmWorker {
  id: string
  name: string
  role: string
  status: 'waiting' | 'running' | 'done' | 'failed' | 'blocked' | 'retrying'
  dependencies: string[]
  output?: string
}

export const SWARM_PRESETS: SwarmPreset[] = [
  {
    id: 'investment-committee',
    name: 'Investment Committee',
    description: 'A full investment-committee debate: bull analyst, bear analyst, risk reviewer, and portfolio manager make the final call.',
    category: 'Equity',
    workers: [
      { id: 'w1', name: 'Bull Analyst', role: 'Argues the long thesis', status: 'done', dependencies: [], output: 'Strong fundamental momentum. NVDA Blackwell cycle drives 35%+ EPS growth. Maintain overweight.' },
      { id: 'w2', name: 'Bear Analyst', role: 'Argues the short thesis', status: 'done', dependencies: [], output: 'Valuation at 32x forward earnings leaves no margin for error. Competitive pressure from AMD MI400 series.' },
      { id: 'w3', name: 'Risk Reviewer', role: 'Stress-tests both sides', status: 'done', dependencies: ['w1', 'w2'], output: 'Tail risk: China export controls on HBM. Position sizing should cap at 6% NAV with -25% stop.' },
      { id: 'w4', name: 'Portfolio Manager', role: 'Final allocation decision', status: 'done', dependencies: ['w3'], output: 'Hold position at 5.2% NAV. Tighten stop to $118. Add 0.5% on any pullback to $125.' },
    ],
  },
  {
    id: 'quant-desk',
    name: 'Quant Strategy Desk',
    description: 'Factor researcher, signal engineer, backtester, and validator iterate on a new alpha signal.',
    category: 'Quantitative',
    workers: [
      { id: 'w1', name: 'Factor Researcher', role: 'Identifies candidate factors', status: 'done', dependencies: [], output: 'Found positive cross-sectional momentum on 5-day returns, attenuated after 20 days.' },
      { id: 'w2', name: 'Signal Engineer', role: 'Composes raw signal', status: 'done', dependencies: ['w1'], output: 'Signal = rank(5d_ret) - rank(20d_ret), neutralized by sector. IC: 0.071, IR: 1.42.' },
      { id: 'w3', name: 'Backtester', role: 'Runs full backtest', status: 'running', dependencies: ['w2'] },
      { id: 'w4', name: 'Validator', role: 'Monte Carlo + walk-forward', status: 'waiting', dependencies: ['w3'] },
    ],
  },
  {
    id: 'crypto-desk',
    name: 'Crypto Trading Desk',
    description: 'On-chain analyst, sentiment scraper, market-maker, and execution trader handle a BTC/ETH rotation.',
    category: 'Crypto',
    workers: [
      { id: 'w1', name: 'On-Chain Analyst', role: 'Reads whale flows', status: 'done', dependencies: [], output: 'Exchange balances down 12.4k BTC this week. Miner outflows elevated → potential sell pressure.' },
      { id: 'w2', name: 'Sentiment Scraper', role: 'X/Reddit sentiment', status: 'done', dependencies: [], output: 'Funding rates neutral. Social sentiment +2σ bullish → contrarian short-term risk.' },
      { id: 'w3', name: 'Market Maker', role: 'Quotes two-sided markets', status: 'running', dependencies: ['w1', 'w2'] },
      { id: 'w4', name: 'Execution Trader', role: 'TWAPs parent orders', status: 'waiting', dependencies: ['w3'] },
    ],
  },
  {
    id: 'global-macro',
    name: 'Global Macro Desk',
    description: 'Rates strategist, FX strategist, commodities analyst, and macro PM allocate across asset classes.',
    category: 'Macro',
    workers: [
      { id: 'w1', name: 'Rates Strategist', role: 'Calls the curve', status: 'done', dependencies: [], output: 'Curve steepening trade: long 30Y / short 2Y. Carry +4bps, target 30bps.' },
      { id: 'w2', name: 'FX Strategist', role: 'Currency views', status: 'done', dependencies: [], output: 'Short USDJPY into BOJ. Stop 158.50. Target 152.00.' },
      { id: 'w3', name: 'Commodities Analyst', role: 'Energy & metals', status: 'done', dependencies: [], output: 'Long copper on supply deficit. TC/RCs at record lows.' },
      { id: 'w4', name: 'Macro PM', role: 'Top-down allocation', status: 'done', dependencies: ['w1', 'w2', 'w3'], output: 'Risk-on basket: 40% equities, 25% commodities, 20% FX, 15% cash. Hedge tail with VIX calls.' },
    ],
  },
  {
    id: 'risk-committee',
    name: 'Risk Committee',
    description: 'Reviews portfolio risk, proposes hedges, and authorizes position-size adjustments.',
    category: 'Risk',
    workers: [
      { id: 'w1', name: 'VaR Analyst', role: 'Computes tail risk', status: 'done', dependencies: [], output: '1-day 95% VaR: $2,847 (1.87% NAV). 99% VaR: $4,512. Within mandate.' },
      { id: 'w2', name: 'Stress Tester', role: 'Historical scenarios', status: 'done', dependencies: [], output: 'GFC 2008 scenario: -18.4%. COVID 2020: -12.1%. Taper Tantrum 2013: -6.8%.' },
      { id: 'w3', name: 'Hedger', role: 'Proposes overlays', status: 'done', dependencies: ['w1', 'w2'], output: 'Buy SPY Dec 575 puts (8 delta) for $1.42. Caps tail at -4.2%.' },
      { id: 'w4', name: 'Chief Risk Officer', role: 'Final mandate', status: 'done', dependencies: ['w3'], output: 'Approved. Trim NVDA from 5.2% to 4.5%. Add put hedge.' },
    ],
  },
]

// ----- Shadow Account Behavior Profile -----
export interface BehaviorProfile {
  metric: string
  value: number | string
  benchmark: string
  status: 'good' | 'warning' | 'bad'
  description: string
}

export const SAMPLE_BEHAVIOR_PROFILE: BehaviorProfile[] = [
  { metric: 'Avg Holding Period', value: '4.2 days', benchmark: 'Industry: 11 days', status: 'warning', description: 'You trade too frequently. Short holding periods amplify transaction costs and tax drag.' },
  { metric: 'Win Rate', value: '52.3%', benchmark: 'Random: ~50%', status: 'good', description: 'Marginally above random. Suggests modest skill but high variance.' },
  { metric: 'PnL Ratio', value: '1.18', benchmark: 'Pro: >2.0', status: 'warning', description: 'Your winners are only 18% larger than losers. Cut losers earlier or let winners run.' },
  { metric: 'Max Drawdown', value: '-23.4%', benchmark: 'SPY: -12%', status: 'bad', description: 'Drawdowns nearly 2x the index. Position sizing or stop discipline is lacking.' },
  { metric: 'Disposition Effect', value: '+0.34', benchmark: 'Neutral: 0.0', status: 'bad', description: 'You sell winners too early and hold losers too long. A classic behavioral bias.' },
  { metric: 'Overtrading Score', value: '7.8 / 10', benchmark: 'Ideal: <3', status: 'bad', description: 'You turn over your portfolio 4.2x per month. Commissions and slippage are eating returns.' },
  { metric: 'Momentum Chasing', value: 'High', benchmark: 'Low', status: 'warning', description: 'You buy stocks after they have already run 15%+ in 5 days. Risk of buying tops.' },
  { metric: 'Anchoring Bias', value: 'Detected', benchmark: 'None', status: 'warning', description: 'You tend to buy back at prices you previously sold at, ignoring current fundamentals.' },
]

export const SAMPLE_TRADES = [
  { date: '2024-11-12', symbol: 'NVDA', side: 'BUY', qty: 20, price: 145.20, pnl: 0, holdingDays: 0 },
  { date: '2024-11-15', symbol: 'NVDA', side: 'SELL', qty: 20, price: 141.80, pnl: -68.00, holdingDays: 3 },
  { date: '2024-11-18', symbol: 'TSLA', side: 'BUY', qty: 15, price: 348.50, pnl: 0, holdingDays: 0 },
  { date: '2024-11-22', symbol: 'TSLA', side: 'SELL', qty: 15, price: 352.10, pnl: 54.00, holdingDays: 4 },
  { date: '2024-11-25', symbol: 'AAPL', side: 'BUY', qty: 30, price: 228.40, pnl: 0, holdingDays: 0 },
  { date: '2024-11-28', symbol: 'AAPL', side: 'SELL', qty: 30, price: 231.85, pnl: 103.50, holdingDays: 3 },
  { date: '2024-12-02', symbol: 'META', side: 'BUY', qty: 10, price: 588.30, pnl: 0, holdingDays: 0 },
  { date: '2024-12-05', symbol: 'META', side: 'SELL', qty: 10, price: 575.20, pnl: -131.00, holdingDays: 3 },
  { date: '2024-12-09', symbol: 'AMD', side: 'BUY', qty: 25, price: 138.50, pnl: 0, holdingDays: 0 },
  { date: '2024-12-12', symbol: 'AMD', side: 'SELL', qty: 25, price: 144.80, pnl: 157.50, holdingDays: 3 },
]

// ----- Ticker tape -----
export const TICKER_ITEMS = [
  { sym: 'AAPL', price: 234.45, chg: 1.39 },
  { sym: 'NVDA', price: 138.62, chg: 3.06 },
  { sym: 'TSLA', price: 412.88, chg: -2.01 },
  { sym: 'MSFT', price: 428.91, chg: 0.43 },
  { sym: 'GOOGL', price: 174.55, chg: 1.40 },
  { sym: 'META', price: 565.34, chg: 1.21 },
  { sym: 'AMZN', price: 186.32, chg: -0.76 },
  { sym: 'BTC', price: 67412.55, chg: 1.88 },
  { sym: 'ETH', price: 3284.18, chg: 2.74 },
  { sym: 'SOL', price: 178.42, chg: 4.12 },
  { sym: '0700.HK', price: 412.80, chg: 1.28 },
  { sym: '9988.HK', price: 84.35, chg: -1.23 },
  { sym: 'BABA', price: 84.32, chg: -1.18 },
  { sym: 'JD', price: 38.45, chg: 2.41 },
  { sym: 'PDD', price: 142.18, chg: 3.84 },
  { sym: 'SPY', price: 587.45, chg: 0.31 },
  { sym: 'QQQ', price: 512.30, chg: 0.78 },
]
