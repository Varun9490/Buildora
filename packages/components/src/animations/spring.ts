export type SpringConfig = { stiffness?: number; damping?: number; mass?: number; dt?: number };

export const springs = {
  gentle: { stiffness: 170, damping: 26, mass: 1 },
  snappy: { stiffness: 320, damping: 28, mass: 0.9 },
  bouncy: { stiffness: 220, damping: 14, mass: 1 },
  stiff: { stiffness: 480, damping: 34, mass: 1 },
};

export function springStep(x: number, v: number, target: number, { stiffness = 170, damping = 26, mass = 1, dt = 0.016 }: SpringConfig = {}) {
  // Clamp the timestep so a stalled tab or a long frame cannot blow the
  // spring up; semi-implicit Euler keeps it stable at high stiffness.
  const step = Math.min(0.05, Math.max(0, dt));
  if (step === 0) return { x, v };
  const f = -stiffness * (x - target) - damping * v;
  const a = f / mass;
  const newV = v + a * step;
  const newX = x + newV * step;
  // Snap to rest once the spring has effectively settled, so callers do not
  // keep integrating noise around the target.
  if (Math.abs(newX - target) < 0.001 && Math.abs(newV) < 0.001) {
    return { x: target, v: 0 };
  }
  return { x: newX, v: newV };
}

/**
 * Converts a physical spring configuration into a CSS `linear()` easing string.
 * Simulates the spring to rest and resamples it into an evenly-spaced linear curve.
 */
export function springToLinear({ stiffness = 170, damping = 26, mass = 1 }: SpringConfig = {}, samples = 48) {
  let x = 0;
  let v = 0;
  const target = 1;
  const dt = 1 / 60;
  const positions: number[] = [0];
  
  while (true) {
    const res = springStep(x, v, target, { stiffness, damping, mass, dt });
    x = res.x;
    v = res.v;
    positions.push(x);
    if (Math.abs(x - target) < 0.0005 && Math.abs(v) < 0.0005) break;
    if (positions.length > 1000) break; // fail-safe
  }
  
  const linearVals: string[] = [];
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const index = t * (positions.length - 1);
    const floor = Math.floor(index);
    const ceil = Math.ceil(index);
    const weight = index - floor;
    const val = positions[floor] * (1 - weight) + (positions[ceil] || positions[floor]) * weight;
    linearVals.push(val.toFixed(4));
  }
  
  return `linear(${linearVals.join(', ')})`;
}
