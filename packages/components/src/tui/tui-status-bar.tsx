"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUIStatusBarProps {
  items: Array<{
    label?: string;
    value: string;
    color?: "default" | "success" | "warning" | "error" | "accent";
  }>;
  className?: string;
}

const valueColors = {
  default: "text-white/90",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
  accent: "text-cyan-400",
};

export function TUIStatusBar({ items, className }: TUIStatusBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-3 py-1 bg-[#0a0c10] border-t border-white/10 font-mono text-[11px]",
        className
      )}
      role="status"
      aria-label="Status bar"
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="text-white/20" aria-hidden>
              │
            </span>
          )}
          <span className="flex items-center gap-1">
            {item.label && (
              <span className="text-white/40">{item.label}:</span>
            )}
            <span className={valueColors[item.color || "default"]}>
              {item.value}
            </span>
          </span>
        </React.Fragment>
      ))}
      <span className="flex-1" />
      <span className="text-white/30">Press ? for help</span>
    </div>
  );
}
