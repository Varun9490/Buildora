"use client";

/**
 * buildora:theme-exempt
 *
 * The only literal colour here is a fallback for the canvas: a canvas
 * cannot read a CSS variable directly, so the accent is read from the
 * computed style, and this is what to use if that read fails. The particle
 * colour itself is the theme's.
 */

import * as React from "react";
import { cn } from "@buildora/utils";

/**
 * ParticleField — a canvas field of drifting points.
 *
 * No Three.js: one 2D context, a DPR cap of 2 and a bounded particle count.
 * The canvas is decorative, so it is aria-hidden and the component renders
 * nothing under prefers-reduced-motion.
 */
export type ParticleFieldProps = {
  /** Number of particles. Each one is a draw call, so keep it bounded. */
  count?: number;
  className?: string;
};

export function ParticleField({ count = 70, className }: ParticleFieldProps) {
  const ref = React.useRef<HTMLCanvasElement | null>(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const parts = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      r: 0.8 + Math.random() * 1.8,
      a: 0.25 + Math.random() * 0.55,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle =
          getComputedStyle(canvas).getPropertyValue("--b-accent").trim() || "#D4FF4F";
        ctx.globalAlpha = p.a;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn(
        "h-48 w-full rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color:var(--b-bg)]",
        className
      )}
    />
  );
}

export default ParticleField;
