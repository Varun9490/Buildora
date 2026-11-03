"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type PulseRingProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: number;
  variant?: "accent" | "success" | "danger" | "muted";
  label?: string;
  pulse?: boolean;
};

const VARIANT_COLOR: Record<NonNullable<PulseRingProps["variant"]>, string> = {
  accent: "var(--b-accent)",
  success: "var(--b-success)",
  danger: "var(--b-danger)",
  muted: "var(--b-muted)",
};

/**
 * PulseRing — a status indicator: a solid dot wrapped by an expanding,
 * fading ring. Useful for "live", "online", "recording" states. The ring
 * animation is disabled under reduced motion; the dot remains visible.
 */
export function PulseRing({
  size = 10,
  variant = "accent",
  label,
  pulse = true,
  className,
  ...rest
}: PulseRingProps) {
  const reduced = useReducedMotion();
  const color = VARIANT_COLOR[variant];
  const animate = pulse && !reduced;

  return (
    <span
      role="status"
      aria-label={label ?? "Live"}
      className={cn("relative inline-flex items-center gap-2", className)}
      {...rest}
    >
      <span className="relative inline-flex" style={{ width: size, height: size }}>
        {animate && (
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full"
            style={{ background: color, opacity: 0.5 }}
          />
        )}
        <span
          aria-hidden
          className="relative inline-flex rounded-full"
          style={{ width: size, height: size, background: color }}
        />
      </span>
      {label && <span className="text-xs text-[color:var(--b-text-secondary)]">{label}</span>}
    </span>
  );
}

export default PulseRing;