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
  default: "border-white/20",
  accent: "border-cyan-500/50",
  success: "border-green-500/50",
  warning: "border-yellow-500/50",
  error: "border-red-500/50",
};

const focusBorders = {
  default: "focus-within:border-cyan-400",
  accent: "focus-within:border-cyan-300",
  success: "focus-within:border-green-300",
  warning: "focus-within:border-yellow-300",
  error: "focus-within:border-red-300",
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
        "font-mono text-xs bg-[#0a0c10] overflow-hidden",
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
        <div className="flex items-center gap-2 px-2 py-1 border-b border-white/10 mb-2">
          {focused && <span className="text-cyan-400">●</span>}
          <span className="text-white/60 text-[11px] uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}
      <div className={cn(title && "px-1")}>{children}</div>
    </div>
  );
}
