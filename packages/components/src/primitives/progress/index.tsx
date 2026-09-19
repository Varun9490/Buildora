"use client";

import * as React from "react";
import { cn, clamp } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

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
      default: "bg-white/20",
      accent: "bg-[#d4ff4f]",
      success: "bg-[#4fe08a]",
      warning: "bg-[#ffb86b]",
      danger: "bg-red-500",
    };

    const sizeStyles: Record<ProgressSize, string> = {
      default: "h-2",
      sm: "h-1",
      lg: "h-3",
    };

    return (
      <div className={cn("w-full", className)} ref={ref} {...props}>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={indeterminate ? undefined : value}
          className={cn(
            "relative w-full overflow-hidden rounded-full bg-white/10 border border-white/5",
            sizeStyles[size]
          )}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all",
              !reducedMotion && "duration-300",
              variantStyles[variant],
              indeterminate && !reducedMotion && "animate-pulse animate-[loading_1.5s_ease-in-out_infinite]"
            )}
            style={{
              width: indeterminate ? "30%" : `${clampedPercentage}%`,
            }}
          />
        </div>
        {showValue && !indeterminate && (
          <div className="mt-1.5 text-xs text-white/50 text-right">
            {formatValue ? formatValue(value, max) : `${Math.round(clampedPercentage)}%`}
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
