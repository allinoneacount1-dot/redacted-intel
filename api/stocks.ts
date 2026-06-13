// Vercel Serverless Function — Stock price proxy
// Fetches from Yahoo Finance server-side (no CORS issues)

export const config = {
  runtime: "edge",
};

const STOCK_SYMBOLS = [
  "AAPL", "TSLA", "NVDA", "MSFT", "GOOGL",
  "AMZN", "META", "AMD", "JPM", "XOM",
];

export default async function handler(req: Request) {
  try {
    const symbols = new URL(req.url).searchParams.get("symbols") || STOCK_SYMBOLS.join(",");
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbols}?interval=1d&range=5d`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; REDACTED-Intel/1.0)",
      },
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `Yahoo API ${res.status}` }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    const results: Record<string, { price: number; change24h: number; prevClose: number }> = {};

    // Handle single or multiple symbols
    const charts = Array.isArray(data?.chart?.result)
      ? data.chart.result
      : [data?.chart?.result].filter(Boolean);

    for (const chart of charts) {
      if (!chart?.meta) continue;
      const symbol = chart.meta.symbol;
      const price = chart.meta.regularMarketPrice;
      const prevClose = chart.meta.chartPreviousClose || chart.meta.previousClose;
      const change24h = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
      results[symbol] = { price, change24h, prevClose };
    }

    return new Response(JSON.stringify({ stocks: results }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=30",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
