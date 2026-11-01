"use client";

import * as React from "react";

/**
 * An app can force motion off for everyone, not just the people whose OS
 * asks for it. When the host sets `data-motion="reduced"` on the document
 * root, every Buildora component stops moving.
 */
function forcedOff() {
  if (typeof document === "undefined") return false;
  return document.documentElement.getAttribute("data-motion") === "reduced";
}

function systemPrefersReduced() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {};
  }
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  const observer =
    typeof MutationObserver === "undefined"
      ? null
      : new MutationObserver(cb);
  observer?.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-motion"],
  });
  return () => {
    mq.removeEventListener("change", cb);
    observer?.disconnect();
  };
}

function getSnapshot() {
  return forcedOff() || systemPrefersReduced();
}

function getServerSnapshot() {
  return false;
}

/**
 * SSR-safe prefers-reduced-motion.
 *
 * Uses useSyncExternalStore so server and first client render agree (no
 * hydration mismatch), unlike a useState(false) + useEffect that flashes
 * motion before measuring.
 *
 * Honours two things: the system setting, and a `data-motion="reduced"`
 * attribute on the document root, which is how an app pauses motion for
 * everyone at once.
 */
export function useReducedMotion() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export type MagneticSpring = { stiffness?: number; damping?: number; mass?: number };

/**
 * useMagnetic — spring-magnetic pointer attraction.
 *
 * Writes the transform directly via rAF (no re-render per frame). Attracts from
 * `radius` away thanks to a window-level pointermove listener. Mass-aware,
 * dt-based spring keeps it stable at high stiffness; snaps to rest at the
 * origin. Honours `disabled` (pass `useReducedMotion()` through) so reduced
 * motion is a no-op.
 */
export function useMagnetic(
  ref: React.RefObject<HTMLElement>,
  {
    strength = 0.35,
    radius = 180,
    spring = { stiffness: 260, damping: 22, mass: 1 },
    disabled = false,
  }: {
    strength?: number;
    radius?: number;
    spring?: MagneticSpring;
    disabled?: boolean;
  } = {}
) {
  const { stiffness = 260, damping = 22, mass = 1 } = spring;
  const state = React.useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
  const rafRef = React.useRef<number | null>(null);
  const ticking = React.useRef(false);
  const last = React.useRef<number | null>(null);

  const stop = React.useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    ticking.current = false;
    last.current = null;
  }, []);

  const tick = React.useCallback((now: number) => {
    const el = ref.current;
    if (!el || disabled) {
      stop();
      return;
    }
    const s = state.current;
    if (last.current === null) last.current = now;
    const dt = Math.min(0.05, Math.max(0, (now - last.current) / 1000));
    last.current = now;
    if (dt > 0) {
      const ax = (-stiffness * (s.x - s.tx) - damping * s.vx) / mass;
      const ay = (-stiffness * (s.y - s.ty) - damping * s.vy) / mass;
      s.vx += ax * dt;
      s.vy += ay * dt;
      s.x += s.vx * dt;
      s.y += s.vy * dt;
    }
    if (
      s.tx === 0 && s.ty === 0 &&
      Math.abs(s.x) < 0.05 && Math.abs(s.vx) < 0.05 &&
      Math.abs(s.y) < 0.05 && Math.abs(s.vy) < 0.05
    ) {
      s.x = 0; s.y = 0; s.vx = 0; s.vy = 0;
      el.style.transform = "";
      stop();
      return;
    }
    el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
    rafRef.current = requestAnimationFrame(tick);
  }, [ref, disabled, stiffness, damping, mass, stop]);

  const ensureTicking = React.useCallback(() => {
    if (disabled || ticking.current) return;
    ticking.current = true;
    last.current = null;
    rafRef.current = requestAnimationFrame(tick);
  }, [disabled, tick]);

  React.useEffect(() => {
    if (disabled) return;
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const inside = dist < radius + Math.max(r.width, r.height) / 2;
      if (!inside) {
        state.current.tx = 0;
        state.current.ty = 0;
      } else {
        const t = Math.max(0, 1 - Math.max(0, dist - 20) / radius);
        const eased = t * t * (3 - 2 * t);
        state.current.tx = dx * strength * eased;
        state.current.ty = dy * strength * eased;
      }
      ensureTicking();
    };
    const onLeave = () => {
      state.current.tx = 0;
      state.current.ty = 0;
      ensureTicking();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      stop();
    };
  }, [ref, radius, strength, disabled, ensureTicking, stop]);

  const reset = React.useCallback(() => {
    state.current.tx = 0;
    state.current.ty = 0;
    ensureTicking();
  }, [ensureTicking]);

  return { reset };
}
