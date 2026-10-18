"use client";

import * as React from "react";
import { cn, clamp } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   PROGRESS — a meter that reads like one: label + value ride
   ABOVE the track, the fill announces itself to AT with the
   same formatted number you see, the completion sheen knows
   when to stop, and indeterminate is a contained slide instead
   of a fly-through.
   ───────────────────────────────────────────────────────────── */

export type ProgressVariant = "default" | "accent" | "success" | "warning" | "danger";
export type ProgressSize = "sm" | "default" | "lg";

export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  /** renders the slot row: label left, formatted value right */
  label?: string;
  showValue?: boolean;
  /** formatted string announced to AT and shown when showValue */
  formatValue?: (value: number, max: number) => string;
  indeterminate?: boolean;
 };

const fillVariantStyles: Record<ProgressVariant, string> = {
  default: "bg-[color:var(--b-text)]",
  accent: "bg-[color:var(--b-accent)] shadow-[0_0_12px_var(--b-accent-glow,transparent)]",
  success: "bg-[color:var(--b-success)]",
  warning: "bg-[color:var(--b-warning)]",
  danger: "bg-[color:var(--b-danger)]",
} as const;

const trackSizeStyles: Record<ProgressSize, string> = {
  sm: "h-1.5",
  default: "h-2",
  lg: "h-3",
} as const;

function defaultFormat(value: number, max: number) {
  return `${Math.round(clamp(value, 0, max) / max * 100)}%`;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    { className, value = 0, max = 100, variant = "default", size = "default", label, showValue = false, formatValue, indeterminate = false, ...props },
    ref
  ) => {
    const reduced = useReducedMotion();
    const pctP = clamp(value, 0, max);
    const clamped = (pctP / max) * 100;
    const formatted = formatValue ? formatValue(value, max) : defaultFormat(value, max);
    const filling = !indeterminate && clamped > 0 && clamped < 100;
    const showSlot = Boolean(label) || showValue;

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        {showSlot && (
          <div className="mb-2 flex items-baseline justify-between gap-2">
            {label ? (
              <span className="truncate text-xs font-medium text-[color:var(--b-text-secondary)] antialiased">{label}</span>
            ) : (
              <span className="sr-only" role="text">Progress</span>
            )}
            {showValue && !indeterminate && (
              <motion.span
                aria-hidden
                initial={false}
                animate={{ opacity: filling ? [0.65, 1, 1] : 1 }}
                key={formatted}
                transition={{ duration: 0.5 }}
                className="shrink-0 font-mono text-[11px] tabular-nums text-[color:var(--b-muted)]"
              >
                {formatted}
              </motion.span>
            )}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={indeterminate ? undefined : pctP}
          aria-valuetext={indeterminate ? undefined : formatted}
          className={cn(
            "relative w-full overflow-hidden rounded-full",
            "bg-[color:color-mix(in_oklab,var(--b-text)_9%,transparent)] border border-[color:color-mix(in_oklab,var(--b-border)_40%,transparent)]",
            trackSizeStyles[size]
          )}
        >
          {indeterminate ? (
            <motion.div
              className={cn("h-full w-[42%] rounded-full", fillVariantStyles[variant])}
              style={{ width: "42%" }}
              initial={{ x: "-100%" }}
              animate={{ x: ["-100%", "240%"] }}
              transition={reduced ? { duration: 0 } : { repeat: Infinity, repeatDelay: 0.35, duration: 1.3, ease: "easeInOut" }}
            />
          ) : (
            <motion.div
              className={cn("h-full rounded-full", fillVariantStyles[variant])}
              initial={false}
              animate={{ width: `${clamped}%` }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
            />
          )}
          {filling && !reduced && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-[35%] rounded-full mix-blend-overlay"
              style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)" }}
              animate={{ x: ["-110%", "300%"] }}
              transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1], repeatDelay: 1.1, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
