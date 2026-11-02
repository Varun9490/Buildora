"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type FloatingLabelInputProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function FloatingLabelInput({ className, children, ...rest }: FloatingLabelInputProps) {
  const [focused, setFocused] = React.useState(false);
  const [hasValue, setHasValue] = React.useState(false);
  const reduced = useReducedMotion();
  const up = focused || hasValue;
  return (
    <label className={cn("relative block", className)}>
      <motion.span
        animate={reduced ? {} : { y: up ? -22 : 0, scale: up ? 0.85 : 1, color: up ? "var(--b-accent)" : "var(--b-muted)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="absolute left-3 top-3 origin-left text-sm pointer-events-none"
      >
        {children}
      </motion.span>
      <input
        onFocus={() => setFocused(true)}
        onBlur={(e) => { setFocused(false); setHasValue(!!e.target.value); }}
        onChange={(e) => setHasValue(!!e.target.value)}
        className="w-full rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-3 text-[color:var(--b-text)] focus:border-[color:var(--b-accent)] focus:outline-none" aria-label="Full name"
      />
    </label>
  );
}
export default FloatingLabelInput;
