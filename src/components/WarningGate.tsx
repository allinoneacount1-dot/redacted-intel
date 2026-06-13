import { useState, useEffect, useCallback } from "react";
import "framer-motion";
import { motion } from "framer-motion";

interface WarningGateProps {
  onProceed: () => void;
}

const WARNING_LINES = [
  "CLASSIFIED SYSTEM INTERFACE",
  "",
  "UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE.",
  "ALL ACTIVITY IS MONITORED AND LOGGED.",
  "BY PROCEEDING YOU ACKNOWLEDGE CLEARANCE LEVEL 0.",
  "",
  "DISTRIBUTION OF MATERIALS IS STRICTLY PROHIBITED.",
];

const STORAGE_KEY = "warning-gate-dismissed";

export default function WarningGate({ onProceed }: WarningGateProps) {
  const [visibleChars, setVisibleChars] = useState(0);
  const [showButton, setShowButton] = useState(false);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const fullText = WARNING_LINES.join("\n");
  const totalChars = fullText.length;

  useEffect(() => {
    // Check sessionStorage for prior dismissal
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "true") {
        onProceed();
        return;
      }
    } catch {
      // ignore storage errors
    }

    if (prefersReducedMotion) {
      setVisibleChars(totalChars);
      setShowButton(true);
      return;
    }

    if (visibleChars < totalChars) {
      const timeout = setTimeout(() => {
        setVisibleChars((prev) => prev + 1);
      }, 18);
      return () => clearTimeout(timeout);
    } else {
      // All text revealed, show button after brief pause
      const timeout = setTimeout(() => setShowButton(true), 400);
      return () => clearTimeout(timeout);
    }
  }, [visibleChars, totalChars, onProceed, prefersReducedMotion]);

  const handleProceed = useCallback(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    onProceed();
  }, [onProceed]);

  const displayedText = fullText.slice(0, visibleChars);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: "#0C0C0C" }}
    >
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
        }}
      />

      {/* Warning text */}
      <div
        className="relative max-w-lg w-full font-mono text-sm leading-relaxed whitespace-pre-wrap mb-8"
        style={{
          color: "#39FF6E",
          textShadow: "0 0 8px rgba(57,255,110,0.35)",
        }}
      >
        {displayedText}
        {visibleChars < totalChars && (
          <span
            className="inline-block w-2.5 h-5 ml-0.5 align-middle"
            style={{ backgroundColor: "#39FF6E" }}
          >
            &nbsp;
          </span>
        )}
      </div>

      {/* Proceed button */}
      {showButton && (
        <motion.button
          className="relative font-['Oswald',_sans-serif] text-sm tracking-[0.3em] uppercase px-8 py-3 border-2 cursor-pointer transition-colors duration-200"
          style={{
            borderColor: "#39FF6E",
            color: "#39FF6E",
            backgroundColor: "transparent",
          }}
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }
          }
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#39FF6E";
            e.currentTarget.style.color = "#0C0C0C";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#39FF6E";
          }}
          onClick={handleProceed}
        >
          [PROCEED]
        </motion.button>
      )}

      {/* Bottom classification line */}
      <div
        className="absolute bottom-6 left-0 right-0 text-center font-mono text-xs tracking-widest"
        style={{ color: "rgba(57,255,110,0.2)" }}
      >
        TOP SECRET // NOFORN // ORCON
      </div>
    </div>
  );
}
