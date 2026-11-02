"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type TooltipFadeProps = React.HTMLAttributes<HTMLSpanElement> & { className?: string; children?: React.ReactNode };

export function TooltipFade({ className, children, ...rest }: TooltipFadeProps) {
  const [show, setShow] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <span className={cn("relative inline-block", className)}>
      <span onPointerEnter={() => setShow(true)} onPointerLeave={() => setShow(false)} onFocus={() => setShow(true)} onBlur={() => setShow(false)} tabIndex={0} className="text-[color:var(--b-text)]">
        {children}
      </span>
      <AnimatePresence>
        {show && (
          <motion.span
            role="tooltip"
            initial={reduced ? {} : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? {} : { opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-[var(--b-radius-sm)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-2 py-1 text-xs text-[color:var(--b-text)] shadow-lg"
          >
            Tooltip
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
export default TooltipFade;
