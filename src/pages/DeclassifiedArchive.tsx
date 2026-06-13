import { useState, useMemo, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { dossiers } from "../data/dossiers";
import StampBadge from "../components/StampBadge";
import { updateSEO, SEO_PAGES } from "../utils/seo";

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

const ARCHIVE_DOSSIERS = dossiers.map((d) => ({
    ...d,
    chartData: generateChartData(d.issuePrice, d.currentPrice),
  }));

/* ═══════════════════════════════════════════════════════════════
   DECLASSIFIED ARCHIVE PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function DeclassifiedArchive() {
  const [filter, setFilter] = useState<FilterType>("all");

  // SEO
  useState(() => {
    updateSEO(SEO_PAGES.declassified);
  });

  const filtered = useMemo(() => {
    let list = [...ARCHIVE_DOSSIERS];

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
  const verifiedCount = ARCHIVE_DOSSIERS.filter(
    (d) => d.outcome === "VERIFIED"
  ).length;
  const totalCount = ARCHIVE_DOSSIERS.length;
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
              {ARCHIVE_DOSSIERS.filter((d) => d.outcome === "BURNED").length}{" "}
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
              onMouseEnter={(e) => {
                if (filter !== f) {
                  e.currentTarget.style.borderColor = "rgba(208,58,43,0.5)";
                  e.currentTarget.style.color = "rgba(208,58,43,0.7)";
                }
              }}
              onMouseLeave={(e) => {
                if (filter !== f) {
                  e.currentTarget.style.borderColor = "rgba(233,228,216,0.1)";
                  e.currentTarget.style.color = "rgba(233,228,216,0.4)";
                }
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
  dossier: (typeof ARCHIVE_DOSSIERS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

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
      initial={typeof window !== 'undefined' && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? { opacity: 1 } : { opacity: 0, y: 24 }}
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
