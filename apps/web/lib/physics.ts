"use client";

import * as React from "react";

/* ─────────────────────────────────────────────────────
   BUILDORA PHYSICS KERNEL
   Real damped-harmonic-oscillator integration, shared by
   every interactive primitive on the landing surface.

   F(t) = -k·(x − xₜ) − c·v
   a    = F/m
   v'   = v + a·Δt
   x'   = x + v'·Δt
   ───────────────────────────────────────────────────── */

export type SpringConfig = { stiffness: number; damping: number; mass: number };

export const SPRING_DEFAULTS: SpringConfig = { stiffness: 220, damping: 18, mass: 1 };

export function springStep(
  x: number,
  v: number,
  target: number,
  cfg: SpringConfig,
  dt = 1 / 60
): { x: number; v: number } {
  const f = -cfg.stiffness * (x - target) - cfg.damping * v;
  const a = f / Math.max(cfg.mass, 0.05);
  const nv = v + a * dt;
  const nx = x + nv * dt;
  return { x: nx, v: nv };
}

/** Gaussian falloff — the magnification dock's core function. */
export function gaussian(d: number, sigma: number): number {
  return Math.exp(-(d * d) / (2 * sigma * sigma));
}

/** Apple-style logarithmic rubber-band resistance. */
export function rubberBand(overflow: number, dimension: number, constant = 0.55): number {
  const sign = Math.sign(overflow);
  const abs = Math.abs(overflow);
  return sign * (1 - 1 / ((abs * constant) / Math.max(dimension, 1) + 1)) * dimension * constant;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function clamp01(v: number): number {
  return clamp(v, 0, 1);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Analytic unit-impulse response of a damped oscillator.
 * Used by the Spring Telemetry proof card to render x(t).
 */
export function dampedOscillator(t: number, zeta: number, omega0: number): number {
  if (zeta < 1) {
    const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
    return Math.exp(-zeta * omega0 * t) * (Math.cos(omegaD * t) + ((zeta * omega0) / omegaD) * Math.sin(omegaD * t));
  }
  if (Math.abs(zeta - 1) < 0.001) {
    return (1 + omega0 * t) * Math.exp(-omega0 * t);
  }
  const r = omega0 * Math.sqrt(zeta * zeta - 1);
  const s1 = -zeta * omega0 + r;
  const s2 = -zeta * omega0 - r;
  const c1 = -s2 / (s2 - s1);
  const c2 = s1 / (s2 - s1);
  return c1 * Math.exp(s1 * t) + c2 * Math.exp(s2 * t);
}

/** rAF loop with cleanup — reads latest callback, never re-subscribes. */
export function useRafLoop(cb: (dt: number, now: number) => void, active = true) {
  const cbRef = React.useRef(cb);
  cbRef.current = cb;
  React.useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      cbRef.current(dt, now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/** True when OS reduce-motion is on OR the Physics Console override is engaged. */
export function useReducedMotionPref(): boolean {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setReduced(mq.matches || document.documentElement.getAttribute("data-motion") === "reduced");
    update();
    mq.addEventListener("change", update);
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
    return () => {
      mq.removeEventListener("change", update);
      obs.disconnect();
    };
  }, []);
  return reduced;
}

/** Live FPS sampler — deterministic "60" on first paint, real number after mount. */
export function useFps(): number {
  const [fps, setFps] = React.useState(60);
  React.useEffect(() => {
    let raf = 0;
    let frames = 0;
    let last = performance.now();
    const loop = (now: number) => {
      frames++;
      if (now - last >= 500) {
        setFps(Math.max(1, Math.round((frames * 1000) / (now - last))));
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);
  return fps;
}

/** IntersectionObserver gate — pauses off-screen canvases. */
export function useInView<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  rootMargin = "240px"
): boolean {
  const [inView, setInView] = React.useState(true);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting);
      },
      { rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

/** Mulberry32 — deterministic PRNG so canvas scenes are stable across mounts. */
export function createSeededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
