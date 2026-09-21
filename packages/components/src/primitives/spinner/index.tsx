"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type SpinnerSize = "default" | "sm" | "lg" | "xl";
export type SpinnerVariant = "default" | "accent" | "light";

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
};

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "default", variant = "default", label = "Loading...", ...props }, ref) => {
    const sizeStyles: Record<SpinnerSize, string> = {
      default: "h-8 w-8",
      sm: "h-4 w-4",
      lg: "h-12 w-12",
      xl: "h-16 w-16",
    };

    const variantStyles: Record<SpinnerVariant, string> = {
      default: "text-[color:var(--b-accent)]",
      accent: "text-[color:var(--b-accent)] drop-shadow-[0_0_8px_rgba(212,255,79,0.5))]",
      light: "text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]",
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className="inline-flex items-center"
        {...props}
      >
        <svg
          className={cn(
            "animate-spin",
            sizeStyles[size],
            variantStyles[variant],
            className
          )}
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
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };
