import { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import WarningGate from "../components/WarningGate";
import Navbar from "../components/Navbar";
import DossierCard from "../components/DossierCard";
import InterceptFeed from "../components/InterceptFeed";
import ClearanceCard from "../components/ClearanceCard";
import AgentTicker from "../components/AgentTicker";
import CountdownTimer from "../components/CountdownTimer";
import StampBadge from "../components/StampBadge";

import { interceptFeed } from "../data/intercepts";
import WaitlistModal from "../components/WaitlistModal";
import Toast from "../components/Toast";
import type { ToastType } from "../components/Toast";

import { agentActivity } from "../data/activity";
import { useLivePrice, getLivePriceForSymbol } from "../hooks/useLivePrice";
import { updateSEO, SEO_PAGES } from "../utils/seo";
 
/* ─── helpers ─── */

function usePrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/* ─── mock price-line data for the 3 declassified dossiers ─── */

function generatePriceData(startPrice: number, endPrice: number, points = 12) {
  const data = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const base = startPrice + (endPrice - startPrice) * t;
    const noise = (Math.sin(i * 1.7) * (endPrice - startPrice)) * 0.08;
    data.push({
      t: i,
      price: Number((base + noise).toFixed(2)),
    });
  }
  return data;
}

const DECLASSIFIED_THREE = [
  {
    id: "2026-0609-A",
    codeName: "SILENT VECTOR",
    asset: "BTC",
    issuePrice: 91400.0,
    currentPrice: 97214.0,
    changePct: 6.4,
    outcome: "VERIFIED" as const,
    summary:
      "Three dormant wallets, silent since 2021, absorbed 14,200 BTC across 48 hours using sub-threshold orders designed to evade exchange surveillance. Identical execution fingerprint last observed 11 days before the March rally. Funding rates remain neutral — the crowd has not noticed. Assessment: accumulation phase, late stage. Expected repricing window: 9–14 days.",
    redactedSummary:
      "Three dormant wallets, silent since ████, absorbed ██,███ BTC across 48 hours using ████████████ orders designed to evade exchange surveillance. Identical execution fingerprint last observed ██ days before the ████ rally. Assessment: ████████ phase, ████ stage. Expected repricing window: █–██ days.",
    readersCount: 2417,
    chartData: generatePriceData(91400, 97214),
  },
  {
    id: "2026-0610-A",
    codeName: "THE TIDE GAUGE",
    asset: "ETH",
    issuePrice: 3540.0,
    currentPrice: 3891.0,
    changePct: 9.9,
    outcome: "VERIFIED" as const,
    summary:
      "Stablecoin inflows to spot exchanges hit a 60-day high while ETH exchange reserves fell to a 2-year low. Dry powder is loading against shrinking supply. Options desks are pricing calm; on-chain disagrees. When dealers are wrong, the unwind is fuel. Assessment: upside dislocation within 5 sessions.",
    redactedSummary:
      "Stablecoin inflows to spot exchanges hit a 60-day high while ████ exchange reserves fell to a 2-year low. Dry powder is loading against shrinking supply. Options desks are pricing calm; on-chain disagrees. Assessment: upside dislocation within 5 sessions.",
    readersCount: 2389,
    chartData: generatePriceData(3540, 3891),
  },
  {
    id: "2026-0611-A",
    codeName: "INSIDER CLOCK",
    asset: "SOL",
    issuePrice: 87.0,
    currentPrice: 270.0,
    changePct: 212.0,
    outcome: "VERIFIED" as const,
    summary:
      "Token unlock scheduled in 6 days, yet insider wallets are buying, not hedging — 14 wallets linked to the founding team added 2.1% of supply via OTC. Insiders buying their own unlock is the rarest signal in this market. They know what ships. Assessment: announcement-grade catalyst before unlock date.",
    redactedSummary:
      "Token unlock scheduled in 6 days, yet insider wallets are buying, not hedging — 14 wallets linked to the founding team added 2.1% of supply via OTC. Insiders buying their own unlock is the rarest signal in this market. Assessment: announcement-grade catalyst before unlock date.",
    readersCount: 2440,
    chartData: generatePriceData(87, 270),
  },
];

/* ─── hero dossier (2026-0612-A) ─── */

const HERO_DOSSIER = {
  id: "DSR-HERO",
  codeName: "PALE HORIZON",
  issuedAt: "2026-06-12",
  asset: "BTC",
  assetName: "Bitcoin",
  issuePrice: 71200.0,
  currentPrice: 68400.0,
  changePct: -3.93,
  confidence: 54,
  outcome: "PENDING" as const,
  summary:
    "Bitcoin accumulation thesis post-halving. Institutional ETF inflows expected to offset miner sell pressure within 90 days.",
  redactedSummary:
    "██████ accumulation thesis post-halving. Institutional ████ inflows expected to offset ████ sell pressure within 90 days.",
  readersCount: 22105,
};

/* ─── memo cards data ─── */

const MEMO_CARDS = [
  {
    id: "collection",
    title: "COLLECTION",
    body: "Signals are intercepted from on-chain data, dark pools, satellite imagery, and human intelligence networks. Every datum is time-stamped, source-tagged, and assigned a reliability score before entering the pipeline.",
  },
  {
    id: "analysis",
    title: "ANALYSIS",
    body: "Raw signals undergo multi-layer analysis. Pattern recognition models cross-reference against historical precedents. Confidence scores are calculated. Only dossiers scoring above 50% proceed to distribution.",
  },
  {
    id: "distribution",
    title: "DISTRIBUTION",
    body: "Cleared agents receive dossiers according to their clearance level. Level 1 gets summaries. Level 2 gets full analysis. Level 3 gets raw intercepts. Timing is everything. A signal delivered too late is history.",
  },
];

/* ─── clearance tiers ─── */

const CLEARANCE_TIERS = [
  {
    level: 1 as const,
    title: "FIELD AGENT",
    price: "FREE",
    features: [
      "Declassified dossier archive",
      "Weekly intelligence summary",
      "Public intercept feed",
      "Community briefing room",
    ],
  },
  {
    level: 2 as const,
    title: "CASE OFFICER",
    price: "$39/mo",
    features: [
      "Full active dossiers (unredacted)",
      "Real-time intercept stream",
      "Price targets and confidence scores",
      "Briefing Room access",
      "72-hour early declassification",
    ],
    seatCount: 47,
    seatTotal: 200,
    highlighted: true,
  },
  {
    level: 3 as const,
    title: "STATION CHIEF",
    price: "$179/mo",
    features: [
      "Everything in Case Officer",
      "Raw intercept data feeds",
      "Direct analyst communication",
      "Custom dossier requests",
      "Priority declassification",
      "Annual intelligence retrospective",
    ],
  },
];

/* ─── custom chart tooltip ─── */

function ChartTooltip({ active, payload, }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-2 py-1 font-mono text-xs"
      style={{ backgroundColor: "#0C0C0C", color: "#39FF6E", border: "1px solid #333" }}
    >
      ${payload[0].value.toLocaleString()}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const [gateDismissed, setGateDismissed] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistLevel, setWaitlistLevel] = useState<1 | 2 | 3 | null>(null);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Live prices from CoinGecko
  const { prices: livePrices, lastUpdated, isLive } = useLivePrice();

  // SEO
  useState(() => {
    updateSEO(SEO_PAGES.home);
  });
 
  const openWaitlist = useCallback((level?: 1 | 2 | 3) => {
    setWaitlistLevel(level ?? null);
    setWaitlistOpen(true);
  }, []);
 
 
  if (!gateDismissed) {
    return <WarningGate onProceed={() => setGateDismissed(true)} />;
  }

  return (
    <div style={{ backgroundColor: "#0C0C0C", minHeight: "100vh" }}>
      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
        preselectedLevel={waitlistLevel}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={4000}
          onClose={() => setToast(null)}
        />
      )}
 
      {/* B. Red scrolling top bar */}
      <RedactionTopBar />

      {/* C. Navbar */}
      <Navbar />

      {/* D. Hero */}
      <HeroSection onRequestClearance={openWaitlist} />

      {/* E. Declassified — The Receipts */}
      <DeclassifiedSection prefersReduced={prefersReduced} livePrices={livePrices} isLive={isLive} lastUpdated={lastUpdated} />

      {/* F. Live Intercepts */}
      <LiveInterceptsSection />

      {/* G. How the Agency Works */}
      <HowItWorksSection />

      {/* H. Clearance */}
      <ClearanceSection onRequestClearance={openWaitlist} />

      {/* I. Agent Activity ticker */}
      <AgentActivityStrip />

      {/* J. Final CTA */}
      <FinalCTASection onRequestClearance={() => openWaitlist()} />

      {/* K. Footer */}
      <FooterSection />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   B. RED SCROLLING TOP BAR
   ═══════════════════════════════════════════════════════════════ */

function RedactionTopBar() {
  const items = [
    "ACTIVE DOSSIERS: 7",
    "///",
    "NEXT DECLASSIFICATION:",
    "—",
    "///",
    "CLEARANCE SEATS: 47/200",
    "///",
    "ACTIVE DOSSIERS: 7",
    "///",
    "NEXT DECLASSIFICATION:",
    "—",
    "///",
    "CLEARANCE SEATS: 47/200",
    "///",
  ];

  return (
    <div
      className="fixed top-14 left-0 right-0 z-30 overflow-hidden"
      style={{
        backgroundColor: "#D03A2B",
        height: "32px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="inline-flex items-center gap-6 whitespace-nowrap font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase"
        style={{
          color: "#fff",
          animation: "ticker-scroll 18s linear infinite",
        }}
      >
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-6">
            {item === "—" ? (
              <span>
                <CountdownTimer
                  persistKey="next-declass-countdown"
                  targetHours={4}
                />
              </span>
            ) : (
              item
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   D. HERO SECTION
   ═══════════════════════════════════════════════════════════════ */

function HeroSection({ onRequestClearance }: { onRequestClearance: (level?: 1 | 2 | 3) => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center px-4 md:px-8 pt-32 pb-20 md:pb-28"
      style={{ minHeight: "100vh" }}
      aria-="Hero"
    >
      {/* Background grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(233,228,216,1) 1px, transparent 1px), linear-gradient(90deg, rgba(233,228,216,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: headline + subtext + CTAs */}
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div
            className="font-mono text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: "rgba(233,228,216,0.4)" }}
          >
            CLASSIFIED INTELLIGENCE NETWORK
          </div>

          <h1
            className="font-['Oswald',_sans-serif] text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase leading-[1.1] mb-6"
            style={{ color: "#E9E4D8" }}
          >
            RIGHT NOW, 2,400 PEOPLE ARE READING SOMETHING YOU CAN&apos;T.
          </h1>

          <p
            className="font-['Special_Elite',_monospace] text-base md:text-lg leading-relaxed mb-8 max-w-lg"
            style={{ color: "rgba(233,228,216,0.55)" }}
          >
            Every week, the Agency publishes dossiers on assets before the
            market moves. Verified intelligence. Tracked outcomes. Every miss
            on record. This is not a newsletter. This is an operation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              className="inline-flex items-center justify-center font-['Oswald',_sans-serif] text-sm tracking-[0.2em] uppercase px-8 py-3.5 border-2 transition-colors duration-200 cursor-pointer"
              style={{ borderColor: "#D03A2B", color: "#D03A2B" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#D03A2B";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#D03A2B";
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onRequestClearance()}
            >
              REQUEST CLEARANCE
            </motion.button>
            <motion.button
             className="inline-flex items-center justify-center font-['Oswald',_sans-serif] text-sm tracking-[0.2em] uppercase px-8 py-3.5 border transition-colors duration-200 cursor-pointer"
             style={{
               borderColor: "rgba(233,228,216,0.2)",
               color: "rgba(233,228,216,0.6)",
             }}
             onMouseEnter={(e) => {
               e.currentTarget.style.borderColor = "#E9E4D8";
               e.currentTarget.style.color = "#E9E4D8";
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.borderColor = "rgba(233,228,216,0.2)";
               e.currentTarget.style.color = "rgba(233,228,216,0.6)";
             }}
             whileTap={{ scale: 0.97 }}
             onClick={() => {
               document.getElementById("declassified")?.scrollIntoView({ behavior: "smooth" });
             }}
            >
             VIEW DECLASSIFIED
            </motion.button>
          </div>
        </motion.div>

        {/* Right: floating hero dossier card */}
        <motion.div
          className="hidden lg:flex justify-center"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div
            animate={
              prefersReduced
                ? {}
                : { y: [0, -8, 0] }
            }
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <DossierCard dossier={HERO_DOSSIER} variant="hero" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={prefersReduced ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div
          className="w-px h-12 mx-auto"
          style={{ backgroundColor: "rgba(233,228,216,0.15)" }}
        />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   E. DECLASSIFIED — THE RECEIPTS
   ═══════════════════════════════════════════════════════════════ */

function DeclassifiedSection({ prefersReduced, livePrices, isLive, lastUpdated }: { prefersReduced: boolean; livePrices: Record<string, { price: number; change24h: number }>; isLive: boolean; lastUpdated: Date | null }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="declassified"
      ref={ref}
      className="relative px-4 md:px-8 py-24 md:py-32"
      style={{ backgroundColor: "#111" }}
      aria-="Declassified dossiers"
    >
      <div className="max-w-7xl w-full mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-16"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div
            className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "#D03A2B" }}
          >
            DECLASSIFIED
          </div>
          <h2
            className="font-['Oswald',_sans-serif] text-3xl md:text-4xl tracking-wide uppercase"
            style={{ color: "#E9E4D8" }}
          >
            The Receipts.
          </h2>
          <p
            className="font-['Special_Elite',_monospace] text-sm mt-3 max-w-xl"
            style={{ color: "rgba(233,228,216,0.45)" }}
          >
            Every dossier we publish is tracked. Every outcome is recorded.
            Here are the ones that already resolved.
          </p>
          {isLive && lastUpdated && (
            <div className="flex items-center gap-2 mt-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "#39FF6E" }}
              />
              <span
                className="font-mono text-xs"
                style={{ color: "rgba(57,255,110,0.6)" }}
              >
                LIVE PRICES · UPDATED {lastUpdated.toLocaleTimeString()}
              </span>
            </div>
          )}
        </motion.div>

        {/* 3 dossier cards with charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {DECLASSIFIED_THREE.map((d, i) => (
            <motion.div
              key={d.id}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {/* Card */}
              <div
                className="relative p-5 mb-4"
                style={{
                  backgroundColor: "#E9E4D8",
                  boxShadow: "2px 3px 12px rgba(0,0,0,0.18)",
                }}
              >
                {/* Classification strip */}
                <div
                  className="px-4 py-1.5 flex items-center justify-between -mx-5 -mt-5 mb-4"
                  style={{ backgroundColor: "#D03A2B" }}
                >
                  <span className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] text-white uppercase">
                    DECLASSIFIED
                  </span>
                  <span className="font-mono text-xs text-white/70">
                    {d.id}
                  </span>
                </div>

                {/* Code name */}
                <h3
                  className="font-['Oswald',_sans-serif] text-lg tracking-wider uppercase mb-1"
                  style={{ color: "#2B2B2B" }}
                >
                  {d.codeName}
                </h3>

                {/* Asset + price */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span
                    className="font-['Oswald',_sans-serif] text-base tracking-wide"
                    style={{ color: "#2B2B2B" }}
                  >
                    {d.asset}
                  </span>
                  <span className="font-mono text-xs" style={{ color: "#555" }}>
                    ${d.issuePrice.toLocaleString()} →{" "}
                    <span
                      style={{ color: d.changePct >= 0 ? "#39FF6E" : "#D03A2B" }}
                    >
                      ${d.currentPrice.toLocaleString()}
                    </span>
                  </span>
                  {(() => {
                    const live = getLivePriceForSymbol(livePrices, d.asset);
                    if (!live || !isLive) return null;
                    return (
                      <span
                        className="font-['Oswald',_sans-serif] text-[10px] tracking-[0.15em] uppercase px-1.5 py-0.5"
                        style={{ backgroundColor: "rgba(57,255,110,0.12)", color: "#39FF6E", border: "1px solid rgba(57,255,110,0.25)" }}
                      >
                        LIVE ${live.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    );
                  })()}
                </div>

                {/* Summary */}
                <p
                  className="font-['Special_Elite',_monospace] text-xs leading-relaxed mb-3"
                  style={{ color: "#2B2B2B" }}
                >
                  {d.summary}
                </p>

                {/* Outcome stamp */}
                <div className="flex items-center justify-between">
                  <StampBadge
                    label={d.outcome}
                    variant={d.outcome === "VERIFIED" ? "verified" : "burned"}
                    size="sm"
                  />
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: d.changePct >= 0 ? "#39FF6E" : "#D03A2B" }}
                  >
                    {d.changePct >= 0 ? "+" : ""}
                    {d.changePct}%
                  </span>
                </div>
              </div>

              {/* Mini price chart */}
              <div
                className="p-3"
                style={{
                  backgroundColor: "#0C0C0C",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <ResponsiveContainer width="100%" height={80}>
                  <LineChart data={d.chartData}>
                    <XAxis dataKey="t" hide />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={d.changePct >= 0 ? "#39FF6E" : "#D03A2B"}
                      strokeWidth={1.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer line */}
        <motion.div
          className="text-center"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p
            className="font-['Special_Elite',_monospace] text-sm"
            style={{ color: "rgba(233,228,216,0.35)" }}
          >
            2,417 cleared agents read this 72 hours before you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   F. LIVE INTERCEPTS
   ═══════════════════════════════════════════════════════════════ */

function LiveInterceptsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = usePrefersReducedMotion();

  const interceptLines = interceptFeed;

  return (
    <section
      id="intercepts"
      ref={ref}
      className="relative px-4 md:px-8 py-24 md:py-32"
      style={{ backgroundColor: "#0C0C0C" }}
      aria-="Live intercepts"
    >
      <div className="max-w-7xl w-full mx-auto">
        <motion.div
          className="mb-10"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div
            className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "#39FF6E" }}
          >
            LIVE
          </div>
          <h2
            className="font-['Oswald',_sans-serif] text-3xl md:text-4xl tracking-wide uppercase"
            style={{ color: "#E9E4D8" }}
          >
            Live Intercepts.
          </h2>
        </motion.div>

        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              border: "1px solid rgba(57,255,110,0.1)",
              borderRadius: "2px",
            }}
          >
            {/* CRT panel header */}
            <div
              className="flex items-center gap-2 px-4 py-2"
              style={{
                backgroundColor: "rgba(57,255,110,0.04)",
                borderBottom: "1px solid rgba(57,255,110,0.08)",
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: "#39FF6E" }}
              />
              <span
                className="font-mono text-xs tracking-wider"
                style={{ color: "rgba(57,255,110,0.5)" }}
              >
                INTERCEPT FEED — ENCRYPTED CHANNEL 7
              </span>
            </div>

            <InterceptFeed lines={interceptLines} speed={40} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   G. HOW THE AGENCY WORKS
   ═══════════════════════════════════════════════════════════════ */

function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="relative px-4 md:px-8 py-24 md:py-32"
      style={{ backgroundColor: "#111" }}
      aria-="How the Agency works"
    >
      <div className="max-w-7xl w-full mx-auto">
        <motion.div
          className="mb-14"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div
            className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "rgba(233,228,216,0.4)" }}
          >
            OPERATIONS
          </div>
          <h2
            className="font-['Oswald',_sans-serif] text-3xl md:text-4xl tracking-wide uppercase"
            style={{ color: "#E9E4D8" }}
          >
            How the Agency Works.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MEMO_CARDS.map((card, i) => (
            <motion.article
              key={card.id}
              className="relative p-6"
              style={{
                backgroundColor: "#E9E4D8",
                boxShadow: "2px 3px 12px rgba(0,0,0,0.12)",
              }}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.12 }}
            >
              {/* Memo header */}
              <div
                className="px-4 py-1.5 -mx-6 -mt-6 mb-5 flex items-center justify-between"
                style={{ backgroundColor: "#2B2B2B" }}
              >
                <span className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] text-white uppercase">
                  MEMO
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {String(i + 1).padStart(2, "0")}/03
                </span>
              </div>

              <h3
                className="font-['Oswald',_sans-serif] text-xl tracking-wider uppercase mb-3"
                style={{ color: "#2B2B2B" }}
              >
                {card.title}
              </h3>

              <p
                className="font-['Special_Elite',_monospace] text-sm leading-relaxed"
                style={{ color: "#555" }}
              >
                {card.body}
              </p>

              {/* Classification footer */}
              <div
                className="mt-5 pt-3 font-mono text-xs"
                style={{
                  borderTop: "1px dashed #c8c0b0",
                  color: "#aaa",
                }}
              >
                CLASSIFICATION: INTERNAL USE ONLY
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   H. CLEARANCE
   ═══════════════════════════════════════════════════════════════ */

function ClearanceSection({ onRequestClearance }: { onRequestClearance: (level: 1 | 2 | 3) => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      id="clearance"
      ref={ref}
      className="relative px-4 md:px-8 py-24 md:py-32"
      style={{ backgroundColor: "#0C0C0C" }}
      aria-="Clearance levels"
    >
      <div className="max-w-7xl w-full mx-auto">
        <motion.div
          className="mb-14"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div
            className="font-mono text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "#D03A2B" }}
          >
            ACCESS LEVELS
          </div>
          <h2
            className="font-['Oswald',_sans-serif] text-3xl md:text-4xl tracking-wide uppercase"
            style={{ color: "#E9E4D8" }}
          >
            Clearance.
          </h2>
          <p
            className="font-['Special_Elite',_monospace] text-sm mt-3 max-w-xl"
            style={{ color: "rgba(233,228,216,0.45)" }}
          >
            Choose your level of access. Each tier unlocks deeper layers of
            intelligence. Once you&apos;re in, there is no going back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {CLEARANCE_TIERS.map((tier, i) => (
            <motion.div
              key={tier.level}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: i * 0.12 }}
            >
              <ClearanceCard
                level={tier.level}
                title={tier.title}
                price={tier.price}
                features={tier.features}
                seatCount={tier.seatCount}
                seatTotal={tier.seatTotal}
                highlighted={tier.highlighted}
                onRequestClearance={onRequestClearance}
                />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   I. AGENT ACTIVITY TICKER STRIP
   ═══════════════════════════════════════════════════════════════ */

function AgentActivityStrip() {
  const tickerItems = agentActivity;

  return (
    <div
      className="py-4 overflow-hidden"
      style={{
        backgroundColor: "#0a0a0a",
        borderTop: "1px solid rgba(57,255,110,0.06)",
        borderBottom: "1px solid rgba(57,255,110,0.06)",
      }}
    >
      <AgentTicker items={tickerItems} speed={35} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   J. FINAL CTA
   ═══════════════════════════════════════════════════════════════ */

function FinalCTASection({ onRequestClearance }: { onRequestClearance: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = usePrefersReducedMotion();

  return (
    <section
      ref={ref}
      className="relative px-4 md:px-8 py-24 md:py-32"
      style={{ backgroundColor: "#111" }}
      aria-="Final call to action"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Typewritten quote */}
          <div
            className="font-['Special_Elite',_monospace] text-lg md:text-xl leading-relaxed mb-8 mx-auto max-w-2xl"
            style={{ color: "rgba(233,228,216,0.5)" }}
          >
            &ldquo;The market will be told what it needs to know, when it
            needs to know it. We decide the timing. We decide the framing. We
            decide what remains buried.&rdquo;
          </div>

          <div
            className="w-12 h-px mx-auto mb-8"
            style={{ backgroundColor: "rgba(208,58,43,0.4)" }}
          />

          <h2
            className="font-['Oswald',_sans-serif] text-3xl md:text-5xl tracking-wide uppercase mb-4"
            style={{ color: "#E9E4D8" }}
          >
            REQUEST CLEARANCE
          </h2>

          <p
            className="font-['Special_Elite',_monospace] text-sm mb-8"
            style={{ color: "rgba(233,228,216,0.35)" }}
          >
            Next declassification in:{" "}
            <CountdownTimer persistKey="final-cta-countdown" targetHours={4} />
          </p>

          <motion.button
            className="inline-flex items-center justify-center font-['Oswald',_sans-serif] text-sm tracking-[0.2em] uppercase px-10 py-4 border-2 transition-colors duration-200 cursor-pointer"
            style={{ borderColor: "#D03A2B", color: "#D03A2B" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D03A2B";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#D03A2B";
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onRequestClearance()}
          >
            REQUEST CLEARANCE
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   K. FOOTER
   ═══════════════════════════════════════════════════════════════ */

function FooterSection() {
  return (
    <footer
      className="px-4 md:px-8 py-12"
      style={{
        backgroundColor: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.04)",
      }}
      role="contentinfo"
    >
      <div className="max-w-7xl w-full mx-auto">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div
            className="font-['Oswald',_sans-serif] text-sm tracking-[0.25em] uppercase"
            style={{ color: "rgba(233,228,216,0.3)" }}
          >
            [REDACTED]
          </div>

          <div className="flex items-center gap-6">
            <Link
              to="/declassified"
              className="font-mono text-xs tracking-wider uppercase"
              style={{ color: "rgba(233,228,216,0.3)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#E9E4D8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(233,228,216,0.3)";
              }}
            >
              Declassified
            </Link>
            <Link
              to="/briefing"
              className="font-mono text-xs tracking-wider uppercase"
              style={{ color: "rgba(233,228,216,0.3)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#E9E4D8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(233,228,216,0.3)";
              }}
            >
              Clearance
            </Link>
            <Link
              to="/agency"
              className="font-mono text-xs tracking-wider uppercase"
              style={{ color: "rgba(233,228,216,0.3)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#E9E4D8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(233,228,216,0.3)";
              }}
            >
              The Agency
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-6"
          style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
        />

        {/* Disclaimer */}
        <div
          className="font-mono text-xs leading-relaxed max-w-2xl"
          style={{ color: "rgba(233,228,216,0.2)" }}
        >
          <p className="mb-2">
            DISCLAIMER: [REDACTED] is an intelligence simulation platform. All
            dossiers, intercepts, and agent activity depicted on this site are
            fictional constructs for demonstration purposes only.
          </p>
          <p className="mb-2">
            No financial advice is being offered. No actual securities are being
            recommended. All price data, outcomes, and performance metrics are
            simulated. Past simulated performance does not guarantee future
            simulated results.
          </p>
          <p>
            CLASSIFICATION: UNCLASSIFIED // FOR DEMONSTRATION ONLY // DISTRIBUTION
            UNLIMITED
          </p>
        </div>

        {/* Bottom line */}
        <div className="mt-8 flex items-center justify-between">
          <span
            className="font-mono text-xs"
            style={{ color: "rgba(233,228,216,0.1)" }}
          >
            {new Date().getFullYear()} [REDACTED]. ALL RIGHTS RESERVED.
          </span>
          <span
            className="font-mono text-xs"
            style={{ color: "rgba(233,228,216,0.1)" }}
          >
            DOCUMENT FOOTER — PAGE 1 OF 1
          </span>
        </div>
      </div>
    </footer>
  );
}
