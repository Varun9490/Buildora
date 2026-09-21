"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ButtonVariant = "default" | "destructive" | "outline" | "ghost" | "link" | "accent";
export type ButtonSize = "default" | "sm" | "lg" | "icon";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const reducedMotion = useReducedMotion();
    const isDisabled = disabled || loading;

    const baseStyles = cn(
      "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--b-bg)]",
      "disabled:pointer-events-none disabled:opacity-50",
      !reducedMotion && "active:scale-[0.98]",
      className
    );

    const variantStyles: Record<ButtonVariant, string> = {
      default:
        "rounded-[10px] bg-[color:var(--b-surface)] text-[color:var(--b-text)] border border-[color:var(--b-border)] hover:border-[color:var(--b-border-hover)] hover:bg-[color:var(--b-elevated)]",
      destructive:
        "rounded-[10px] bg-[color-mix(in_oklab,var(--b-danger)_10%,transparent)] text-[color:var(--b-danger)] border border-[color-mix(in_oklab,var(--b-danger)_20%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-danger)_15%,transparent)]",
      outline:
        "rounded-[10px] bg-transparent text-[color:var(--b-text)] border border-[color:var(--b-border-hover)] hover:bg-[color:var(--b-surface)]",
      ghost: "rounded-[10px] bg-transparent text-[color:var(--b-text-secondary)] hover:bg-[color:var(--b-surface)] hover:text-[color:var(--b-text)]",
      link: "bg-transparent text-[color:var(--b-accent)] underline-offset-4 hover:underline",
      accent:
        "rounded-[10px] bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)] font-semibold hover:brightness-[1.03]",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      lg: "px-6 py-3 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size])}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children && <span>{children}</span>}
        {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
