import { NextRequest, NextResponse } from "next/server";
import { getZai } from "@/lib/zai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are VibeAgent, an autonomous AI trading research assistant embedded in the VibeTrading web app. You help users analyze markets, design strategies, explain alpha factors, and reason about portfolio risk.

Your capabilities (be specific when referencing them):
- Market data across US / HK / CN equities, crypto, futures, forex
- 456+ alpha factors across 4 families: Qlib158 (154), alpha101 (101), GTJA191 (191), Academic (10)
- Multi-agent swarm presets: Investment Committee, Quant Strategy Desk, Crypto Trading Desk, Global Macro Desk, Risk Committee
- Paper trading simulation with realistic fills
- Shadow Account: analyze a user's broker trade journal and surface behavioral biases (disposition effect, overtrading, momentum chasing, anchoring)
- Backtesting with Monte Carlo, Bootstrap, Walk-Forward validation

Response style:
- Be concrete and quantitative when possible (cite specific numbers, ICs, ratios).
- Use bullet points and short paragraphs. Avoid long walls of text.
- When the user asks about a specific ticker, mention realistic price action, sector context, and one or two relevant alpha factors.
- When the user asks about strategy design, propose a clear entry / exit / risk rule set.
- When the user asks about portfolio risk, cite VaR, beta, Sharpe, max drawdown.
- NEVER fabricate specific live trade execution or pretend to place real orders. Always remind users this is a research / simulation tool.
- If a question is outside trading/finance, politely redirect.

Today is ${new Date().toDateString()}. The user's paper-trading portfolio is currently up +52.35% YTD with Sharpe 1.84, beta 1.12, max drawdown -12.4%. Top positions: NVDA, AAPL, TSLA, MSFT, GOOGL, BTC.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages array is required" },
        { status: 400 }
      );
    }

    const zai = await getZai();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.map(
          (m: { role: "system" | "user" | "assistant"; content: string }) => ({
            role: m.role,
            content: m.content,
          })
        ),
      ],
      temperature: 0.6,
      max_tokens: 1200,
      thinking: { type: "disabled" },
    });

    const content =
      completion.choices?.[0]?.message?.content ??
      "I couldn't generate a response. Please try again.";

    return NextResponse.json({
      content,
      usage: completion.usage ?? null,
    });
  } catch (err) {
    console.error("Agent API error:", err);
    return NextResponse.json(
      {
        error: "Failed to reach the agent. Please retry.",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
