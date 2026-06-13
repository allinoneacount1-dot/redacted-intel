import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWaitlist } from "../hooks/useWaitlist";

interface WaitlistModalProps {
  open: boolean;
  onClose: () => void;
  preselectedLevel?: 1 | 2 | 3 | null;
}

const LEVELS = [
  { value: 1 as const, label: "LEVEL 1 — FIELD AGENT", price: "FREE" },
  { value: 2 as const, label: "LEVEL 2 — CASE OFFICER", price: "$39/mo" },
  { value: 3 as const, label: "LEVEL 3 — STATION CHIEF", price: "$179/mo" },
];

export default function WaitlistModal({
  open,
  onClose,
  preselectedLevel = null,
}: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<1 | 2 | 3 | null>(
    preselectedLevel
  );
  const [emailError, setEmailError] = useState("");

  const { submit, loading, error, success, position, reset } = useWaitlist();

  // Sync preselectedLevel when it changes
  useEffect(() => {
    if (open) {
      setSelectedLevel(preselectedLevel);
      setEmail("");
      setEmailError("");
      reset();
    }
  }, [open, preselectedLevel, reset]);

  const validateEmail = useCallback((value: string) => {
    if (!value.trim()) return "EMAIL REQUIRED";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      return "INVALID EMAIL FORMAT";
    return "";
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const err = validateEmail(email);
      if (err) {
        setEmailError(err);
        return;
      }
      setEmailError("");
      await submit(email, selectedLevel ?? 1);
    },
    [email, selectedLevel, submit, validateEmail]
  );

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Waitlist signup form"
        >
          <motion.div
            className="relative w-full max-w-md"
            initial={
              prefersReduced ? { scale: 1 } : { scale: 0.92, opacity: 0 }
            }
            animate={{ scale: 1, opacity: 1 }}
            exit={
              prefersReduced ? { scale: 1 } : { scale: 0.92, opacity: 0 }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Paper document */}
            <div
              className="relative"
              style={{
                backgroundColor: "#E9E4D8",
                boxShadow: "4px 6px 24px rgba(0,0,0,0.4)",
              }}
            >
              {/* Classification strip */}
              <div
                className="px-4 py-2 flex items-center justify-between"
                style={{ backgroundColor: "#D03A2B" }}
              >
                <span className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] text-white uppercase">
                  TOP SECRET
                </span>
                <span className="font-mono text-xs text-white/70">
                  FORM 313-CLEARANCE
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-10 right-3 z-10 w-8 h-8 flex items-center justify-center font-['Oswald',_sans-serif] text-lg transition-colors duration-200 cursor-pointer"
                style={{ color: "#888" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "#2B2B2B")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "#888")
                }
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="p-6 pt-5">
                {/* TOP SECRET stamp */}
                <div
                  className="absolute top-16 right-4 font-['Oswald',_sans-serif] text-xl tracking-[0.2em] uppercase pointer-events-none select-none"
                  style={{
                    color: "rgba(208,58,43,0.12)",
                    transform: "rotate(-12deg)",
                  }}
                  aria-hidden="true"
                >
                  TOP SECRET
                </div>

                {/* Title */}
                <h2
                  className="font-['Oswald',_sans-serif] text-xl tracking-[0.15em] uppercase mb-1"
                  style={{ color: "#2B2B2B" }}
                >
                  REQUEST CLEARANCE
                </h2>
                <p
                  className="font-['Special_Elite',_monospace] text-xs mb-5"
                  style={{ color: "#888" }}
                >
                  Complete the form below to join the waitlist.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Email field */}
                  <div className="mb-4">
                    <label
                      htmlFor="waitlist-email"
                      className="block font-mono text-xs tracking-wider uppercase mb-1.5"
                      style={{ color: "#555" }}
                    >
                      EMAIL ADDRESS
                    </label>
                    <input
                      id="waitlist-email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      disabled={loading || success}
                      placeholder="agent@agency.secure"
                      className="w-full px-3 py-2.5 font-['Special_Elite',_monospace] text-sm border-2 outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: "#f5f2eb",
                        borderColor: emailError ? "#D03A2B" : "#c8c0b0",
                        color: "#2B2B2B",
                      }}
                      onFocus={(e) => {
                        if (!emailError)
                          e.currentTarget.style.borderColor = "#D03A2B";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = emailError
                          ? "#D03A2B"
                          : "#c8c0b0";
                      }}
                    />
                    {emailError && (
                      <p
                        className="font-mono text-xs mt-1"
                        style={{ color: "#D03A2B" }}
                        role="alert"
                      >
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Level selection */}
                  <div className="mb-5">
                    <div className="font-mono text-xs tracking-wider uppercase mb-2" style={{ color: "#555" }}>
                      SELECT CLEARANCE LEVEL
                    </div>
                    <div className="space-y-2">
                      {LEVELS.map((lvl) => (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setSelectedLevel(lvl.value)}
                          disabled={loading || success}
                          className="w-full text-left px-3 py-2 border-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                          style={{
                            borderColor:
                              selectedLevel === lvl.value
                                ? "#D03A2B"
                                : "#c8c0b0",
                            backgroundColor:
                              selectedLevel === lvl.value
                                ? "rgba(208,58,43,0.06)"
                                : "#f5f2eb",
                          }}
                        >
                          <span
                            className="font-['Oswald',_sans-serif] text-xs tracking-wider uppercase"
                            style={{
                              color:
                                selectedLevel === lvl.value
                                  ? "#D03A2B"
                                  : "#555",
                            }}
                          >
                            {lvl.label}
                          </span>
                          <span
                            className="font-mono text-xs"
                            style={{ color: "#888" }}
                          >
                            {lvl.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error from API */}
                  {error && !success && (
                    <div
                      className="mb-4 p-3 font-mono text-xs text-center"
                      style={{
                        backgroundColor: "rgba(208,58,43,0.08)",
                        color: "#D03A2B",
                        border: "1px dashed rgba(208,58,43,0.3)",
                      }}
                      role="alert"
                    >
                      {error}
                      <button
                        type="button"
                        onClick={() => reset()}
                        className="block mx-auto mt-2 underline cursor-pointer"
                        style={{ color: "#D03A2B" }}
                      >
                        TRY AGAIN
                      </button>
                    </div>
                  )}

                  {/* Success state */}
                  {success && (
                    <motion.div
                      className="mb-4 p-4 text-center"
                      style={{
                        backgroundColor: "rgba(57,255,110,0.06)",
                        border: "1px dashed rgba(57,255,110,0.3)",
                      }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="font-['Oswald',_sans-serif] text-sm tracking-[0.15em] uppercase mb-2"
                        style={{ color: "#39FF6E" }}
                      >
                        ✓ FILE OPENED
                      </div>
                      <p
                        className="font-['Special_Elite',_monospace] text-sm"
                        style={{ color: "#2B2B2B" }}
                      >
                        YOUR FILE HAS BEEN OPENED.
                      </p>
                      <p
                        className="font-['Special_Elite',_monospace] text-sm font-bold mt-1"
                        style={{ color: "#D03A2B" }}
                      >
                        POSITION #{position}.
                      </p>
                      <p
                        className="font-['Special_Elite',_monospace] text-sm mt-1"
                        style={{ color: "#2B2B2B" }}
                      >
                        WE WILL FIND YOU.
                      </p>
                    </motion.div>
                  )}

                  {/* Submit button */}
                  {!success && (
                    <button
                      type="submit"
                      disabled={loading || !selectedLevel}
                      className="w-full py-3 font-['Oswald',_sans-serif] text-sm tracking-[0.2em] uppercase border-2 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        borderColor: "#D03A2B",
                        color: "#D03A2B",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading && selectedLevel) {
                          e.currentTarget.style.backgroundColor = "#D03A2B";
                          e.currentTarget.style.color = "#fff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#D03A2B";
                      }}
                    >
                      {loading ? (
                        <span className="inline-flex items-center gap-2">
                          <motion.span
                            className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                          PROCESSING...
                        </span>
                      ) : (
                        "SUBMIT REQUEST"
                      )}
                    </button>
                  )}
                </form>

                {/* Form-style footer */}
                <div
                  className="mt-5 pt-3 font-mono text-xs"
                  style={{ borderTop: "1px dashed #c8c0b0", color: "#aaa" }}
                >
                  AUTHORIZATION: _____________ &nbsp;&nbsp; DATE:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
