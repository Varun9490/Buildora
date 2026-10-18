"use client";

import * as React from "react";
import { motion, AnimatePresence, animate, useSpring, useTransform } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotionPref } from "@/lib/physics";

type Mode = "liquid" | "hold" | "magnet";
type Phase = "idle" | "working" | "done";

const MODES: { id: Mode; label: string }[] = [
  { id: "liquid", label: "Liquid Morph" },
  { id: "hold", label: "Hold to Confirm" },
  { id: "magnet", label: "Magnetic Spotlight" },
];

const MORPH = { type: "spring", stiffness: 450, damping: 30 } as const;

export function KineticButtons() {
  const [mode, setMode] = React.useState<Mode>("liquid");
  const [phase, setPhase] = React.useState<Phase>("idle");
  const reduced = useReducedMotionPref();
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const btnRef = React.useRef<HTMLButtonElement | null>(null);
  const holding = React.useRef(false);

  const progress = useSpring(0, { stiffness: 320, damping: 26 });
  const ring = useTransform(progress, (v: number) => {
    const deg = Math.min(Math.max(v, 0), 1) * 360;
    return `conic-gradient(var(--b-accent) ${deg}deg, transparent ${deg}deg)`;
  });

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timers.current.push(id);
  };

  React.useEffect(() => {
    setPhase("idle");
    holding.current = false;
    progress.set(0);
  }, [mode, progress]);

  const runLiquid = () => {
    if (phase !== "idle") return;
    setPhase("working");
    later(() => setPhase("done"), 850);
    later(() => setPhase("idle"), 2400);
  };

  const startHold = () => {
    if (phase === "done") return;
    holding.current = true;
    setPhase("working");
    animate(progress, 1, {
      duration: reduced ? 0.4 : 1.2,
      ease: "linear",
      onComplete: () => {
        if (!holding.current) return;
        holding.current = false;
        progress.set(0);
        setPhase("done");
        later(() => setPhase("idle"), 1500);
      },
    });
  };

  const stopHold = () => {
    if (!holding.current) return;
    holding.current = false;
    animate(progress, 0, { type: "spring", stiffness: 420, damping: 24 });
    setPhase((p) => (p === "done" ? p : "idle"));
  };

  const onMagnetMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (!el || mode !== "magnet" || reduced) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    el.style.setProperty("--mx", `${mx}px`);
    el.style.setProperty("--my", `${my}px`);
    const pullX = ((mx - r.width / 2) / (r.width / 2)) * 5;
    const pullY = ((my - r.height / 2) / (r.height / 2)) * 4;
    el.style.transform = `translate3d(${pullX.toFixed(2)}px, ${pullY.toFixed(2)}px, 0)`;
    el.style.setProperty("--spot", "1");
  };

  const onMagnetLeave = () => {
    const el = btnRef.current;
    if (!el) return;
    el.style.transform = "translate3d(0px, 0px, 0)";
    el.style.setProperty("--spot", "0");
  };

  const label =
    mode === "liquid"
      ? phase === "idle"
        ? "Deploy"
        : phase === "working"
          ? "Deploying…"
          : "Deployed"
      : mode === "hold"
        ? phase === "done"
          ? "Confirmed"
          : "Hold to confirm"
        : "Generate key";

  return (
    <div className="relative flex h-[340px] w-full items-center justify-center">
      <div className="absolute left-3 top-3 z-10" role="tablist" aria-label="Button mode">
        <div className="flex rounded-full border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_72%,transparent)] p-0.5 backdrop-blur-md">
          {MODES.map((m) => {
            const selected = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setMode(m.id)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-[11px] transition-colors",
                  selected ? "font-medium text-[color:var(--b-text)]" : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="kinetic-mode"
                    className="absolute inset-0 rounded-full bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)]"
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.button
        ref={btnRef}
        layout
        transition={MORPH}
        type="button"
        onPointerMove={onMagnetMove}
        onPointerLeave={onMagnetLeave}
        onPointerDown={(e) => {
          if (mode !== "hold") return;
          e.currentTarget.setPointerCapture(e.pointerId);
          startHold();
        }}
        onPointerUp={stopHold}
        onPointerCancel={stopHold}
        onKeyDown={(e) => {
          if (mode !== "hold" || (e.key !== " " && e.key !== "Enter") || e.repeat) return;
          e.preventDefault();
          startHold();
        }}
        onKeyUp={(e) => {
          if (mode === "hold" && (e.key === " " || e.key === "Enter")) stopHold();
        }}
        onClick={() => mode === "liquid" && runLiquid()}
        animate={{ scale: phase === "working" && mode === "hold" ? 0.96 : 1 }}
        aria-label={label}
        className={cn(
          "group/kinetic relative flex h-12 touch-none select-none items-center justify-center overflow-hidden rounded-full px-7 text-[13px] font-medium transition-colors",
          phase === "done"
            ? "border border-[color:color-mix(in_oklab,var(--b-success)_45%,transparent)] bg-[color:color-mix(in_oklab,var(--b-success)_12%,transparent)] text-[color:var(--b-success)]"
            : "border border-[color:var(--b-border-hover)] bg-[color:var(--b-panel)] text-[color:var(--b-text)] hover:border-[color:var(--b-accent)]"
        )}
        style={{
          ["--mx" as string]: "50%",
          ["--my" as string]: "50%",
          ["--spot" as string]: "0",
          transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease",
        }}
      >
        {mode === "hold" && (
          <>
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ background: ring }}
              aria-hidden="true"
            />
            <span className="pointer-events-none absolute inset-[2px] rounded-full bg-[color:var(--b-panel)]" aria-hidden="true" />
          </>
        )}

        {mode === "magnet" && (
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-[var(--spot)]"
            style={{
              background:
                "radial-gradient(120px circle at var(--mx) var(--my), color-mix(in oklab, var(--b-accent) 30%, transparent), transparent 70%)",
              transition: "opacity 0.25s ease",
            }}
            aria-hidden="true"
          />
        )}

        <span className="relative z-10 flex items-center gap-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={`${mode}-${phase}`}
              initial={{ opacity: 0, filter: "blur(4px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {phase === "done" && (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              )}
              {label}
            </motion.span>
          </AnimatePresence>
          {mode === "liquid" && phase === "working" && (
            <motion.span
              className="block h-3.5 w-3.5 rounded-full border-2 border-[color:color-mix(in_oklab,var(--b-text)_25%,transparent)] border-t-[color:var(--b-accent)]"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
              aria-hidden="true"
            />
          )}
        </span>
      </motion.button>
    </div>
  );
}
