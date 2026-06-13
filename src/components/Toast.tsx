import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const TYPE_STYLES: Record<
  ToastType,
  { bg: string; border: string; text: string; icon: string }
> = {
  success: {
    bg: "rgba(57,255,110,0.08)",
    border: "rgba(57,255,110,0.25)",
    text: "#39FF6E",
    icon: "✓",
  },
  error: {
    bg: "rgba(208,58,43,0.08)",
    border: "rgba(208,58,43,0.25)",
    text: "#D03A2B",
    icon: "✕",
  },
  info: {
    bg: "rgba(233,228,216,0.06)",
    border: "rgba(233,228,216,0.15)",
    text: "rgba(233,228,216,0.7)",
    icon: "ℹ",
  },
};

export default function Toast({
  message,
  type,
  duration = 4000,
  onClose,
}: ToastProps) {
  const style = TYPE_STYLES[type];

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (duration <= 0) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-6 right-6 z-[60] max-w-sm w-full"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 12, scale: 0.95 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        role="status"
        aria-live="polite"
      >
        <div
          className="relative px-4 py-3 flex items-start gap-3"
          style={{
            backgroundColor: style.bg,
            border: `1px solid ${style.border}`,
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Icon */}
          <span
            className="font-['Oswald',_sans-serif] text-sm shrink-0 mt-0.5"
            style={{ color: style.text }}
            aria-hidden="true"
          >
            {style.icon}
          </span>

          {/* Message */}
          <p
            className="font-['Special_Elite',_monospace] text-sm flex-1"
            style={{ color: style.text }}
          >
            {message}
          </p>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="shrink-0 w-6 h-6 flex items-center justify-center font-['Oswald',_sans-serif] text-xs transition-opacity duration-200 cursor-pointer opacity-60 hover:opacity-100"
            style={{ color: style.text }}
            aria-label="Dismiss notification"
          >
            ✕
          </button>

          {/* Auto-dismiss progress bar */}
          {duration > 0 && (
            <motion.div
              className="absolute bottom-0 left-0 h-px"
              style={{ backgroundColor: style.border }}
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
