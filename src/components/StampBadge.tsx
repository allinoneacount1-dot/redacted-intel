import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type StampVariant = "classification" | "verified" | "burned" | "pending";
type StampSize = "sm" | "md" | "lg";

interface StampBadgeProps {
  label: string;
  variant: StampVariant;
  size?: StampSize;
}

const variantColors: Record<StampVariant, string> = {
  classification: "#D03A2B",
  verified: "#39FF6E",
  burned: "#D03A2B",
  pending: "#C8A832",
};

const sizeClasses: Record<StampSize, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

const rotationMap: Record<StampVariant, number> = {
  classification: -8,
  verified: 6,
  burned: -5,
  pending: 10,
};

export default function StampBadge({
  label,
  variant,
  size = "md",
}: StampBadgeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const color = variantColors[variant];
  const rotation = rotationMap[variant];

  return (
    <motion.div
      ref={ref}
      className={`inline-block font-['Oswald',_sans-serif] uppercase tracking-widest border-2 ${sizeClasses[size]}`}
      style={{
        color,
        borderColor: color,
        transform: `rotate(${rotation}deg)`,
        opacity: 0.9,
      }}
      initial={
        prefersReducedMotion
          ? { scale: 1, rotate: rotation }
          : { scale: 3, rotate: rotation * 3, opacity: 0 }
      }
      animate={
        isInView
          ? { scale: 1, rotate: rotation, opacity: 0.9 }
          : { scale: 3, rotate: rotation * 3, opacity: 0 }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 18, mass: 0.8 }
      }
    >
      {label}
    </motion.div>
  );
}
