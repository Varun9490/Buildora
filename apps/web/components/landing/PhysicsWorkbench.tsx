"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CopyButton } from "./CodeBlock";
import { useBuildora } from "@/lib/store";
import {
  springStep,
  gaussian,
  clamp,
  useRafLoop,
  useReducedMotionPref,
  useFps,
  type SpringConfig,
} from "@/lib/physics";

/* ─────────────────────────────────────────────────────
   SECTION 2 — THE LIVE PHYSICS WORKBENCH
   A real damped-harmonic-oscillator console: sliders mutate
   stiffness / damping / pull, telemetry streams at 60fps, and
   the JSX below rewrites itself as you drag.
   ───────────────────────────────────────────────────── */

type TabId = "singularity" | "orb" | "dock";

type Telemetry = { dx: number; dy: number; v: number; tension: number };
type Pointer = { x: number; y: number; active: boolean };
type LiveConfig = { strength: number; stiffness: number; damping: number; radius: number };

const TABS: { id: TabId; label: string; short: string }[] = [
  { id: "singularity", label: "Magnetic Singularity Button", short: "Singularity" },
  { id: "orb", label: "3D Specular Command Orb", short: "Specular Orb" },
  { id: "dock", label: "Elastic Gravity Dock", short: "Gravity Dock" },
];

export function PhysicsWorkbench() {
  const [tab, setTab] = React.useState<TabId>("singularity");
  const [strength, setStrength] = React.useState(45);
  const [stiffness, setStiffness] = React.useState(220);
  const [damping, setDamping] = React.useState(18);
  const motionOverride = useBuildora((s) => s.motionOverride);
  const setMotionOverride = useBuildora((s) => s.setMotionOverride);
  const fps = useFps();

  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const pointerRef = React.useRef<Pointer>({ x: 0, y: 0, active: false });
  const telemetryRef = React.useRef<Telemetry>({ dx: 0, dy: 0, v: 0, tension: 0 });
  const configRef = React.useRef<LiveConfig>({ strength: 0.45, stiffness: 220, damping: 18, radius: 150 });
  configRef.current = {
    strength: strength / 100,
    stiffness,
    damping,
    radius: 150,
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
  };
  const onPointerLeave = () => {
    pointerRef.current = { ...pointerRef.current, active: false };
  };

  const code = React.useMemo(() => {
    switch (tab) {
      case "singularity":
        return [
          "<MagneticButton",
          `  strength={${(strength / 100).toFixed(2)}}`,
          `  stiffness={${stiffness}}`,
          `  damping={${damping}}`,
          ">",
          "  Deploy Primitives",
          "</MagneticButton>",
        ].join("\n");
      case "orb":
        return `<SpecularOrb tilt={18} stiffness={${stiffness}} damping={${damping}}>\n  Ship v1.0\n</SpecularOrb>`;
      case "dock":
        return `<GravityDock radius={${configRef.current.radius}} stiffness={${stiffness}} damping={${damping}} items={5} />`;
    }
  }, [tab, strength, stiffness, damping]);

  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="pointer-events-none absolute -inset-2 rounded-[2.6rem] bg-gradient-to-br from-[color:var(--b-accent-glow)] via-transparent to-[color:color-mix(in_oklab,var(--b-iris)_18%,transparent)] opacity-70 blur-2xl" />

      {/* Doppelrand shell */}
      <div className="relative rounded-[2rem] border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-text)_3%,transparent)] p-2 shadow-[0_30px_70px_-24px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        <div className="relative overflow-hidden rounded-[calc(2rem-0.5rem)] border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_96%,transparent)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_55%,transparent)] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--b-accent)] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--b-accent)]" />
              </span>
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[color:var(--b-text-secondary)]">
                Interactive Physics Console
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMotionOverride(motionOverride === "reduced" ? "auto" : "reduced")}
                aria-pressed={motionOverride === "reduced"}
                className="rounded-full border border-[color:var(--b-border)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--b-muted)] transition-colors hover:border-[color:var(--b-border-hover)] hover:text-[color:var(--b-text-secondary)]"
                title="Toggle reduced motion override"
              >
                {motionOverride === "reduced" ? "MOTION: REDUCED" : "MOTION: FULL"}
              </button>
              <span className="rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-bg)] px-2 py-0.5 font-mono text-[10px] text-[color:var(--b-muted)]">
                {fps} FPS
              </span>
            </div>
          </div>

          {/* Primitive tabs */}
          <div className="flex gap-1 border-b border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_25%,transparent)] p-1.5" role="tablist" aria-label="Interactive primitive">
            {TABS.map((t) => {
              const selected = tab === t.id;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setTab(t.id)}
                  className={`relative flex flex-1 items-center justify-center rounded-xl px-2 py-2 font-mono text-[11px] transition-colors ${
                    selected
                      ? "font-semibold text-[color:var(--b-text)]"
                      : "text-[color:var(--b-muted)] hover:bg-[color:color-mix(in_oklab,var(--b-text)_3%,transparent)] hover:text-[color:var(--b-text-secondary)]"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="workbench-tab"
                      className="absolute inset-0 rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] shadow-sm"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 truncate">{t.short}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive stage */}
          <div
            ref={stageRef}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            className="relative flex min-h-[290px] items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,color-mix(in_oklab,var(--b-accent)_8%,transparent),transparent_70%)]"
          >
            {/* Dashed proximity boundary */}
            <ProximityRing telemetryRef={telemetryRef} />

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ type: "spring", stiffness: 340, damping: 30 }}
                className="relative z-10 flex w-full items-center justify-center"
              >
                {tab === "singularity" && (
                  <SingularityStage configRef={configRef} pointerRef={pointerRef} telemetryRef={telemetryRef} stageRef={stageRef} />
                )}
                {tab === "orb" && (
                  <OrbStage configRef={configRef} pointerRef={pointerRef} telemetryRef={telemetryRef} stageRef={stageRef} />
                )}
                {tab === "dock" && (
                  <DockStage configRef={configRef} pointerRef={pointerRef} telemetryRef={telemetryRef} stageRef={stageRef} />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Telemetry overlay */}
            <TelemetryPanel telemetryRef={telemetryRef} />
          </div>

          {/* Parameter sliders */}
          <div className="grid gap-3 border-t border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_25%,transparent)] px-4 py-3 sm:grid-cols-3">
            <SliderControl
              label="Attraction Strength"
              value={strength}
              min={10}
              max={100}
              step={1}
              format={(v) => `${v}%`}
              onChange={setStrength}
            />
            <SliderControl
              label="Spring Stiffness k"
              value={stiffness}
              min={80}
              max={400}
              step={5}
              format={(v) => String(v)}
              onChange={setStiffness}
            />
            <SliderControl
              label="Spring Damping c"
              value={damping}
              min={8}
              max={40}
              step={1}
              format={(v) => String(v)}
              onChange={setDamping}
            />
          </div>

          {/* Live JSX dock — $ reserved for shell commands only */}
          <div className="flex items-center justify-between gap-3 border-t border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_80%,#000_8%)] px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--b-muted)]">
                Live JSX · rewrites as you drag
              </p>
              <pre className="scroll-sleek overflow-x-auto font-mono text-[11px] leading-relaxed text-[color:var(--b-text-secondary)]">
                <code>{code}</code>
              </pre>
            </div>
            <CopyButton text={code} label="Copy JSX" copiedLabel="Copied" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Slider ─────────────────────────────────────────── */
function SliderControl({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[color:var(--b-muted)]">
        {label}
        <span className="font-bold text-[color:var(--b-accent)]">{format(value)}</span>
      </span>
      <input
        type="range"
        className="b-range w-full"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ "--range-fill": `${pct}%` } as React.CSSProperties}
        aria-label={label}
      />
    </label>
  );
}

/* ── Dashed boundary ring ───────────────────────────── */
function ProximityRing({ telemetryRef }: { telemetryRef: React.RefObject<Telemetry> }) {
  const ringRef = React.useRef<HTMLDivElement | null>(null);
  useRafLoop(() => {
    const el = ringRef.current;
    if (!el) return;
    const t = telemetryRef.current?.tension ?? 0;
    el.style.opacity = `${0.18 + t * 0.55}`;
    el.style.transform = `translate(-50%, -50%) scale(${1 + t * 0.07})`;
    el.style.borderColor = `color-mix(in oklab, var(--b-accent) ${Math.round(18 + t * 60)}%, transparent)`;
  });
  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] rounded-full border-2 border-dashed border-[color:var(--b-border)] transition-none"
      style={{ transform: "translate(-50%, -50%)" }}
    />
  );
}

/* ── Telemetry readouts ─────────────────────────────── */
function TelemetryPanel({ telemetryRef }: { telemetryRef: React.RefObject<Telemetry> }) {
  const dxRef = React.useRef<HTMLSpanElement | null>(null);
  const dyRef = React.useRef<HTMLSpanElement | null>(null);
  const vRef = React.useRef<HTMLSpanElement | null>(null);
  const tRef = React.useRef<HTMLSpanElement | null>(null);

  useRafLoop(() => {
    const t = telemetryRef.current;
    if (!t) return;
    const fmt = (v: number) => `${v >= 0 ? "+" : "-"}${Math.abs(Math.round(v))}px`;
    if (dxRef.current) dxRef.current.textContent = fmt(t.dx);
    if (dyRef.current) dyRef.current.textContent = fmt(t.dy);
    if (vRef.current) vRef.current.textContent = `${Math.round(Math.abs(t.v))}px/s`;
    if (tRef.current) tRef.current.textContent = `${Math.round(t.tension * 100)}%`;
  });

  return (
    <div className="pointer-events-none absolute bottom-3 left-3 z-20 grid grid-cols-2 gap-x-4 gap-y-1 rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_72%,transparent)] px-3 py-2 font-mono text-[10px] backdrop-blur-md">
      <span className="text-[color:var(--b-muted)]">
        ΔX <span ref={dxRef} className="text-[color:var(--b-text-secondary)]">±0px</span>
      </span>
      <span className="text-[color:var(--b-muted)]">
        ΔY <span ref={dyRef} className="text-[color:var(--b-text-secondary)]">±0px</span>
      </span>
      <span className="text-[color:var(--b-muted)]">
        VEL <span ref={vRef} className="text-[color:var(--b-text-secondary)]">0px/s</span>
      </span>
      <span className="text-[color:var(--b-muted)]">
        TENS <span ref={tRef} className="text-[color:var(--b-accent)]">0%</span>
      </span>
    </div>
  );
}

/* ── Primitive 1 · Magnetic Singularity Button ──────── */
function SingularityStage({
  configRef,
  pointerRef,
  telemetryRef,
  stageRef,
}: {
  configRef: React.RefObject<LiveConfig>;
  pointerRef: React.RefObject<Pointer>;
  telemetryRef: React.RefObject<Telemetry>;
  stageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const state = React.useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const reduced = useReducedMotionPref();

  useRafLoop(() => {
    const el = btnRef.current;
    const stage = stageRef.current;
    const cfg = configRef.current;
    const p = pointerRef.current;
    if (!el || !stage || !cfg || !p) return;

    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const homeX = w / 2;
    const homeY = h / 2;

    let tx = 0;
    let ty = 0;
    let dist = Infinity;
    let tension = 0;

    if (p.active) {
      const dx = p.x - homeX;
      const dy = p.y - homeY;
      dist = Math.hypot(dx, dy);
      tension = clamp(1 - dist / cfg.radius, 0, 1);
      tx = dx * cfg.strength * tension;
      ty = dy * cfg.strength * tension;
    }

    const spring: SpringConfig = { stiffness: cfg.stiffness, damping: cfg.damping, mass: 1 };
    if (reduced) {
      state.current.x = tx;
      state.current.y = ty;
      state.current.vx = 0;
      state.current.vy = 0;
    } else {
      const sx = springStep(state.current.x, state.current.vx, tx, spring);
      const sy = springStep(state.current.y, state.current.vy, ty, spring);
      state.current = { x: sx.x, vx: sx.v, y: sy.x, vy: sy.v };
    }

    el.style.transform = `translate3d(${state.current.x.toFixed(2)}px, ${state.current.y.toFixed(2)}px, 0)`;
    if (telemetryRef.current) {
      telemetryRef.current.dx = state.current.x;
      telemetryRef.current.dy = state.current.y;
      telemetryRef.current.v = Math.hypot(state.current.vx, state.current.vy);
      telemetryRef.current.tension = Number.isFinite(dist) ? tension : 0;
    }
  });

  return (
    <div className="flex flex-col items-center gap-4 py-6">
      <button
        ref={btnRef}
        type="button"
        className="will-change-transform focus-visible:outline-none"
        aria-label="Magnetic singularity button — hover nearby to feel the pull"
      >
        <span className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-[color:var(--b-accent)] px-7 py-3.5 font-mono text-sm font-bold text-[color:var(--b-accent-foreground)] shadow-[0_0_34px_var(--b-accent-glow)]">
          <span className="absolute inset-0 bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] bg-[length:200%_100%] fx-pulse-soft" aria-hidden="true" />
          <span className="relative">Deploy Primitives</span>
          <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-black/20 text-[10px]">
            ↗
          </span>
        </span>
      </button>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--b-muted)]">
        Move the cursor inside the dashed field
      </p>
    </div>
  );
}

/* ── Primitive 2 · 3D Specular Command Orb ──────────── */
function OrbStage({
  configRef,
  pointerRef,
  telemetryRef,
  stageRef,
}: {
  configRef: React.RefObject<LiveConfig>;
  pointerRef: React.RefObject<Pointer>;
  telemetryRef: React.RefObject<Telemetry>;
  stageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const glareRef = React.useRef<HTMLDivElement | null>(null);
  const state = React.useRef({ rx: 0, ry: 0, vx: 0, vy: 0 });
  const reduced = useReducedMotionPref();

  useRafLoop(() => {
    const el = wrapRef.current;
    const stage = stageRef.current;
    const cfg = configRef.current;
    const p = pointerRef.current;
    if (!el || !stage || !cfg || !p) return;

    const w = stage.clientWidth;
    const h = stage.clientHeight;
    let trx = 0;
    let try_ = 0;
    let tension = 0;

    if (p.active) {
      const nx = clamp((p.x - w / 2) / (w / 2), -1, 1);
      const ny = clamp((p.y - h / 2) / (h / 2), -1, 1);
      trx = -ny * 18 * cfg.strength * 2;
      try_ = nx * 18 * cfg.strength * 2;
      tension = clamp(Math.hypot(nx, ny), 0, 1);
    }

    const spring: SpringConfig = { stiffness: cfg.stiffness, damping: cfg.damping, mass: 1 };
    if (reduced) {
      state.current.rx = trx;
      state.current.ry = try_;
      state.current.vx = 0;
      state.current.vy = 0;
    } else {
      const sx = springStep(state.current.rx, state.current.vx, trx, spring);
      const sy = springStep(state.current.ry, state.current.vy, try_, spring);
      state.current = { rx: sx.x, vx: sx.v, ry: sy.x, vy: sy.v };
    }

    el.style.transform = `perspective(760px) rotateX(${state.current.rx.toFixed(2)}deg) rotateY(${state.current.ry.toFixed(2)}deg)`;
    if (glareRef.current) {
      const gx = 50 + state.current.ry * 1.8;
      const gy = 42 - state.current.rx * 1.8;
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.85), rgba(255,255,255,0.08) 34%, transparent 60%)`;
    }
    if (telemetryRef.current) {
      telemetryRef.current.dx = state.current.ry;
      telemetryRef.current.dy = state.current.rx;
      telemetryRef.current.v = Math.hypot(state.current.vy, state.current.vx) * 57;
      telemetryRef.current.tension = tension;
    }
  });

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <div ref={wrapRef} className="preserve-3d will-change-transform" style={{ transformStyle: "preserve-3d" }}>
        <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-[radial-gradient(circle_at_32%_28%,color-mix(in_oklab,var(--b-accent)_85%,white),var(--b-accent)_40%,color-mix(in_oklab,var(--b-accent)_35%,black)_78%)] shadow-[0_18px_50px_-12px_var(--b-accent-glow),inset_0_-10px_26px_rgba(0,0,0,0.4)]">
          <div ref={glareRef} className="absolute inset-0 rounded-full opacity-80 mix-blend-screen" aria-hidden="true" />
          <div className="absolute inset-2 rounded-full border border-white/20" aria-hidden="true" />
          <svg className="relative h-10 w-10 text-black/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
            <circle cx="12" cy="12" r="3.2" />
          </svg>
        </div>
      </div>
      <button
        type="button"
        className="rounded-full border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_70%,transparent)] px-4 py-1.5 font-mono text-[11px] font-semibold text-[color:var(--b-text)] transition-colors hover:border-[color:var(--b-border-hover)]"
      >
        Ship v1.0
      </button>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--b-muted)]">
        Tilt springs read rotateX / rotateY in degrees
      </p>
    </div>
  );
}

/* ── Primitive 3 · Elastic Gravity Dock ─────────────── */
const DOCK_ICONS = [
  {
    label: "Terminal",
    d: "M4 17l6-5-6-5M12 19h8",
  },
  {
    label: "Layers",
    d: "M12 2l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5",
  },
  {
    label: "Sparkles",
    d: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z",
  },
  {
    label: "Command",
    d: "M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6z",
  },
  {
    label: "Wand",
    d: "M15 4V2m0 20v-2m5-8h2M2 12h2m12.5-5.5L18 5M6 18l1.5-1.5M18 18l-1.5-1.5M6 6l1.5 1.5",
  },
];

function DockStage({
  configRef,
  pointerRef,
  telemetryRef,
  stageRef,
}: {
  configRef: React.RefObject<LiveConfig>;
  pointerRef: React.RefObject<Pointer>;
  telemetryRef: React.RefObject<Telemetry>;
  stageRef: React.RefObject<HTMLDivElement | null>;
}) {
  const rowRef = React.useRef<HTMLDivElement | null>(null);
  const iconRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const [tooltip, setTooltip] = React.useState<string | null>(null);
  const reduced = useReducedMotionPref();

  useRafLoop(() => {
    const row = rowRef.current;
    const stage = stageRef.current;
    const cfg = configRef.current;
    const p = pointerRef.current;
    if (!row || !stage || !cfg || !p) return;

    const rowRect = row.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const pointerX = p.active ? p.x - (rowRect.left - stageRect.left) : -9999;
    const pointerY = p.active ? p.y - (rowRect.top - stageRect.top) : -9999;

    let maxScale = 1;
    let tension = 0;

    iconRefs.current.forEach((icon, i) => {
      if (!icon) return;
      const iconCenterX = i * 62 + 30;
      const iconCenterY = rowRect.height / 2;
      const d = Math.hypot(pointerX - iconCenterX, pointerY - iconCenterY);
      const influence = gaussian(d, 46);
      const scale = 1 + 0.85 * influence;
      const lift = -16 * gaussian(d, 58);
      if (scale > maxScale) maxScale = scale;
      icon.style.transform = reduced
        ? "translate3d(0,0,0) scale(1)"
        : `translate3d(0, ${lift.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
      icon.style.zIndex = String(Math.round(scale * 100));
    });

    // Proximity tension from the dock center
    const centerX = rowRect.left - stageRect.left + rowRect.width / 2;
    const centerY = rowRect.top - stageRect.top + rowRect.height / 2;
    if (p.active) {
      tension = clamp(1 - Math.hypot(p.x - centerX, p.y - centerY) / cfg.radius, 0, 1);
    }

    if (telemetryRef.current) {
      telemetryRef.current.dx = maxScale * 10 - 10;
      telemetryRef.current.dy = (maxScale - 1) * -8;
      telemetryRef.current.v = Math.abs(maxScale - 1) * 640;
      telemetryRef.current.tension = tension;
    }
  });

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      <div className="relative">
        <AnimatePresence>
          {tooltip && (
            <motion.span
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 480, damping: 30 }}
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-panel)_95%,transparent)] px-2.5 py-1 font-mono text-[10px] text-[color:var(--b-text)] shadow-lg backdrop-blur-md"
            >
              {tooltip}
            </motion.span>
          )}
        </AnimatePresence>

        <div
          ref={rowRef}
          className="flex items-end gap-2 rounded-2xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-glass)_100%,transparent)] p-2 backdrop-blur-xl"
        >
          {DOCK_ICONS.map((icon, i) => (
            <button
              key={icon.label}
              ref={(el) => {
                iconRefs.current[i] = el;
              }}
              type="button"
              aria-label={`Dock app — ${icon.label}`}
              onFocus={() => setTooltip(icon.label)}
              onBlur={() => setTooltip(null)}
              onPointerEnter={() => setTooltip(icon.label)}
              onPointerLeave={() => setTooltip(null)}
              className="flex h-11 w-11 shrink-0 origin-bottom items-center justify-center rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-surface)_80%,transparent)] text-[color:var(--b-text-secondary)] transition-colors will-change-transform hover:text-[color:var(--b-accent)]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d={icon.d} />
              </svg>
            </button>
          ))}
        </div>
      </div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--b-muted)]">
        Gaussian magnification · S(d) = 1 + A·e^(−d²/2σ²)
      </p>
    </div>
  );
}
