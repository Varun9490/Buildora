"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { useReducedMotionPref } from "@/lib/physics";

const APPS = [
  { label: "Foundry", d: "M3 20h18M5 20V9l7-5 7 5v11M9 20v-6h6v6" },
  { label: "Terminal", d: "M4 17l6-5-6-5M12 19h8" },
  { label: "Cathedral", d: "M12 2l3 6h-6l3-6zM4 22V10l8-6 8 6v12M4 22h16M9 22v-7h6v7" },
  { label: "Nebula", d: "M12 3a9 9 0 1 0 9 9M12 3a9 9 0 0 1 9 9h-9V3zM3 12h9" },
  { label: "Quill", d: "M20 4c-6 0-11 4-14 10l-3 6 6-3c6-3 10-8 11-13zM6 20l3-3" },
  { label: "Relay", d: "M12 4v16M4 12h16M7 7l10 10M17 7L7 17" },
  { label: "Vault", d: "M4 6h16v12H4zM4 10h16M8 14h2M14 14h2" },
];

const BASE = 44;
const CELL = 56;
const MAX = 76;

function DockIcon({
  index,
  label,
  path,
  mouseX,
  reduce,
  onHover,
}: {
  index: number;
  label: string;
  path: string;
  mouseX: MotionValue<number>;
  reduce: boolean;
  onHover: (i: number | null) => void;
}) {
  const size = useSpring(
    useTransform(mouseX, (mx: number) => {
      const center = index * CELL + CELL / 2;
      const d = Math.abs(mx - center);
      const t = Math.max(0, 1 - d / 140);
      return BASE + (reduce ? 0 : MAX - BASE) * t;
    }),
    { mass: 0.1, stiffness: 170, damping: 12 }
  );
  const depth = useTransform(size, (s: number) => Math.round(s));

  return (
    <div className="relative h-[60px] w-[56px] shrink-0">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <motion.button
          type="button"
          aria-label={label}
          onPointerEnter={() => onHover(index)}
          onFocus={() => onHover(index)}
          onBlur={() => onHover(null)}
          onClick={(e) => {
            if (typeof e.currentTarget.animate !== "function") return;
            e.currentTarget.animate(
              [
                { transform: "scale(1)" },
                { transform: "scale(1.12)", offset: 0.35 },
                { transform: "scale(0.96)", offset: 0.7 },
                { transform: "scale(1)" },
              ],
              { duration: 380, easing: "cubic-bezier(.34,1.56,.64,1)" }
            );
          }}
          style={{ width: size, height: size, zIndex: depth }}
          className="flex origin-bottom items-center justify-center rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_85%,transparent)] text-[color:var(--b-text-secondary)] transition-colors will-change-[width,height] hover:text-[color:var(--b-accent)]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
            <path d={path} />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

export function MagnificationDock() {
  const mouseX = useMotionValue(-999);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const rowRef = React.useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotionPref();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
  };

  const onLeave = () => {
    mouseX.set(-999);
    setHovered(null);
  };

  return (
    <div className="flex h-[340px] w-full items-center justify-center">
      <div className="relative">
        <AnimatePresence>
          {hovered !== null && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.14 }}
              className="absolute -top-9 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-2.5 py-1 text-[11px] text-[color:var(--b-text)] shadow-lg"
              style={{ left: hovered * CELL + CELL / 2 }}
            >
              {APPS[hovered].label}
            </motion.span>
          )}
        </AnimatePresence>

        <div
          ref={rowRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="flex h-[60px] items-end rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-2"
          role="toolbar"
          aria-label="Application dock"
        >
          {APPS.map((app, i) => (
            <DockIcon
              key={app.label}
              index={i}
              label={app.label}
              path={app.d}
              mouseX={mouseX}
              reduce={reduced}
              onHover={setHovered}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
