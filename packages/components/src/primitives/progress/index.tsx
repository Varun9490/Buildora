"use client";

import * as React from "react";
import { cn, clamp } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type ProgressVariant = "default" | "accent" | "success" | "warning" | "danger";
export type ProgressSize = "default" | "sm" | "lg";

export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  size?: ProgressSize;
  showValue?: boolean;
  formatValue?: (value: number, max: number) => string;
  indeterminate?: boolean;
};

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({
    className,
    value = 0,
    max = 100,
    variant = "default",
    size = "default",
    showValue = false,
    formatValue,
    indeterminate = false,
    ...props
  }, ref) => {
    const reducedMotion = useReducedMotion();
    const percentage = indeterminate ? 50 : clamp(value, 0, max);
    const clampedPercentage = (percentage / max) * 100;

    const variantStyles: Record<ProgressVariant, string> = {
      default: "bg-[color-mix(in_oklab,var(--b-text)_20%,transparent)]",
      accent: "bg-[color:var(--b-accent)]",
      success: "bg-[color:var(--b-success)]",
      warning: "bg-[#ffb86b]",
      danger: "bg-red-500",
    };

    const sizeStyles: Record<ProgressSize, string> = {
      default: "h-2",
      sm: "h-1",
      lg: "h-3",
    };

    return (
      <div className={cn("w-full max-w-sm", className)} ref={ref} {...props}>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={indeterminate ? undefined : value}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_5%,transparent)]",
            sizeStyles[size]
          )}
        >
          {indeterminate ? (
            <motion.div
              className={cn(
                "h-full rounded-full",
                variantStyles[variant]
              )}
              initial={{ x: "-100%", width: "30%" }}
              animate={{ x: "300%" }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          ) : (
            <motion.div
              className={cn(
                "h-full rounded-full",
                variantStyles[variant]
              )}
              animate={{ width: `${clampedPercentage}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
          )}
        </div>
        {showValue && !indeterminate && (
          <div className="mt-1.5 text-xs text-[color-mix(in_oklab,var(--b-text)_50%,transparent)] text-right">
            {formatValue ? formatValue(value, max) : `${Math.round(clampedPercentage)}%`}
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
