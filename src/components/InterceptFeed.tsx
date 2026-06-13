import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface InterceptFeedProps {
  lines: string[];
  speed?: number;
}

function maskLine(line: string): string {
  // Replace patterns that look like classified fields
  return line
    .replace(
      /\b[A-Z]{2,}\b/g,
      (match) =>
        '\u2588'.repeat(match.length)
    )
    .replace(
      /\b\d{4,}\b/g,
      (match) =>
        '\u2588'.repeat(match.length)
    );
}

export default function InterceptFeed({
  lines,
  speed = 50,
}: InterceptFeedProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      setVisibleLines(lines.map(maskLine));
      return;
    }

    if (currentLineIndex >= lines.length) return;

    const line = lines[currentLineIndex];
    const masked = maskLine(line);

    if (currentCharIndex < masked.length) {
      const timeout = setTimeout(() => {
        setCurrentCharIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      // Line complete, move to next
      setVisibleLines((prev) => [...prev, masked]);
      setCurrentLineIndex((prev) => prev + 1);
      setCurrentCharIndex(0);
    }
  }, [currentLineIndex, currentCharIndex, lines, speed, prefersReducedMotion]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleLines, currentCharIndex]);

  const currentTypingLine =
    !prefersReducedMotion &&
    currentLineIndex < lines.length
      ? maskLine(lines[currentLineIndex]).slice(0, currentCharIndex)
      : "";

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden font-mono text-sm leading-relaxed p-4"
      style={{
        backgroundColor: "#0C0C0C",
        color: "#39FF6E",
        textShadow: "0 0 6px rgba(57,255,110,0.4)",
      }}
    >
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
        }}
      />

      {/* CRT flicker */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        animate={
          prefersReducedMotion
            ? { opacity: 0 }
            : { opacity: [0, 0, 0.03, 0, 0, 0.02, 0, 0, 0, 0] }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{ backgroundColor: "#39FF6E" }}
      />

      {/* Rendered lines */}
      {visibleLines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">
          {line}
        </div>
      ))}

      {/* Currently typing line */}
      {currentTypingLine && (
        <div className="whitespace-pre-wrap">
          {currentTypingLine}
          <span className="inline-block w-2 h-4 ml-0.5 align-middle" style={{ backgroundColor: "#39FF6E" }}>
            &nbsp;
          </span>
        </div>
      )}

      {/* Empty state */}
      {lines.length === 0 && (
        <div className="opacity-40">AWAITING INTERCEPT...</div>
      )}
    </div>
  );
}
