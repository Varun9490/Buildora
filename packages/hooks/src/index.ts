"use client";

import * as React from "react";

/** prefers-reduced-motion — always respect for creative components */
export function useReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
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
