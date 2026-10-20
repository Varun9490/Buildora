"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type GrabRollerStripProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  labels: string[];
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  itemWidth?: number;
  label?: string;
};

const SNAP_CSS = `
@keyframes bk-roller-flank{0%,100%{opacity:.38}50%{opacity:.7}}
`;

/**
 * GrabRollerStrip — a physical roller of labels you drag sideways; it settles
 * on the nearest label under a fixed center marker, with flanks flowing
 * under a fade. role="slider" (index-based), keyboard + drag.
 */
export function GrabRollerStrip({
  labels,
  value,
  defaultValue,
  onChange,
  itemWidth = 128,
  label = "Selector",
  className,
  ...rest
}: GrabRollerStripProps) {
  const reduced = useReducedMotion();
  const [internal, setInternal] = React.useState(defaultValue ?? Math.floor(labels.length / 2));
  const active = value ?? internal;
  const dragging = React.useRef(false);
  const startX = React.useRef(0);
  const baseIdx = React.useRef(0);
  const trackRef = React.useRef<HTMLDivElement | null>(null);

  const clamp = (v: number) => Math.max(0, Math.min(labels.length - 1, v));
  const commit = (idx: number) => {
    const n = clamp(Math.round(idx));
    if (value === undefined) setInternal(n);
    if (n !== active) onChange?.(n);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    startX.current = e.clientX;
    baseIdx.current = active;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    commit(baseIdx.current - (e.clientX - startX.current) / itemWidth);
  };
  const onPointerUp = () => {
    dragging.current = false;
    commit(active);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") commit(active + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") commit(active - 1);
    else if (e.key === "Home") commit(0);
    else if (e.key === "End") commit(labels.length - 1);
    else return;
    e.preventDefault();
  };

  const x = active * itemWidth;

  return (
    <div className={cn("flex w-full max-w-sm flex-col items-center gap-2", className)} onKeyDown={onKey} {...rest}>
      <style>{SNAP_CSS}</style>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={labels.length - 1}
        aria-valuenow={active}
        aria-valuetext={labels[active] ?? String(active)}
        aria-label={label}
        aria-orientation="horizontal"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          "relative h-16 w-full cursor-grab touch-none select-none overflow-hidden outline-none",
          "bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)]",
          "border-y border-[color:var(--b-border)] focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]",
          dragging.current ? "cursor-grabbing" : ""
        )}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10"
        >
          <div className="absolute inset-x-0 top-0 h-6" style={{ background: "linear-gradient(to bottom, var(--b-surface), transparent)", opacity: 0.9 }} />
          <div className="absolute inset-x-0 bottom-0 h-6" style={{ background: "linear-gradient(to top, var(--b-surface), transparent)", opacity: 0.9 }} />
        </div>

        <motion.div
          className="absolute inset-y-0 left-1/2 flex items-center will-change-transform"
          animate={reduced ? { x: 0 } : { x: -x }}
          transition={
            dragging.current
              ? { duration: 0 }
              : reduced
                ? { duration: 0 }
                : { type: "spring", bounce: 0.14, duration: 0.5 }
          }
          style={{ originX: 0 }}
        >
          <div className="flex h-full items-center" style={{ gap: 0 }}>
            {labels.map((l, i) => {
              const dist = Math.abs(i - active);
              const isCenter = dist === 0;
              const near = dist === 1;
              return (
                <span
                  key={l + i}
                  aria-hidden="true"
                  className={cn(
                    "flex shrink-0 items-center justify-center font-display font-bold transition-colors",
                    isCenter ? "text-[color:var(--b-accent)]" : "text-[color:var(--b-text)]"
                  )}
                  style={{
                    width: itemWidth,
                    fontSize: isCenter ? 22 : near ? 16 : 14,
                    opacity: isCenter ? 1 : dist === 1 ? 0.55 : 0.28,
                    ...(near && !reduced ? { animation: `bk-roller-flank ${1.8}s ease-in-out infinite` } : undefined),
                  }}
                >
                  {l}
                </span>
              );
            })}
          </div>
        </motion.div>

        {/* center marker */}
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 z-20 h-full w-px -translate-x-1/2 bg-[color:var(--b-accent)]" />
      </div>
      <div className="flex items-center justify-center gap-2" aria-hidden="true">
        <button type="button" tabIndex={-1} onClick={() => commit(active - 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--b-border)] text-[color:var(--b-muted)] hover:text-[color:var(--b-text)]" aria-label="Previous">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M10 3.5 5.5 8 10 12.5" /></svg>
        </button>
        <button type="button" tabIndex={-1} onClick={() => commit(active + 1)} className="flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--b-border)] text-[color:var(--b-muted)] hover:text-[color:var(--b-text)]" aria-label="Next">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m5.5 3.5 4.5 4.5L5.5 12.5" /></svg>
        </button>
      </div>
    </div>
  );
}

export default GrabRollerStrip;
