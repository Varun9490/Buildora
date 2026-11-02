"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type BadgePulseProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function BadgePulse({ className, children, ...rest }: BadgePulseProps) {
  const reduced = useReducedMotion();
  return (
    <span className={cn("relative inline-flex items-center gap-1.5 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2.5 py-0.5 text-xs text-[color:var(--b-text)]", className)}>
      <span className="relative flex h-2 w-2">
        {!reduced && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--b-accent)] opacity-60" />}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--b-accent)]" />
      </span>
      {children}
    </span>
  );
}
export default BadgePulse;
