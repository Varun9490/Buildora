"use client";

import * as React from "react";
import { cn } from "../utils";

export interface TUIGaugeProps {
  value: number;
  max?: number;
  label?: string;
  unit?: string;
  className?: string;
  color?: "default" | "success" | "warning" | "error";
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

const gaugeColors = {
  default: { fill: "█", empty: "░", text: "text-cyan-400" },
  success: { fill: "█", empty: "░", text: "text-green-400" },
  warning: { fill: "█", empty: "░", text: "text-yellow-400" },
  error: { fill: "█", empty: "░", text: "text-red-400" },
};

const gaugeSizes = {
  sm: { width: 20, labelSize: "text-[10px]" },
  md: { width: 30, labelSize: "text-xs" },
  lg: { width: 40, labelSize: "text-sm" },
};

const gaugeStyles = {
  default: "text-cyan-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
};

export function TUIGauge({
  value,
  max = 100,
  label,
  unit = "%",
  className,
  color = "default",
  showValue = true,
  size = "md",
}: TUIGaugeProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const renderGauge = () => {
    const rows: string[] = [];
    const width = gaugeSizes[size].width;
    const mid = Math.floor(width / 2);

    for (let row = 0; row < 5; row++) {
      const rowStart = row === 0 ? mid : mid - row;
      const rowEnd = row === 0 ? mid + 1 : mid + row + 1;
      const rowWidth = rowEnd - rowStart;
      
      const filledRatio = percentage / 100;
      const filledWidth = Math.floor(filledRatio * rowWidth);
      
      const filled = gaugeColors[color].fill.repeat(filledWidth);
      const empty = gaugeColors[color].empty.repeat(rowWidth - filledWidth);
      
      const padding = " ".repeat(rowStart);
      rows.push(padding + filled + empty);
    }
    return rows;
  };

  const gaugeArt = renderGauge();

  return (
    <div
      className={cn("font-mono inline-flex flex-col items-center", className)}
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <pre className={cn(gaugeStyles[color], "leading-tight")}>
        {gaugeArt.join("\n")}
      </pre>
      {showValue && (
        <div className={cn("mt-1", gaugeSizes[size].labelSize)}>
          <span className={gaugeColors[color].text}>
            {Math.round(percentage)}
            {unit}
          </span>
        </div>
      )}
      {label && (
        <div className="text-white/50 text-[10px] mt-0.5">{label}</div>
      )}
    </div>
  );
}
