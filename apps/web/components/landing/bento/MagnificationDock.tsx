"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { gaussian, clamp, useReducedMotionPref } from "@/lib/physics";

/* ─────────────────────────────────────────────────────
   CARD 5 · FLUID GAUSSIAN MAGNIFICATION DOCK
   S(d) = 1 + A·exp(−d² / 2σ²) — interpolated per icon,
   written straight to GPU transforms.
   ───────────────────────────────────────────────────── */

const APPS = [
  { label: "Foundry", d: "M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" },
  { label: "Terminal", d: "M4 17l6-5-6-5M12 19h8" },
  { label: "Cathedral", d: "M12 2l3 6h-6l3-6zM4 22V10l8-6 8 6v12M4 22h16M9 22v-7h6v7" },
  { label: "Nebula", d: "M12 3a9 9 0 1 0 9 9M12 3a9 9 0 0 1 9 9h-9V3zM3 12h9" },
  { label: "Quill", d: "M20 4c-6 0-11 4-14 10l-3 6 6-3c6-3 10-8 11-13zM6 20l3-3" },
  { label: "Relay", d: "M12 4v16M4 12h16M7 7l10 10M17 7L7 17" },
  { label: "Vault", d: "M4 6h16v12H4zM4 10h16M8 14h2M14 14h2" },
];

const BASE = 46;
const GAP = 12;

export function MagnificationDock() {
  const rowRef = React.useRef<HTMLDivElement | null>(null);
  const iconRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [pressed, setPressed] = React.useState<number | null>(null);
  const reduced = useReducedMotionPref();

  const applyMagnification = (pointerX: number | null) => {
    iconRefs.current.forEach((icon, i) => {
      if (!icon) return;
      const center = i * (BASE + GAP) + BASE / 2;
      const d = pointerX === null ? 999 : Math.abs(pointerX - center);
      const influence = gaussian(d, 52);
      const scale = 1 + 0.9 * influence;
      const lift = -18 * gaussian(d, 60);
      icon.style.transform = reduced
        ? "translate3d(0,0,0) scale(1)"
        : `translate3d(0, ${lift.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      icon.style.zIndex = String(10 + Math.round(influence * 100));
    });
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = clamp(e.clientX - rect.left - 8, -40, rect.width + 40);
    applyMagnification(x);
  };

  const onLeave = () => {
    applyMagnification(null);
    setHovered(null);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative pt-9">
        <AnimatePresence>
          {hovered !== null && (
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 520, damping: 30 }}
              className="absolute top-0 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_96%,transparent)] px-2.5 py-1 font-mono text-[10px] text-[color:var(--b-text)] shadow-xl backdrop-blur-md"
              style={{ left: hovered * (BASE + GAP) + BASE / 2 + 8 }}
            >
              {APPS[hovered].label}
            </motion.span>
          )}
        </AnimatePresence>

        <div
          ref={rowRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="flex items-end gap-3 rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-glass)] p-2 shadow-[0_24px_50px_-24px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          role="toolbar"
          aria-label="Application dock"
        >
          {APPS.map((app, i) => (
            <motion.button
              key={app.label}
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              type="button"
              aria-label={`Open ${app.label}`}
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              onClick={() => {
                setPressed(i);
                setTimeout(() => setPressed(null), 550);
              }}
              style={{ width: BASE, height: BASE }}
              animate={pressed === i ? { scale: [1.15, 0.92, 1.08, 1] } : {}}
              transition={{ type: "spring", stiffness: 560, damping: 18 }}
              className="relative flex shrink-0 origin-bottom items-center justify-center rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_85%,transparent)] text-[color:var(--b-text-secondary)] transition-colors will-change-transform hover:text-[color:var(--b-accent)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d={app.d} />
              </svg>
              {pressed === i && (
                <motion.span
                  initial={{ opacity: 0.7, scale: 0.4 }}
                  animate={{ opacity: 0, scale: 1.9 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="pointer-events-none absolute inset-0 rounded-xl border border-[color:var(--b-accent)]"
                  aria-hidden="true"
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--b-muted)]">
        Magnify · Click for spring bounce + preview tooltip
      </p>
    </div>
  );
}
