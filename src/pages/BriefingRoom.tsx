import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RedactionBar from "../components/RedactionBar";
import WaitlistModal from "../components/WaitlistModal";
import { updateSEO, SEO_PAGES } from "../utils/seo";
import { useLiveStockPrice, STOCK_SYMBOLS } from "../hooks/useLiveStockPrice";
import Navbar from "../components/Navbar";

/* ─── types ─── */

interface BriefingResult {
  asset: string;
  assetName: string;
  direction: "LONG" | "SHORT";
  targetPrice: number;
  currentPrice: number;
  change24h: number;
  confidence: number;
  summary: string;
  redactedSummary: string;
  isStock: boolean;
}

interface CoinData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

/* ─── 4 crypto assets ─── */

const CRYPTO_ASSETS = [
  { symbol: "BTC", name: "Bitcoin", geckoId: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", geckoId: "ethereum" },
  { symbol: "SOL", name: "Solana", geckoId: "solana" },
  { symbol: "BNB", name: "BNB", geckoId: "binancecoin" },
] as const;

/* ─── loading sequence ─── */

const LOADING_LINES = [
  "ESTABLISHING SECURE CHANNEL...",
  "ROUTING THROUGH NODE 7...",
  "DECRYPTING PAYLOAD...",
  "CROSS-REFERENCING INTERCEPTS...",
  "ANALYZING ON-CHAIN DATA...",
  "CALCULATING CONFIDENCE SCORE...",
  "COMPILING DOSSIER...",
];

/* ─── stock narratives ─── */

const STOCK_NARRATIVES: Record<string, { bull: string; bear: string }> = {
  AAPL: {
    bull: "iPhone cycle acceleration detected. Services revenue hitting new highs. China demand stabilizing after Q3 weakness. Capital return program expanding. Assessment: institutional accumulation phase.",
    bear: "Regulatory pressure in EU and US intensifying. China market share erosion to Huawei continuing. Services growth decelerating. Valuation stretched relative to earnings trajectory.",
  },
  TSLA: {
    bull: "FSD adoption accelerating. Energy storage business scaling faster than expected. Robotaxi pilot expansion. Margin recovery in progress. Assessment: inflection point approaching.",
    bear: "Competition from BYD and legacy OEMs intensifying. FSD timeline repeatedly delayed. Margin pressure from price cuts continuing. CEO distraction risk elevated.",
  },
  NVDA: {
    bull: "AI datacenter demand exceeding supply. Blackwell ramp accelerating. Enterprise adoption expanding. Software ecosystem moat widening. Assessment: structural growth thesis intact.",
    bear: "Customer concentration risk — top 4 hyperscalers 40%+ of revenue. China export restrictions impacting. Competition from custom ASICs growing. Valuation pricing perfection.",
  },
  MSFT: {
    bull: "Azure AI revenue run-rate accelerating. Copilot enterprise adoption exceeding targets. Gaming integration progressing. Cloud market share gains continuing. Assessment: diversified growth engine.",
    bear: "Regulatory scrutiny increasing globally. Cloud growth deceleration concerns. AI monetization timeline uncertain. Valuation at premium to historical range.",
  },
  GOOGL: {
    bull: "Search revenue resilient despite AI overview rollout. YouTube monetization improving. Cloud profitability expanding. Waymo commercialization progressing. Assessment: undervalued relative to AI optionality.",
    bear: "Search market share pressure from AI competitors. Antitrust ruling impact uncertain. Cloud competition intensifying. Capital expenditure surge pressuring margins.",
  },
  AMZN: {
    bull: "AWS margin expansion continuing. Advertising revenue growing 20%+. Logistics efficiency gains. International profitability improving. Assessment: earnings power underestimated.",
    bear: "Consumer spending softness impacting retail. AWS growth deceleration. Regulatory pressure increasing. Capital expenditure elevated.",
  },
  META: {
    bull: "AI-driven ad targeting improving ROI. Reels monetization accelerating. Reality Labs losses narrowing. Capital return expanding. Assessment: AI flywheel gaining momentum.",
    bear: "Reality Labs burn rate persistent. Regulatory headwinds in EU. Teen user engagement declining. Competition from TikTok intensifying.",
  },
  AMD: {
    bull: "MI300X datacenter GPU ramp accelerating. Hyperscaler design wins expanding. Embedded segment recovering. Assessment: market share gain trajectory intact.",
    bear: "NVIDIA dominance persistent. China export restrictions impacting. Datacenter competition intensifying. Valuation pricing aggressive growth.",
  },
  JPM: {
    bull: "Net interest income stabilization. Investment banking fee recovery. Credit quality resilient. Capital return elevated. Assessment: best-in-class operator.",
    bear: "Commercial real estate exposure concern. Regulatory capital requirements increasing. Economic slowdown risk. Fee income cyclicality.",
  },
  XOM: {
    bull: "Permian basin production growth continuing. Refining margins strong. Capital discipline maintained. Shareholder returns elevated. Assessment: cash flow machine.",
    bear: "Energy transition risk long-term. Crude price volatility. Capital expenditure requirements. Regulatory pressure on fossil fuels.",
  },
};

/* ─── generate briefing from live data ─── */

function generateCryptoBriefing(coin: CoinData): BriefingResult {
  const { symbol, name, price, change24h } = coin;
  const seed = Math.floor(price * 100) % 100;
  const direction: "LONG" | "SHORT" = change24h > -1.5 ? "LONG" : "SHORT";
  const magnitude = 0.05 + (seed % 10) / 100;
  const targetPrice = direction === "LONG" ? price * (1 + magnitude) : price * (1 - magnitude);
  const confidence = 55 + (seed % 37);

  const narratives: Record<string, { summary: string; redacted: string }> = {
    BTC: {
      summary: `Bitcoin ${direction === "LONG" ? "accumulation" : "distribution"} pattern detected. 24h momentum: ${change24h.toFixed(2)}%. ${direction === "LONG" ? "Institutional ETF inflows persisting. Whale wallets increasing positions." : "Miner sell pressure increasing. Exchange inflows rising."} On-chain data suggests ${direction === "LONG" ? "upside" : "downside"} continuation within 5-14 day window. Target: $${targetPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`,
      redacted: `██████ ${direction === "LONG" ? "accumulation" : "distribution"} pattern detected. 24h momentum: █.██%. ${direction === "LONG" ? "Institutional ████ inflows persisting." : "████ sell pressure increasing."} On-chain data suggests ${direction === "LONG" ? "upside" : "downside"} continuation within █-██ day window.`,
    },
    ETH: {
      summary: `Ethereum ${direction === "LONG" ? "supply squeeze" : "weakness"} thesis. 24h: ${change24h.toFixed(2)}%. ${direction === "LONG" ? "Exchange reserves declining. Staking inflows accelerating. L2 activity driving fee burn." : "Validator exit queue growing. L2 migration reducing mainnet fee revenue."} Assessment: ${direction === "LONG" ? "upside" : "downside"} dislocation within 5 sessions. Target: $${targetPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`,
      redacted: `████████ ${direction === "LONG" ? "supply squeeze" : "weakness"} thesis. 24h: █.██%. ${direction === "LONG" ? "Exchange reserves declining." : "Validator exit queue growing."} Assessment: ${direction === "LONG" ? "upside" : "downside"} dislocation within 5 sessions.`,
    },
    SOL: {
      summary: `Solana network ${direction === "LONG" ? "momentum" : "exhaustion"} signal. 24h: ${change24h.toFixed(2)}%. ${direction === "LONG" ? "DeFi TVL expanding. Firedancer client approaching mainnet. Memecoin activity driving fee revenue." : "Network congestion concerns resurfacing. Validator profit margins compressing."} Assessment: ${direction === "LONG" ? "upside" : "downside"} move probable. Target: $${targetPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`,
      redacted: `██████ network ${direction === "LONG" ? "momentum" : "exhaustion"} signal. 24h: █.██%. ${direction === "LONG" ? "████ TVL expanding." : "Network congestion concerns resurfacing."} Assessment: ${direction === "LONG" ? "upside" : "downside"} move probable.`,
    },
    BNB: {
      summary: `BNB ${direction === "LONG" ? "bullish" : "bearish"} structure. 24h: ${change24h.toFixed(2)}%. ${direction === "LONG" ? "Token burn mechanism accelerating. BSC ecosystem TVL recovering." : "Regulatory headwinds persisting. BSC ecosystem growth stagnating."} Assessment: ${direction === "LONG" ? "upside" : "downside"} bias, 1-2 week horizon. Target: $${targetPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`,
      redacted: `████ ${direction === "LONG" ? "bullish" : "bearish"} structure. 24h: █.██%. ${direction === "LONG" ? "Token burn mechanism accelerating." : "Regulatory headwinds persisting."} Assessment: ${direction === "LONG" ? "upside" : "downside"} bias, 1-2 week horizon.`,
    },
  };

  const narrative = narratives[symbol] || narratives.BTC;

  return {
    asset: symbol,
    assetName: name,
    direction,
    targetPrice: Number(targetPrice.toFixed(2)),
    currentPrice: price,
    change24h,
    confidence,
    summary: narrative.summary,
    redactedSummary: narrative.redacted,
    isStock: false,
  };
}

function generateStockBriefing(symbol: string, price: number, change24h: number): BriefingResult {
  const seed = Math.floor(price * 100) % 100;
  const direction: "LONG" | "SHORT" = change24h > -1.0 ? "LONG" : "SHORT";
  const magnitude = 0.04 + (seed % 8) / 100;
  const targetPrice = direction === "LONG" ? price * (1 + magnitude) : price * (1 - magnitude);
  const confidence = 52 + (seed % 40);

  const narrative = STOCK_NARRATIVES[symbol] || { bull: "Positive momentum detected.", bear: "Negative pressure building." };
  const story = direction === "LONG" ? narrative.bull : narrative.bear;

  return {
    asset: symbol,
    assetName: symbol,
    direction,
    targetPrice: Number(targetPrice.toFixed(2)),
    currentPrice: price,
    change24h,
    confidence,
    summary: `${story} 24h change: ${change24h.toFixed(2)}%. Target: $${targetPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}.`,
    redactedSummary: `${story.replace(/[A-Z]{2,}/g, "████")} 24h change: █.██%.`,
    isStock: true,
  };
}

/* ═══════════════════════════════════════════════════════════════
   BRIEFING ROOM PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function BriefingRoom() {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLineIndex, setLoadingLineIndex] = useState(0);
  const [result, setResult] = useState<BriefingResult | null>(null);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [liveCrypto, setLiveCrypto] = useState<Record<string, CoinData>>({});
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<"crypto" | "stocks">("crypto");

  const { prices: liveStocks, isLive: stocksLive } = useLiveStockPrice();

  useEffect(() => {
    updateSEO(SEO_PAGES.briefing);
  }, []);

  // Fetch live crypto prices
  const fetchCryptoPrices = useCallback(async () => {
    try {
      const ids = CRYPTO_ASSETS.map((a) => a.geckoId).join(",");
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();

      const mapped: Record<string, CoinData> = {};
      for (const asset of CRYPTO_ASSETS) {
        const info = data[asset.geckoId];
        if (info) {
          mapped[asset.symbol] = {
            symbol: asset.symbol,
            name: asset.name,
            price: info.usd,
            change24h: info.usd_24h_change ?? 0,
            marketCap: info.usd_market_cap ?? 0,
            volume24h: info.usd_24h_vol ?? 0,
          };
        }
      }
      setLiveCrypto(mapped);
      setLastFetch(new Date());
      setCryptoLoading(false);
    } catch {
      setCryptoLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCryptoPrices();
    const interval = setInterval(fetchCryptoPrices, 60_000);
    return () => clearInterval(interval);
  }, [fetchCryptoPrices]);

  const handleChipClick = useCallback(
    (chip: string) => {
      if (loading) return;
      setSelectedChip(chip);
      setResult(null);
      setLoading(true);
      setLoadingLineIndex(0);
    },
    [loading]
  );

  useEffect(() => {
    if (!loading) return;
    if (loadingLineIndex < LOADING_LINES.length) {
      const timeout = setTimeout(() => setLoadingLineIndex((p) => p + 1), 350);
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        if (selectedChip) {
          if (liveCrypto[selectedChip]) {
            setResult(generateCryptoBriefing(liveCrypto[selectedChip]));
          } else if (liveStocks[selectedChip]) {
            const s = liveStocks[selectedChip];
            setResult(generateStockBriefing(s.symbol, s.price, s.change24h));
          }
        }
        setLoading(false);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [loading, loadingLineIndex, selectedChip, liveCrypto, liveStocks]);

  const allChips = activeTab === "crypto"
    ? CRYPTO_ASSETS.map((a) => ({ symbol: a.symbol, name: a.name, live: liveCrypto[a.symbol], loading: cryptoLoading }))
    : STOCK_SYMBOLS.map((s) => ({ symbol: s, name: s, live: liveStocks[s], loading: !stocksLive }));

  return (
    <div style={{ backgroundColor: "#0C0C0C", minHeight: "100vh" }}>
      <Navbar />
      <WaitlistModal open={waitlistOpen} onClose={() => setWaitlistOpen(false)} preselectedLevel={2} />

      <header className="px-4 md:px-8 pt-10 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="font-mono text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#D03A2B" }}>BRIEFING ROOM</div>
          <h1 className="font-['Oswald',_sans-serif] text-3xl md:text-4xl tracking-wide uppercase" style={{ color: "#E9E4D8" }}>Desk View.</h1>
          <p className="font-['Special_Elite',_monospace] text-sm mt-2 max-w-lg" style={{ color: "rgba(233,228,216,0.4)" }}>
            Select an asset to task the Agency. Live data from CoinGecko + Yahoo Finance.
            {lastFetch && <span style={{ color: "rgba(233,228,216,0.2)" }}> · Updated {lastFetch.toLocaleTimeString()}</span>}
          </p>
        </div>
      </header>

      {/* TASK THE AGENCY */}
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="p-4 md:p-6" style={{ backgroundColor: "#111", border: "1px solid rgba(57,255,110,0.08)" }}>
            <div className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(233,228,216,0.4)" }}>TASK THE AGENCY</div>

            {/* Tab switcher */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => { setActiveTab("crypto"); setSelectedChip(null); setResult(null); }}
                className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-4 py-2 border transition-all cursor-pointer"
                style={{
                  borderColor: activeTab === "crypto" ? "#39FF6E" : "rgba(233,228,216,0.1)",
                  color: activeTab === "crypto" ? "#39FF6E" : "rgba(233,228,216,0.4)",
                  backgroundColor: activeTab === "crypto" ? "rgba(57,255,110,0.04)" : "transparent",
                }}
              >
                CRYPTO
              </button>
              <button
                onClick={() => { setActiveTab("stocks"); setSelectedChip(null); setResult(null); }}
                className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-4 py-2 border transition-all cursor-pointer"
                style={{
                  borderColor: activeTab === "stocks" ? "#39FF6E" : "rgba(233,228,216,0.1)",
                  color: activeTab === "stocks" ? "#39FF6E" : "rgba(233,228,216,0.4)",
                  backgroundColor: activeTab === "stocks" ? "rgba(57,255,110,0.04)" : "transparent",
                }}
              >
                STOCKS
              </button>
              {stocksLive && activeTab === "stocks" && (
                <span className="font-mono text-[10px] ml-2" style={{ color: "#39FF6E" }}>● LIVE</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="font-['Special_Elite',_monospace] text-sm" style={{ color: "#E9E4D8" }}>
                {activeTab === "crypto" ? "SELECT CRYPTO:" : "SELECT STOCK:"}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {allChips.map((item) => (
                  <motion.button
                    key={item.symbol}
                    onClick={() => handleChipClick(item.symbol)}
                    disabled={loading}
                    className="relative font-['Oswald',_sans-serif] text-xs tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderColor: selectedChip === item.symbol ? "#39FF6E" : "rgba(233,228,216,0.12)",
                      color: selectedChip === item.symbol ? "#39FF6E" : "rgba(233,228,216,0.5)",
                      backgroundColor: selectedChip === item.symbol ? "rgba(57,255,110,0.06)" : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && selectedChip !== item.symbol) {
                        e.currentTarget.style.borderColor = "#39FF6E";
                        e.currentTarget.style.color = "#39FF6E";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedChip !== item.symbol) {
                        e.currentTarget.style.borderColor = "rgba(233,228,216,0.12)";
                        e.currentTarget.style.color = "rgba(233,228,216,0.5)";
                      }
                    }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {item.symbol}
                    {item.live && (
                      <span className="block font-mono text-[9px] tracking-normal mt-0.5" style={{ color: item.live.change24h >= 0 ? "#39FF6E" : "#D03A2B" }}>
                        ${item.live.price.toLocaleString("en-US", { maximumFractionDigits: item.live.price < 1 ? 4 : item.live.price < 100 ? 2 : 0 })}
                        <span className="ml-1">({item.live.change24h >= 0 ? "+" : ""}{item.live.change24h.toFixed(2)}%)</span>
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desk-view layout */}
      <div className="px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: asset overview */}
          <div className="lg:col-span-2 space-y-3">
            <div className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(233,228,216,0.3)" }}>
              LIVE MARKET DATA
            </div>
            {allChips.map((item) => (
              <motion.button
                key={item.symbol}
                onClick={() => handleChipClick(item.symbol)}
                disabled={loading}
                className="w-full text-left p-4 transition-colors duration-200 cursor-pointer disabled:opacity-50"
                style={{
                  backgroundColor: selectedChip === item.symbol ? "rgba(57,255,110,0.04)" : "#111",
                  border: selectedChip === item.symbol ? "1px solid rgba(57,255,110,0.15)" : "1px solid rgba(255,255,255,0.04)",
                }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-['Oswald',_sans-serif] text-sm tracking-wider uppercase" style={{ color: "#E9E4D8" }}>{item.symbol}</span>
                    <span className="font-mono text-xs" style={{ color: "rgba(233,228,216,0.3)" }}>{item.name}</span>
                  </div>
                  {item.live && (
                    <span className="font-mono text-xs px-2 py-0.5" style={{ color: item.live.change24h >= 0 ? "#39FF6E" : "#D03A2B", backgroundColor: item.live.change24h >= 0 ? "rgba(57,255,110,0.06)" : "rgba(208,58,43,0.06)" }}>
                      {item.live.change24h >= 0 ? "+" : ""}{item.live.change24h.toFixed(2)}%
                    </span>
                  )}
                </div>
                {item.live ? (
                  <div className="font-['Special_Elite',_monospace] text-xs">
                    <span style={{ color: "rgba(233,228,216,0.6)" }}>
                      ${item.live.price.toLocaleString("en-US", { maximumFractionDigits: item.live.price < 1 ? 4 : item.live.price < 100 ? 2 : 0 })}
                    </span>
                    {activeTab === "crypto" && (item.live as CoinData).marketCap && (
                      <>
                        <span className="ml-3" style={{ color: "rgba(233,228,216,0.25)" }}>MCap: ${((item.live as CoinData).marketCap / 1e9).toFixed(1)}B</span>
                        <span className="ml-3" style={{ color: "rgba(233,228,216,0.25)" }}>Vol: ${((item.live as CoinData).volume24h / 1e6).toFixed(0)}M</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="font-['Special_Elite',_monospace] text-xs" style={{ color: "rgba(233,228,216,0.2)" }}>
                    {item.loading ? "LOADING..." : "DATA UNAVAILABLE"}
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {/* Right: briefing result */}
          <div className="lg:col-span-3">
            <div className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] uppercase mb-4" style={{ color: "rgba(233,228,216,0.3)" }}>BRIEFING RESULT</div>

            <AnimatePresence mode="wait">
              {loading && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6" style={{ backgroundColor: "#111", border: "1px solid rgba(57,255,110,0.08)" }}>
                  <div className="space-y-2">
                    {LOADING_LINES.slice(0, loadingLineIndex + 1).map((line, i) => (
                      <div key={i} className="font-['Special_Elite',_monospace] text-xs" style={{ color: i === loadingLineIndex ? "#39FF6E" : "rgba(57,255,110,0.3)" }}>{line}</div>
                    ))}
                  </div>
                </motion.div>
              )}

              {result && !loading && (
                <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-6" style={{ backgroundColor: "#111", border: result.direction === "LONG" ? "1px solid rgba(57,255,110,0.15)" : "1px solid rgba(208,58,43,0.15)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="font-['Oswald',_sans-serif] text-lg tracking-wider uppercase" style={{ color: "#E9E4D8" }}>{result.asset}</span>
                      <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5" style={{ color: "rgba(233,228,216,0.3)", backgroundColor: "rgba(255,255,255,0.04)" }}>
                        {result.isStock ? "EQUITY" : "CRYPTO"}
                      </span>
                      <span className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-3 py-1" style={{ color: result.direction === "LONG" ? "#39FF6E" : "#D03A2B", backgroundColor: result.direction === "LONG" ? "rgba(57,255,110,0.06)" : "rgba(208,58,43,0.06)", border: `1px solid ${result.direction === "LONG" ? "rgba(57,255,110,0.2)" : "rgba(208,58,43,0.2)"}` }}>
                        {result.direction}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[10px] tracking-wider uppercase mb-1" style={{ color: "rgba(233,228,216,0.3)" }}>CONFIDENCE</div>
                      <div className="font-['Oswald',_sans-serif] text-lg" style={{ color: result.confidence >= 75 ? "#39FF6E" : result.confidence >= 60 ? "#FFB800" : "#D03A2B" }}>{result.confidence}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4 p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <div>
                      <div className="font-mono text-[10px] tracking-wider uppercase mb-1" style={{ color: "rgba(233,228,216,0.3)" }}>Current</div>
                      <div className="font-['Special_Elite',_monospace] text-sm" style={{ color: "#E9E4D8" }}>${result.currentPrice.toLocaleString("en-US", { maximumFractionDigits: result.currentPrice < 1 ? 4 : result.currentPrice < 100 ? 2 : 0 })}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-wider uppercase mb-1" style={{ color: "rgba(233,228,216,0.3)" }}>Target</div>
                      <div className="font-['Special_Elite',_monospace] text-sm" style={{ color: result.direction === "LONG" ? "#39FF6E" : "#D03A2B" }}>${result.targetPrice.toLocaleString("en-US", { maximumFractionDigits: result.targetPrice < 1 ? 4 : result.targetPrice < 100 ? 2 : 0 })}</div>
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-wider uppercase mb-1" style={{ color: "rgba(233,228,216,0.3)" }}>24h Change</div>
                      <div className="font-['Special_Elite',_monospace] text-sm" style={{ color: result.change24h >= 0 ? "#39FF6E" : "#D03A2B" }}>{result.change24h >= 0 ? "+" : ""}{result.change24h.toFixed(2)}%</div>
                    </div>
                  </div>

                  <div className="font-['Special_Elite',_monospace] text-sm leading-[1.8] mb-4" style={{ color: "rgba(233,228,216,0.5)" }}>
                    <RedactionBar text={result.redactedSummary} />
                  </div>

                  <div className="font-['Special_Elite',_monospace] text-sm leading-[1.8] p-4" style={{ color: "rgba(233,228,216,0.7)", backgroundColor: "rgba(233,228,216,0.02)", border: "1px solid rgba(233,228,216,0.06)" }}>
                    {result.summary}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="font-mono text-[10px]" style={{ color: "rgba(233,228,216,0.2)" }}>FULL VERSION REQUIRES LEVEL 2 CLEARANCE</div>
                    <motion.button onClick={() => setWaitlistOpen(true)} className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-5 py-2.5 border cursor-pointer" style={{ borderColor: "#D03A2B", color: "#D03A2B", backgroundColor: "transparent" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#D03A2B"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#D03A2B"; }} whileTap={{ scale: 0.97 }}>
                      REQUEST CLEARANCE
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {!result && !loading && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 text-center" style={{ backgroundColor: "#111", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <div className="font-['Special_Elite',_monospace] text-sm" style={{ color: "rgba(233,228,216,0.2)" }}>
                    SELECT AN ASSET TO GENERATE A BRIEFING.
                    <br />
                    <span style={{ color: "rgba(233,228,216,0.1)" }}>LIVE DATA · CRYPTO VIA COINGECKO · STOCKS VIA YAHOO FINANCE</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
