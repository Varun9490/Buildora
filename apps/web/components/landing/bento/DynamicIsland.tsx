"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";

type IslandState = "idle" | "timer" | "wave" | "think";

const SIZES: Record<IslandState, { width: number; height: number; borderRadius: number }> = {
  idle: { width: 172, height: 44, borderRadius: 22 },
  timer: { width: 228, height: 50, borderRadius: 25 },
  wave: { width: 214, height: 44, borderRadius: 22 },
  think: { width: 262, height: 62, borderRadius: 31 },
};

const THINK_LINES = ["Analyzing motion tokens…", "Compiling spring curves…", "Streaming props to the island…"];
const EQ_BARS = [0.5, 0.9, 0.35, 1, 0.65, 0.8, 0.45];

const SCREEN = {
  initial: { opacity: 0, filter: "blur(6px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(6px)" },
};

function ListenEq() {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden="true">
      {EQ_BARS.map((delay, i) => (
        <span
          key={i}
          className="fx-eq-bar w-[3px] rounded-full bg-[color:var(--b-accent)]"
          style={{ height: 18, animationDelay: `${i * 0.09}s`, animationDuration: "0.85s" }}
        />
      ))}
    </span>
  );
}

function TimerRing({ seconds }: { seconds: number }) {
  const C = 2 * Math.PI * 13;
  const frac = seconds / 8;
  return (
    <span className="relative flex h-8 w-8 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="3" />
        <motion.circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke="var(--b-accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          animate={{ strokeDashoffset: C * (1 - frac) }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
      </svg>
      <span className="font-mono text-[10px] font-semibold text-white">{seconds}</span>
    </span>
  );
}

function ThinkOrb() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center" aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,var(--b-accent),var(--b-iris),var(--b-accent))] opacity-80 blur-[6px] fx-spin-slow" />
      <span className="relative h-6 w-6 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,color-mix(in_oklab,var(--b-accent)_70%,black))] shadow-[0_0_16px_var(--b-accent-glow)] fx-pulse-soft" />
    </span>
  );
}

function Typewriter({ text }: { text: string }) {
  const [shown, setShown] = React.useState("");
  React.useEffect(() => {
    setShown("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 26);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span className="font-mono text-[11px] text-white/85">
      {shown}
      <span
        className="ml-0.5 inline-block h-3 w-[2px] translate-y-[2px] bg-[color:var(--b-accent)]"
        style={{ animation: "fx-caret-blink 1s steps(1) infinite" }}
      />
    </span>
  );
}

export function DynamicIsland() {
  const [state, setState] = React.useState<IslandState>("idle");
  const [seconds, setSeconds] = React.useState(8);
  const [lineIdx, setLineIdx] = React.useState(0);

  React.useEffect(() => {
    if (state !== "timer") return;
    setSeconds(8);
    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 8 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  React.useEffect(() => {
    if (state !== "think") return;
    setLineIdx(0);
    const id = setInterval(() => setLineIdx((i) => (i + 1) % THINK_LINES.length), 3400);
    return () => clearInterval(id);
  }, [state]);

  const size = SIZES[state];

  return (
    <div className="flex h-[340px] w-full flex-col items-center pt-12">
      <motion.div
        animate={size}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        style={{ transformOrigin: "top center" }}
        className="relative overflow-hidden border border-white/12 bg-black shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.09)]"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center justify-between px-4"
              style={{ height: size.height }}
            >
              <span className="font-mono text-[11px] font-semibold text-white/85">09:41</span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
                <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
              </span>
            </motion.div>
          )}

          {state === "timer" && (
            <motion.div
              key="timer"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center gap-3 px-3.5"
              style={{ height: size.height }}
            >
              <TimerRing seconds={seconds} />
              <span className="flex flex-col">
                <span className="text-[12px] font-medium text-white/90">Deploying edge build</span>
                <span className="font-mono text-[10px] text-white/45">{8 - seconds}/8 regions live</span>
              </span>
            </motion.div>
          )}

          {state === "wave" && (
            <motion.div
              key="wave"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center justify-between gap-3 px-3.5"
              style={{ height: size.height }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57] fx-pulse-soft" />
              <ListenEq />
              <span className="text-[11px] text-white/50">listening</span>
            </motion.div>
          )}

          {state === "think" && (
            <motion.div
              key="think"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center gap-3 px-3.5"
              style={{ height: size.height }}
            >
              <ThinkOrb />
              <span className="flex min-w-0 flex-col">
                <span className="text-[10px] font-medium text-[color:var(--b-accent)]">AI agent</span>
                <Typewriter text={THINK_LINES[lineIdx]} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-10" role="tablist" aria-label="Dynamic island state">
        <div className="flex rounded-full border border-[color:var(--b-border)] p-0.5">
          {(
            [
              { id: "idle", label: "Idle" },
              { id: "timer", label: "Timer" },
              { id: "wave", label: "Audio wave" },
              { id: "think", label: "AI thinking" },
            ] as const
          ).map((s) => {
            const selected = state === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setState(s.id)}
                className={cn(
                  "relative rounded-full px-3 py-1.5 text-[11px] transition-colors",
                  selected ? "font-medium text-[color:var(--b-text)]" : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="island-state"
                    className="absolute inset-0 rounded-full bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)]"
                    transition={{ type: "spring", stiffness: 480, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
