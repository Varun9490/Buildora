"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@buildora/hooks";

export type TokenMeterProps = {
  used?: number;
  limit?: number;
  /** tokens the runtime overhead reserves and never touches */
  reserved?: number;
  label?: string;
  className?: string;
};

const SEGMENTS = 24;

export function TokenMeter({ used = 1284, limit = 8000, reserved = 512, label = "Context window", className }: TokenMeterProps) {
  const reduced = useReducedMotion();
  const pct = Math.min(100, (used / limit) * 100);
  const reservePct = Math.min(100 - pct, (reserved / limit) * 100);
  const warn = pct >= 70;
  const danger = pct >= 90;
  const filled = Math.round((pct / 100) * SEGMENTS);
  const reservedSegs = Math.min(SEGMENTS - filled, Math.ceil((reservePct / 100) * SEGMENTS));

  return (
    <div
      className={cn("rounded-xl border border-[color:color-mix(in_oklab,var(--b-border)_70%,transparent)] bg-[color:var(--b-panel)] p-4", className)}
      role="meter"
      aria-valuenow={used}
      aria-valuemin={0}
      aria-valuemax={limit}
      aria-valuetext={`${Math.round(pct)}% of context used — ${Math.max(0, limit - used)} tokens free`}
      aria-label={label}
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-[color:var(--b-text-secondary)]">
          {label}
          {danger ? (
            <span className="ml-2 rounded-full bg-[color:color-mix(in_oklab,var(--b-danger)_16%,transparent)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--b-danger)]">90%+</span>
          ) : warn ? (
            <span className="ml-2 rounded-full bg-[color:color-mix(in_oklab,var(--b-warning)_16%,transparent)] px-1.5 py-0.5 text-[10px] font-semibold text-[color:var(--b-warning)]">70%+</span>
          ) : null}
        </span>
        <motion.span
          key={used}
          initial={reduced ? false : { opacity: 0.4, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 font-mono text-xs tabular-nums text-[color:var(--b-text)]"
          aria-hidden
        >
          {used.toLocaleString()}<span className="text-[color:var(--b-muted)]"> / {limit.toLocaleString()}</span>
        </motion.span>
      </div>

      {/* the rail: 24 bars; consumed = accent→danger, reserved = hatched, free = quiet */}
      <div className="mt-3 flex h-6 items-stretch gap-[3px]" aria-hidden>
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const shown = reduced || i === 0 ? "filled" : i < filled ? "filled" : i < filled + reservedSegs ? "reserved" : "free";
          return (
            <motion.span
              key={i}
              className={cn(
                "flex-1 rounded-[3px]",
                shown === "filled"
                  ? danger
                    ? "bg-[color:var(--b-danger)]"
                    : warn
                      ? "bg-[color:var(--b-warning)]"
                      : "bg-[color:var(--b-accent)]"
                  : shown === "reserved"
                    ? "bg-[color:color-mix(in_oklab,var(--b-iris)_38%,transparent)]"
                    : "bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)]"
              )}
              initial={reduced ? false : { scaleY: 0.35, opacity: 0.4 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.018, 0.45), ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "bottom", height: shown === "reserved" ? "72%" : shown === "filled" ? "92%" : "56%" }}
            />
          );
        })}
      </div>

      {/* split readout */}
      <dl className="mt-3 grid grid-cols-3 gap-2 text-center" aria-hidden>
        <div className="rounded-lg bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)] py-1.5">
          <dt className="text-[10px] font-medium uppercase tracking-wide text-[color:var(--b-muted)]">Used</dt>
          <dd className="font-mono text-[11px] tabular-nums text-[color:var(--b-text)]">{used.toLocaleString()}</dd>
        </div>
        <div className="rounded-lg bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)] py-1.5">
          <dt className="text-[10px] font-medium uppercase tracking-wide text-[color:var(--b-muted)]">Reserved</dt>
          <dd className="font-mono text-[11px] tabular-nums text-[color:var(--b-iris)]">{reserved.toLocaleString()}</dd>
        </div>
        <div className="rounded-lg bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)] py-1.5">
          <dt className="text-[10px] font-medium uppercase tracking-wide text-[color:var(--b-muted)]">Free</dt>
          <dd className="font-mono text-[11px] tabular-nums text-[color:var(--b-success)]">{Math.max(0, limit - used).toLocaleString()}</dd>
        </div>
      </dl>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MODEL SELECTOR — a real accessible listbox instead of a
   bare <select>: keyboard search, aria-activedescendant,
   per-model context/latency/grade rows, spring pop-in list.
   ───────────────────────────────────────────────────────── */

export default TokenMeter;
