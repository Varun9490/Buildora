"use client";

import * as React from "react";
import { cn } from "../../utils";

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
    default: "bg-[--b-surface] text-[--b-text-secondary] border-[--b-border]",
    secondary: "bg-[--b-panel] text-[--b-muted] border-[--b-border]",
    success: "bg-[--b-success]/10 text-[--b-success] border-[--b-success]/25",
    warning: "bg-[--b-warning]/10 text-[--b-warning] border-[--b-warning]/25",
    danger: "bg-[--b-danger]/10 text-[--b-danger] border-[--b-danger]/25",
    outline: "bg-transparent text-[--b-text-secondary] border-[--b-border-hover]",
    accent: "bg-[--b-accent-muted] text-[--b-accent] border-[--b-accent]/30",
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
        ? "bg-[--b-text]/10 text-[--b-text] border-[--b-border-hover]"
        : "bg-[--b-surface] text-[--b-text-secondary] border-[--b-border] hover:bg-[--b-elevated]",
      secondary: selected
        ? "bg-[--b-surface] text-[--b-text] border-[--b-border-hover]"
        : "bg-[--b-panel] text-[--b-muted] border-[--b-border] hover:text-[--b-text-secondary]",
      success: selected
        ? "bg-[--b-success]/20 text-[--b-success] border-[--b-success]/30"
        : "bg-[--b-success]/10 text-[--b-success] border-[--b-success]/15 hover:bg-[--b-success]/15",
      warning: selected
        ? "bg-[--b-warning]/20 text-[--b-warning] border-[--b-warning]/30"
        : "bg-[--b-warning]/10 text-[--b-warning] border-[--b-warning]/15 hover:bg-[--b-warning]/15",
      danger: selected
        ? "bg-[--b-danger]/20 text-[--b-danger] border-[--b-danger]/30"
        : "bg-[--b-danger]/10 text-[--b-danger] border-[--b-danger]/15 hover:bg-[--b-danger]/15",
      outline: selected
        ? "bg-[--b-surface] text-[--b-text] border-[--b-border-hover]"
        : "bg-transparent text-[--b-text-secondary] border-[--b-border] hover:bg-[--b-surface]",
      accent: selected
        ? "bg-[--b-accent]/25 text-[--b-accent] border-[--b-accent]/40"
        : "bg-[--b-accent-muted] text-[--b-accent] border-[--b-accent]/20 hover:bg-[--b-accent]/15",
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
