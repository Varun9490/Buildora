"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";
import { springStep } from "../animations/spring";

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
      ? "bg-[--b-accent] text-[--b-accent-foreground]"
      : variant === "iris"
        ? "bg-[--b-surface] text-[--b-text] border border-[--b-border] hover:border-[--b-border-hover]"
        : "bg-[--b-surface] text-[--b-text-secondary] border border-[--b-border] hover:bg-[--b-elevated] hover:text-[--b-text]";

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 rounded-[10px] px-5 py-2.5 text-sm font-semibold",
        "transition-[background-color,border-color] duration-200 will-change-transform",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--b-accent] focus-visible:ring-offset-2 focus-visible:ring-offset-[--b-bg]",
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
