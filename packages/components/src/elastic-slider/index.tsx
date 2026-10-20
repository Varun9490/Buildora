"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type ElasticSliderProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Optional suffix rendered next to the numeric readout. */
  unit?: string;
  label?: string;
  /** Minimum pixel width of the free-moving track. */
  trackWidth?: number;
};

/**
 * ElasticSlider — a slider whose knob over-stretches at the edges and
 * snaps back with rubber-band physics. Keyboard: arrows step, Home/End,
 * PageUp/PageDown. Announced via role="slider".
 */
export function ElasticSlider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onChange,
  unit = "",
  label = "Value",
  trackWidth = 260,
  className,
  ...rest
}: ElasticSliderProps) {
  const reduced = useReducedMotion();
  const [internal, setInternal] = React.useState(defaultValue ?? min);
  const active = value ?? internal;
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [stretch, setStretch] = React.useState(0); // overshoot px beyond bounds

  const pct = (active - min) / (max - min);

  const commit = (v: number) => {
    const clamped = Math.min(max, Math.max(min, v));
    const snapped = Math.round(clamped / step) * step;
    if (value === undefined) setInternal(snapped);
    onChange?.(snapped);
  };

  const posToValue = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return min;
    const r = track.getBoundingClientRect();
    return min + Math.max(0, Math.min(1, (clientX - r.left) / r.width)) * (max - min);
  };

  const onPointer = (e: React.PointerEvent) => {
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const v = posToValue(e.clientX);
    if (v < min) setStretch(Math.min(28, (min - v) * 2.2));
    else if (v > max) setStretch(Math.min(28, (v - max) * 2.2));
    else setStretch(0);
    commit(v);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const big = Math.max(step, (max - min) / 8);
    const map: Record<string, number> = {
      ArrowRight: active + step,
      ArrowUp: active + step,
      ArrowLeft: active - step,
      ArrowDown: active - step,
      PageUp: active + big,
      PageDown: active - big,
      Home: min,
      End: max,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const v = map[e.key];
    if (v < min || v > max) setStretch(Math.min(28, (v < min ? min - v : v - max) * 0.5));
    commit(v);
  };

  const release = () => setStretch(0);

  const readout = `${Math.round(active * 100) / 100}${unit ? unit : ""}`;

  return (
    <div
      className={cn("flex w-full max-w-md flex-col gap-3", className)}
      onKeyDown={onKey}
      {...rest}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-xs font-medium uppercase tracking-widest text-[color:var(--b-muted)]">{label}</span>
        <span className="font-display text-lg font-bold tabular-nums text-[color:var(--b-text)]">
          {readout}
          {unit ? <span className="ml-0.5 text-xs font-medium text-[color:var(--b-muted)]">{unit}</span> : null}
        </span>
      </div>
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={active}
        aria-valuetext={readout}
        aria-label={label}
        tabIndex={0}
        onPointerDown={onPointer}
        onPointerMove={(e) => {
          if (e.buttons & 1) onPointer(e);
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        className={cn(
          "relative w-full cursor-pointer touch-none rounded-full outline-none",
          "h-2 border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)]",
          "focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]"
        )}
        style={{ maxWidth: trackWidth }}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--b-accent)]"
          style={{ width: `${Math.max(0, Math.min(1, pct)) * 100}%` }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute top-1/2 flex h-8 w-8 items-center justify-center rounded-full border bg-[color:var(--b-panel)] shadow-md -translate-y-1/2 outline-none"
          style={{ left: `${Math.max(0, Math.min(1, pct)) * 100}%` }}
          animate={
            reduced
              ? { x: stretch > 0 ? (stretch > 0 ? (pct <= 0 ? -Math.min(10, stretch / 3) : Math.min(10, stretch / 3)) : 0) : 0, scaleX: 1 }
              : { x: pct <= 0 ? -Math.min(12, stretch / 2.2) : pct >= 1 ? Math.min(12, stretch / 2.2) : 0, scaleX: stretch > 0 ? 1 + Math.min(0.28, stretch / 90) : 1 }
          }
          transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.5, duration: 0.5 }}
          aria-hidden="true"
        >
          <span className="h-3 w-[3px] rounded-full bg-[color:var(--b-accent)]" />
        </motion.div>
      </div>
      <div className="flex justify-between font-mono text-[10px] text-[color:var(--b-muted)]" aria-hidden="true">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

export default ElasticSlider;
