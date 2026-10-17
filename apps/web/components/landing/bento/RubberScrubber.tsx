"use client";

import * as React from "react";
import { clamp, clamp01, useReducedMotionPref } from "@/lib/physics";

/* ─────────────────────────────────────────────────────
   CARD 7 · RUBBER-BAND ELASTIC SCRUBBER
   Range input with real overscroll resistance at the
   extremes, velocity-tilted value badge, live waveform.
   ───────────────────────────────────────────────────── */

const MAX = 100;

const WAVE = Array.from({ length: 56 }, (_, i) => {
  const t = i / 55;
  return (
    0.25 +
    0.45 * Math.abs(Math.sin(t * Math.PI * 1.2)) * (1 - t * 0.35) +
    0.18 * Math.sin(t * 19)
  );
});

export function RubberScrubber() {
  const [value, setValue] = React.useState(68);
  const [stretch, setStretch] = React.useState(0); // −1 … +1 overscroll
  const [velocity, setVelocity] = React.useState(0);
  const lastValue = React.useRef(68);
  const lastTime = React.useRef(0);
  const decayRaf = React.useRef(0);
  const reduced = useReducedMotionPref();

  const kbStep = (dir: 1 | -1) => {
    setValue((v) => clamp(Math.round(v) + dir * 5, 0, MAX));
  };

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    const now = performance.now();
    const dt = Math.max(now - lastTime.current, 8);
    const v = ((next - lastValue.current) / dt) * 1000;
    setVelocity(reduced ? 0 : clamp(v, -260, 260));
    setValue(next);
    lastValue.current = next;
    lastTime.current = now;

    // velocity decay loop (self-cancelling)
    cancelAnimationFrame(decayRaf.current);
    const decay = () => {
      setVelocity((prev) => {
        const nv = prev * 0.88;
        if (Math.abs(nv) < 4) return 0;
        decayRaf.current = requestAnimationFrame(decay);
        return nv;
      });
    };
    decayRaf.current = requestAnimationFrame(decay);
  };

  React.useEffect(() => () => cancelAnimationFrame(decayRaf.current), []);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // resistance glow on further presses at the wall
    if ((value <= 0 && e.key === "ArrowLeft") || (value >= MAX && e.key === "ArrowRight")) {
      setStretch(value <= 0 ? -1 : 1);
      window.setTimeout(() => setStretch(0), 180);
    }
  };

  const pct = value / MAX;
  const visibleBars = Math.round(pct * WAVE.length);
  const tilt = reduced ? 0 : clamp(-velocity / 14, -9, 9);
  const badgeScale = reduced ? 1 : 1 + clamp01(Math.abs(velocity) / 300) * 0.16;

  return (
    <div className="w-full max-w-[430px] select-none">
      {/* waveform visualization */}
      <div className="relative mb-5 flex h-[96px] items-end justify-center gap-[3px] rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_70%,#000_8%)] px-5 pb-4 pt-5">
        {WAVE.map((h, i) => {
          const active = i < visibleBars;
          return (
            <span
              key={i}
              className="w-[3px] rounded-full transition-[background-color,box-shadow] duration-150"
              style={{
                height: `${Math.max(h * 62, 5)}px`,
                backgroundColor: active ? "var(--b-accent)" : "color-mix(in oklab, var(--b-text) 12%, transparent)",
                boxShadow:
                  active && Math.abs(i / WAVE.length - pct) < 0.05
                    ? "0 0 12px var(--b-accent-glow)"
                    : "none",
              }}
            />
          );
        })}
        {/* floating value badge */}
        <div
          className="pointer-events-none absolute -top-4 z-10"
          style={{
            left: `${8 + pct * 84}%`,
            transform: `translateX(-50%) rotate(${tilt.toFixed(2)}deg) scale(${badgeScale.toFixed(3)})`,
            transition: reduced ? "none" : "transform 60ms linear",
          }}
        >
          <span className="rounded-full border border-[color:var(--b-accent)]/40 bg-[color:var(--b-accent)] px-2 py-0.5 font-mono text-[10px] font-bold text-[color:var(--b-accent-foreground)] shadow-[0_0_18px_var(--b-accent-glow)]">
            {value}
          </span>
        </div>
      </div>

      {/* rubber-band rail */}
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 overflow-hidden rounded-full"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-[color:var(--b-accent)]"
            style={{
              width: `${pct * 100}%`,
              transform: `scaleX(${1 + clamp01(Math.abs(stretch)) * 0.04}) translateX(${stretch < 0 ? -2 : 0}px)`,
              transformOrigin: stretch < 0 ? "left" : "right",
              boxShadow: stretch !== 0 ? "0 0 14px var(--b-accent-glow)" : "none",
              transition: reduced ? "none" : "transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={MAX}
          step={1}
          value={value}
          onChange={onInput}
          onKeyDown={onKeyDown}
          className="b-range relative z-10 w-full cursor-grab active:cursor-grabbing"
          style={{ "--range-fill": `${pct * 100}%` } as React.CSSProperties}
          aria-label="Elastic intensity scrubber"
          aria-valuetext={`${value} percent`}
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <button
            onClick={() => kbStep(-1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--b-border)] font-mono text-xs text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)]"
            aria-label="Decrease by 5"
          >
            −
          </button>
          <button
            onClick={() => kbStep(1)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-[color:var(--b-border)] font-mono text-xs text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)]"
            aria-label="Increase by 5"
          >
            +
          </button>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--b-muted)]">
          drag to the walls — feel the resistance · ↑↓ keys fire too
        </span>
      </div>
    </div>
  );
}
