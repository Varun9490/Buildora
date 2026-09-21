"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type FxButtonEffect = "none" | "shimmer" | "glow" | "ripple" | "gradient-border" | "liquid";

export type FxButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  effect?: FxButtonEffect;
  /** Ripple lifetime in ms (ripple). */
  rippleMs?: number;
};

/**
 * FxButton — one real <button> with six finishes.
 * Semantics stay native (keyboard, focus, disabled). Effect layers are
 * aria-hidden; pointer math writes to refs, never state per move.
 * Static under prefers-reduced-motion. Replaces: liquid, ripple, shimmer,
 * glow, gradient-border buttons. HoldButton stays separate (real behavior).
 */
export function FxButton({ effect = "none", rippleMs = 600, className, children, onClick, ...rest }: FxButtonProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const blob = React.useRef<HTMLSpanElement | null>(null);
  const glow = React.useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
  const idRef = React.useRef(0);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => {
    timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (effect === "liquid" && blob.current) {
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      blob.current.style.transform = `translate(${x - 50}%, ${y - 50}%) scale(1.5)`;
    }
    if (effect === "glow" && glow.current) {
      glow.current.style.background = `radial-gradient(60px circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, var(--b-accent)66, transparent 70%)`;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (effect === "ripple" && !reduced && ref.current) {
      const r = ref.current.getBoundingClientRect();
      const id = idRef.current++;
      setRipples((p) => [...p.slice(-5), { x: e.clientX - r.left, y: e.clientY - r.top, id }]);
      const t = window.setTimeout(() => setRipples((p) => p.filter((x) => x.id !== id)), rippleMs);
      timers.current.push(t);
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      data-effect={effect}
      onPointerMove={effect === "liquid" || effect === "glow" ? onMove : undefined}
      onClick={handleClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold",
        "bg-[color-mix(in_oklab,var(--b-text)_5%,transparent)] text-[color:var(--b-text)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)]",
        "transition-all duration-200 hover:border-[color-mix(in_oklab,var(--b-border)_25%,transparent)] active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        effect === "glow" && "border-[color-mix(in_oklab,var(--b-accent)_40%,transparent)]",
        effect === "gradient-border" && "border-transparent",
        className
      )}
      {...rest}
    >
      {effect === "gradient-border" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background: "linear-gradient(90deg, var(--b-accent), var(--b-iris, #9d8cff), var(--b-accent))",
            backgroundSize: "300% 100%",
            padding: 2,
            animation: reduced ? undefined : "buildora-gradient-pan 3s linear infinite",
            mask: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
            WebkitMask: "linear-gradient(black, black) content-box, linear-gradient(black, black)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }}
        />
      )}
      {effect === "shimmer" && !reduced && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(90deg, transparent 20%, color-mix(in srgb, var(--b-accent) 35%, transparent) 50%, transparent 80%)", backgroundSize: "200% 100%", animation: "buildora-gradient-pan 2.5s linear infinite" }}
        />
      )}
      {effect === "glow" && (
        <span ref={glow} aria-hidden className="pointer-events-none absolute inset-0 rounded-xl" />
      )}
      {effect === "liquid" && (
        <span
          ref={blob}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-[220%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-md transition-transform duration-300 ease-out"
          style={{ background: "linear-gradient(135deg, var(--b-iris, #9d8cff), var(--b-accent))" }}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {effect === "ripple" &&
        ripples.map((r) => (
          <span
            key={r.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-[color-mix(in_oklab,var(--b-text)_40%,transparent)]"
            style={{ left: r.x, top: r.y, width: 10, height: 10, animation: `buildora-ripple-dot ${rippleMs}ms ease-out forwards` }}
          />
        ))}
    </button>
  );
}

export default FxButton;
