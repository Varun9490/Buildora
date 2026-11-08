"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion, useMagnetic } from "@buildora/hooks";

export type MagneticTextProps = React.HTMLAttributes<HTMLSpanElement> & {
  /** Pull strength, 0 (none) to 1 (full). */
  strength?: number;
  /** Attraction radius in px — the cursor feels the pull before it arrives. */
  radius?: number;
  /** Turn the pointer attraction off. Overrides reduced motion. */
  disabled?: boolean;
};

/**
 * MagneticText — the text-level sibling of MagneticButton. Display type
 * leans toward the cursor with spring physics (shared rAF spring via
 * useMagnetic, transform written directly, no re-renders). Under reduced
 * motion the text sits still; the spring never arms. Pass `disabled` to opt
 * out entirely.
 */
export function MagneticText({
  strength = 0.22,
  radius = 160,
  disabled = false,
  className,
  children,
  ...rest
}: MagneticTextProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const { reset } = useMagnetic(ref as React.RefObject<HTMLElement>, { strength, radius, disabled: !!reduced || !!disabled });

  return (
    <span
      ref={ref}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn("relative inline-block will-change-transform", className)}
      {...rest}
    >
      {children}
    </span>
  );
}

export default MagneticText;
