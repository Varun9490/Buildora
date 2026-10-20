"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type RubberBandProps = {
  children: React.ReactNode;
  /** How far the content can be pulled, in px. */
  pull?: number;
  /** Spring stiffness on release. */
  stiffness?: number;
  /** Spring damping on release. */
  damping?: number;
  className?: string;
  /** Called when the pull is released past the threshold. */
  onRelease?: (velocity: number) => void;
};

/**
 * RubberBand — a container that resists being pulled past its edges.
 *
 * What makes this different from `overflow: auto`: the pull is tracked in
 * a spring, so the content follows the finger, resists with a force that
 * grows the further you go, and snaps back with the velocity you let go
 * at. It is the gesture every native app uses for "there is nothing more
 * here", implemented without a scroll library.
 */
export function RubberBand({
  children,
  pull = 120,
  stiffness = 260,
  damping = 24,
  className,
  onRelease,
}: RubberBandProps) {
  const reduced = useReducedMotion();
  const [offset, setOffset] = React.useState(0);
  const offsetRef = React.useRef(0);
  const velocityRef = React.useRef(0);
  const drag = React.useRef<{ y: number; last: number; lastT: number } | null>(null);
  const raf = React.useRef<number | null>(null);

  offsetRef.current = offset;

  const spring = React.useCallback(
    (target: number) => {
      if (reduced) {
        offsetRef.current = target;
        setOffset(target);
        return;
      }
      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const accel = -stiffness * (offsetRef.current - target) - damping * velocityRef.current;
        velocityRef.current += accel * dt;
        const next = offsetRef.current + velocityRef.current * dt;
        if (Math.abs(next - target) < 0.2 && Math.abs(velocityRef.current) < 0.5) {
          offsetRef.current = target;
          velocityRef.current = 0;
          setOffset(target);
          raf.current = null;
          return;
        }
        offsetRef.current = next;
        setOffset(next);
        raf.current = requestAnimationFrame(tick);
      };
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    },
    [reduced, stiffness, damping]
  );

  React.useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduced) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = { y: e.clientY, last: e.clientY, lastT: performance.now() };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dy = e.clientY - d.y;
    // Resistance: the further you pull, the less it moves.
    const resisted = Math.sign(dy) * Math.min(Math.abs(dy), pull) * (1 - Math.min(Math.abs(dy), pull) / (pull * 2));

    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    velocityRef.current = ((e.clientY - d.last) / dt) * 1000;
    d.last = e.clientY;
    d.lastT = now;

    offsetRef.current = resisted;
    setOffset(resisted);
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    onRelease?.(velocityRef.current);
    spring(0);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={cn("relative overflow-hidden", className)}
      style={{ touchAction: "pan-y" }}
    >
      <div
        style={{
          transform: `translate3d(0, ${offset}px, 0)`,
          transition: reduced ? "none" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default RubberBand;
