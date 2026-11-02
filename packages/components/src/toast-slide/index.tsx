"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ToastSlideProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function ToastSlide({ className, children, ...rest }: ToastSlideProps) {
  const [show, setShow] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div className={className}>
      <button onClick={() => { setShow(true); setTimeout(() => setShow(false), 2500); }} className="rounded-[var(--b-radius-sm)] bg-[color:var(--b-accent)] px-4 py-2 text-sm text-[color:var(--b-accent-foreground)]">Show toast</button>
      <AnimatePresence>
        {show && (
          <motion.div
            role="status"
            initial={reduced ? {} : { opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? {} : { opacity: 0, x: 40 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="fixed bottom-4 right-4 z-50 rounded-[var(--b-radius)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-4 py-3 text-sm text-[color:var(--b-text)] shadow-lg"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ToastSlide;
