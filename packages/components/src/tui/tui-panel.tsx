"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUIPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  focused?: boolean;
  bordered?: boolean;
  borderColor?: "default" | "accent" | "success" | "warning" | "error";
  padding?: "none" | "sm" | "md" | "lg";
}

const borderColors = {
  default: "border-[color-mix(in_oklab,var(--b-border)_20%,transparent)]",
  accent: "border-[color:var(--b-accent)]/50",
  success: "border-[color:var(--b-success)]/50",
  warning: "border-[color:var(--b-warning)]/50",
  error: "border-[color:var(--b-danger)]/50",
};

const focusBorders = {
  default: "focus-within:border-[color:var(--b-accent)]",
  accent: "focus-within:border-[color:var(--b-accent)]",
  success: "focus-within:border-[color:var(--b-success)]",
  warning: "focus-within:border-[color:var(--b-warning)]",
  error: "focus-within:border-[color:var(--b-danger)]",
};

const paddingSizes = {
  none: "",
  sm: "p-1",
  md: "p-2",
  lg: "p-3",
};

export function TUIPanel({
  title,
  children,
  className,
  focused = false,
  bordered = true,
  borderColor = "default",
  padding = "md",
}: TUIPanelProps) {
  return (
    <div
      className={cn(
        "font-mono text-xs bg-[var(--b-bg)] overflow-hidden",
        bordered && "border",
        focused ? focusBorders[borderColor] : borderColors[borderColor],
        paddingSizes[padding],
        className
      )}
      tabIndex={focused ? 0 : -1}
      role="region"
      aria-label={title}
    >
      {title && (
        <div className="flex items-center gap-2 px-2 py-1 border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] mb-2">
          {focused && <span className="text-[color:var(--b-accent)]">●</span>}
          <span className="text-[color-mix(in_oklab,var(--b-text)_60%,transparent)] text-[11px] uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      <div className={cn(title && "px-1")}>{children}</div>
    </div>
  );
}
