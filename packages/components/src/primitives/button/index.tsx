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
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff4f]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08090d]",
      "disabled:pointer-events-none disabled:opacity-50",
      !reducedMotion && "active:scale-[0.98]",
      className
    );

    const variantStyles: Record<ButtonVariant, string> = {
      default:
        "rounded-xl bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20",
      destructive:
        "rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
      outline:
        "rounded-xl bg-transparent text-white border border-white/20 hover:bg-white/5 hover:border-white/30",
      ghost: "rounded-xl bg-transparent text-white/70 hover:bg-white/5 hover:text-white",
      link: "bg-transparent text-[#d4ff4f] underline-offset-4 hover:underline",
      accent:
        "rounded-xl bg-[#d4ff4f] text-black font-semibold hover:bg-[#d4ff4f]/90 shadow-glow-sm",
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
