export type SpringOpts = { stiffness?: number; damping?: number; mass?: number };

export function springStep(
  x: number,
  v: number,
  target: number,
  opts: SpringOpts = {},
  dt = 1 / 60
) {
  const { stiffness = 220, damping = 24, mass = 1 } = opts;
  // Clamp the timestep so a stalled tab or a long frame cannot blow the
  // spring up; semi-implicit Euler keeps it stable at high stiffness.
  const step = Math.min(0.05, Math.max(0, dt));
  if (step === 0) return { x, v };
  const F = -stiffness * (x - target) - damping * v;
  const a = F / mass;
  const nv = v + a * step;
  const nx = x + nv * step;
  // Snap to rest once the spring has effectively settled, so callers do not
  // keep integrating noise around the target.
  if (Math.abs(nx - target) < 0.001 && Math.abs(nv) < 0.001) {
    return { x: target, v: 0 };
  }
  return { x: nx, v: nv };
}

/** Magnetic attraction: pull point toward anchor, scaled by proximity */
export function magnet(
  px: number,
  py: number,
  ax: number,
  ay: number,
  radius: number,
  strength: number
) {
  const dx = ax - px;
  const dy = ay - py;
  const dist = Math.hypot(dx, dy) || 0.0001;
  if (dist > radius) return { x: 0, y: 0, t: 0 };
  const t = 1 - dist / radius; // 0..1 proximity
  const eased = t * t * (3 - 2 * t);
  const mag = eased * strength * dist;
  return { x: (dx / dist) * mag, y: (dy / dist) * mag, t: eased };
}

export function reducedMotionPreferred() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** rAF loop helper with cleanup */
export function rafLoop(fn: (dt: number, t: number) => void | false) {
  let raf = 0;
  let last = performance.now();
  let alive = true;
  const tick = (now: number) => {
    if (!alive) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const res = fn(dt, now);
    if (res === false) {
      alive = false;
      return;
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => {
    alive = false;
    cancelAnimationFrame(raf);
  };
}

export { springs, easings, durations, fadeUp, scaleIn, stagger, springTransition } from "./motion-tokens";
export type { SpringPreset } from "./motion-tokens";
