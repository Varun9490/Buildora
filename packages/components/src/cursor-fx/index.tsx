"use client";

import * as React from "react";

import { cn } from "../utils";

export type CursorFxMode = "glow" | "spotlight" | "trail" | "blob";

export type CursorFxProps = {
  mode?: CursorFxMode;
  /** Any valid CSS color, including var(--token). */
  color?: string;
  /** Diameter in px of the glow/spotlight; trail and blob dots scale from it. */
  size?: number;
  className?: string;
};

const TRAIL_COUNT = 10;
const OFFSCREEN = -9999;
const SETTLE_PX = 0.1;

const EASE: Record<CursorFxMode, number> = {
  glow: 0.2,
  spotlight: 0.25,
  trail: 0.35,
  blob: 0.16,
};

/**
 * Mix a CSS color with transparency. Works for hex, rgb(), hsl() AND var(--x).
 * (Appending hex alpha like `${color}55` breaks for var(...) values: the whole
 * declaration becomes invalid and nothing is painted.)
 */
function alpha(color: string, pct: number) {
  return `color-mix(in srgb, ${color} ${pct}%, transparent)`;
}

/**
 * CursorFx — one pointer-following effect with four modes.
 * Decorative (aria-hidden, pointer-events-none), fine-pointer only,
 * renders nothing under prefers-reduced-motion. A single rAF loop writes
 * transforms to refs (no re-render per pointer move) and goes idle once the
 * effect has caught up with the pointer.
 */
export function CursorFx({
  mode = "glow",
  color = "var(--b-accent)",
  size = 320,
  className,
}: CursorFxProps) {
  const gooId = `cursor-fx-goo-${React.useId().replace(/:/g, "")}`;

  const [enabled, setEnabled] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  const head = React.useRef<HTMLDivElement | null>(null);
  const dots = React.useRef<Array<HTMLDivElement | null>>([]);
  const seeded = React.useRef(false);
  const target = React.useRef({ x: OFFSCREEN, y: OFFSCREEN });
  const points = React.useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: OFFSCREEN, y: OFFSCREEN }))
  );

  // Enable only for fine pointers without reduced motion, and react to changes.
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setEnabled(!reduce.matches && !coarse.matches);
    update();
    reduce.addEventListener("change", update);
    coarse.addEventListener("change", update);
    return () => {
      reduce.removeEventListener("change", update);
      coarse.removeEventListener("change", update);
    };
  }, []);

  React.useEffect(() => {
    if (!enabled) return;

    const chain = mode === "trail" || mode === "blob";
    const ease = EASE[mode];
    let raf = 0;

    const snapToTarget = () => {
      for (const p of points.current) {
        p.x = target.current.x;
        p.y = target.current.y;
      }
    };

    const place = (el: HTMLDivElement | null, p: { x: number; y: number }) => {
      if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%)`;
    };

    const tick = () => {
      raf = 0;
      const pts = points.current;
      const count = chain ? TRAIL_COUNT : 1;
      let moving = false;

      for (let i = 0; i < count; i++) {
        const lead = i === 0 ? target.current : pts[i - 1];
        const dx = lead.x - pts[i].x;
        const dy = lead.y - pts[i].y;
        pts[i].x += dx * ease;
        pts[i].y += dy * ease;
        if (Math.abs(dx) > SETTLE_PX || Math.abs(dy) > SETTLE_PX) moving = true;
      }

      if (chain) {
        dots.current.forEach((el, i) => place(el, pts[Math.min(i, pts.length - 1)]));
      } else {
        place(head.current, pts[0]);
      }

      if (moving) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      target.current = { x: e.clientX, y: e.clientY };
      if (!seeded.current) {
        // First movement: jump there instead of streaking in from off-screen.
        seeded.current = true;
        snapToTarget();
      }
      setVisible(true);
      start();
    };
    const onLeave = () => setVisible(false);

    // Mode switched while the pointer is already known: re-place new nodes.
    if (seeded.current) {
      snapToTarget();
      start();
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, mode]);

  if (!enabled) return null;

  const base = mode === "blob" ? size / 8 : size / 24;
  const dotEls = Array.from({ length: TRAIL_COUNT }).map((_, i) => {
    const d = Math.max(4, Math.round(base * (1 - (i / TRAIL_COUNT) * 0.75)));
    return (
      <div
        key={i}
        ref={(el) => {
          dots.current[i] = el;
        }}
        className="absolute left-0 top-0 rounded-full will-change-transform"
        style={{
          width: d,
          height: d,
          background: color,
          opacity: mode === "blob" ? 1 : 0.7 - (i / TRAIL_COUNT) * 0.6,
          transform: `translate3d(${OFFSCREEN}px, ${OFFSCREEN}px, 0)`,
        }}
      />
    );
  });

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 overflow-hidden transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ zIndex: "var(--z-cursor, 200)" }}
    >
      {(mode === "glow" || mode === "spotlight") && (
        <div
          ref={head}
          className="absolute left-0 top-0 rounded-full will-change-transform"
          style={{
            width: size,
            height: size,
            background:
              mode === "glow"
                ? `radial-gradient(circle, ${alpha(color, 35)} 0%, transparent 70%)`
                : `radial-gradient(circle, ${alpha(color, 22)} 0%, ${alpha(color, 8)} 45%, transparent 68%)`,
            transform: `translate3d(${OFFSCREEN}px, ${OFFSCREEN}px, 0)`,
          }}
        />
      )}

      {mode === "trail" && dotEls}

      {mode === "blob" && (
        <>
          <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
            <defs>
              <filter id={gooId} colorInterpolationFilters="sRGB">
                <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                />
              </filter>
            </defs>
          </svg>
          <div className="absolute inset-0" style={{ filter: `url(#${gooId})`, opacity: 0.6 }}>
            {dotEls}
          </div>
        </>
      )}
    </div>
  );
}

export default CursorFx;
