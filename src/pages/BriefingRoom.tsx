import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RedactionBar from "../components/RedactionBar";
import CountdownTimer from "../components/CountdownTimer";

/* ─── types ─── */

interface ActiveDossier {
  id: string;
  codeName: string;
  asset: string;
  redactedPreview: string;
  hoursRemaining: number;
  persistKey: string;
}

interface BriefingResult {
  asset: string;
  direction: string;
  targetPrice: number;
  currentPrice: number;
  confidence: number;
  summary: string;
  redactedSummary: string;
}

/* ─── mock data ─── */

const ACTIVE_DOSSIERS: ActiveDossier[] = [
  {
    id: "DSR-004",
    codeName: "PALE HORIZON",
    asset: "BTC",
    redactedPreview:
      "██████ accumulation thesis post-halving. Institutional ████ inflows expected to offset ████ sell pressure within 90 days.",
    hoursRemaining: 47,
    persistKey: "briefing-btc-countdown",
  },
  {
    id: "DSR-008",
    codeName: "SIGIL DAWN",
    asset: "COIN",
    redactedPreview:
      "███████ staking revenue recovery pending ████ clarity on ████ staking classification. Legal resolution expected Q3.",
    hoursRemaining: 23,
    persistKey: "briefing-coin-countdown",
  },
  {
    id: "DSR-010",
    codeName: "EMBER CROWN",
    asset: "AVGO",
    redactedPreview:
      "████████ custom AI ████ revenue ramp. ██████████ orders for next-gen inference chips expected to double YoY.",
    hoursRemaining: 61,
    persistKey: "briefing-avgo-countdown",
  },
  {
    id: "DSR-011",
    codeName: "GHOST LINE",
    asset: "MSFT",
    redactedPreview:
      "████████ cloud revenue acceleration driven by ██████ enterprise adoption. Operating leverage inflection point detected in ████ segment.",
    hoursRemaining: 12,
    persistKey: "briefing-msft-countdown",
  },
  {
    id: "DSR-012",
    codeName: "IRON VEIL",
    asset: "LLY",
    redactedPreview:
      "GLP-1 supply chain analysis indicates ██████████ constraints will persist through ████. Pricing power asymmetric to ████ estimates.",
    hoursRemaining: 89,
    persistKey: "briefing-lly-countdown",
  },
];

const CHIPS = ["BTC", "ETH", "SOL"] as const;

const MOCK_RESPONSES: Record<string, BriefingResult> = {
  BTC: {
    asset: "BTC",
    direction: "LONG",
    targetPrice: 74500,
    currentPrice: 68400,
    confidence: 72,
    summary:
      "Bitcoin accumulation thesis post-halving. Institutional ETF inflows expected to offset miner sell pressure within 90 days. On-chain data shows whale wallets increasing positions by 12% over the past 14 days. Historical post-halving cycles indicate a 60-90 day lag before price discovery accelerates.",
    redactedSummary:
      "██████ accumulation thesis post-halving. Institutional ████ inflows expected to offset ████ sell pressure within 90 days. On-chain data shows ████ wallets increasing positions by 12% over the past 14 days. Historical post-halving cycles indicate a 60-90 day lag before price discovery accelerates.",
  },
  ETH: {
    asset: "ETH",
    direction: "SHORT",
    targetPrice: 2850,
    currentPrice: 3120,
    confidence: 64,
    summary:
      "Ethereum L2 fee compression thesis failed. Sequencer revenue declined as activity migrated to competing L1s. TVL on major L2s dropped 18% in 30 days. Validator exit queue increasing. Staking yield compression reducing institutional demand.",
    redactedSummary:
      "████████ L2 fee compression thesis failed. ██████████ revenue declined as activity migrated to competing L1s. ████ on major L2s dropped 18% in 30 days. Validator exit queue increasing. Staking yield compression reducing institutional demand.",
  },
  SOL: {
    asset: "SOL",
    direction: "LONG",
    targetPrice: 185,
    currentPrice: 148,
    confidence: 81,
    summary:
      "Solana network activity surging. DeFi TVL up 40% QoQ. Firedancer validator client approaching mainnet launch, expected to increase throughput 10x. Memecoin activity driving fee revenue to all-time highs. Developer ecosystem growing faster than any L1.",
    redactedSummary:
      "██████ network activity surging. ████ TVL up 40% QoQ. ████████ validator client approaching mainnet launch, expected to increase throughput 10x. ████████ activity driving fee revenue to all-time highs. Developer ecosystem growing faster than any L1.",
  },
};

/* ─── loading sequence lines ─── */

const LOADING_LINES = [
  "ESTABLISHING SECURE CHANNEL...",
  "ROUTING THROUGH NODE 7...",
  "DECRYPTING PAYLOAD...",
  "CROSS-REFERENCING INTERCEPTS...",
  "ANALYZING ON-CHAIN DATA...",
  "CALCULATING CONFIDENCE SCORE...",
  "COMPILING DOSSIER...",
];

/* ═══════════════════════════════════════════════════════════════
   BRIEFING ROOM PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function BriefingRoom() {
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLineIndex, setLoadingLineIndex] = useState(0);
  const [result, setResult] = useState<BriefingResult | null>(null);
  const [selectedDossier, setSelectedDossier] = useState<ActiveDossier | null>(
    null
  );

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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

  // Loading sequence
  useEffect(() => {
    if (!loading) return;

    if (loadingLineIndex < LOADING_LINES.length) {
      const timeout = setTimeout(() => {
        setLoadingLineIndex((prev) => prev + 1);
      }, 350);
      return () => clearTimeout(timeout);
    } else {
      // Loading complete
      const timeout = setTimeout(() => {
        if (selectedChip) {
          setResult(MOCK_RESPONSES[selectedChip] || null);
        }
        setLoading(false);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [loading, loadingLineIndex, selectedChip]);

  return (
    <div
      style={{
        backgroundColor: "#0C0C0C",
        minHeight: "100vh",
        paddingTop: "56px",
      }}
    >
      {/* Page header */}
      <header className="px-4 md:px-8 pt-10 pb-6">
        <div className="max-w-7xl mx-auto">
          <div
            className="font-mono text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "#D03A2B" }}
          >
            BRIEFING ROOM
          </div>
          <h1
            className="font-['Oswald',_sans-serif] text-3xl md:text-4xl tracking-wide uppercase"
            style={{ color: "#E9E4D8" }}
          >
            Desk View.
          </h1>
          <p
            className="font-['Special_Elite',_monospace] text-sm mt-2 max-w-lg"
            style={{ color: "rgba(233,228,216,0.4)" }}
          >
            Active dossiers on the left. Open briefing on the right. Select an
            asset to task the Agency.
          </p>
        </div>
      </header>

      {/* TASK THE AGENCY input */}
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto">
          <div
            className="p-4 md:p-6"
            style={{
              backgroundColor: "#111",
              border: "1px solid rgba(57,255,110,0.08)",
            }}
          >
            <div
              className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "rgba(233,228,216,0.4)" }}
            >
              TASK THE AGENCY
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div
                className="font-['Special_Elite',_monospace] text-sm"
                style={{ color: "#E9E4D8" }}
              >
                SELECT ASSET:
              </div>
              <div className="flex items-center gap-3">
                {CHIPS.map((chip) => (
                  <button
                    key={chip}
                    onClick={() => handleChipClick(chip)}
                    disabled={loading}
                    className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-5 py-2.5 border transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      borderColor:
                        selectedChip === chip ? "#39FF6E" : "rgba(233,228,216,0.15)",
                      color: selectedChip === chip ? "#39FF6E" : "rgba(233,228,216,0.5)",
                      backgroundColor:
                        selectedChip === chip
                          ? "rgba(57,255,110,0.06)"
                          : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading && selectedChip !== chip) {
                        e.currentTarget.style.borderColor = "#39FF6E";
                        e.currentTarget.style.color = "#39FF6E";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedChip !== chip) {
                        e.currentTarget.style.borderColor = "rgba(233,228,216,0.15)";
                        e.currentTarget.style.color = "rgba(233,228,216,0.5)";
                      }
                    }}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desk-view layout: active dossiers (left) + open dossier (right) */}
      <div className="px-4 md:px-8 pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: active dossier list */}
          <div className="lg:col-span-2 space-y-3">
            <div
              className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "rgba(233,228,216,0.3)" }}
            >
              ACTIVE DOSSIERS ({ACTIVE_DOSSIERS.length})
            </div>

            {ACTIVE_DOSSIERS.map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setSelectedDossier(d);
                  setResult(null);
                  setSelectedChip(null);
                }}
                className="w-full text-left p-4 transition-colors duration-200 cursor-pointer"
                style={{
                  backgroundColor:
                    selectedDossier?.id === d.id ? "rgba(208,58,43,0.08)" : "#111",
                  border:
                    selectedDossier?.id === d.id
                      ? "1px solid rgba(208,58,43,0.2)"
                      : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-['Oswald',_sans-serif] text-sm tracking-wider uppercase"
                      style={{ color: "#E9E4D8" }}
                    >
                      {d.codeName}
                    </span>
                    <span
                      className="font-mono text-xs"
                      style={{ color: "rgba(233,228,216,0.3)" }}
                    >
                      {d.asset}
                    </span>
                  </div>
                  <span
                    className="font-mono text-xs"
                    style={{ color: "rgba(233,228,216,0.2)" }}
                  >
                    {d.id}
                  </span>
                </div>

                <p
                  className="font-['Special_Elite',_monospace] text-xs leading-relaxed mb-2"
                  style={{ color: "rgba(233,228,216,0.35)" }}
                >
                  <RedactionBar text={d.redactedPreview} />
                </p>

                <div className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs"
                    style={{ color: "rgba(233,228,216,0.25)" }}
                  >
                    DECLASSIFIES IN:
                  </span>
                  <CountdownTimer
                    persistKey={d.persistKey}
                    targetHours={d.hoursRemaining}
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Right: open dossier / result */}
          <div className="lg:col-span-3">
            <div
              className="sticky top-24 min-h-[400px] p-6 md:p-8"
              style={{
                backgroundColor: "#E9E4D8",
                boxShadow: "2px 3px 12px rgba(0,0,0,0.18)",
              }}
            >
              {/* Classification header */}
              <div
                className="px-4 py-2 -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6 flex items-center justify-between"
                style={{ backgroundColor: "#D03A2B" }}
              >
                <span className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] text-white uppercase">
                  {loading ? "PROCESSING" : result ? "BRIEFING" : "PENDING"}
                </span>
                <span className="font-mono text-xs text-white/70">
                  {result ? `ASSET: ${result.asset}` : "AWAITING INPUT"}
                </span>
              </div>

              <AnimatePresence mode="wait">
                {/* Loading state */}
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="font-mono text-sm leading-relaxed space-y-1"
                      style={{ color: "#2B2B2B" }}
                    >
                      {LOADING_LINES.slice(0, loadingLineIndex).map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <span style={{ color: "#39FF6E" }}>&gt;</span> {line}
                        </motion.div>
                      ))}
                      {loadingLineIndex < LOADING_LINES.length && (
                        <div style={{ color: "#39FF6E" }}>
                          &gt;{" "}
                          <span
                            className="inline-block w-2 h-4 ml-0.5 align-middle"
                            style={{ backgroundColor: "#39FF6E" }}
                          >
                            &nbsp;
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Result state */}
                {result && !loading && (
                  <motion.div
                    key="result"
                    initial={
                      prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Direction + asset */}
                    <div className="flex items-baseline gap-3 mb-1">
                      <h2
                        className="font-['Oswald',_sans-serif] text-2xl tracking-wider uppercase"
                        style={{ color: "#2B2B2B" }}
                      >
                        {result.asset}
                      </h2>
                      <span
                        className="font-['Oswald',_sans-serif] text-sm tracking-wider uppercase px-2 py-0.5"
                        style={{
                          backgroundColor:
                            result.direction === "LONG" ? "#39FF6E" : "#D03A2B",
                          color: "#0C0C0C",
                        }}
                      >
                        {result.direction}
                      </span>
                    </div>

                    {/* Price info */}
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-mono text-sm" style={{ color: "#555" }}>
                        CURRENT: ${result.currentPrice.toLocaleString()}
                      </span>
                      <span className="font-mono text-sm" style={{ color: "#555" }}>
                        TARGET: ${result.targetPrice.toLocaleString()}
                      </span>
                      <span
                        className="font-mono text-sm"
                        style={{
                          color:
                            result.direction === "LONG" ? "#39FF6E" : "#D03A2B",
                        }}
                      >
                        CONFIDENCE: {result.confidence}%
                      </span>
                    </div>

                    {/* Divider */}
                    <div
                      className="w-full h-px mb-4"
                      style={{ backgroundColor: "#c8c0b0" }}
                    />

                    {/* Summary — half redacted */}
                    <div
                      className="font-['Special_Elite',_monospace] text-sm leading-relaxed mb-6"
                      style={{ color: "#2B2B2B" }}
                    >
                      <RedactionBar text={result.summary} />
                    </div>

                    {/* Level 2 clearance banner */}
                    <div
                      className="p-4 flex items-center gap-3"
                      style={{
                        backgroundColor: "#0C0C0C",
                        border: "1px solid rgba(208,58,43,0.3)",
                      }}
                    >
                      <div
                        className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase shrink-0"
                        style={{ color: "#D03A2B" }}
                      >
                        ████
                      </div>
                      <p
                        className="font-mono text-xs"
                        style={{ color: "rgba(233,228,216,0.5)" }}
                      >
                        FULL VERSION REQUIRES LEVEL 2 CLEARANCE. Upgrade to
                        access unredacted analysis, price targets, and confidence
                        intervals.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Empty state / selected dossier preview */}
                {!loading && !result && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {selectedDossier ? (
                      <div>
                        <div className="flex items-baseline gap-3 mb-1">
                          <h2
                            className="font-['Oswald',_sans-serif] text-2xl tracking-wider uppercase"
                            style={{ color: "#2B2B2B" }}
                          >
                            {selectedDossier.codeName}
                          </h2>
                          <span
                            className="font-mono text-xs"
                            style={{ color: "#888" }}
                          >
                            {selectedDossier.asset}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                          <span
                            className="font-mono text-xs"
                            style={{ color: "#888" }}
                          >
                            {selectedDossier.id}
                          </span>
                          <CountdownTimer
                            persistKey={selectedDossier.persistKey}
                            targetHours={selectedDossier.hoursRemaining}
                          />
                        </div>
                        <div
                          className="w-full h-px mb-4"
                          style={{ backgroundColor: "#c8c0b0" }}
                        />
                        <p
                          className="font-['Special_Elite',_monospace] text-sm leading-relaxed"
                          style={{ color: "#2B2B2B" }}
                        >
                          <RedactionBar
                            text={selectedDossier.redactedPreview}
                          />
                        </p>
                        <div
                          className="mt-6 p-3 font-mono text-xs text-center"
                          style={{
                            backgroundColor: "rgba(208,58,43,0.06)",
                            color: "#D03A2B",
                            border: "1px dashed rgba(208,58,43,0.2)",
                          }}
                        >
                          FULL DOSSIERS REQUIRE ACTIVE CLEARANCE
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div
                          className="font-['Oswald',_sans-serif] text-lg tracking-[0.2em] uppercase mb-3"
                          style={{ color: "#888" }}
                        >
                          NO DOSSIER SELECTED
                        </div>
                        <p
                          className="font-['Special_Elite',_monospace] text-sm text-center max-w-sm"
                          style={{ color: "#aaa" }}
                        >
                          Select an active dossier from the list, or task the
                          Agency with an asset to generate a new briefing.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
