import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { dossiers } from "../data/dossiers";
import StampBadge from "../components/StampBadge";

/* ─── types ─── */

type FilterType = "all" | "verified" | "burned";

/* ─── generate chart data for each dossier ─── */

function generateChartData(issuePrice: number, currentPrice: number, points = 10) {
  const data = [];
  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const base = issuePrice + (currentPrice - issuePrice) * t;
    const noise = (Math.sin(i * 2.1) * Math.abs(currentPrice - issuePrice)) * 0.06;
    data.push({ t, price: Number((base + noise).toFixed(2)) });
  }
  return data;
}

/* ─── extended dossier list (14+ items) ─── */

const EXTENDED_DOSSIERS = [
  ...dossiers.map((d) => ({
    ...d,
    chartData: generateChartData(d.issuePrice, d.currentPrice),
  })),
  // Additional dossiers to reach 14+
  {
    id: "DSR-011",
    codeName: "GHOST LINE",
    issuedAt: "2025-06-15",
    asset: "MSFT",
    issuePrice: 440.0,
    currentPrice: 478.5,
    changePct: 8.75,
    confidence: 76,
    outcome: "VERIFIED" as const,
    summary:
      "Microsoft Copilot enterprise adoption accelerating. Revenue per user up 34% YoY across commercial cloud segment.",
    redactedSummary:
      "████████ ██████ enterprise adoption accelerating. Revenue per user up 34% YoY across commercial cloud segment.",
    readersCount: 9340,
    chartData: generateChartData(440, 478.5),
  },
  {
    id: "DSR-012",
    codeName: "IRON VEIL",
    issuedAt: "2025-06-22",
    asset: "LLY",
    issuePrice: 850.0,
    currentPrice: 798.0,
    changePct: -6.12,
    confidence: 52,
    outcome: "BURNED" as const,
    summary:
      "GLP-1 pricing pressure from generic entrants. Tirzepatide market share erosion faster than modeled.",
    redactedSummary:
      "████ pricing pressure from generic entrants. ██████████ market share erosion faster than modeled.",
    readersCount: 5120,
    chartData: generateChartData(850, 798),
  },
  {
    id: "DSR-013",
    codeName: "DUSK ANCHOR",
    issuedAt: "2025-07-01",
    asset: "GOOGL",
    issuePrice: 172.0,
    currentPrice: 191.4,
    changePct: 11.28,
    confidence: 81,
    outcome: "VERIFIED" as const,
    summary:
      "Google Search revenue resilience despite AI overview rollout. Ad click-through rates stable. Cloud backlog growing.",
    redactedSummary:
      "██████ Search revenue resilience despite AI overview rollout. Ad click-through rates stable. Cloud backlog growing.",
    readersCount: 16780,
    chartData: generateChartData(172, 191.4),
  },
  {
    id: "DSR-014",
    codeName: "ASH PROTOCOL",
    issuedAt: "2025-07-10",
    asset: "META",
    issuePrice: 485.0,
    currentPrice: 442.0,
    changePct: -8.87,
    confidence: 48,
    outcome: "BURNED" as const,
    summary:
      "Meta Reality Labs spend efficiency thesis failed. Operating losses widened despite revenue growth in core segments.",
    redactedSummary:
      "████ Reality Labs spend efficiency thesis failed. Operating losses widened despite revenue growth in core segments.",
    readersCount: 8920,
    chartData: generateChartData(485, 442),
  },
  {
    id: "DSR-015",
    codeName: "NULL RANGE",
    issuedAt: "2025-07-18",
    asset: "AMD",
    issuePrice: 155.0,
    currentPrice: 178.2,
    changePct: 14.97,
    confidence: 85,
    outcome: "VERIFIED" as const,
    summary:
      "AMD MI300X datacenter GPU revenue ramp. Hyperscaler design wins accelerating. Market share gain against incumbent expected.",
    redactedSummary:
      "████ ████████ datacenter ████ revenue ramp. ██████████ design wins accelerating. Market share gain against incumbent expected.",
    readersCount: 19450,
    chartData: generateChartData(155, 178.2),
  },
  {
    id: "DSR-016",
    codeName: "GLASS TOWER",
    issuedAt: "2025-07-25",
    asset: "JPM",
    issuePrice: 198.0,
    currentPrice: 212.5,
    changePct: 7.32,
    confidence: 70,
    outcome: "VERIFIED" as const,
    summary:
      "JPMorgan net interest income stabilization. Loan loss reserves adequate. Investment banking fee recovery in H2.",
    redactedSummary:
      "████████ net interest income stabilization. Loan loss reserves adequate. Investment banking fee recovery in H2.",
    readersCount: 7830,
    chartData: generateChartData(198, 212.5),
  },
  {
    id: "DSR-017",
    codeName: "STATIC FIELD",
    issuedAt: "2025-08-02",
    asset: "XOM",
    issuePrice: 112.0,
    currentPrice: 104.8,
    changePct: -6.43,
    confidence: 44,
    outcome: "BURNED" as const,
    summary:
      "Exxon production growth thesis offset by crude price compression. Permian basin output flat quarter over quarter.",
    redactedSummary:
      "█████ production growth thesis offset by crude price compression. ██████ basin output flat quarter over quarter.",
    readersCount: 4560,
    chartData: generateChartData(112, 104.8),
  },
];

/* ═══════════════════════════════════════════════════════════════
   DECLASSIFIED ARCHIVE PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function DeclassifiedArchive() {
  const [filter, setFilter] = useState<FilterType>("all");
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const filtered = useMemo(() => {
    let list = [...EXTENDED_DOSSIERS];

    if (filter === "verified") {
      list = list.filter((d) => d.outcome === "VERIFIED");
    } else if (filter === "burned") {
      list = list.filter((d) => d.outcome === "BURNED");
    }

    // Default sort: highest % gain first (most painful to miss = FOMO sorting)
    list.sort((a, b) => b.changePct - a.changePct);

    return list;
  }, [filter]);

  // Stats
  const verifiedCount = EXTENDED_DOSSIERS.filter(
    (d) => d.outcome === "VERIFIED"
  ).length;
  const totalCount = EXTENDED_DOSSIERS.length;
  const accuracy = ((verifiedCount / totalCount) * 100).toFixed(1);

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
            ARCHIVE
          </div>
          <h1
            className="font-['Oswald',_sans-serif] text-3xl md:text-4xl tracking-wide uppercase"
            style={{ color: "#E9E4D8" }}
          >
            Declassified Archive.
          </h1>
          <p
            className="font-['Special_Elite',_monospace] text-sm mt-2 max-w-lg"
            style={{ color: "rgba(233,228,216,0.4)" }}
          >
            Every dossier we have ever published. Sorted by what hurt most to
            miss.
          </p>
        </div>
      </header>

      {/* Stat bar */}
      <div className="px-4 md:px-8 pb-6">
        <div
          className="max-w-7xl mx-auto p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          style={{
            backgroundColor: "#111",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="font-['Special_Elite',_monospace] text-sm"
            style={{ color: "rgba(233,228,216,0.5)" }}
          >
            ACCURACY {accuracy}% (90D) &middot; {totalCount} DOSSIERS &middot;
            EVERY MISS ON RECORD.
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#39FF6E" }}
            />
            <span
              className="font-mono text-xs"
              style={{ color: "rgba(233,228,216,0.3)" }}
            >
              {verifiedCount} VERIFIED
            </span>
            <div
              className="w-2 h-2 rounded-full ml-3"
              style={{ backgroundColor: "#D03A2B" }}
            />
            <span
              className="font-mono text-xs"
              style={{ color: "rgba(233,228,216,0.3)" }}
            >
              {EXTENDED_DOSSIERS.filter((d) => d.outcome === "BURNED").length}{" "}
              BURNED
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 md:px-8 pb-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          {(["all", "verified", "burned"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-200 cursor-pointer"
              style={{
                borderColor: filter === f ? "#D03A2B" : "rgba(233,228,216,0.1)",
                color: filter === f ? "#D03A2B" : "rgba(233,228,216,0.4)",
                backgroundColor:
                  filter === f ? "rgba(208,58,43,0.06)" : "transparent",
              }}
            >
              {f === "all" ? "ALL" : f.toUpperCase()}
            </button>
          ))}
          <span
            className="font-mono text-xs ml-auto"
            style={{ color: "rgba(233,228,216,0.25)" }}
          >
            {filtered.length} RESULTS
          </span>
        </div>
      </div>

      {/* Dossier grid */}
      <div className="px-4 md:px-8 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((d, i) => (
            <DossierArchiveCard key={d.id} dossier={d} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DOSSIER ARCHIVE CARD
   ═══════════════════════════════════════════════════════════════ */

function DossierArchiveCard({
  dossier: d,
  index,
}: {
  dossier: (typeof EXTENDED_DOSSIERS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isPositive = d.changePct >= 0;
  const stampVariant =
    d.outcome === "VERIFIED"
      ? "verified" as const
      : d.outcome === "BURNED"
        ? "burned" as const
        : "pending" as const;

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{
        backgroundColor: "#E9E4D8",
        boxShadow: "2px 3px 12px rgba(0,0,0,0.18)",
      }}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      {/* Classification strip */}
      <div
        className="px-4 py-1.5 flex items-center justify-between"
        style={{ backgroundColor: "#D03A2B" }}
      >
        <span className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] text-white uppercase">
          DECLASSIFIED
        </span>
        <span className="font-mono text-xs text-white/70">{d.id}</span>
      </div>

      <div className="p-4">
        {/* Code name + date */}
        <div className="flex items-baseline justify-between mb-1">
          <h3
            className="font-['Oswald',_sans-serif] text-base tracking-wider uppercase"
            style={{ color: "#2B2B2B" }}
          >
            {d.codeName}
          </h3>
          <span className="font-mono text-xs" style={{ color: "#888" }}>
            {d.issuedAt}
          </span>
        </div>

        {/* Asset + price */}
        <div className="flex items-center gap-2 mb-2">
          <span
            className="font-['Oswald',_sans-serif] text-sm tracking-wide"
            style={{ color: "#2B2B2B" }}
          >
            {d.asset}
          </span>
          <span className="font-mono text-xs" style={{ color: "#555" }}>
            ${d.issuePrice.toLocaleString()} →{" "}
            <span style={{ color: isPositive ? "#39FF6E" : "#D03A2B" }}>
              ${d.currentPrice.toLocaleString()}
            </span>
          </span>
        </div>

        {/* Mini chart */}
        <div
          className="mb-3 p-2"
          style={{
            backgroundColor: "#0C0C0C",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        >
          <ResponsiveContainer width="100%" height={60}>
            <LineChart data={d.chartData}>
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPositive ? "#39FF6E" : "#D03A2B"}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <p
          className="font-['Special_Elite',_monospace] text-xs leading-relaxed mb-3"
          style={{ color: "#2B2B2B" }}
        >
          {d.summary}
        </p>

        {/* Footer: stamp + change + readers */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StampBadge label={d.outcome} variant={stampVariant} size="sm" />
            <span
              className="font-mono text-xs font-bold"
              style={{ color: isPositive ? "#39FF6E" : "#D03A2B" }}
            >
              {isPositive ? "+" : ""}
              {d.changePct}%
            </span>
          </div>
          <span className="font-mono text-xs" style={{ color: "#888" }}>
            {d.readersCount.toLocaleString()} readers
          </span>
        </div>
      </div>

      {/* Watermark */}
      <div
        className="absolute bottom-3 right-3 font-['Oswald',_sans-serif] text-lg tracking-[0.15em] uppercase pointer-events-none select-none"
        style={{
          color: "rgba(208,58,43,0.08)",
          transform: "rotate(-12deg)",
        }}
        aria-hidden="true"
      >
        DECLASSIFIED
      </div>
    </motion.div>
  );
}
