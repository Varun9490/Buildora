"use client";

import * as React from "react";
import { cn } from "../utils";

export type CursorFxMode = "glow" | "spotlight" | "trail" | "blob";

export type CursorFxProps = {
  mode?: CursorFxMode;
  color?: string;
  size?: number;
  className?: string;
};

const TRAIL_COUNT = 10;

/**
 * CursorFx — one pointer-following glow with four modes.
 * Decorative (aria-hidden, pointer-events-none), pointer-fine only,
 * renders nothing under prefers-reduced-motion. A single rAF loop writes
 * transforms to refs — no re-render per pointer move.
 * Replaces: glow/blob/trail/ghost/spotlight cursors.
 */
export function CursorFx({ mode = "glow", color = "var(--b-accent)", size = 320, className }: CursorFxProps) {
  const [enabled, setEnabled] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const head = React.useRef<HTMLDivElement | null>(null);
  const dots = React.useRef<Array<HTMLDivElement | null>>([]);
  const target = React.useRef({ x: -9999, y: -9999 });
  const trail = React.useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -9999, y: -9999 }))
  );

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    setEnabled(true);
  }, []);

  React.useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      setVisible((v) => (v ? v : true));
    };
    const onLeave = () => setVisible(false);
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = target.current;
      if (mode === "trail" || mode === "blob") {
        const pts = trail.current;
        const head0 = pts[0];
        const ease = mode === "blob" ? 0.18 : 0.35;
        head0.x += (t.x - head0.x) * ease;
        head0.y += (t.y - head0.y) * ease;
        for (let i = 1; i < pts.length; i++) {
          pts[i].x += (pts[i - 1].x - pts[i].x) * ease;
          pts[i].y += (pts[i - 1].y - pts[i].y) * ease;
        }
        dots.current.forEach((el, i) => {
          if (!el) return;
          const p = pts[Math.min(i, pts.length - 1)];
          el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
        });
        if (head.current) {
          head.current.style.transform = `translate(${head0.x}px, ${head0.y}px) translate(-50%, -50%)`;
        }
      } else if (head.current) {
        head.current.style.transform = `translate(${t.x}px, ${t.y}px) translate(-50%, -50%)`;
      }
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, mode]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
        className
      )}
      style={{ zIndex: "var(--z-cursor, 200)" }}
    >
      {(mode === "glow" || mode === "spotlight") && (
        <div
          ref={head}
          className="absolute left-0 top-0 rounded-full"
          style={{
            width: size,
            height: size,
            background:
              mode === "glow"
                ? `radial-gradient(circle, ${color}55 0%, transparent 70%)`
                : `radial-gradient(circle, ${color}33 0%, ${color}11 45%, transparent 68%)`,
            filter: mode === "glow" ? "blur(60px)" : undefined,
            transform: "translate(-9999px, -9999px)",
          }}
        />
      )}
      {(mode === "trail" || mode === "blob") && (
        <>
          {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                dots.current[i] = el;
              }}
              className="absolute left-0 top-0 rounded-full"
              style={{
                width: Math.max(4, size / 24 - i * 1.6),
                height: Math.max(4, size / 24 - i * 1.6),
                background: color,
                opacity: mode === "blob" ? 0.12 + (i === 0 ? 0.25 : 0) : 0.7 - (i / TRAIL_COUNT) * 0.6,
                filter: mode === "blob" ? `blur(${2 + i}px)` : undefined,
                boxShadow: i === 0 && mode === "blob" ? `0 0 24px ${color}` : undefined,
                transform: "translate(-9999px, -9999px)",
              }}
            />
          ))}
          {mode === "blob" && <div ref={head} className="absolute hidden" />}
        </>
      )}
    </div>
  );
}

export default CursorFx;
