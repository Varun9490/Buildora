"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion, useMagnetic } from "@buildora/hooks";
import { z } from "zod";

const magneticButtonSchema = z.object({
  strength: z.number().min(0).max(1).optional(),
  radius: z.number().min(0).optional(),
  glow: z.boolean().optional(),
  variant: z.enum(["accent", "ghost", "iris"]).optional(),
});

export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  strength?: number;
  radius?: number;
  glow?: boolean;
  variant?: "accent" | "ghost" | "iris";
};

/**
 * MagneticButton — spring-magnetic, now with true proximity radius
 * (pointermove watched globally so attraction begins before the cursor
 * touches the button). Real <button> semantics, rAF spring, glow wash.
 */
export function MagneticButton({ strength = 0.38, radius = 180, glow = true, variant = "accent", className, children, ...rest }: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const { reset } = useMagnetic(ref as React.RefObject<HTMLElement>, { strength, radius, disabled: !!reduced });

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const res = magneticButtonSchema.safeParse({ strength, radius, glow, variant });
      if (!res.success) console.warn("[MagneticButton] Invalid props:", res.error.format());
    }
  }, [strength, radius, glow, variant]);

  const styles =
    variant === "accent"
      ? "bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)] shadow-[0_8px_32px_-8px_var(--b-accent-glow)] hover:shadow-[0_12px_40px_-10px_var(--b-accent-glow)] hover:brightness-[1.04]"
      : variant === "iris"
        ? "bg-[color:var(--b-panel)] text-[color:var(--b-text)] border border-[color:var(--b-border)] hover:border-[color:var(--b-iris)]/30 hover:bg-[color:var(--b-surface)]"
        : "bg-[color:var(--b-surface)] text-[color:var(--b-text-secondary)] border border-[color:var(--b-border)] hover:bg-[color:var(--b-elevated)] hover:text-[color:var(--b-text)]";

  return (
    <button
      ref={ref}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-[12px] px-6 py-3 text-sm font-semibold isolate overflow-hidden",
        "transition-[background-color,border-color,box-shadow,filter] duration-300 will-change-transform",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--b-bg)]",
        "active:scale-[0.98]",
        styles,
        className
      )}
      {...rest}
    >
      {glow && variant === "accent" && !reduced && (
        <span aria-hidden className="pointer-events-none absolute -inset-6 opacity-60 blur-2xl" style={{ background: "radial-gradient(closest-side, var(--b-accent-glow), transparent 70%)" }} />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export default MagneticButton;
