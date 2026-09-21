"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { springStep } from "@buildora/animations";
import { z } from "zod";

const magneticButtonSchema = z.object({
  strength: z.number().min(0).max(1).optional(),
  radius: z.number().min(0).optional(),
  glow: z.boolean().optional(),
  variant: z.enum(["accent", "ghost", "iris"]).optional(),
});

export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  strength?: number; // 0..1 attraction
  radius?: number; // px influence
  glow?: boolean;
  variant?: "accent" | "ghost" | "iris";
};

/**
 * MagneticButton — a real <button> with a magnetic pointer layer.
 * Semantics stay intact: keyboard, focus, disabled all native.
 */
export function MagneticButton({
  strength = 0.35,
  radius = 120,
  glow = true,
  variant = "accent",
  className,
  children,
  ...rest
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const pos = React.useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const [, force] = React.useReducer((x: number) => x + 1, 0);

  React.useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const res = magneticButtonSchema.safeParse({ strength, radius, glow, variant });
      if (!res.success) {
        console.warn("[MagneticButton] Invalid props:", res.error.format());
      }
    }
  }, [strength, radius, glow, variant]);

  const onMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (reduced) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const t = Math.max(0, 1 - dist / radius);
      const target = { x: dx * strength * t, y: dy * strength * t };
      // critically-damped approach via spring steps
      let { x, y, vx, vy } = pos.current;
      for (let i = 0; i < 3; i++) {
        const sx = springStep(x, vx, target.x, { stiffness: 260, damping: 22 });
        const sy = springStep(y, vy, target.y, { stiffness: 260, damping: 22 });
        x = sx.x; vx = sx.v; y = sy.x; vy = sy.v;
      }
      pos.current = { x, y, vx, vy };
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    },
    [radius, strength, reduced]
  );

  const reset = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    pos.current = { x: 0, y: 0, vx: 0, vy: 0 };
    el.style.transform = "";
    force();
  }, []);

  const styles =
    variant === "accent"
      ? "bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)]"
      : variant === "iris"
        ? "bg-[color:var(--b-surface)] text-[color:var(--b-text)] border border-[color:var(--b-border)] hover:border-[color:var(--b-border-hover)]"
        : "bg-[color:var(--b-surface)] text-[color:var(--b-text-secondary)] border border-[color:var(--b-border)] hover:bg-[color:var(--b-elevated)] hover:text-[color:var(--b-text)]";

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-semibold",
        "transition-[background-color,border-color] duration-200 will-change-transform",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--b-bg)]",
        styles,
        className
      )}
      {...rest}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export default MagneticButton;
