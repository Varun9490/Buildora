"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type CheckboxBounceProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function CheckboxBounce({ className, ...rest }: CheckboxBounceProps) {
  const [checked, setChecked] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      onClick={() => setChecked((v) => !v)}
      className={cn("flex h-5 w-5 items-center justify-center rounded border border-[color:var(--b-border)] bg-[color:var(--b-surface)]", checked && "bg-[color:var(--b-accent)] border-[color:var(--b-accent)]", className)} aria-label="Checkbox"
    >
      <AnimatePresence>
        {checked && (
          <motion.svg
            initial={reduced ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            exit={reduced ? {} : { scale: 0 }}
            className="h-3.5 w-3.5 text-[color:var(--b-accent-foreground)]"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
          >
            <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.2 }} />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}
export default CheckboxBounce;
