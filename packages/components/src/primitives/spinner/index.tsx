"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type SpinnerSize = "default" | "sm" | "lg" | "xl";
export type SpinnerVariant = "default" | "accent" | "light" | "orbit";

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
};

const sizeMap: Record<SpinnerSize, string> = {
  sm: "h-4 w-4",
  default: "h-7 w-7",
  lg: "h-10 w-10",
  xl: "h-14 w-14",
};

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "default", variant = "default", label = "Loading…", ...props }, ref) => {
    const reduced = useReducedMotion();

    if (variant === "orbit" && !reduced) {
      return (
        <div ref={ref} role="status" aria-label={label} className={cn("relative inline-flex items-center justify-center", sizeMap[size], className)} {...props}>
          <span className="sr-only">{label}</span>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)] shadow-[0_0_8px_var(--b-accent-glow)]"
              style={{ left: "50%", top: "50%" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, ease: "linear", repeat: Infinity, delay: i * -0.3 }}
            >
              <span
                className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[color:var(--b-accent)]"
                style={{ transform: `translate(-50%, -50%) translateX(${size === "sm" ? 10 : size === "lg" ? 18 : size === "xl" ? 24 : 14}px)` } as React.CSSProperties}
              />
            </motion.span>
          ))}
          {/* center dot */}
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)] opacity-60" />
        </div>
      );
    }

    const color =
      variant === "accent"
        ? "text-[color:var(--b-accent)] drop-shadow-[0_0_10px_var(--b-accent-glow)]"
        : variant === "light"
          ? "text-[color:var(--b-muted)]"
          : "text-[color:var(--b-accent)]";

    return (
      <div ref={ref} role="status" aria-label={label} className="inline-flex items-center" {...props}>
        <motion.svg
          className={cn(sizeMap[size], color, className)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden
          animate={reduced ? undefined : { rotate: 360 }}
          transition={reduced ? undefined : { duration: 0.85, ease: "linear", repeat: Infinity }}
          style={{ originX: "50%", originY: "50%" }}
        >
          <circle className="opacity-15" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3.5" />
          <motion.path
            d="M12 2a10 10 0 0 1 10 10"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
            className="opacity-90"
            style={{ originX: "50%", originY: "50%" }}
          />
        </motion.svg>
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);
Spinner.displayName = "Spinner";
