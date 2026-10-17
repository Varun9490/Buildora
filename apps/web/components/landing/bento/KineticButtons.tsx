"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { springStep, useRafLoop, useReducedMotionPref, clamp01, type SpringConfig } from "@/lib/physics";

/* ─────────────────────────────────────────────────────
   CARD 2 · HAPTIC MICRO-ACTION BUTTON MATRIX
   Four distinct kinetic buttons, each a real <button>.
   ───────────────────────────────────────────────────── */

type MorphState = "idle" | "loading" | "done";

function LiquidMorphButton() {
  const [state, setState] = React.useState<MorphState>("idle");
  const reduced = useReducedMotionPref();
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    if (state !== "idle") return;
    setState("loading");
    timers.current.push(
      setTimeout(() => setState("done"), 900),
      setTimeout(() => setState("idle"), 2300)
    );
  };

  const widths: Record<MorphState, number> = { idle: 210, loading: 52, done: 190 };

  return (
    <motion.button
      type="button"
      onClick={run}
      onKeyDown={(e) => {
        if (e.key === "Enter") run();
      }}
      aria-label={
        state === "loading" ? "Deploying transaction" : state === "done" ? "Deployed to edge" : "Run liquid morph deploy"
      }
      animate={{
        width: reduced ? widths[state] : widths[state],
        borderRadius: state === "loading" ? 999 : 14,
      }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className={cn(
        "relative flex h-11 items-center justify-center overflow-hidden font-mono text-[12px] font-semibold transition-colors",
        state === "done"
          ? "bg-[color:color-mix(in_oklab,var(--b-success)_16%,transparent)] text-[color:var(--b-success)] border border-[color:color-mix(in_oklab,var(--b-success)_45%,transparent)]"
          : "bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)] border border-transparent"
      )}
      style={{ width: widths.idle }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.16 }}
            className="whitespace-nowrap px-4"
          >
            Deploy to Edge
          </motion.span>
        )}
        {state === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center justify-center"
          >
            <motion.span
              className="block h-5 w-5 rounded-full border-2 border-black/25 border-t-black/80"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
            />
          </motion.span>
        )}
        {state === "done" && (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 520, damping: 24 }}
            className="flex items-center gap-2 whitespace-nowrap px-4"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 13l4 4L19 7" />
            </svg>
            Deployed to Edge
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function HoldToConfirmButton() {
  const [phase, setPhase] = React.useState<"idle" | "holding" | "done">("idle");
  const progress = React.useRef(0);
  const velocity = React.useRef(0);
  const holding = React.useRef(false);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const ringRef = React.useRef<HTMLSpanElement | null>(null);
  const labelRef = React.useRef<HTMLSpanElement | null>(null);
  const [burst, setBurst] = React.useState<{ id: number; x: number; y: number }[]>([]);
  const reduced = useReducedMotionPref();
  const HOLD_MS = 1200;

  useRafLoop((dt) => {
    const p = progress.current;
    if (holding.current) {
      progress.current = clamp01(p + dt / (HOLD_MS / 1000));
      if (progress.current >= 1) {
        holding.current = false;
        setPhase("done");
        const btn = btnRef.current;
        if (btn) {
          const rect = btn.getBoundingClientRect();
          setBurst(
            Array.from({ length: 14 }, (_, i) => ({
              id: Date.now() + i,
              x: 50,
              y: 50,
            }))
          );
          void rect;
          setTimeout(() => setBurst([]), 900);
        }
        setTimeout(() => {
          setPhase("idle");
          progress.current = 0;
        }, 1500);
      }
    } else if (progress.current > 0 && phase !== "done") {
      // spring back
      const cfg: SpringConfig = { stiffness: 320, damping: 24, mass: 1 };
      const s = springStep(progress.current, velocity.current, 0, cfg, dt * 60);
      progress.current = Math.max(0, s.x);
      velocity.current = s.v;
      if (progress.current < 0.005) {
        progress.current = 0;
        velocity.current = 0;
        setPhase((ph) => (ph === "holding" ? "idle" : ph));
      }
    }

    const ring = ringRef.current;
    if (ring) {
      const deg = progress.current * 360;
      ring.style.background = `conic-gradient(var(--b-danger) ${deg}deg, transparent ${deg}deg)`;
    }
    const label = labelRef.current;
    if (label) {
      const amp = reduced ? 0 : progress.current * 2.2;
      label.style.transform = `translate3d(${(Math.random() - 0.5) * amp}px, ${(Math.random() - 0.5) * amp}px, 0)`;
    }
  });

  const start = () => {
    if (phase === "done") return;
    holding.current = true;
    setPhase("holding");
  };
  const stop = () => {
    holding.current = false;
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          start();
        }}
        onPointerUp={stop}
        onPointerCancel={stop}
        onPointerLeave={stop}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") stop();
        }}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Hold for 1.2 seconds to purge the environment"
        aria-pressed={phase === "holding"}
        className={cn(
          "relative flex h-11 w-[210px] touch-none select-none items-center justify-center overflow-hidden rounded-[14px] border bg-[color:color-mix(in_oklab,var(--b-danger)_9%,transparent)] font-mono text-[12px] font-semibold text-[color:var(--b-danger)] transition-colors",
          phase === "done"
            ? "border-[color:var(--b-danger)]"
            : "border-[color:color-mix(in_oklab,var(--b-danger)_35%,transparent)] hover:border-[color:var(--b-danger)]"
        )}
      >
        <span
          ref={ringRef}
          className="pointer-events-none absolute inset-0 rounded-[14px]"
          style={{ background: "conic-gradient(var(--b-danger) 0deg, transparent 0deg)" }}
          aria-hidden="true"
        />
        <span className="pointer-events-none absolute inset-[1.5px] rounded-[12px] bg-[color:var(--b-panel)]" aria-hidden="true" />
        <span ref={labelRef} className="relative z-10 will-change-transform">
          {phase === "done" ? "Environment Purged" : phase === "holding" ? "Holding…" : "Hold to Purge"}
        </span>
        {/* progress percentage */}
        <span className="absolute right-3 z-10 font-mono text-[9px] text-[color:var(--b-muted)]">
          {phase === "holding" ? `${Math.round(progress.current * 100)}%` : "1.2s"}
        </span>
      </button>

      <AnimatePresence>
        {burst.length > 0 && (
          <motion.span
            key="shockwave"
            initial={{ opacity: 0.9, scale: 0.2 }}
            animate={{ opacity: 0, scale: 2.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[color:var(--b-danger)]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SpecularBeamButton() {
  const ref = React.useRef<HTMLButtonElement | null>(null);

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <button
      ref={ref}
      type="button"
      onPointerMove={onMove}
      className="group/beam relative h-11 w-[210px] overflow-hidden rounded-[14px] border border-[color:var(--b-border-hover)] bg-[color:color-mix(in_oklab,var(--b-surface)_90%,transparent)] font-mono text-[12px] font-semibold text-[color:var(--b-text)] transition-colors hover:border-[color:var(--b-accent)]"
      style={{ ["--mx" as string]: "50%", ["--my" as string]: "50%" }}
      aria-label="Specular beam button — move the pointer across its surface"
    >
      {/* rotating conic border beam */}
      <span
        className="pointer-events-none absolute -inset-[140%] opacity-0 transition-opacity duration-300 group-hover/beam:opacity-100 fx-spin-slow"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, var(--b-accent) 24deg, transparent 60deg, transparent 180deg, color-mix(in oklab, var(--b-iris) 80%, transparent) 210deg, transparent 250deg)",
        }}
        aria-hidden="true"
      />
      <span className="pointer-events-none absolute inset-[1.5px] rounded-[12px] bg-[color:color-mix(in_oklab,var(--b-panel)_96%,transparent)]" aria-hidden="true" />
      {/* specular highlight */}
      <span
        className="pointer-events-none absolute inset-[1.5px] rounded-[12px] opacity-70 mix-blend-screen"
        style={{
          background:
            "radial-gradient(120px circle at var(--mx) var(--my), color-mix(in oklab, var(--b-accent) 55%, transparent), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <span className="relative z-10">Generate Signing Key</span>
    </button>
  );
}

function RippleWaveButton() {
  const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number }[]>([]);
  const reduced = useReducedMotionPref();
  const idRef = React.useRef(0);

  const spawn = (e: React.PointerEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    if (reduced) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const ripple = { id: ++idRef.current, x: e.clientX - r.left, y: e.clientY - r.top };
    setRipples((prev) => [...prev.slice(-4), ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((p) => p.id !== ripple.id));
    }, 750);
  };

  return (
    <button
      type="button"
      onPointerDown={spawn}
      className="relative h-11 w-[210px] overflow-hidden rounded-[14px] bg-[color:var(--b-accent)] font-mono text-[12px] font-bold text-[color:var(--b-accent-foreground)] transition-transform active:scale-[0.98]"
      aria-label="Elastic ripple wave button — click to emit physics rings"
    >
      <span className="relative z-10">Emit Ripple Wave</span>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ opacity: 0.55, scale: 0 }}
          animate={{ opacity: 0, scale: 5.2 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute h-16 w-16 rounded-full border-2 border-black/30 bg-black/10"
          style={{ left: r.x - 32, top: r.y - 32 }}
          aria-hidden="true"
        />
      ))}
    </button>
  );
}

export function KineticButtons() {
  return (
    <div className="grid w-full max-w-[480px] grid-cols-1 justify-items-center gap-3 sm:grid-cols-2">
      <LiquidMorphButton />
      <HoldToConfirmButton />
      <SpecularBeamButton />
      <RippleWaveButton />
    </div>
  );
}
