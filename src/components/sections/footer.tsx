'use client'

import * as React from 'react'
import { Github, Heart, TrendingUp, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-base">
                Vibe<span className="text-primary">Trading</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              An open-source AI-powered trading research workspace. Built as a
              portfolio project inspired by{' '}
              <a
                href="https://github.com/HKUDS/Vibe-Trading"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                HKUDS/Vibe-Trading
              </a>{' '}
              — re-imagined as an interactive Next.js web app.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://github.com/KeshavCracks/VibeTrading"
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Sections</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#dashboard" className="hover:text-foreground">Dashboard</a></li>
              <li><a href="#agent" className="hover:text-foreground">AI Agent</a></li>
              <li><a href="#alphas" className="hover:text-foreground">Alpha Zoo</a></li>
              <li><a href="#paper-trading" className="hover:text-foreground">Paper Trading</a></li>
              <li><a href="#shadow" className="hover:text-foreground">Shadow Account</a></li>
              <li><a href="#swarm" className="hover:text-foreground">Swarm</a></li>
              <li><a href="#builder" className="hover:text-foreground">Strategy Builder</a></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Disclaimer</div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              VibeTrading is a research and simulation tool. Nothing here is
              financial advice. Market data is illustrative. Always do your own
              research before trading real capital.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} VibeTrading · MIT License
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500" /> using Next.js, Tailwind, and z-ai-web-dev-sdk
          </div>
        </div>
      </div>
    </footer>
  )
}
