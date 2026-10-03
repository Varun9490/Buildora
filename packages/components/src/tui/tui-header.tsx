"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export interface TUIHeaderProps {
  title: string;
  subtitle?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  color?: "default" | "accent" | "success" | "warning" | "error";
}

const headerColors = {
  default: "bg-[var(--b-bg)] border-[color-mix(in_oklab,var(--b-border)_10%,transparent)]",
  accent: "bg-[#0a1520] border-[color:var(--b-accent)]/20",
  success: "bg-[#0a1510] border-[color:var(--b-success)]/20",
  warning: "bg-[#15100a] border-[color:var(--b-warning)]/20",
  error: "bg-[#150a0a] border-[color:var(--b-danger)]/20",
};

const titleColors = {
  default: "text-[color-mix(in_oklab,var(--b-text)_90%,transparent)]",
  accent: "text-[color:var(--b-accent)]",
  success: "text-[color:var(--b-success)]",
  warning: "text-[color:var(--b-warning)]",
  error: "text-[color:var(--b-danger)]",
};

export function TUIHeader({
  title,
  subtitle,
  leftContent,
  rightContent,
  className,
  color = "default",
}: TUIHeaderProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-3 py-2 border-b font-mono",
        headerColors[color],
        className
      )}
      role="banner"
    >
      <div className="flex items-center gap-3">
        {leftContent}
        <div className="flex items-center gap-2">
          <h1 className={cn("text-sm font-medium tracking-wide", titleColors[color])}>
            {title}
          </h1>
          {subtitle && (
            <span className="text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{subtitle}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">{rightContent}</div>
    </header>
  );
}
