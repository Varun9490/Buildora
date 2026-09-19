"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type BadgeVariant = "default" | "secondary" | "success" | "warning" | "danger" | "outline" | "accent";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: "default" | "sm" | "lg";
  icon?: React.ReactNode;
};

function Badge({
  className,
  variant = "default",
  size = "default",
  icon,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-white/10 text-white/80 border-white/10",
    secondary: "bg-white/5 text-white/60 border-white/5",
    success: "bg-[#4fe08a]/15 text-[#4fe08a] border-[#4fe08a]/20",
    warning: "bg-[#ffb86b]/15 text-[#ffb86b] border-[#ffb86b]/20",
    danger: "bg-red-500/15 text-red-400 border-red-500/20",
    outline: "bg-transparent text-white/70 border-white/20",
    accent: "bg-[#d4ff4f]/15 text-[#d4ff4f] border-[#d4ff4f]/20",
  };

  const sizeStyles: Record<"default" | "sm" | "lg", string> = {
    default: "px-2.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-[10px]",
    lg: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-mono font-medium transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export type ChipProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BadgeVariant;
  selected?: boolean;
  icon?: React.ReactNode;
};

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant = "default", selected, icon, children, ...props }, ref) => {
    const variantStyles: Record<BadgeVariant, string> = {
      default: selected
        ? "bg-white/15 text-white border-white/20"
        : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white/80",
      secondary: selected
        ? "bg-white/10 text-white border-white/15"
        : "bg-white/[0.03] text-white/50 border-white/5 hover:bg-white/5 hover:text-white/70",
      success: selected
        ? "bg-[#4fe08a]/25 text-[#4fe08a] border-[#4fe08a]/30"
        : "bg-[#4fe08a]/10 text-[#4fe08a]/60 border-[#4fe08a]/10 hover:bg-[#4fe08a]/15",
      warning: selected
        ? "bg-[#ffb86b]/25 text-[#ffb86b] border-[#ffb86b]/30"
        : "bg-[#ffb86b]/10 text-[#ffb86b]/60 border-[#ffb86b]/10 hover:bg-[#ffb86b]/15",
      danger: selected
        ? "bg-red-500/25 text-red-400 border-red-500/30"
        : "bg-red-500/10 text-red-400/60 border-red-500/10 hover:bg-red-500/15",
      outline: selected
        ? "bg-white/10 text-white border-white/30"
        : "bg-transparent text-white/50 border-white/20 hover:bg-white/5 hover:border-white/30",
      accent: selected
        ? "bg-[#d4ff4f]/25 text-[#d4ff4f] border-[#d4ff4f]/40"
        : "bg-[#d4ff4f]/5 text-[#d4ff4f]/60 border-[#d4ff4f]/10 hover:bg-[#d4ff4f]/10",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Chip.displayName = "Chip";

export { Badge, Chip };
