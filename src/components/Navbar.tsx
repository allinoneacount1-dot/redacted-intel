import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import WaitlistModal from "./WaitlistModal";
import WalletButton from "./WalletButton";

const NAV_LINKS = [
  { label: "Briefing Room", to: "/briefing" },
  { label: "Declassified", to: "/declassified" },
  { label: "The Agency", to: "/agency" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 md:px-8"
        style={{
          backgroundColor: "rgba(12,12,12,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="relative inline-flex items-center gap-0 font-['Oswald',_sans-serif] text-base tracking-[0.25em] uppercase"
          style={{ color: "#E9E4D8" }}
          aria-label="Home"
        >
          <span>[</span>
          <span className="relative inline-block">
            REDACTED
            {/* Half-covering black bar */}
            <motion.span
              className="absolute top-0 right-0 h-full bg-black"
              initial={
                prefersReducedMotion
                  ? { width: "50%" }
                  : { width: "100%" }
              }
              animate={{ width: "50%" }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: 0.6, delay: 0.3, ease: "easeOut" }
              }
            />
          </span>
          <span>]</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-mono text-xs tracking-wider uppercase transition-colors duration-200"
              style={{ color: "rgba(233,228,216,0.5)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#E9E4D8";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(233,228,216,0.5)";
              }}
            >
              {link.label}
            </Link>
          ))}

          <WalletButton />

          <button
            onClick={() => setWaitlistOpen(true)}
            className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-4 py-1.5 border transition-colors duration-200 cursor-pointer"
            style={{
              borderColor: "#D03A2B",
              color: "#D03A2B",
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
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <motion.span
            className="block w-5 h-px"
            style={{ backgroundColor: "#E9E4D8" }}
            animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-px"
            style={{ backgroundColor: "#E9E4D8" }}
            animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block w-5 h-px"
            style={{ backgroundColor: "#E9E4D8" }}
            animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          />
        </button>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="absolute top-14 left-0 right-0 p-6 flex flex-col gap-4 md:hidden"
              style={{ backgroundColor: "rgba(12,12,12,0.97)" }}
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: -8 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : { opacity: 0, y: -8 }
              }
              transition={{ duration: 0.2 }}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-mono text-sm tracking-wider uppercase"
                  style={{ color: "rgba(233,228,216,0.6)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <WalletButton />
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setWaitlistOpen(true);
                }}
                className="font-['Oswald',_sans-serif] text-xs tracking-[0.2em] uppercase px-4 py-2 border text-center mt-2 cursor-pointer"
                style={{ borderColor: "#D03A2B", color: "#D03A2B" }}
              >
                REQUEST CLEARANCE
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <WaitlistModal
        open={waitlistOpen}
        onClose={() => setWaitlistOpen(false)}
      />
    </>
  );
}
