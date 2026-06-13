import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { manifesto } from "../data/manifesto";
import WaitlistModal from "../components/WaitlistModal";
import { updateSEO, SEO_PAGES } from "../utils/seo";

/* ═══════════════════════════════════════════════════════════════
   THE AGENCY PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function TheAgency() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  // SEO
  useEffect(() => {
    updateSEO(SEO_PAGES.agency);
  }, []);

  // Split manifesto into paragraphs for rendering
  const paragraphs = manifesto.paragraphs;

  return (
    <div
      style={{
        backgroundColor: "#0C0C0C",
        minHeight: "100vh",
        paddingTop: "56px",
      }}
    >
      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />

      {/* Page header */}
      <header className="px-4 md:px-8 pt-10 pb-6">
        <div className="max-w-4xl mx-auto">
          <div
            className="font-mono text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "#D03A2B" }}
          >
            MANIFESTO
          </div>
          <h1
            className="font-['Oswald',_sans-serif] text-3xl md:text-4xl tracking-wide uppercase"
            style={{ color: "#E9E4D8" }}
          >
            The Agency.
          </h1>
        </div>
      </header>

      {/* Manifesto document */}
      <section
        ref={ref}
        className="px-4 md:px-8 pb-20"
        aria-label="Agency manifesto"
      >
        <div className="max-w-3xl mx-auto">
          <motion.article
            className="relative paper-document"
            style={{
              backgroundColor: "#E9E4D8",
              padding: "clamp(2rem, 6vw, 4rem)",
              boxShadow: "4px 6px 24px rgba(0,0,0,0.25)",
            }}
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Paperclip */}
            <svg
              width="24"
              height="48"
              viewBox="0 0 24 48"
              fill="none"
              className="absolute -top-3 right-8 z-10"
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

            {/* Punch holes */}
            <div
              className="absolute left-4 top-0 bottom-0 flex flex-col justify-start gap-[28px] pt-3"
              aria-hidden="true"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-full border border-[#c8c0b0]"
                  style={{
                    backgroundColor: "#0C0C0C",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)",
                  }}
                />
              ))}
            </div>

            {/* Classification strip */}
            <div
              className="px-6 py-2 -mx-8 md:-mx-12 -mt-8 md:-mt-12 mb-8 flex items-center justify-between"
              style={{ backgroundColor: "#D03A2B" }}
            >
              <span className="font-['Oswald',_sans-serif] text-xs tracking-[0.3em] text-white uppercase">
                EYES ONLY / LEVEL OMEGA
              </span>
              <span className="font-mono text-xs text-white/70">
                v3.7.1
              </span>
            </div>

            {/* Manifesto body */}
            <div className="font-['Special_Elite',_monospace] text-sm leading-[1.8] relative">
              {paragraphs.map((para, i) => {
                const trimmed = para.trim();
                if (!trimmed) return null;

                // Decorative separator lines (═══)
                if (trimmed.startsWith("═")) {
                  return (
                    <div
                      key={i}
                      className="my-6 text-center"
                      style={{ color: "rgba(43,43,43,0.15)" }}
                    >
                      {trimmed}
                    </div>
                  );
                }

                // Section headers (Roman numeral sections)
                if (/^[IVX]+\.\s/.test(trimmed)) {
                  return (
                    <h2
                      key={i}
                      className="font-['Oswald',_sans-serif] text-lg tracking-[0.15em] uppercase mt-8 mb-3"
                      style={{ color: "#2B2B2B" }}
                    >
                      {trimmed}
                    </h2>
                  );
                }

                // Closing quote line
                if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
                  return (
                    <p
                      key={i}
                      className="text-center italic mt-6 mb-2"
                      style={{ color: "rgba(43,43,43,0.5)" }}
                    >
                      {trimmed}
                    </p>
                  );
                }

                // Regular paragraph
                return (
                  <p
                    key={i}
                    className="mb-4"
                    style={{
                      color: "#2B2B2B",
                      textIndent: i === 0 ? "2em" : "0",
                    }}
                  >
                    {/* Drop cap for first paragraph */}
                    {i === 0 && (
                      <span
                        className="float-left font-['Oswald',_sans-serif] text-5xl leading-[0.8] mr-2 mt-1"
                        style={{ color: "#D03A2B" }}
                      >
                        {trimmed[0]}
                      </span>
                    )}
                    {i === 0 ? trimmed.slice(1) : trimmed}
                  </p>
                );
              })}

              {/* Signature */}
              <div className="mt-10 pt-6" style={{ borderTop: "1px dashed #c8c0b0" }}>
                <p
                  className="font-['Special_Elite',_monospace] text-sm"
                  style={{ color: "#555" }}
                >
                  &mdash; THE DIRECTOR. ████████.
                </p>
              </div>
            </div>

            {/* TOP SECRET watermark */}
            <div
              className="absolute bottom-6 right-6 font-['Oswald',_sans-serif] text-3xl tracking-[0.2em] uppercase pointer-events-none select-none"
              style={{
                color: "rgba(208,58,43,0.08)",
                transform: "rotate(-12deg)",
              }}
              aria-hidden="true"
            >
              TOP SECRET
            </div>

            {/* Coffee ring stain */}
            <div
              className="absolute bottom-16 left-12 w-20 h-20 rounded-full pointer-events-none opacity-[0.06]"
              style={{
                border: "2px solid #8B7355",
                background:
                  "radial-gradient(circle, transparent 55%, rgba(139,115,85,0.2) 60%, rgba(139,115,85,0.08) 70%, transparent 75%)",
              }}
              aria-hidden="true"
            />
          </motion.article>

          {/* CTA after manifesto */}
          <motion.div
            className="mt-12 text-center"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p
              className="font-['Special_Elite',_monospace] text-sm mb-4"
              style={{ color: "rgba(233,228,216,0.4)" }}
            >
              You've read the manifesto. The only question is whether you're
              cleared to act on it.
            </p>
            <motion.button
              className="inline-flex items-center justify-center font-['Oswald',_sans-serif] text-sm tracking-[0.2em] uppercase px-10 py-4 border-2 transition-colors duration-200 cursor-pointer"
              style={{ borderColor: "#D03A2B", color: "#D03A2B" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#D03A2B";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#D03A2B";
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setWaitlistOpen(true)}
            >
              REQUEST CLEARANCE
            </motion.button>
          </motion.div>

          {/* Document footer */}
          <div className="mt-8 flex items-center justify-between">
            <span
              className="font-mono text-xs"
              style={{ color: "rgba(233,228,216,0.15)" }}
            >
              DOCUMENT CLASSIFICATION: EYES ONLY
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: "rgba(233,228,216,0.15)" }}
            >
              PAGE 1 OF 1 — DO NOT DISTRIBUTE
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
