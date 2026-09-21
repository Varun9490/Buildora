"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUIProgressProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  color?: "default" | "success" | "warning" | "error";
  animated?: boolean;
}

const progressColors = {
  default: "bg-cyan-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

const textColors = {
  default: "text-cyan-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
};

export function TUIProgress({
  value,
  max = 100,
  label,
  showValue = true,
  className,
  color = "default",
  animated = false,
}: TUIProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const filled = Math.floor(percentage / 5);
  const empty = 20 - filled;

  return (
    <div className={cn("font-mono text-xs", className)}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]">{label}</span>
          {showValue && (
            <span className={textColors[color]}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className="flex items-center h-4 bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] rounded"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="flex items-center px-0.5 w-full h-full">
          <span className={cn("flex", progressColors[color], animated && "animate-pulse")}>
            {"█".repeat(filled)}
          </span>
          <span className="text-[color-mix(in_oklab,var(--b-text)_20%,transparent)]">{"░".repeat(empty)}</span>
        </div>
      </div>
      {!label && showValue && (
        <div className="text-center mt-0.5">
          <span className={textColors[color]}>{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
}
