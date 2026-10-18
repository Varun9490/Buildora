"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotionPref } from "@/lib/physics";

/* ─────────────────────────────────────────────────────
   PHYSICS LAB — the spring kernel, plotted honestly.
   Pick a damping regime, pluck the system, read real
   numbers: overshoot, settling time, envelope.
   ───────────────────────────────────────────────────── */

type Regime = { id: string; label: string; zeta: number; note: string };

const REGIMES: Regime[] = [
  { id: "under", label: "Underdamped", zeta: 0.35, note: "Bouncy overshoot — buttons, sheets, toasts" },
  { id: "critical", label: "Critical", zeta: 1.0, note: "Fastest settle with zero overshoot — layout shifts" },
  { id: "over", label: "Overdamped", zeta: 1.6, note: "Heavy and deliberate — drawers, full-screen modals" },
];

const OMEGA = 6; // rad/s

function response(t: number, zeta: number): number {
  const w = OMEGA;
  if (Math.abs(zeta - 1) < 0.001) {
    return (1 + w * t) * Math.exp(-w * t);
  }
  if (zeta < 1) {
    const wd = w * Math.sqrt(1 - zeta * zeta);
    return Math.exp(-zeta * w * t) * (Math.cos(wd * t) + ((zeta * w) / wd) * Math.sin(wd * t));
  }
  const s = Math.sqrt(zeta * zeta - 1);
  const r1 = -w * (zeta - s);
  const r2 = -w * (zeta + s);
  const A = r2 / (r2 - r1);
  const B = -r1 / (r2 - r1);
  return A * Math.exp(r1 * t) + B * Math.exp(r2 * t);
}

function envelope(t: number, zeta: number): number {
  return Math.exp(-zeta * OMEGA * t);
}

const VB_W = 560;
const VB_H = 200;
const T_MAX = 3.2;

function toPath(zeta: number, scale: number): string {
  const pts: string[] = [];
  const N = 180;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_MAX;
    const x = response(t, zeta);
    const px = (i / N) * VB_W;
    const py = VB_H / 2 - x * scale;
    pts.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`);
  }
  return pts.join(" ");
}

function settleStats(zeta: number) {
  let overshoot = 1;
  let settle = T_MAX;
  const N = 900;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_MAX;
    overshoot = Math.max(overshoot, response(t, zeta));
  }
  for (let i = N; i >= 0; i--) {
    const t = (i / N) * T_MAX;
    if (Math.abs(response(t, zeta)) > 0.02) {
      settle = t;
      break;
    }
  }
  return { overshootPct: (overshoot - 1) * 100, settle };
}

export function PhysicsLab() {
  const [regime, setRegime] = React.useState<Regime>(REGIMES[0]);
  const [pluckKey, setPluckKey] = React.useState(0);
  const reduced = useReducedMotionPref();

  const scale = 74;
  const stats = React.useMemo(() => settleStats(regime.zeta), [regime.zeta]);
  const path = React.useMemo(() => toPath(regime.zeta, scale), [regime.zeta]);
  const envelopePath = React.useMemo(() => {
    const top: string[] = [];
    const bottom: string[] = [];
    const N = 90;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * T_MAX;
      const px = (i / N) * VB_W;
      const e = envelope(t, regime.zeta) * scale;
      top.push(`${i === 0 ? "M" : "L"}${px.toFixed(1)},${(VB_H / 2 - e).toFixed(1)}`);
      bottom.push(`L${px.toFixed(1)},${(VB_H / 2 + e).toFixed(1)}`);
    }
    return `${top.join(" ")} ${bottom.reverse().join(" ")} Z`;
  }, [regime.zeta]);

  return (
    <section id="physics-lab" className="relative mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-1 text-[11px] text-[color:var(--b-accent)]">
          Physics Lab
        </span>
        <h2 className="mt-5 font-display text-3xl font-bold tracking-tight text-[color:var(--b-text)] sm:text-4xl lg:text-5xl text-balance">
          The spring kernel, plotted honestly.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--b-text-secondary)] sm:text-base">
          This is the exact solver the primitives ship with. Pick a damping regime,
          pluck the system, and read the numbers instead of trusting a marketing claim.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-[1.9fr_1fr]">
        {/* oscilloscope */}
        <div className="relative overflow-hidden rounded-[2rem] border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_65%,#000_8%)] p-2">
          <div className="relative overflow-hidden rounded-[calc(2rem-0.5rem)] border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_80%,transparent)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--b-muted)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)] fx-pulse-soft" />
                x(t) · displacement response
              </div>
              <div className="flex gap-1.5" role="group" aria-label="Damping regime">
                {REGIMES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setRegime(r);
                      setPluckKey((k) => k + 1);
                    }}
                    aria-pressed={regime.id === r.id}
                    className={cn(
                      "rounded-full border px-3 py-1 font-mono text-[10px] transition-colors",
                      regime.id === r.id
                        ? "border-[color:var(--b-accent)] bg-[color:var(--b-accent-muted)] font-semibold text-[color:var(--b-accent)]"
                        : "border-[color:var(--b-border)] text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                    )}
                  >
                    ζ {r.zeta.toFixed(2)}
                  </button>
                ))}
              </div>
            </div>

            <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="mt-4 w-full" role="img" aria-label={`Step response with damping ratio ${regime.zeta}`}>
              {/* grid */}
              {[0.25, 0.5, 0.75].map((f) => (
                <line key={`v${f}`} x1={VB_W * f} y1="0" x2={VB_W * f} y2={VB_H} stroke="var(--b-border)" strokeWidth="0.5" />
              ))}
              <line x1="0" y1={VB_H / 2} x2={VB_W} y2={VB_H / 2} stroke="var(--b-border-hover)" strokeWidth="1" strokeDasharray="4 4" />

              {/* envelope (only meaningful for underdamped) */}
              {regime.zeta < 1 && (
                <motion.path
                  key={`env-${regime.id}`}
                  d={envelopePath}
                  fill="var(--b-accent-muted)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                />
              )}

              {/* response curve */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.path
                  key={`curve-${regime.id}-${pluckKey}`}
                  d={path}
                  fill="none"
                  stroke="var(--b-accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 0.4 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={reduced ? { duration: 0 } : { duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  style={{ filter: "drop-shadow(0 0 6px var(--b-accent-glow))" }}
                />
              </AnimatePresence>
            </svg>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[color:var(--b-border)] pt-3">
              <p className="font-mono text-[10px] text-[color:var(--b-muted)]">{regime.note}</p>
              <button
                onClick={() => setPluckKey((k) => k + 1)}
                className="rounded-lg border border-[color:var(--b-border)] px-3 py-1 font-mono text-[10px] font-medium text-[color:var(--b-text-secondary)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)] active:scale-95"
              >
                ↺ Pluck the system
              </button>
            </div>
          </div>
        </div>

        {/* readouts */}
        <div className="flex flex-col gap-3">
          {[
            { k: "Damping ratio", v: `ζ = ${regime.zeta.toFixed(2)}` },
            { k: "Natural frequency", v: `ωₙ = ${OMEGA} rad/s` },
            { k: "Peak overshoot", v: `${stats.overshootPct < 0.05 ? "0.0" : stats.overshootPct.toFixed(1)} %` },
            { k: "Settling time (±2%)", v: `t_s ≈ ${stats.settle.toFixed(2)} s` },
          ].map((row) => (
            <div
              key={row.k}
              className="flex items-center justify-between rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_90%,transparent)] px-5 py-4"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--b-muted)]">
                {row.k}
              </span>
              <span className="font-mono text-sm font-semibold text-[color:var(--b-text)]">{row.v}</span>
            </div>
          ))}
          <div className="rounded-2xl border border-dashed border-[color:var(--b-border)] px-5 py-4">
            <p className="text-xs leading-relaxed text-[color:var(--b-muted)]">
              Equivalent configuration:{" "}
              <code className="rounded bg-[color:var(--b-accent-muted)] px-1.5 py-0.5 font-mono text-[11px] text-[color:var(--b-accent)]">
                {"{ stiffness: " + Math.round(OMEGA * OMEGA * 8) + ", damping: " + Math.round(2 * regime.zeta * OMEGA * 8) + ", mass: 8 }"}
              </code>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
