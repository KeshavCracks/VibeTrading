'use client'

import { Navbar, TickerTape } from '@/components/navbar'
import { Hero } from '@/components/sections/hero'
import { Dashboard } from '@/components/sections/dashboard'
import { Agent } from '@/components/sections/agent'
import { AlphaZoo } from '@/components/sections/alpha-zoo'
import { PaperTrading } from '@/components/sections/paper-trading'
import { ShadowAccount } from '@/components/sections/shadow-account'
import { Swarm } from '@/components/sections/swarm'
import { StrategyBuilder } from '@/components/sections/strategy-builder'
import { Features } from '@/components/sections/features'
import { Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <TickerTape />
      <main className="flex-1">
        <Hero />
        <Dashboard />
        <Agent />
        <AlphaZoo />
        <PaperTrading />
        <ShadowAccount />
        <Swarm />
        <StrategyBuilder />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
