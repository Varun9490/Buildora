"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type DetentDialProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  /** Number of snap detents around the sweep. */
  detents?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  /** Sweep range in degrees (total, centered at 12 o'clock). */
  sweep?: number;
  size?: number;
  label?: string;
  /** Formats the numeric readout. */
  format?: (v: number) => string;
};

/**
 * DetentDial — a rotary knob with a Gaussian tick wave around the active
 * detent. Drag, wheel, or arrow keys; each detent ticks with a haptic-style
 * settle. role="slider" semantics.
 */
export function DetentDial({
  detents = 24,
  value,
  defaultValue,
  onChange,
  sweep = 270,
  size = 168,
  label = "Level",
  format,
  className,
  ...rest
}: DetentDialProps) {
  const reduced = useReducedMotion();
  const [internal, setInternal] = React.useState(defaultValue ?? Math.floor(detents / 2));
  const active = value ?? internal;
  const knobRef = React.useRef<HTMLDivElement | null>(null);
  const dragging = React.useRef(false);

  const clamp = (v: number) => Math.max(0, Math.min(detents - 1, v));
  const commit = (v: number) => {
    const snapped = clamp(Math.round(v));
    if (value === undefined) setInternal(snapped);
    onChange?.(snapped);
  };

  const angleFromCenter = (e: PointerEvent | React.PointerEvent) => {
    const knob = knobRef.current;
    if (!knob) return 0;
    const r = knob.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    // 0deg = 12 o'clock, positive clockwise
    let deg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    deg = Math.max(-sweep / 2, Math.min(sweep / 2, deg));
    return deg;
  };

  React.useEffect(() => {
    if (!dragging.current) return;
    const onMove = (e: PointerEvent) => commit((angleFromCenter(e) + sweep / 2) / (sweep / (detents - 1)));
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const onKey = (e: React.KeyboardEvent) => {
    const n = active;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") commit(n + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") commit(n - 1);
    else if (e.key === "Home") commit(0);
    else if (e.key === "End") commit(detents - 1);
    else return;
    e.preventDefault();
  };

  const rot = -sweep / 2 + (active / (detents - 1)) * sweep;
  const R = size / 2;
  const tickCount = detents;

  return (
    <div className={cn("inline-flex flex-col items-center gap-3", className)} onKeyDown={onKey} {...rest}>
      <div
        ref={knobRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={detents - 1}
        aria-valuenow={active}
        aria-valuetext={format ? format(active) : String(active)}
        aria-label={label}
        aria-orientation="vertical"
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          dragging.current = true;
          commit((angleFromCenter(e) + sweep / 2) / (sweep / (detents - 1)));
        }}
        onWheel={(e) => {
          e.preventDefault();
          commit(active + (e.deltaY > 0 ? -1 : 1));
        }}
        className={cn(
          "relative cursor-grab touch-none select-none rounded-full outline-none active:cursor-grabbing",
          "bg-[color:var(--b-surface)] border border-[color:var(--b-border)]",
          "focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]"
        )}
        style={{ width: size, height: size }}
      >
        {/* tick crown */}
        <div className="absolute inset-0" aria-hidden="true">
          {Array.from({ length: tickCount }, (_, i) => {
            const a = -sweep / 2 + (i / (detents - 1)) * sweep;
            const dist = Math.abs(i - active);
            const wave = Math.exp(-(dist * dist) / 2.4); // gaussian emphasis
            const len = 5 + wave * 7;
            return (
              <span
                key={i}
                className="absolute left-1/2 top-1/2 origin-bottom rounded-full transition-opacity duration-150"
                style={{
                  width: 2.5,
                  height: len,
                  background: `color-mix(in oklab, var(--b-accent) ${Math.round(35 + wave * 65)}%, var(--b-border))`,
                  transform: `translate(-50%,0) rotate(${a}deg) translateY(${-(R - 14)}px) translateY(-${len}px)`,
                  opacity: 0.45 + wave * 0.55,
                }}
              />
            );
          })}
        </div>

        {/* knob face */}
        <div
          className="absolute inset-[26%] rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-panel)] shadow-inner"
          style={{
            transform: reduced ? `rotate(${rot}deg)` : `rotate(${rot}deg)`,
            transition: reduced ? undefined : "transform 320ms cubic-bezier(.22,1.4,.36,1)",
          }}
        >
          <span
            className="absolute left-1/2 top-[7%] h-[34%] w-[3px] -translate-x-1/2 rounded-full bg-[color:var(--b-accent)]"
            aria-hidden="true"
          />
        </div>
      </div>
      <span className="font-display text-xl font-bold tabular-nums text-[color:var(--b-text)]" role="status">
        {format ? format(active) : active}
      </span>
    </div>
  );
}

export default DetentDial;
