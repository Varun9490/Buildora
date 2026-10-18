"use client";

import * as React from "react";
import { cn, clamp } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type ProgressVariant = "default" | "accent" | "success" | "warning" | "danger";
export type ProgressSize = "default" | "sm" | "lg";
export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & { value?: number; max?: number; variant?: ProgressVariant; size?: ProgressSize; showValue?: boolean; formatValue?: (value: number, max: number) => string; indeterminate?: boolean };

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, variant = "default", size = "default", showValue = false, formatValue, indeterminate = false, ...props }, ref) => {
    const reduced = useReducedMotion();
    const pct = indeterminate ? 50 : clamp(value, 0, max);
    const clamped = (pct / max) * 100;
    const variantStyles: Record<ProgressVariant, string> = {
      default: "bg-[color:var(--b-text)]",
      accent: "bg-[color:var(--b-accent)] shadow-[0_0_12px_var(--b-accent-glow)]",
      success: "bg-[color:var(--b-success)]",
      warning: "bg-[color:var(--b-warning)]",
      danger: "bg-[color:var(--b-danger)]",
    };
    const sizeStyles: Record<ProgressSize, string> = { default: "h-2", sm: "h-1.5", lg: "h-3" };
    return (
      <div className={cn("w-full max-w-sm", className)} ref={ref} {...props}>
        <div
          role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={indeterminate ? undefined : value}
          className={cn("relative w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--b-text)_9%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_8%,transparent)]", sizeStyles[size])}
        >
          {indeterminate ? (
            <motion.div className={cn("h-full rounded-full", variantStyles[variant])} initial={{ x: "-40%" }} animate={{ x: "250%" }} style={{ width: "38%" }} transition={reduced ? { duration: 0 } : { repeat: Infinity, duration: 1.1, ease: "easeInOut" }} />
          ) : (
            <motion.div className={cn("h-full rounded-full", variantStyles[variant])} initial={false} animate={{ width: `${clamped}%` }} transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }} />
          )}
          {/* subtle sheen sweep when filling */}
          {!indeterminate && !reduced && (
            <motion.div aria-hidden className="pointer-events-none absolute inset-y-0 w-[40%] rounded-full opacity-40" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)" }} animate={{ x: ["-60%", "260%"] }} transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.2 }} />
          )}
        </div>
        {showValue && !indeterminate && (
          <motion.div key={Math.round(clamped)} initial={reduced ? false : { scale: 1.06 }} animate={{ scale: 1 }} className="mt-1.5 text-right font-mono text-xs text-[color:var(--b-muted)]">
            {formatValue ? formatValue(value, max) : `${Math.round(clamped)}%`}
          </motion.div>
        )}
      </div>
    );
  }
);
Progress.displayName = "Progress";
export { Progress };
