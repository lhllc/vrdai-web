import OpenAI from "openai";
const FINNHUB = process.env.FINNHUB_KEY!;

async function fetchOHLC(symbol: string, from: number, to: number) {
  const url = `https://finnhub.io/api/v1/crypto/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${FINNHUB}`;
  const r = await fetch(url);
  const { t, o, h, l, c } = await r.json();
  return t.map((time: number, i: number) => ({
    time, open: o[i], high: h[i], low: l[i], close: c[i]
  }));
}

export async function POST(req: Request) {
  const { symbol, days, question } = await req.json();
  const to = Math.floor(Date.now() / 1000);
  const from = to - days * 24 * 60 * 60;
  const ohlc = await fetchOHLC(symbol, from, to);

  const openai = new OpenAI();
  const out = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content:
`You are vrdAI. Return JSON only with keys: analysis, confidence, trend,
price_action, volume_profile, resistance, support, price_target,
entry_zone, stop_loss, take_profit, rsi14, macd_line, macd_signal,
macd_histogram, bollinger_upper, bollinger_middle, bollinger_lower,
sma50, sma200, ema20, ema50, stochastic_k, stochastic_d, atr14, adx14,
obv, cci20, parabolic_sar, vwap, cmf20.` },
      { role: "user", content:
`OHLC: ${JSON.stringify(ohlc.slice(-200))}\nQuestion: ${question}` }
    ]
  });
  return new Response(out.choices[0].message.content, {
    headers: { "Content-Type": "application/json" }
  });
}
