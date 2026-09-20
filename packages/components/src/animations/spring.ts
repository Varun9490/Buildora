export function springStep(x: number, v: number, target: number, { stiffness = 170, damping = 26, mass = 1, dt = 0.016 } = {}) {
  const f = -stiffness * (x - target) - damping * v;
  const a = f / mass;
  const newV = v + a * dt;
  const newX = x + newV * dt;
  return { x: newX, v: newV };
}
