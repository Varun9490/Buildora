"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUISparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  color?: "default" | "success" | "warning" | "error";
  showMinMax?: boolean;
  label?: string;
}

const sparklineChars = {
  default: ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"],
  dots: ["⠁", "⠃", "⠇", "⡇", "⡏", "⡟", "⡿", "⣿"],
};

const sparklineColors = {
  default: "text-cyan-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
};

export function TUISparkline({
  data,
  width = 20,
  height = 1,
  className,
  color = "default",
  showMinMax = false,
  label,
}: TUISparklineProps) {
  if (data.length === 0) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const chars = sparklineChars.default;

  const normalized = data.map((v) => Math.round(((v - min) / range) * (chars.length - 1)));
  const paddedData = normalized.slice(-width);
  const padding = width - paddedData.length;
  const sparkline = " ".repeat(Math.max(0, padding)) + 
    paddedData.map((v) => chars[Math.min(v, chars.length - 1)]).join("");

  return (
    <div className={cn("font-mono text-xs inline-flex flex-col", className)}>
      {label && (
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-white/50 text-[10px]">{label}</span>
          {showMinMax && (
            <span className="text-white/30 text-[10px]">
              {min.toFixed(1)} – {max.toFixed(1)}
            </span>
          )}
        </div>
      )}
      <div className={cn("flex", sparklineColors[color])}>
        {height > 1 ? (
          <pre className="leading-none">{sparkline}</pre>
        ) : (
          <span className={sparklineColors[color]}>{sparkline}</span>
        )}
      </div>
      {!label && showMinMax && (
        <div className="flex justify-between text-[10px] text-white/30 mt-0.5">
          <span>-{min.toFixed(0)}</span>
          <span>+{max.toFixed(0)}</span>
        </div>
      )}
    </div>
  );
}
