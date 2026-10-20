"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

/**
 * FxCard — seven effects: six pointer treatments plus a CSS 3D flip.
 * All pointer math writes to CSS vars / transform (no re-render per move).
 * Decorative layers are aria-hidden; card is keyboard-focusable.
 */
export type FxCardEffect = "tilt" | "spotlight" | "glare" | "holographic" | "wobble" | "glass" | "flip";

export type FxCardProps = React.HTMLAttributes<HTMLDivElement> & {
  effect?: FxCardEffect;
  tiltMax?: number;
  sheen?: string;
  /** Reverse face for the flip effect. */
  back?: React.ReactNode;
  /** Accessible name for the flip control. */
  flipLabel?: string;
};

export function FxCard({ effect = "spotlight", tiltMax = 8, sheen = "color-mix(in srgb, var(--b-accent) 22%, transparent)", back, flipLabel = "Flip card", className, children, ...rest }: FxCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = React.useState(false);
  const interactive = !reduced && (effect === "tilt" || effect === "spotlight" || effect === "glare" || effect === "holographic");
  const rafRef = React.useRef<number | null>(null);
  const target = React.useRef({ rx: 0, ry: 0 });
  const cur = React.useRef({ rx: 0, ry: 0 });

  const tick = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    // spring chase
    cur.current.rx += (target.current.rx - cur.current.rx) * 0.12;
    cur.current.ry += (target.current.ry - cur.current.ry) * 0.12;
    if (Math.abs(cur.current.rx) < 0.02 && Math.abs(cur.current.ry) < 0.02 && target.current.rx === 0 && target.current.ry === 0) {
      el.style.transform = "";
      rafRef.current = null;
      return;
    }
    el.style.transform = `perspective(900px) rotateX(${cur.current.rx.toFixed(2)}deg) rotateY(${cur.current.ry.toFixed(2)}deg)`;
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / Math.max(r.width, 1);
    const py = (e.clientY - r.top) / Math.max(r.height, 1);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (effect === "tilt" || effect === "holographic") {
      target.current.rx = (0.5 - py) * tiltMax;
      target.current.ry = (px - 0.5) * tiltMax;
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
    }
  };
  const reset = () => {
    target.current = { rx: 0, ry: 0 };
    if (!rafRef.current) rafRef.current = requestAnimationFrame(tick);
  };

  if (effect === "flip") {
    // A flip card is a control, not a pointer surface: the whole face is the
    // button, and the back face is the second state.
    return (
      <div
        ref={ref}
        data-effect={effect}
        className={cn("[perspective:1200px]", className)}
        {...rest}
      >
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={flipLabel}
          className="block w-full text-left"
        >
          <div
            className={cn(
              "relative h-44 transition-transform duration-500 motion-reduce:transition-none",
              "[transform-style:preserve-3d]"
            )}
            style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
          >
            <div className="absolute inset-0 rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color:var(--b-surface)] p-5 [backface-visibility:hidden]">
              {children}
            </div>
            <div className="absolute inset-0 rounded-2xl border border-[color-mix(in_oklab,var(--b-accent)_30%,transparent)] bg-[color:var(--b-bg)] p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              {back}
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-effect={effect}
      onPointerMove={interactive ? onMove : undefined}
      onPointerLeave={interactive ? reset : undefined}
      className={cn(
        "group relative rounded-2xl border p-6 overflow-hidden",
        "border-[color:var(--b-border)] bg-[color:var(--b-panel)] b-fluid-card",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] focus-visible:ring-offset-2",
        effect === "wobble" && !reduced && "hover:rotate-[0.6deg]",
        (effect === "tilt" || effect === "holographic") && "will-change-transform",
        className
      )}
      tabIndex={0}
      role="group"
      {...rest}
    >
      {(effect === "spotlight" || effect === "holographic") && !reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-400" style={{ background: `radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), ${sheen}, transparent 68%)` }} />
      )}
      {(effect === "glare" || effect === "holographic") && !reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(118deg, transparent 30%, ${sheen} 50%, transparent 70%)`, backgroundPosition: "var(--mx, 50%) var(--my, 50%)", backgroundSize: "260% 260%" }} />
      )}
      {effect === "glass" && (
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl" style={{ backdropFilter: "blur(16px) saturate(1.25)", WebkitBackdropFilter: "blur(16px) saturate(1.25)", background: "linear-gradient(to bottom, color-mix(in srgb, var(--b-text) 7%, transparent), transparent 42%)", border: "1px solid color-mix(in srgb, var(--b-text) 8%, transparent)" }} />
      )}
      {effect === "glass" && !reduced && (
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--b-accent) 14%, transparent), transparent 66%)` }} />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export default FxCard;
