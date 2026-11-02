"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type DrawerSlideProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function DrawerSlide({ className, children, ...rest }: DrawerSlideProps) {
  const [open, setOpen] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={className} {...rest}>
      <button onClick={() => setOpen(true)} className="rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] px-4 py-2 text-sm text-[color:var(--b-text)]">Open drawer</button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? {} : { x: "100%" }}
            animate={{ x: 0 }}
            exit={reduced ? {} : { x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed right-0 top-0 z-50 h-full w-80 border-l border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-6 text-[color:var(--b-text)] shadow-xl"
          >
            <button onClick={() => setOpen(false)} className="mb-4 text-sm text-[color:var(--b-muted)]">Close</button>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default DrawerSlide;
