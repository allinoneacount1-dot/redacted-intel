import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
  targetHours?: number;
  persistKey: string;
}

function formatTime(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const h = Math.floor(clamped / 3600);
  const m = Math.floor((clamped % 3600) / 60);
  const s = Math.floor(clamped % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function CountdownTimer({
  targetHours = 72,
  persistKey,
}: CountdownTimerProps) {
  const getTarget = useCallback((): number => {
    try {
      const stored = localStorage.getItem(persistKey);
      if (stored) {
        const parsed = JSON.parse(stored) as { target: number };
        if (parsed.target > Date.now()) {
          return parsed.target;
        }
      }
    } catch {
      // ignore parse errors
    }
    const target = Date.now() + targetHours * 3600 * 1000;
    try {
      localStorage.setItem(persistKey, JSON.stringify({ target }));
    } catch {
      // ignore storage errors
    }
    return target;
  }, [persistKey, targetHours]);

  const [target] = useState<number>(getTarget);

  const calcRemaining = useCallback((): number => {
    return Math.floor((target - Date.now()) / 1000);
  }, [target]);

  const [remaining, setRemaining] = useState<number>(calcRemaining);

  useEffect(() => {
    setRemaining(calcRemaining());
    const id = setInterval(() => {
      setRemaining(calcRemaining());
    }, 1000);
    return () => clearInterval(id);
  }, [calcRemaining]);

  return (
    <span
      className="font-mono text-sm tracking-widest"
      style={{ color: remaining <= 0 ? "#666" : "#D03A2B" }}
    >
      {formatTime(remaining)}
    </span>
  );
}
