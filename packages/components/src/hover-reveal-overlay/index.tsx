"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type HoverRevealOverlayProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function HoverRevealOverlay({ className, children, ...rest }: HoverRevealOverlayProps) {
  const [hover, setHover] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden rounded-[var(--b-radius-lg)]", className)} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} {...rest}>
      <div className="text-[color:var(--b-text)]">{children}</div>
      <motion.div
        className="absolute inset-0 flex items-end bg-[color:var(--b-accent)]/80 p-4 text-[color:var(--b-accent-foreground)]"
        initial={reduced ? { y: "100%" } : { y: "100%" }}
        animate={reduced ? {} : hover ? { y: 0 } : { y: "100%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        Details
      </motion.div>
    </div>
  );
}
export default HoverRevealOverlay;
