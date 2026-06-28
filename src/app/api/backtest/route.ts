import { NextRequest, NextResponse } from "next/server";
import { getZai } from "@/lib/zai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a quantitative backtest engine reviewer. Given a strategy specification (entry rule, exit rule, risk rule, universe, and parameters), you produce a realistic-looking backtest report.

Always respond as STRICT JSON with this exact shape:
{
  "summary": "<2-3 sentence executive summary>",
  "metrics": {
    "totalReturn": <number, percent>,
    "annualReturn": <number, percent>,
    "sharpe": <number>,
    "sortino": <number>,
    "maxDrawdown": <number, negative percent>,
    "winRate": <number, percent>,
    "profitFactor": <number>,
    "beta": <number>,
    "alpha": <number, percent>,
    "volatility": <number, percent>,
    "turnover": <number, percent>
  },
  "monthlyReturns": [ {"month": "2024-01", "return": <number>} ... 12 entries ],
  "equityCurve": [ {"month": "2024-01", "value": <number>} ... 12 entries starting at 100000 ],
  "trades": [
    { "date": "2024-MM-DD", "symbol": "<TICKER>", "side": "BUY|SELL", "qty": <int>, "price": <number>, "pnl": <number>, "holdingDays": <int> }
  ]  // 8-12 sample trades
  "observations": ["<observation 1>", "<observation 2>", "<observation 3>"],
  "recommendation": "<one-paragraph actionable recommendation>"
}

Rules:
- Numbers must be plausible (Sharpe between 0.4 and 2.6, max drawdown between -5% and -35%, win rate between 40% and 70%).
- Monthly returns should sum approximately to the annual return.
- Be honest about weaknesses in the "observations" array.
- Do NOT include any text outside the JSON object.`;

export async function POST(req: NextRequest) {
  try {
    const { strategy } = await req.json();

    if (!strategy) {
      return NextResponse.json(
        { error: "strategy specification is required" },
        { status: 400 }
      );
    }

    const zai = await getZai();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Run a backtest for this strategy and return the JSON report:\n\n${strategy}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1800,
      thinking: { type: "disabled" },
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    // Try to extract JSON even if wrapped in markdown fences
    let parsed: unknown;
    try {
      const cleaned = raw
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse backtest output", raw },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Backtest API error:", err);
    return NextResponse.json(
      {
        error: "Failed to run backtest",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
