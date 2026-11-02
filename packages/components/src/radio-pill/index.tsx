"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type RadioPillProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function RadioPill({ className, ...rest }: RadioPillProps) {
  const items = ["One", "Two", "Three"];
  const [active, setActive] = React.useState(0);
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative inline-flex rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-1", className)}>
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-[color:var(--b-accent)]"
        animate={reduced ? {} : { left: `${(active / items.length) * 100}%`, width: `${100 / items.length}%` }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
      />
      {items.map((it, i) => (
        <button
          key={it}
          onClick={() => setActive(i)}
          className={cn("relative z-10 px-4 py-1.5 text-sm", active === i ? "text-[color:var(--b-accent-foreground)]" : "text-[color:var(--b-text-secondary)]")}
        >
          {it}
        </button>
      ))}
    </div>
  );
}
export default RadioPill;
