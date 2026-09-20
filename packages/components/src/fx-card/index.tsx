"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type FxCardEffect = "tilt" | "spotlight" | "glare" | "holographic" | "wobble" | "glass";

export type FxCardProps = React.HTMLAttributes<HTMLDivElement> & {
  effect?: FxCardEffect;
  /** Max tilt in degrees (tilt/holographic). */
  tiltMax?: number;
  /** Sheen color for spotlight/glare/holographic. Defaults to theme tokens. */
  sheen?: string;
};

/**
 * FxCard — one card shell with six pointer effects.
 * Pointer layers are decorative (aria-hidden); handlers write straight to
 * the DOM node (no re-render per move) and detach on unmount.
 * Static under prefers-reduced-motion.
 * Replaces: magnetic/tilt, spotlight, glare, holographic, wobble, glass,
 * interactive-3d cards.
 */
export function FxCard({
  effect = "spotlight",
  tiltMax = 8,
  sheen = "color-mix(in srgb, var(--b-accent) 22%, transparent)",
  className,
  children,
  ...rest
}: FxCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const sheenRef = React.useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const interactive = !reduced && (effect === "tilt" || effect === "spotlight" || effect === "glare" || effect === "holographic");

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / Math.max(r.width, 1);
    const py = (e.clientY - r.top) / Math.max(r.height, 1);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (effect === "tilt" || effect === "holographic") {
      el.style.transform = `perspective(900px) rotateX(${((0.5 - py) * tiltMax).toFixed(2)}deg) rotateY(${((px - 0.5) * tiltMax).toFixed(2)}deg)`;
    }
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      data-effect={effect}
      onPointerMove={interactive ? onMove : undefined}
      onPointerLeave={interactive ? reset : undefined}
      onBlur={interactive ? reset : undefined}
      className={cn(
        "group relative rounded-2xl border p-6 transition-shadow duration-300",
        "border-white/10 bg-white/[0.03]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--b-accent]",
        !reduced && effect === "wobble" && "transition-transform duration-300 hover:scale-[1.03] hover:rotate-1",
        !reduced && effect === "tilt" && "will-change-transform",
        className
      )}
      {...rest}
    >
      {(effect === "spotlight" || effect === "holographic") && !reduced && (
        <div
          ref={sheenRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${sheen}, transparent 65%)` }}
        />
      )}
      {(effect === "glare" || effect === "holographic") && !reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `linear-gradient(115deg, transparent 30%, ${sheen} 50%, transparent 70%)`, backgroundPosition: "var(--mx, 50%) var(--my, 50%)", backgroundSize: "250% 250%" }}
        />
      )}
      {effect === "glass" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: "linear-gradient(to bottom, color-mix(in srgb, var(--b-text) 6%, transparent), transparent 40%)" }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export default FxCard;
