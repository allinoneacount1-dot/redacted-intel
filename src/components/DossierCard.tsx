import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Dossier } from "../data/dossiers";
import RedactionBar from "./RedactionBar";
import StampBadge from "./StampBadge";
import CountdownTimer from "./CountdownTimer";

type CardVariant = "redacted" | "declassified" | "hero";

interface DossierCardProps {
  dossier: Dossier;
  variant?: CardVariant;
}

const outcomeVariant = {
  VERIFIED: "verified" as const,
  BURNED: "burned" as const,
  PENDING: "pending" as const,
};

function PaperclipSVG() {
  return (
    <svg
      width="24"
      height="48"
      viewBox="0 0 24 48"
      fill="none"
      className="absolute -top-3 right-6 z-20"
      aria-hidden="true"
    >
      <path
        d="M8 6C8 3.79 9.79 2 12 2C14.21 2 16 3.79 16 6V30C16 33.31 13.31 36 10 36C6.69 36 4 33.31 4 30V14"
        stroke="#888"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function PunchHole({ top }: { top: string }) {
  return (
    <div
      className="absolute left-4 w-5 h-5 rounded-full border border-[#c8c0b0]"
      style={{
        top,
        backgroundColor: "#0C0C0C",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)",
      }}
      aria-hidden="true"
    />
  );
}

function CoffeeRing() {
  return (
    <div
      className="absolute bottom-12 right-8 w-16 h-16 rounded-full pointer-events-none opacity-10"
      style={{
        border: "2px solid #8B7355",
        background:
          "radial-gradient(circle, transparent 55%, rgba(139,115,85,0.15) 60%, rgba(139,115,85,0.05) 70%, transparent 75%)",
      }}
      aria-hidden="true"
    />
  );
}

export default function DossierCard({
  dossier,
  variant = "redacted",
}: DossierCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const rotation = variant === "hero" ? 0 : (parseInt(dossier.id.slice(-1)) % 3) - 1;
  const isRedacted = variant === "redacted";
  const isPending = dossier.outcome === "PENDING";

  const displayText = isRedacted ? dossier.redactedSummary : dossier.summary;

  const changeColor =
    dossier.changePct >= 0 ? "#39FF6E" : "#D03A2B";

  return (
    <motion.div
      ref={ref}
      className="relative"
      style={{
        backgroundColor: "#E9E4D8",
        transform: `rotate(${rotation}deg)`,
        boxShadow: "2px 3px 12px rgba(0,0,0,0.18)",
      }}
      initial={
        prefersReducedMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 30 }
      }
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <PaperclipSVG />
      <PunchHole top="12px" />
      <PunchHole top="28px" />
      <CoffeeRing />

      {/* Classification header strip */}
      <div
        className="px-5 py-2 flex items-center justify-between"
        style={{ backgroundColor: "#D03A2B" }}
      >
        <span className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] text-white uppercase">
          TOP SECRET
        </span>
        <span className="font-mono text-xs text-white/70">
          {dossier.id}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 pt-4">
        {/* Code name */}
        <div className="flex items-baseline gap-3 mb-1">
          <h3
            className="font-['Oswald',_sans-serif] text-xl tracking-wider uppercase"
            style={{ color: "#2B2B2B" }}
          >
            {dossier.codeName}
          </h3>
          <span className="font-mono text-xs" style={{ color: "#888" }}>
            {dossier.issuedAt}
          </span>
        </div>

        {/* Asset and price */}
        <div className="flex items-center gap-4 mb-3">
          <span
            className="font-['Oswald',_sans-serif] text-lg tracking-wide"
            style={{ color: "#2B2B2B" }}
          >
            {dossier.asset}
          </span>
          <span className="font-mono text-sm" style={{ color: "#555" }}>
            ${dossier.issuePrice.toLocaleString()} →{" "}
            <span style={{ color: changeColor }}>
              ${dossier.currentPrice.toLocaleString()}
            </span>
          </span>
          <span className="font-mono text-sm" style={{ color: changeColor }}>
            {dossier.changePct >= 0 ? "+" : ""}
            {dossier.changePct}%
          </span>
        </div>

        {/* Summary */}
        <div
          className="font-['Special_Elite',_monospace] text-sm leading-relaxed mb-4"
          style={{ color: "#2B2B2B" }}
        >
          {isRedacted ? (
            <RedactionBar text={displayText} />
          ) : (
            displayText
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StampBadge
              label={dossier.outcome}
              variant={outcomeVariant[dossier.outcome]}
              size="sm"
            />
            {isPending && (
              <CountdownTimer
                persistKey={`dossier-${dossier.id}-countdown`}
                targetHours={72}
              />
            )}
          </div>
          <span className="font-mono text-xs" style={{ color: "#888" }}>
            {dossier.readersCount.toLocaleString()} readers
          </span>
        </div>
      </div>

      {/* TOP SECRET watermark stamp */}
      <div
        className="absolute bottom-4 right-4 font-['Oswald',_sans-serif] text-2xl tracking-[0.2em] uppercase pointer-events-none select-none"
        style={{
          color: "rgba(208,58,43,0.12)",
          transform: "rotate(-12deg)",
        }}
        aria-hidden="true"
      >
        TOP SECRET
      </div>
    </motion.div>
  );
}
