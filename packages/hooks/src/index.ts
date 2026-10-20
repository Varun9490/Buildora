"use client";

import * as React from "react";

/** prefers-reduced-motion — always respect for creative components */
export function useReducedMotion() {
  // The same contract as the shipped `use-reduced-motion` registry item:
  // SSR-safe (no hydration flash) and honouring a global `data-motion="reduced"`
  // so an app can pause motion for everyone, not just people whose OS asks.
  const subscribe = React.useCallback((cb: () => void) => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return () => {};
    }
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", cb);
    const observer =
      typeof MutationObserver === "undefined" ? null : new MutationObserver(cb);
    observer?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion"],
    });
    return () => {
      mq.removeEventListener("change", cb);
      observer?.disconnect();
    };
  }, []);

  const getSnapshot = React.useCallback(() => {
    if (typeof document !== "undefined" && document.documentElement.getAttribute("data-motion") === "reduced") {
      return true;
    }
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  return React.useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** Pointer position relative to a ref element (for magnetic / spotlight effects) */
export function useRelativePointer<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [pos, setPos] = React.useState({ x: 0.5, y: 0.5, active: false });
  const onMove = React.useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: (e.clientX - r.left) / Math.max(r.width, 1),
      y: (e.clientY - r.top) / Math.max(r.height, 1),
      active: true
    });
  }, []);
  const onLeave = React.useCallback(() => {
    setPos((p) => ({ ...p, active: false }));
  }, []);
  return { ref, pos, onMove, onLeave };
}

/**
 * Fluid magnetic hook — subscribes to window pointermove, so attraction
 * works within `radius` even when the cursor isn't over the element itself
 * (fixes the "radius without proximity" issue). Uses spring physics per-axis
 * via requestAnimationFrame; no re-renders, writes transform directly.
 */
export function useMagnetic(
  ref: React.RefObject<HTMLElement>,
  {
    strength = 0.35,
    radius = 180,
    spring = { stiffness: 260, damping: 22 },
    disabled = false,
  }: { strength?: number; radius?: number; spring?: { stiffness: number; damping: number }; disabled?: boolean } = {}
) {
  const state = React.useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
  const rafRef = React.useRef<number | null>(null);
  const ticking = React.useRef(false);

  const tick = React.useCallback(() => {
    const el = ref.current;
    if (!el || disabled) return;
    const s = state.current;
    // spring toward tx/ty
    const axX = -spring.stiffness * (s.x - s.tx) - spring.damping * s.vx;
    const axY = -spring.stiffness * (s.y - s.ty) - spring.damping * s.vx;
    // use vy for Y axis
    const ay = -spring.stiffness * (s.y - s.ty) - spring.damping * s.vy;
    s.vx += (axX / 1) * (1 / 60);
    s.vy += (ay / 1) * (1 / 60);
    s.x += s.vx * (1 / 60);
    s.y += s.vy * (1 / 60);
    // snap when tiny
    if (Math.abs(s.x - s.tx) < 0.08 && Math.abs(s.vx) < 0.08 && Math.abs(s.y - s.ty) < 0.08 && Math.abs(s.vy) < 0.08) {
      if (s.tx === 0 && s.ty === 0) {
        s.x = 0; s.y = 0; s.vx = 0; s.vy = 0;
        el.style.transform = "";
        ticking.current = false;
        return;
      }
    }
    el.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0)`;
    rafRef.current = requestAnimationFrame(tick);
  }, [ref, disabled, spring.stiffness, spring.damping]);

  const ensureTicking = React.useCallback(() => {
    if (!ticking.current) {
      ticking.current = true;
      rafRef.current = requestAnimationFrame(tick);
    }
  }, [tick]);

  React.useEffect(() => {
    if (disabled) return;
    // track pointer globally so radius works at distance
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
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
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ref, radius, strength, disabled, ensureTicking]);

  const reset = React.useCallback(() => {
    state.current.tx = 0; state.current.ty = 0;
    ensureTicking();
  }, [ensureTicking]);

  return { reset };
}

/** Spotlight — writes --mx / --my CSS vars on a container from any pointer position */
export function useSpotlight(ref: React.RefObject<HTMLElement>, disabled = false) {
  React.useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / Math.max(r.width, 1)) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / Math.max(r.height, 1)) * 100}%`);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [ref, disabled]);
}

/** True when pointer is fine-grained (not coarse/touch) */
export function useFinePointer() {
  const [fine, setFine] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return fine;
}

/** Roving stable callback */
export function useEvent<T extends (...args: never[]) => unknown>(fn: T): T {
  const ref = React.useRef(fn);
  ref.current = fn;
  return React.useCallback(((...args: never[]) => ref.current(...args)) as T, []);
}

/** Local storage with SSR guard */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = React.useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const set = React.useCallback(
    (v: T | ((p: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [key]
  );
  return [value, set] as const;
}

/** Press-and-hold / long-press helper for tactile controls */
export function usePressHold(onHold: () => void, ms = 420) {
  const timer = React.useRef<number | null>(null);
  const start = React.useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(onHold, ms);
  }, [onHold, ms]);
  const cancel = React.useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  }, []);
  React.useEffect(() => cancel, [cancel]);
  return { start, cancel };
}
