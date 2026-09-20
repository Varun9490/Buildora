"use client";

import * as React from "react";

export type Proximity = { dx: number; dy: number; t: number; active: boolean };

/**
 * usePointerProximity — attraction starts BEFORE the pointer reaches the element.
 *
 * A single window pointermove listener (one per hook instance, shared via rAF throttle)
 * measures the pointer against the referenced element's rect expanded by `radius`.
 * - Active only for `(hover: hover) and (pointer: fine)`; touch/keyboard unaffected.
 * - rAF-throttled: at most one state update per frame, only on meaningful change.
 * - Returns zero + inactive under prefers-reduced-motion (zero cost).
 * - Cleans up listener + rAF on unmount (StrictMode-safe).
 *
 * This is what `radius` was always supposed to mean. Wiring onPointerMove on the
 * element itself can never attract from a distance — events only fire on hover.
 */
export function usePointerProximity<T extends HTMLElement>(radius = 120) {
  const ref = React.useRef<T | null>(null);
  const [prox, setProx] = React.useState<Proximity>({ dx: 0, dy: 0, t: 0, active: false });
  const raf = React.useRef(0);
  const last = React.useRef<Proximity>({ dx: 0, dy: 0, t: 0, active: false });

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    let pending: PointerEvent | null = null;

    const apply = () => {
      raf.current = 0;
      const el = ref.current;
      const e = pending;
      pending = null;
      if (!el || !e) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const t = Math.max(0, 1 - dist / radius);
      const next: Proximity = t > 0 ? { dx, dy, t, active: true } : { dx: 0, dy: 0, t: 0, active: false };
      const p = last.current;
      if (
        Math.abs(next.dx - p.dx) < 0.5 &&
        Math.abs(next.dy - p.dy) < 0.5 &&
        Math.abs(next.t - p.t) < 0.01 &&
        next.active === p.active
      ) {
        return;
      }
      last.current = next;
      setProx(next);
    };

    const onMove = (e: PointerEvent) => {
      pending = e;
      if (!raf.current) raf.current = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      pending = null;
      if (raf.current) {
        cancelAnimationFrame(raf.current);
        raf.current = 0;
      }
      last.current = { dx: 0, dy: 0, t: 0, active: false };
      setProx(last.current);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [radius]);

  return { ref, proximity: prox };
}
