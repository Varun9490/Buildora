"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SpringCarouselProps = {
  /** The slides. Anything renderable. */
  children: React.ReactNode[];
  /** How many slides are visible at once. */
  visible?: number;
  /** Spring stiffness. Higher is snappier. */
  stiffness?: number;
  /** Spring damping. Higher settles sooner. */
  damping?: number;
  /** Gap between slides, in px. */
  gap?: number;
  className?: string;
};

/**
 * SpringCarousel — a carousel that snaps with physics instead of easing.
 *
 * What makes this different from a CSS scroll-snap carousel: the position
 * is a spring, so a flick carries momentum and settles on the nearest
 * slide rather than stopping at a hard boundary. Drag it, use the arrow
 * keys, or press the buttons.
 *
 * Under prefers-reduced-motion the spring is replaced by an instant jump
 * and the carousel becomes a plain scroll container.
 */
export function SpringCarousel({
  children,
  visible = 1,
  stiffness = 220,
  damping = 26,
  gap = 16,
  className,
}: SpringCarouselProps) {
  const reduced = useReducedMotion();
  const count = children.length;
  const maxIndex = Math.max(0, count - visible);

  const railRef = React.useRef<HTMLDivElement | null>(null);
  const [railWidth, setRailWidth] = React.useState(0);
  const [index, setIndex] = React.useState(0);
  const [offset, setOffset] = React.useState(0);

  // Refs mirror the state so the rAF loop never closes over a stale value.
  const offsetRef = React.useRef(0);
  const indexRef = React.useRef(0);
  const velocityRef = React.useRef(0);
  const dragRef = React.useRef<{ x: number; offset: number; last: number; lastT: number } | null>(null);

  offsetRef.current = offset;
  indexRef.current = index;

  React.useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => setRailWidth(rail.clientWidth);
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    return () => ro.disconnect();
  }, []);

  const slideWidth = railWidth ? (railWidth - gap * (visible - 1)) / visible : 0;

  const goTo = React.useCallback(
    (next: number) => {
      const clamped = Math.min(maxIndex, Math.max(0, next));
      setIndex(clamped);
      setOffset(clamped);
      offsetRef.current = clamped;
      indexRef.current = clamped;
    },
    [maxIndex]
  );

  // The spring: pull the rail toward the target, carrying velocity across
  // frames so a flick keeps its momentum.
  React.useEffect(() => {
    if (reduced) return;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const current = offsetRef.current;
      const target = indexRef.current;
      const accel = -stiffness * (current - target) - damping * velocityRef.current;
      velocityRef.current += accel * dt;
      const next = current + velocityRef.current * dt;

      if (Math.abs(next - target) < 0.001 && Math.abs(velocityRef.current) < 0.01) {
        offsetRef.current = target;
        velocityRef.current = 0;
        setOffset(target);
        return;
      }
      offsetRef.current = next;
      setOffset(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, reduced, stiffness, damping]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (reduced) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      x: e.clientX,
      offset: offsetRef.current,
      last: e.clientX,
      lastT: performance.now(),
    };
    velocityRef.current = 0;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d || !slideWidth) return;
    const dx = e.clientX - d.x;
    const next = d.offset - dx / (slideWidth + gap);

    const now = performance.now();
    const dt = Math.max(1, now - d.lastT);
    velocityRef.current = ((e.clientX - d.last) / dt) * 1000;
    d.last = e.clientX;
    d.lastT = now;

    // Rubber band at the ends.
    const bounded =
      next < 0
        ? next * 0.35
        : next > maxIndex
          ? maxIndex + (next - maxIndex) * 0.35
          : next;
    offsetRef.current = bounded;
    setOffset(bounded);
  };

  const onPointerUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    // Flick: project the velocity forward and land on the nearest slide.
    const projected = offsetRef.current + (velocityRef.current / 1000) * 0.25;
    goTo(Math.round(projected));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  const shift = slideWidth ? -offset * (slideWidth + gap) : 0;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={railRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Slides"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]"
        style={{ cursor: reduced ? "auto" : "grab", touchAction: "pan-y" }}
      >
        <div
          className="flex"
          style={{
            gap,
            transform: `translate3d(${shift}px, 0, 0)`,
            transition: reduced ? "none" : undefined,
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              aria-hidden={i < index || i >= index + visible}
              className="shrink-0"
              style={{ width: slideWidth ? `${slideWidth}px` : undefined }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          aria-label="Previous slide"
          className="rounded-full border border-[color:var(--b-border)] px-3 py-1 text-xs text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-text)] disabled:opacity-40"
        >
          ←
        </button>
        <span className="font-mono text-[11px] tabular-nums text-[color:var(--b-muted)]">
          {Math.min(index + 1, count)} / {count}
        </span>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index >= maxIndex}
          aria-label="Next slide"
          className="rounded-full border border-[color:var(--b-border)] px-3 py-1 text-xs text-[color:var(--b-text-secondary)] transition-colors hover:text-[color:var(--b-text)] disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default SpringCarousel;
