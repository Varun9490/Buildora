"use client";

import * as React from "react";
import { animate } from "motion/react";
import { clamp, clamp01, useReducedMotionPref } from "@/lib/physics";

const MAX = 100;

const rubber = (over: number) => Math.sign(over) * Math.pow(Math.abs(over), 0.65) * 3.5;

export function RubberScrubber() {
  const hitRef = React.useRef<HTMLDivElement | null>(null);
  const railRef = React.useRef<HTMLDivElement | null>(null);
  const fillRef = React.useRef<HTMLDivElement | null>(null);
  const thumbRef = React.useRef<HTMLDivElement | null>(null);
  const labelRef = React.useRef<HTMLSpanElement | null>(null);
  const minusRef = React.useRef<HTMLButtonElement | null>(null);
  const plusRef = React.useRef<HTMLButtonElement | null>(null);

  const valueRef = React.useRef(68);
  const dragging = React.useRef(false);
  const reduced = useReducedMotionPref();
  const reducedRef = React.useRef(reduced);
  reducedRef.current = reduced;

  const paint = (v: number) => {
    const pct = clamp01(v / MAX) * 100;
    if (fillRef.current) fillRef.current.style.width = `${pct}%`;
    if (thumbRef.current) thumbRef.current.style.left = `${pct}%`;
    if (labelRef.current) labelRef.current.textContent = String(Math.round(v));
    if (hitRef.current) hitRef.current.setAttribute("aria-valuenow", String(Math.round(v)));
  };

  const update = (clientX: number) => {
    const hit = hitRef.current;
    const rail = railRef.current;
    if (!hit || !rail) return;
    const rect = hit.getBoundingClientRect();
    const w = Math.max(rect.width, 1);
    const x = clientX - rect.left;
    const over = x < 0 ? x : x > w ? x - w : 0;

    const next = clamp((x / w) * MAX, 0, MAX);
    valueRef.current = next;
    paint(next);

    if (reducedRef.current) return;
    const t = clamp01(Math.abs(over) / 80);
    rail.style.transform = `translateX(${rubber(over).toFixed(2)}px) scaleX(${(1 + t * 0.08).toFixed(3)}) scaleY(${(1 - t * 0.18).toFixed(3)})`;
    rail.style.transformOrigin = over > 0 ? "left center" : over < 0 ? "right center" : "center";
  };

  const release = () => {
    dragging.current = false;
    const rail = railRef.current;
    if (!rail || reducedRef.current) return;
    animate(rail, { x: 0, scaleX: 1, scaleY: 1 }, { type: "spring", stiffness: 420, damping: 24 });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragging.current = true;
    update(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    update(e.clientX);
  };

  const nudge = (side: "min" | "max") => {
    if (reducedRef.current) return;
    const rail = railRef.current;
    const btn = side === "min" ? minusRef.current : plusRef.current;
    const dir = side === "min" ? -1 : 1;
    const spring = { type: "spring", stiffness: 420, damping: 24 } as const;
    if (rail) {
      animate(rail, { x: dir * 7 }, spring).then(() => animate(rail, { x: 0 }, spring));
    }
    if (btn) {
      animate(btn, { x: dir * 5 }, spring).then(() => animate(btn, { x: 0 }, spring));
    }
  };

  const step = (dir: 1 | -1) => {
    const wall = (dir === -1 && valueRef.current <= 0) || (dir === 1 && valueRef.current >= MAX);
    if (wall) {
      nudge(dir === -1 ? "min" : "max");
      return;
    }
    valueRef.current = clamp(Math.round(valueRef.current) + dir * 5, 0, MAX);
    paint(valueRef.current);
  };

  return (
    <div className="flex h-[340px] w-full items-center justify-center">
      <div className="w-full max-w-[430px] px-1">
        <div className="mb-5 text-center font-mono text-[13px] text-[color:var(--b-text-secondary)]">
          <span ref={labelRef}>68</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            ref={minusRef}
            type="button"
            onClick={() => step(-1)}
            aria-label="Decrease by 5"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--b-border)] text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>

          <div
            ref={hitRef}
            role="slider"
            tabIndex={0}
            aria-label="Elastic intensity"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={68}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={release}
            onPointerCancel={release}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
                e.preventDefault();
                step(-1);
              } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
                e.preventDefault();
                step(1);
              } else if (e.key === "Home") {
                valueRef.current = 0;
                paint(0);
              } else if (e.key === "End") {
                valueRef.current = MAX;
                paint(MAX);
              }
            }}
            className="group relative flex-1 cursor-grab touch-none py-3 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)] active:cursor-grabbing"
          >
            <div
              ref={railRef}
              className="relative h-[10px] w-full rounded-full bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)] transition-[height] duration-200 group-hover:h-[14px] will-change-transform"
            >
              <div ref={fillRef} className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--b-accent)]" style={{ width: "68%" }} />
              <div
                ref={thumbRef}
                className="absolute top-1/2 h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[color:var(--b-accent)] bg-[color:var(--b-panel)] shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                style={{ left: "68%" }}
              />
            </div>
          </div>

          <button
            ref={plusRef}
            type="button"
            onClick={() => step(1)}
            aria-label="Increase by 5"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:var(--b-border)] text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text)]"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
