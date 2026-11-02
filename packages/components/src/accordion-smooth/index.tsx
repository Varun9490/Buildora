"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type AccordionSmoothProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function AccordionSmooth({ className, children, ...rest }: AccordionSmoothProps) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={cn("border border-[color:var(--b-border)] rounded-[var(--b-radius)] bg-[color:var(--b-panel)]", className)} {...rest}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-3 text-[color:var(--b-text)]"
      >
        <span>{children}</span>
        <motion.span animate={reduced ? {} : { rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>▾</motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduced ? {} : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? {} : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden px-4 pb-3 text-sm text-[color:var(--b-text-secondary)]"
          >
            Details
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default AccordionSmooth;
