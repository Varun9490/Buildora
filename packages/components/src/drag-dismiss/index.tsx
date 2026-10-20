"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type DragDismissProps = {
  children: React.ReactNode;
  /** Direction the card can be dragged. */
  axis?: "x" | "y";
  /** How far you must drag, as a fraction of the card's size, to dismiss. */
  threshold?: number;
  /** Called when the card is dismissed. */
  onDismiss?: () => void;
  /** Called when the drag is released without dismissing. */
  onSettle?: () => void;
  className?: string;
};

/**
 * DragDismiss — a card you flick away.
 *
 * What makes this different from a swipe-to-dismiss built on transforms:
 * the dismissal is decided by velocity, not distance alone, so a quick
 * flick dismisses and a slow long drag past the threshold also does —
 * which is how every phone feels, and how almost no web component does.
 *
 * The card is a button, so it is reachable by keyboard and announces
 * itself; Escape dismisses it.
 */
export function DragDismiss({
  children,
  axis = "x",
  threshold = 0.3,
  onDismiss,
  onSettle,
  className,
}: DragDismissProps) {
  const reduced = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = React.useState(0);
  const offsetRef = React.useRef(0);
  const velocityRef = React.useRef(0);
  const drag = React.useRef<{ at: number; origin: number; last: number; lastT: number } | null>(null);
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
        const accel = -320 * (offsetRef.current - target) - 26 * velocityRef.current;
        velocityRef.current += accel * dt;
        const next = offsetRef.current + velocityRef.current * dt;
        if (Math.abs(next - target) < 0.5 && Math.abs(velocityRef.current) < 2) {
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
    [reduced]
  );

  React.useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduced) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    drag.current = {
      at: axis === "x" ? e.clientX : e.clientY,
      origin: offsetRef.current,
      last: axis === "x" ? e.clientX : e.clientY,
      lastT: performance.now(),
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const at = axis === "x" ? e.clientX : e.clientY;
    const next = d.origin + (at - d.at);

    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    velocityRef.current = ((at - d.last) / dt) * 1000;
    d.last = at;
    d.lastT = now;

    offsetRef.current = next;
    setOffset(next);
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;

    const el = ref.current;
    const size = axis === "x" ? (el?.clientWidth ?? 1) : (el?.clientHeight ?? 1);
    const travelled = Math.abs(offsetRef.current);
    const flicked = Math.abs(velocityRef.current) > 450;

    if (travelled > size * threshold || flicked) {
      // Dismiss in the direction it was thrown.
      const target = Math.sign(offsetRef.current || 1) * size * 1.4;
      spring(target);
      window.setTimeout(() => onDismiss?.(), reduced ? 0 : 180);
      return;
    }
    spring(0);
    onSettle?.();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onDismiss?.();
    }
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label="Drag to dismiss"
      className={cn(
        "cursor-grab touch-pan-y select-none rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]",
        className
      )}
      style={{
        transform: `translate3d(${axis === "x" ? offset : 0}px, ${axis === "y" ? offset : 0}px, 0)`,
        transition: reduced ? "none" : undefined,
      }}
    >
      {children}
    </div>
  );
}

export default DragDismiss;
