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
    default: "bg-[color:var(--b-surface)] text-[color:var(--b-text-secondary)] border-[color:var(--b-border)]",
    secondary: "bg-[color:var(--b-panel)] text-[color:var(--b-muted)] border-[color:var(--b-border)]",
    success: "bg-[color-mix(in_oklab,var(--b-success)_10%,transparent)] text-[color:var(--b-success)] border-[color-mix(in_oklab,var(--b-success)_25%,transparent)]",
    warning: "bg-[color-mix(in_oklab,var(--b-warning)_10%,transparent)] text-[color:var(--b-warning)] border-[color-mix(in_oklab,var(--b-warning)_25%,transparent)]",
    danger: "bg-[color-mix(in_oklab,var(--b-danger)_10%,transparent)] text-[color:var(--b-danger)] border-[color-mix(in_oklab,var(--b-danger)_25%,transparent)]",
    outline: "bg-transparent text-[color:var(--b-text-secondary)] border-[color:var(--b-border-hover)]",
    accent: "bg-[color:var(--b-accent-muted)] text-[color:var(--b-accent)] border-[color-mix(in_oklab,var(--b-accent)_30%,transparent)]",
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
        ? "bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] text-[color:var(--b-text)] border-[color:var(--b-border-hover)]"
        : "bg-[color:var(--b-surface)] text-[color:var(--b-text-secondary)] border-[color:var(--b-border)] hover:bg-[color:var(--b-elevated)]",
      secondary: selected
        ? "bg-[color:var(--b-surface)] text-[color:var(--b-text)] border-[color:var(--b-border-hover)]"
        : "bg-[color:var(--b-panel)] text-[color:var(--b-muted)] border-[color:var(--b-border)] hover:text-[color:var(--b-text-secondary)]",
      success: selected
        ? "bg-[color-mix(in_oklab,var(--b-success)_20%,transparent)] text-[color:var(--b-success)] border-[color-mix(in_oklab,var(--b-success)_30%,transparent)]"
        : "bg-[color-mix(in_oklab,var(--b-success)_10%,transparent)] text-[color:var(--b-success)] border-[color-mix(in_oklab,var(--b-success)_15%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-success)_15%,transparent)]",
      warning: selected
        ? "bg-[color-mix(in_oklab,var(--b-warning)_20%,transparent)] text-[color:var(--b-warning)] border-[color-mix(in_oklab,var(--b-warning)_30%,transparent)]"
        : "bg-[color-mix(in_oklab,var(--b-warning)_10%,transparent)] text-[color:var(--b-warning)] border-[color-mix(in_oklab,var(--b-warning)_15%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-warning)_15%,transparent)]",
      danger: selected
        ? "bg-[color-mix(in_oklab,var(--b-danger)_20%,transparent)] text-[color:var(--b-danger)] border-[color-mix(in_oklab,var(--b-danger)_30%,transparent)]"
        : "bg-[color-mix(in_oklab,var(--b-danger)_10%,transparent)] text-[color:var(--b-danger)] border-[color-mix(in_oklab,var(--b-danger)_15%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-danger)_15%,transparent)]",
      outline: selected
        ? "bg-[color:var(--b-surface)] text-[color:var(--b-text)] border-[color:var(--b-border-hover)]"
        : "bg-transparent text-[color:var(--b-text-secondary)] border-[color:var(--b-border)] hover:bg-[color:var(--b-surface)]",
      accent: selected
        ? "bg-[color-mix(in_oklab,var(--b-accent)_25%,transparent)] text-[color:var(--b-accent)] border-[color-mix(in_oklab,var(--b-accent)_40%,transparent)]"
        : "bg-[color:var(--b-accent-muted)] text-[color:var(--b-accent)] border-[color-mix(in_oklab,var(--b-accent)_20%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-accent)_15%,transparent)]",
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
