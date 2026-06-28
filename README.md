# VibeTrading — AI-Powered Trading Research Workspace

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel_Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

**An open-source AI-powered trading research workspace that lives in your browser.**
Chat with an autonomous agent, explore 456+ alpha factors, run paper trades, dissect your broker journal, and orchestrate multi-agent swarms — all from a single, fast, interactive web app.

[Features](#-features) · [Demo](#-demo) · [Quick Start](#-quick-start) · [Deploy on Vercel](#-deploy-on-vercel) · [Architecture](#-architecture) · [Inspiration](#-inspiration)

</div>

---

## Overview

VibeTrading is a portfolio-grade re-imagining of [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) — the popular Python+React research workspace — rebuilt end-to-end as a Next.js 16 web app designed to deploy on the Vercel free tier in a single click.

Where the original is a heavy, Dockerized, multi-process Python stack (FastAPI + LangChain + React 19), this project distills the same UX into a serverless TypeScript app: an LLM-powered agent in a chat panel, an interactive market dashboard, an Alpha Zoo browser, a paper-trading simulator, a behavioral Shadow Account analyzer, a multi-agent swarm visualizer, and a visual strategy builder that compiles a backtest on the fly.

The goal: a polished, interactive, deploy-anywhere showcase that demonstrates full-stack AI product thinking, not just a chatbot.

## Demo

> Live screenshots of the deployed app:

| Hero & Live Ticker | Market Dashboard |
|:---:|:---:|
| ![Hero](./public/screenshots/hero.png) | ![Dashboard](./public/screenshots/dashboard.png) |

| Alpha Zoo (456 factors) | AI Agent Chat |
|:---:|:---:|
| ![Alpha Zoo](./public/screenshots/swarm.png) | ![Agent](./public/screenshots/paper.png) |

| Swarm DAG Visualizer | Strategy Builder + Backtest |
|:---:|:---:|
| ![Swarm](./public/screenshots/swarm.png) | ![Backtest](./public/screenshots/backtest.png) |

| Shadow Account Analysis |
|:---:|
| ![Shadow Account](./public/screenshots/shadow.png) |

## Features

### Real-time Market Dashboard
Live ticker tape of 17 instruments across US / HK / CN equities, crypto, and ETFs. Sector heatmap, indexes (S&P, NASDAQ, Hang Seng, Shanghai, VIX), portfolio holdings with intraday P&L, sentiment-tagged news feed, and animated risk gauges (Sharpe, Sortino, beta, alpha, max drawdown, win rate, profit factor).

### AI Trading Agent (VibeAgent)
A ReAct-style autonomous agent with a custom system prompt that grounds it in your portfolio context. Powered by `z-ai-web-dev-sdk` (Z.ai GLM). Ask it to analyze a stock, design a strategy, explain an alpha factor, or stress-test your portfolio. Suggested prompts get you started in one click.

### Alpha Zoo — 456 factors
Browse a curated library of cross-sectional alphas from four academic / industry families:
- **Qlib158** (154 factors) — Microsoft Research's flagship factor set
- **WorldQuant alpha101** (101 factors) — Kakushadze (2015)
- **GTJA191** (191 factors) — Guotai Junan
- **Academic** (10 factors) — Fama-French 5, Carhart MOM, Jegadeesh reversal, George-Hwang 52W-H, Amihud illiquidity, Harvey-Siddique coskewness

Every factor shows its formula, IC, IR, Sharpe, turnover, max drawdown, status (live / alive-reversed / dead / experimental), and tags. Filter by family or category, search by name / formula / tag, and click any factor to see full details. A bar chart visualizes the category distribution.

### Paper Trading Arena
Start with $100K virtual capital. Place market or limit orders against live prices on the watchlist. See fills flow into your order history, watch your account equity curve grow (or shrink), and learn the mechanics without risking real money.

### Shadow Account (Behavioral Bias Analyzer)
Upload your broker trade journal as CSV (or use the bundled sample). The agent:
1. Computes a behavior profile (holding period, win rate, P&L ratio, max drawdown, disposition effect, overtrading, momentum chasing, anchoring)
2. Detects concrete biases with evidence and actionable fixes
3. Extracts evidence-based entry / exit / risk / filter rules
4. Delivers a coaching recommendation

Required CSV columns: `date, symbol, side, qty, price, pnl, holdingDays`.

### Multi-Agent Swarm Visualizer
Run one of 5 preset trading teams as a directed acyclic graph:
- **Investment Committee** — bull analyst, bear analyst, risk reviewer, PM
- **Quant Strategy Desk** — factor researcher, signal engineer, backtester, validator
- **Crypto Trading Desk** — on-chain analyst, sentiment scraper, market maker, execution trader
- **Global Macro Desk** — rates, FX, commodities, macro PM
- **Risk Committee** — VaR analyst, stress tester, hedger, CRO

Watch each worker node transition through `waiting → running → done` (or `failed / blocked / retrying`) with simulated execution timing. Click any node to inspect its role and output. Edges visualize dependencies in the DAG.

### Visual Strategy Builder
Compose a strategy from a library of 15 building blocks across 5 categories (entry, exit, risk, filter, position sizing). Set your universe and initial capital, then click **Run Backtest** — the agent returns a structured JSON report with:
- 12-month equity curve
- 11 performance metrics (Sharpe, Sortino, max DD, win rate, profit factor, beta, alpha, volatility, turnover, total return, annual return)
- Sample trade list
- Observations and a recommendation

### Polished UX
- **Dark mode by default** with light mode toggle
- **Framer Motion** entrance animations, floating sparkline cards, animated counters
- **Responsive** — works on mobile, tablet, desktop
- **Sticky footer** that respects viewport height
- **Custom scrollbars**, grid background, gradient glows
- **Accessibility** — semantic HTML, ARIA labels, keyboard-navigable

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Charts | Recharts |
| Animation | Framer Motion |
| Icons | Lucide React |
| AI / LLM | `z-ai-web-dev-sdk` (Z.ai GLM) |
| Theme | next-themes |
| State | React hooks (no global store needed) |
| Deployment | Vercel (free tier) |

## Architecture

```
src/
├── app/
│   ├── api/
│   │   ├── agent/route.ts          # POST  /api/agent         → chat with VibeAgent
│   │   ├── backtest/route.ts       # POST  /api/backtest      → run a 12-mo backtest
│   │   └── analyze-trades/route.ts # POST  /api/analyze-trades → shadow-account analysis
│   ├── globals.css                  # Tailwind theme tokens, custom utilities
│   ├── layout.tsx                   # Root layout with ThemeProvider + Toaster
│   └── page.tsx                     # Composed single-page app
├── components/
│   ├── ui/                          # shadcn/ui primitives
│   ├── navbar.tsx                   # Sticky nav + live ticker tape
│   ├── sparkline.tsx                # SVG sparkline + AnimatedNumber + FadeIn
│   ├── theme-provider.tsx
│   └── sections/
│       ├── hero.tsx
│       ├── dashboard.tsx
│       ├── agent.tsx
│       ├── alpha-zoo.tsx
│       ├── paper-trading.tsx
│       ├── shadow-account.tsx
│       ├── swarm.tsx
│       ├── strategy-builder.tsx
│       ├── features.tsx
│       └── footer.tsx
└── lib/
    ├── mock-data.ts                 # Watchlist, portfolio, news, swarm presets, trades
    ├── alphas.ts                    # 456 alpha factor definitions (sample of 60 shown)
    ├── zai.ts                       # ZAI client factory (env-var aware)
    └── utils.ts                     # cn() helper
```

### Why serverless-friendly

The three AI endpoints (`/api/agent`, `/api/backtest`, `/api/analyze-trades`) are stateless Next.js Route Handlers with `runtime = "nodejs"` and `maxDuration = 60`. They use `getZai()` — a small factory in `src/lib/zai.ts` — which:

1. Reads `ZAI_API_KEY` and `ZAI_BASE_URL` from environment variables
2. If present, writes a temporary `.z-ai-config` file the SDK can locate (Vercel's filesystem is read-only except `/tmp` and `process.cwd()` during the request)
3. Falls back to any pre-existing `.z-ai-config` (local dev) or `/etc/.z-ai-config` (sandbox)

This means the same code works in local dev, on a VM, and on Vercel — only the env vars differ.

## Quick Start

### Prerequisites

- Node.js 18.18+ (or Bun)
- A [Z.ai](https://z.ai) account and API key

### 1. Clone

```bash
git clone https://github.com/KeshavCracks/VibeTrading.git
cd VibeTrading
```

### 2. Install dependencies

```bash
npm install
# or: bun install / pnpm install / yarn install
```

### 3. Set environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
ZAI_API_KEY=your_real_zai_api_key
ZAI_BASE_URL=https://api.z.ai/api/paas/v4
```

### 4. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000. You should see the hero, ticker tape, and dashboard. Try the AI agent, paper trading, swarm visualizer, and strategy builder.

### 5. Lint (optional)

```bash
npm run lint
```

## Deploy on Vercel

The project is configured for zero-config Vercel deployments on the free tier.

### Option A — One-click via Vercel dashboard

1. Push this repo to your GitHub (see [Publish to GitHub](#publish-to-github) below).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Vercel auto-detects Next.js — leave the build settings as defaults.
4. In **Project Settings → Environment Variables**, add:
   - `ZAI_API_KEY` = your Z.ai API key
   - `ZAI_BASE_URL` = `https://api.z.ai/api/paas/v4`
5. Click **Deploy**. Your app is live in ~60 seconds at `https://<your-project>.vercel.app`.

### Option B — Via Vercel CLI

```bash
npm i -g vercel
vercel              # follow the prompts
vercel env add ZAI_API_KEY
vercel env add ZAI_BASE_URL
vercel --prod       # deploy to production
```

### Free-tier notes

- The Vercel Hobby plan gives 100 GB-hours of serverless function execution per month — plenty for a portfolio project.
- The `/api/*` routes use `maxDuration = 60` (the Hobby-plan ceiling). If you upgrade to Pro, you can bump this to 300s.
- Cold starts on the AI routes are typically ~1s; warm responses are <10s for the agent and <20s for backtest / shadow-account analysis.
- No database is required — all data is mocked in-memory, so you don't need Vercel Postgres or KV.

## Publish to GitHub

The repository is already initialized for you. To publish your own copy:

```bash
# 1. Create an empty repo on GitHub first (no README, no .gitignore)
#    e.g. https://github.com/new → name: VibeTrading

# 2. From the project root:
git remote set-url origin https://github.com/<your-username>/VibeTrading.git
git push -u origin main
```

Then connect Vercel to that repo so every `git push` triggers a deploy.

## Project Structure

The app is a single-page experience with anchor-scrollable sections, so users can navigate via the top nav or just scroll. Each section is a self-contained React component under `src/components/sections/`, which makes it easy to:

- Reorder sections by editing `src/app/page.tsx`
- Add a new section by dropping a file in `src/components/sections/` and importing it
- Modify mock data in one place (`src/lib/mock-data.ts`, `src/lib/alphas.ts`)

## Customization

### Swap mock data for real APIs

The dashboard and watchlist currently use deterministic mock data (see `genSparkline`, `genCandles` in `src/lib/mock-data.ts`). To go live:

1. Sign up for a market-data provider (Alpha Vantage, Polygon.io, Finnhub, yfinance proxy, etc.)
2. Create a new route handler at `src/app/api/quotes/route.ts` that fetches and caches quotes
3. Replace the static imports in `dashboard.tsx` and `paper-trading.tsx` with `useEffect` + `fetch('/api/quotes')`

### Add more alpha factors

Edit `src/lib/alphas.ts`. Each factor is a plain object — add as many as you want and the UI, filter, and detail panel adapt automatically.

### Add swarm presets

Edit `SWARM_PRESETS` in `src/lib/mock-data.ts`. Each preset is a DAG of workers with `id`, `name`, `role`, `dependencies` (array of worker IDs), and optional `output`.

### Customize the agent prompt

Edit `SYSTEM_PROMPT` in `src/app/api/agent/route.ts`. The agent is grounded in your portfolio context, which you can replace with real data.

## Inspiration

This project is heavily inspired by [HKUDS/Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) — an open-source Python + React workspace from the Hong Kong University Data Science lab. The original is a powerful, Dockerized, multi-process system built around LangChain/LangGraph with ~68 tools, 18 market-data sources, and 10 broker connectors.

VibeTrading is a **re-imagination**, not a port. It keeps the same product DNA — agent + alpha zoo + swarm + shadow account — but rebuilds it as a fast, interactive, serverless Next.js app that anyone can deploy on Vercel's free tier in a single click. Where the original targets quant researchers who want a Python CLI, this version targets a broader audience who wants to explore AI-assisted trading in the browser.

All market data in this project is synthetic / illustrative. **Nothing here is financial advice.**

## Roadmap

- [ ] Real market-data integration (Alpha Vantage / Polygon.io)
- [ ] Persistent paper-trading account via Vercel KV
- [ ] WebSocket live-streaming for the ticker tape
- [ ] Drag-and-drop block reordering in the strategy builder
- [ ] Export strategy as executable Python (Qlib / Backtrader)
- [ ] Compare alphas side-by-side in a scatter plot (IC vs IR)
- [ ] Mobile bottom-sheet navigation
- [ ] PWA + push notifications for scheduled research briefs

## License

MIT © 2026 KeshavCracks. See [LICENSE](./LICENSE).

## Acknowledgments

- [HKUDS / Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) — the original inspiration
- [Z.ai](https://z.ai) — GLM model + `z-ai-web-dev-sdk`
- [shadcn/ui](https://ui.shadcn.com/) — component library
- [Recharts](https://recharts.org/) — charting
- [Framer Motion](https://www.framer.com/motion/) — animation
- [Lucide](https://lucide.dev/) — icons

---

<div align="center">

**If this project helped you, give it a ⭐ on GitHub — it really does help.**

Built with care as a portfolio piece · MIT License · 2026

</div>
