"use client";

import * as React from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type DockItem = {
  /** Accessible name for the icon button. */
  label: string;
  /** 24x24 path data, drawn with the current text colour. */
  path: string;
};

export type MagnificationDockProps = {
  items: DockItem[];
  /** Icon size at rest, in px. */
  baseSize?: number;
  /** Icon size at full magnification, in px. */
  maxSize?: number;
  /** Horizontal slot width, in px. */
  cell?: number;
  className?: string;
};

const BASE = 44;
const CELL = 56;
const MAX = 64;

function DockIcon({
  index,
  item,
  mouseX,
  reduce,
  onHover,
}: {
  index: number;
  item: DockItem;
  mouseX: MotionValue<number>;
  reduce: boolean;
  onHover: (i: number | null) => void;
}) {
  // The size is derived from the pointer's distance to this icon's slot, so
  // the magnification follows the cursor continuously instead of snapping.
  const size = useSpring(
    useTransform(mouseX, (mx: number) => {
      const center = index * CELL + CELL / 2;
      const d = Math.abs(mx - center);
      const t = Math.max(0, 1 - d / 120);
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
          aria-label={item.label}
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
          className="flex origin-bottom items-center justify-center rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_85%,transparent)] text-[color:var(--b-text-secondary)] transition-colors will-change-[width,height] hover:text-[color:var(--b-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.7}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d={item.path} />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}

/**
 * MagnificationDock — a macOS-style dock where icons grow with cursor
 * proximity.
 *
 * The magnification is a spring on a motion value derived from the pointer's
 * distance to each slot, so it is continuous rather than a hover toggle.
 * Under prefers-reduced-motion the icons stay at their resting size.
 */
export function MagnificationDock({
  items,
  baseSize = BASE,
  maxSize = MAX,
  cell = CELL,
  className,
}: MagnificationDockProps) {
  const mouseX = useMotionValue(-999);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - r.left);
  };

  const onLeave = () => {
    mouseX.set(-999);
    setHovered(null);
  };

  return (
    <div className={cn("flex w-full items-center justify-center", className)}>
      <div className="relative">
        <AnimatePresence>
          {hovered !== null && items[hovered] && (
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.14 }}
              className="absolute -top-9 z-50 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-2.5 py-1 text-[11px] text-[color:var(--b-text)] shadow-lg"
              style={{ left: hovered * cell + cell / 2 }}
            >
              {items[hovered].label}
            </motion.span>
          )}
        </AnimatePresence>

        <div
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="flex h-[60px] items-end rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] px-2"
          role="toolbar"
          aria-label="Application dock"
        >
          {items.map((item, i) => (
            <DockIcon
              key={item.label}
              index={i}
              item={item}
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

export default MagnificationDock;
