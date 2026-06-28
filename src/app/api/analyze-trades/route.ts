import { NextRequest, NextResponse } from "next/server";
import { getZai } from "@/lib/zai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `You are a behavioral-finance analyst. Given a list of user trades (date, symbol, side, qty, price, pnl, holdingDays), you produce a behavior-profile report.

Respond as STRICT JSON with this exact shape:
{
  "summary": "<2-3 sentence summary of the user's trading behavior>",
  "metrics": [
    {
      "metric": "<name>",
      "value": "<string>",
      "benchmark": "<string>",
      "status": "good" | "warning" | "bad",
      "description": "<one-sentence explanation>"
    }
  ],  // 6-8 metrics
  "biases": [
    {
      "name": "<bias name e.g. Disposition Effect>",
      "severity": "low" | "moderate" | "high",
      "evidence": "<specific evidence from the trades>",
      "fix": "<one concrete actionable fix>"
    }
  ],  // 3-5 biases
  "extractedRules": [
    {
      "type": "entry" | "exit" | "risk" | "filter",
      "rule": "<plain-English rule>",
      "frequency": "<how often this rule appears in the trade history>"
    }
  ],  // 3-6 rules
  "recommendation": "<one-paragraph coaching recommendation>"
}

Common metrics to include:
- Avg Holding Period (compare to ~11 days industry average)
- Win Rate (compare to ~50%)
- PnL Ratio (avg win / avg loss; compare to >2.0 for pros)
- Max Drawdown (compare to benchmark)
- Disposition Effect score (-1 to +1, 0 is neutral)
- Overtrading Score (0-10, lower is better)
- Momentum Chasing (Low / Medium / High)
- Anchoring Bias (Detected / Not Detected)

Common biases:
- Disposition Effect (sell winners too early, hold losers too long)
- Overtrading
- Momentum Chasing
- Anchoring
- Loss Aversion
- Recency Bias

Rules must be EVIDENCE-BASED — only infer rules that the trades actually support (e.g. "Buys after 3+ up days" if multiple entries follow runs).

Do NOT include any text outside the JSON object.`;

export async function POST(req: NextRequest) {
  try {
    const { trades } = await req.json();

    if (!Array.isArray(trades) || trades.length === 0) {
      return NextResponse.json(
        { error: "trades array is required" },
        { status: 400 }
      );
    }

    const zai = await getZai();

    const completion = await zai.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Analyze these trades and return the JSON behavior profile:\n\n${JSON.stringify(
            trades,
            null,
            2
          )}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 1800,
      thinking: { type: "disabled" },
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";

    let parsed: unknown;
    try {
      const cleaned = raw
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse analysis output", raw },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Analyze-trades API error:", err);
    return NextResponse.json(
      {
        error: "Failed to analyze trades",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
