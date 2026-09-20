"use client";

import * as React from "react";
import { cn } from "../utils";

export interface TUIHeaderProps {
  title: string;
  subtitle?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  className?: string;
  color?: "default" | "accent" | "success" | "warning" | "error";
}

const headerColors = {
  default: "bg-[#0a0c10] border-white/10",
  accent: "bg-[#0a1520] border-cyan-500/20",
  success: "bg-[#0a1510] border-green-500/20",
  warning: "bg-[#15100a] border-yellow-500/20",
  error: "bg-[#150a0a] border-red-500/20",
};

const titleColors = {
  default: "text-white/90",
  accent: "text-cyan-400",
  success: "text-green-400",
  warning: "text-yellow-400",
  error: "text-red-400",
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
            <span className="text-[11px] text-white/40">{subtitle}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">{rightContent}</div>
    </header>
  );
}
