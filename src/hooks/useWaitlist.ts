import { useState, useCallback } from "react";

interface WaitlistState {
  loading: boolean;
  error: string | null;
  success: boolean;
  position: number | null;
}

interface WaitlistActions {
  submit: (email: string, level: 1 | 2 | 3) => Promise<void>;
  reset: () => void;
}

type UseWaitlistReturn = WaitlistState & WaitlistActions;

const STORAGE_KEY = "waitlist-submissions";

function getStoredCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

function storeSubmission(email: string, level: 1 | 2 | 3): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: Array<{ email: string; level: number; timestamp: string }> = raw
      ? JSON.parse(raw)
      : [];
    existing.push({
      email,
      level,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    return existing.length;
  } catch {
    return getStoredCount() + 1;
  }
}

export function useWaitlist(): UseWaitlistReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setPosition(null);
  }, []);

  const submit = useCallback(async (email: string, level: 1 | 2 | 3) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setPosition(null);

    // Simulate API call with 1.5s delay
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // 5% chance of simulated failure for realism
        if (Math.random() < 0.05) {
          reject(new Error("SECURE CHANNEL UNAVAILABLE. RETRY."));
        } else {
          resolve();
        }
      }, 1500);
    })
      .then(() => {
        const pos = storeSubmission(email, level);
        // Base position starts at 313 for thematic consistency
        const displayPosition = 313 + pos - 1;
        setPosition(displayPosition);
        setSuccess(true);
      })
      .catch((err: Error) => {
        setError(err.message || "TRANSMISSION FAILED. RETRY.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { submit, loading, error, success, position, reset };
}
