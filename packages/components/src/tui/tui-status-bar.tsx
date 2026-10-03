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
  default: "text-[color-mix(in_oklab,var(--b-text)_90%,transparent)]",
  success: "text-[color:var(--b-success)]",
  warning: "text-[color:var(--b-warning)]",
  error: "text-[color:var(--b-danger)]",
  accent: "text-[color:var(--b-accent)]",
};

export function TUIStatusBar({ items, className }: TUIStatusBarProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 px-3 py-1 bg-[var(--b-bg)] border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] font-mono text-[11px]",
        className
      )}
      role="status"
      aria-label="Status bar"
    >
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span className="text-[color-mix(in_oklab,var(--b-text)_20%,transparent)]" aria-hidden>
              │
            </span>
          )}
          <span className="flex items-center gap-1">
            {item.label && (
              <span className="text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{item.label}:</span>
            )}
            <span className={valueColors[item.color || "default"]}>
              {item.value}
            </span>
          </span>
        </React.Fragment>
      ))}
      <span className="flex-1" />
      <span className="text-[color-mix(in_oklab,var(--b-text)_30%,transparent)]">Press ? for help</span>
    </div>
  );
}
