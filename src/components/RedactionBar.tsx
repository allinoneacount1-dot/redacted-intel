import { useState } from "react";
import { motion } from "framer-motion";

interface RedactionBarProps {
  text: string;
  className?: string;
  hoverMessage?: string;
}

export default function RedactionBar({
  text,
  className = "",
  hoverMessage = "CLEARANCE LEVEL 2 REQUIRED",
}: RedactionBarProps) {
  const [hovered, setHovered] = useState(false);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Split text into segments: words and spaces
  const segments = text.split(/(\s+)/);

  // Cover roughly 40% of word segments with redaction bars
  const redactedSegments = segments.map((seg, i) => {
    if (seg.trim() === "") return { type: "space" as const, content: seg };
    // Deterministic redaction based on position
    const shouldRedact = (i * 7 + 3) % 5 < 2;
    return shouldRedact
      ? { type: "redacted" as const, content: seg }
      : { type: "visible" as const, content: seg };
  });

  return (
    <span
      className={`relative inline ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {redactedSegments.map((seg, i) => {
        if (seg.type === "space") {
          return <span key={i}>{seg.content}</span>;
        }
        if (seg.type === "redacted") {
          return (
            <motion.span
              key={i}
              className="relative inline-block bg-black text-transparent select-none align-middle"
              initial={
                prefersReducedMotion
                  ? { width: "auto" }
                  : { width: 0, opacity: 0 }
              }
              animate={{ width: "auto", opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: i * 0.03,
                ease: "easeOut",
              }}
              style={{ overflow: "hidden", whiteSpace: "nowrap" }}
            >
              {seg.content}
            </motion.span>
          );
        }
        return <span key={i}>{seg.content}</span>;
      })}

      {/* Tooltip */}
      {hovered && (
        <motion.span
          className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black px-3 py-1 text-xs font-mono tracking-wider"
          style={{ color: "#39FF6E" }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {hoverMessage}
        </motion.span>
      )}
    </span>
  );
}
