"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type TypingIndicatorProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: number;
  variant?: "accent" | "success" | "danger" | "muted";
  label?: string;
  typing?: boolean;
  dots?: number;
};

const VARIANT_COLOR: Record<NonNullable<TypingIndicatorProps["variant"]>, string> = {
  accent: "var(--b-accent)",
  success: "var(--b-success)",
  danger: "var(--b-danger)",
  muted: "var(--b-muted)",
};

/**
 * TypingIndicator — three (or N) dots that bounce in a staggered wave,
 * the classic "someone is typing" affordance. Reduced-motion users get a
 * static row of dots instead of the bouncing animation. role=status so
 * screen readers announce it once.
 */
export function TypingIndicator({
  size = 6,
  variant = "muted",
  label,
  typing = true,
  dots = 3,
  className,
  ...rest
}: TypingIndicatorProps) {
  const reduced = useReducedMotion();
  const color = VARIANT_COLOR[variant];
  const animate = typing && !reduced;
  const count = Math.max(1, Math.min(dots, 6));

  return (
    <span
      role="status"
      aria-label={label ?? "Typing"}
      className={cn("inline-flex items-center gap-2", className)}
      {...rest}
    >
      <span className="inline-flex items-center gap-1" aria-hidden>
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
            className={cn("inline-block rounded-full", animate && "animate-bounce")}
            style={{
              width: size,
              height: size,
              background: color,
              animationDelay: animate ? `${i * 0.15}s` : undefined,
              animationDuration: animate ? "0.9s" : undefined,
            }}
          />
        ))}
      </span>
      {label && <span className="text-xs text-[color:var(--b-text-secondary)]">{label}</span>}
    </span>
  );
}

export default TypingIndicator;
