"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ToggleSwitchAnimProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function ToggleSwitchAnim({ className, ...rest }: ToggleSwitchAnimProps) {
  const [on, setOn] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => setOn((v) => !v)}
      className={cn("relative h-7 w-12 rounded-full border border-[color:var(--b-border)] transition-colors", on ? "bg-[color:var(--b-accent)]" : "bg-[color:var(--b-surface)]", className)} aria-label="Toggle"
    >
      <motion.span
        className="absolute top-0.5 h-6 w-6 rounded-full bg-[color:var(--b-panel)] shadow"
        animate={reduced ? {} : { x: on ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
      />
    </button>
  );
}
export default ToggleSwitchAnim;
