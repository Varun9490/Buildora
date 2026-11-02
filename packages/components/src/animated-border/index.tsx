"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type AnimatedBorderProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function AnimatedBorder({ className, children, ...rest }: AnimatedBorderProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  return (
    <div ref={ref} className={cn("relative rounded-[var(--b-radius-lg)] p-[2px]", className)} {...rest}>
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-[var(--b-radius-lg)]"
        style={{ background: "linear-gradient(90deg, var(--b-accent), var(--b-iris), var(--b-accent))", backgroundSize: "200% 100%" }}
        initial={reduced ? {} : { opacity: 0 }}
        animate={reduced ? {} : inView ? { opacity: 1, backgroundPosition: ["0% 50%", "100% 50%"] } : { opacity: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="relative rounded-[calc(var(--b-radius-lg)-2px)] bg-[color:var(--b-panel)] p-6 text-[color:var(--b-text)]">
        {children}
      </div>
    </div>
  );
}
export default AnimatedBorder;
