"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type CometRingSpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: number;
  /** Trailing dots around the ring. */
  dots?: number;
  durationMs?: number;
  /** Accessible announcement. */
  label?: string;
  tone?: "accent" | "iris" | "text";
};

const TONE: Record<NonNullable<CometRingSpinnerProps["tone"]>, string> = {
  accent: "var(--b-accent)",
  iris: "var(--b-iris)",
  text: "var(--b-text)",
};

/**
 * CometRingSpinner — a comet head racing around a ring of fading trail
 * dots. Pure CSS transforms, no re-renders, role="status". Frozen under
 * reduced motion.
 */
export function CometRingSpinner({
  size = 44,
  dots = 14,
  durationMs = 1400,
  label = "Loading",
  tone = "accent",
  className,
  style,
  ...rest
}: CometRingSpinnerProps) {
  const reduced = useReducedMotion();
  const color = TONE[tone];
  const R = size / 2.4;

  return (
    <div role="status" aria-label={label} className={cn("inline-flex", className)} style={style} {...rest}>
      <span
        aria-hidden="true"
        className="relative inline-block rounded-full"
        style={{ width: size, height: size }}
      >
        <span
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: "color-mix(in oklab, var(--b-border) 70%, transparent)" }}
        />
        {Array.from({ length: dots }, (_, i) => {
          const t = i / dots;
          const isHead = i === 0;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full"
              style={{
                width: isHead ? Math.max(4, size * 0.14) : Math.max(2.5, size * 0.075),
                height: isHead ? Math.max(4, size * 0.14) : Math.max(2.5, size * 0.075),
                background: color,
                opacity: isHead ? 1 : 0.75 * Math.pow(1 - t, 1.6),
                transformOrigin: `0 0`,
                transform: `translate(${Math.sin(t * Math.PI * 2) * R}px, ${-Math.cos(t * Math.PI * 2) * R}px) translate(-50%,-50%)`,
                animation: reduced
                  ? undefined
                  : `bk-comet-fade ${durationMs}ms linear ${((durationMs / dots) * (dots - i)) % durationMs}ms infinite`,
              }}
            />
          );
        })}
        <style>
          {`@keyframes bk-comet-fade{0%{opacity:.9}60%{opacity:.25}100%{opacity:.75}}`}
        </style>
      </span>
    </div>
  );
}

export default CometRingSpinner;
