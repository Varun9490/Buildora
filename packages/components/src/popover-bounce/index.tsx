"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type PopoverBounceProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function PopoverBounce({ className, children, ...rest }: PopoverBounceProps) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative inline-block", className)} {...rest}>
      <button onClick={() => setOpen((v) => !v)} className="rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] px-3 py-1.5 text-sm text-[color:var(--b-text)]">Toggle</button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? {} : { opacity: 0, scale: 0.9, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, scale: 0.9, y: 6 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="absolute left-0 top-full z-50 mt-2 w-64 rounded-[var(--b-radius)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-4 text-sm text-[color:var(--b-text)] shadow-lg"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default PopoverBounce;
