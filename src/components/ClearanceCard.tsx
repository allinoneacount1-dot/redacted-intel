import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ClearanceCardProps {
  level: 1 | 2 | 3;
  title: string;
  price: string;
  features: string[];
  seatCount?: number;
  seatTotal?: number;
  highlighted?: boolean;
}

export default function ClearanceCard({
  level,
  title,
  price,
  features,
  seatCount,
  seatTotal,
  highlighted = false,
}: ClearanceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isLevel2 = level === 2;
  const seatRatio =
    seatCount !== undefined && seatTotal !== undefined
      ? seatCount / seatTotal
      : 0;

  return (
    <motion.div
      ref={ref}
      className="relative p-6"
      style={{
        backgroundColor: "#E9E4D8",
        boxShadow: highlighted
          ? "0 0 0 2px #D03A2B, 4px 6px 20px rgba(0,0,0,0.2)"
          : "2px 3px 12px rgba(0,0,0,0.12)",
        transform: highlighted ? "rotate(-0.5deg)" : "rotate(0.5deg)",
      }}
      initial={
        prefersReducedMotion
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 24 }
      }
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {/* EYES ONLY stamp for level 2 */}
      {isLevel2 && (
        <div
          className="absolute -top-3 -right-3 z-10 font-['Oswald',_sans-serif] text-sm tracking-[0.25em] uppercase px-3 py-1 border-2"
          style={{
            color: "#D03A2B",
            borderColor: "#D03A2B",
            transform: "rotate(8deg)",
            opacity: 0.85,
          }}
        >
          EYES ONLY
        </div>
      )}

      {/* Level indicator */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] uppercase"
          style={{ color: "#888" }}
        >
          LEVEL {level}
        </span>
        {highlighted && (
          <span
            className="font-['Oswald',_sans-serif] text-xs tracking-wider uppercase px-2 py-0.5"
            style={{ backgroundColor: "#D03A2B", color: "#fff" }}
          >
            ACTIVE
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className="font-['Oswald',_sans-serif] text-2xl tracking-wider uppercase mb-1"
        style={{ color: "#2B2B2B" }}
      >
        {title}
      </h3>

      {/* Price */}
      <div className="font-['Special_Elite',_monospace] text-3xl mb-4" style={{ color: "#2B2B2B" }}>
        {price}
      </div>

      {/* Divider */}
      <div
        className="w-full h-px mb-4"
        style={{ backgroundColor: "#c8c0b0" }}
      />

      {/* Features */}
      <ul className="space-y-2 mb-5">
        {features.map((feature, i) => (
          <li
            key={i}
            className="font-['Special_Elite',_monospace] text-sm flex items-start gap-2"
            style={{ color: "#2B2B2B" }}
          >
            <span style={{ color: "#888" }} className="mt-0.5">
              ─
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* Seat counter for level 2 */}
      {isLevel2 && seatCount !== undefined && seatTotal !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between font-mono text-xs mb-1" style={{ color: "#555" }}>
            <span>SEATS REMAINING</span>
            <span>
              {seatCount}/{seatTotal}
            </span>
          </div>
          <div
            className="w-full h-2 overflow-hidden"
            style={{ backgroundColor: "#d0c8b8" }}
          >
            <motion.div
              className="h-full"
              style={{ backgroundColor: "#D03A2B" }}
              initial={{ width: "0%" }}
              animate={isInView ? { width: `${seatRatio * 100}%` } : { width: "0%" }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.8, ease: "easeOut", delay: 0.3 }
              }
            />
          </div>
        </div>
      )}

      {/* CTA button */}
      <button
        className="w-full py-3 font-['Oswald',_sans-serif] text-sm tracking-[0.2em] uppercase border-2 transition-colors duration-200 cursor-pointer"
        style={{
          borderColor: "#D03A2B",
          color: "#D03A2B",
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#D03A2B";
          e.currentTarget.style.color = "#fff";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
          e.currentTarget.style.color = "#D03A2B";
        }}
      >
        REQUEST CLEARANCE
      </button>

      {/* Form-style field lines */}
      <div className="mt-4 pt-3" style={{ borderTop: "1px dashed #c8c0b0" }}>
        <div className="font-mono text-xs" style={{ color: "#aaa" }}>
          AUTHORIZATION: _____________
        </div>
      </div>
    </motion.div>
  );
}
