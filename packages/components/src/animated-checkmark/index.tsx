"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type AnimatedCheckmarkProps = React.HTMLAttributes<HTMLSpanElement> & {
  size?: number;
  variant?: "accent" | "success" | "danger" | "muted";
  checked?: boolean;
  label?: string;
};

const VARIANT_COLOR: Record<NonNullable<AnimatedCheckmarkProps["variant"]>, string> = {
  accent: "var(--b-accent)",
  success: "var(--b-success)",
  danger: "var(--b-danger)",
  muted: "var(--b-muted)",
};

/**
 * AnimatedCheckmark — an SVG checkmark that draws itself in with a
 * stroke-dashoffset transition, the classic "success" affordance. The
 * draw-in is disabled under reduced motion (the final state shows
 * immediately). `checked` toggles the drawn state so it can be reused
 * for confirmations, payments, and form submissions.
 */
export function AnimatedCheckmark({
  size = 24,
  variant = "success",
  checked = true,
  label,
  className,
  ...rest
}: AnimatedCheckmarkProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const color = VARIANT_COLOR[variant];
  const drawn = checked && (reduced || mounted);

  return (
    <span
      role="img"
      aria-label={label ?? "Success"}
      className={cn("inline-flex items-center gap-2", className)}
      {...rest}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth="2"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={drawn ? 0 : 1}
          style={{ transition: reduced ? "none" : "stroke-dashoffset 320ms ease-out" }}
        />
        <path
          d="M7 12.5 L10.5 16 L17 9"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={drawn ? 0 : 1}
          style={{ transition: reduced ? "none" : "stroke-dashoffset 360ms ease-out 120ms" }}
        />
      </svg>
      {label && (
        <span className="text-xs text-[color:var(--b-text-secondary)]">{label}</span>
      )}
    </span>
  );
}

export default AnimatedCheckmark;
