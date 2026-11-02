"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SkeletonShimmerProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function SkeletonShimmer({ className, ...rest }: SkeletonShimmerProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative overflow-hidden rounded-[var(--b-radius)] bg-[color:var(--b-surface)]", className)}>
      <div className="h-4 w-3/4 rounded bg-[color:var(--b-border)]" />
      {!reduced && (
        <motion.div
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[color:var(--b-panel)] to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
export default SkeletonShimmer;
