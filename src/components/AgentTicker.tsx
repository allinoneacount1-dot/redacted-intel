import { useRef, useEffect } from "react";

interface AgentTickerProps {
  items: string[];
  speed?: number;
}

export default function AgentTicker({ items, speed = 40 }: AgentTickerProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  useEffect(() => {
    if (prefersReducedMotion || !trackRef.current) return;

    const track = trackRef.current;
    let animationId: number;
    let pos = 0;

    const scroll = () => {
      pos -= 1;
      const halfWidth = track.scrollWidth / 2;
      if (Math.abs(pos) >= halfWidth) {
        pos = 0;
      }
      track.style.transform = `translateX(${pos}px)`;
      animationId = requestAnimationFrame(scroll);
    };

    // Adjust interval based on speed
    const interval = Math.max(16, 1000 / speed);
    const id = setInterval(() => {
      pos -= 1;
      const halfWidth = trackRef.current!.scrollWidth / 2;
      if (Math.abs(pos) >= halfWidth) {
        pos = 0;
      }
      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${pos}px)`;
      }
    }, interval);

    return () => {
      clearInterval(id);
      cancelAnimationFrame(animationId);
    };
  }, [speed, prefersReducedMotion]);

  const content = items.map((item, i) => (
    <span key={i} className="inline-flex items-center gap-4 whitespace-nowrap">
      <span>{item}</span>
      <span style={{ color: "#39FF6E" }}>///</span>
    </span>
  ));

  return (
    <div
      className="overflow-hidden w-full"
      style={{ color: "#39FF6E" }}
      role="marquee"
      aria-label="Agent activity feed"
    >
      <div
        ref={trackRef}
        className="inline-flex items-center gap-4 font-mono text-xs tracking-wider"
        style={{
          willChange: "transform",
          animation: prefersReducedMotion
            ? "none"
            : `ticker-scroll ${60 / speed}s linear infinite`,
        }}
      >
        {/* Render twice for seamless loop */}
        {content}
        {content}
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
