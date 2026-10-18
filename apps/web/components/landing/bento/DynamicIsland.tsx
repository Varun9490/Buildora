"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";

/* ─────────────────────────────────────────────────────────────
   DYNAMIC ISLAND — iPhone-parity states on a seamless black
   pill (pure #000, full-radius, sensor camera always present):

   - idle:   172×44 pill, front camera + sensors visible
   - timer:  compact expand, orange ring countdown (#FF9F0A)
   - music:  album tile + EQ bars (Apple Music body language)
   - faceid: blue glyph + "Face ID" + cyan check (#0A84FF)
   - record: red dot + waveform, true recording pulse
   - think:  AI orb statesman (Buildora's own state)
   ───────────────────────────────────────────────────────────── */

type IslandState = "idle" | "timer" | "music" | "faceid" | "record" | "think";

const SIZES: Record<IslandState, { width: number; height: number }> = {
  idle: { width: 172, height: 44 },
  timer: { width: 230, height: 44 },
  music: { width: 296, height: 52 },
  faceid: { width: 238, height: 48 },
  record: { width: 262, height: 44 },
  think: { width: 266, height: 58 },
};

const TIMER_SECONDS = 8;
const THINK_LINES = ["Analyzing motion tokens…", "Compiling spring curves…", "Streaming props to the island…"];
const EQ_BARS = [0.45, 0.85, 0.35, 1, 0.6, 0.78, 0.42];

const SCREEN = {
  initial: { opacity: 0, filter: "blur(6px)", scale: 0.94 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
  exit: { opacity: 0, filter: "blur(6px)", scale: 0.96 },
};

function Sensors() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      {/* status LED */}
      <span className="h-[7px] w-[7px] rounded-full bg-[#16161a]" />
      {/* front camera */}
      <span className="relative h-[13px] w-[13px] rounded-full bg-[#101014]">
        <span className="absolute inset-[3px] rounded-full bg-[#1c1c26]" />
      </span>
    </span>
  );
}

function AlbumTile() {
  return (
    <span
      aria-hidden="true"
      className="h-8 w-8 shrink-0 rounded-[9px] bg-[linear-gradient(135deg,#d4ff4f,#7bc86a)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]"
    >
      <svg className="h-full w-full p-1.5 text-black/75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    </span>
  );
}

function EqBars() {
  return (
    <span className="flex items-end gap-[3px]" aria-hidden="true">
      {EQ_BARS.map((h, i) => (
        <span
          key={i}
          className="fx-eq-bar w-[3px] rounded-full bg-white/80"
          style={{ height: 20, animationDelay: `${i * 0.09}s`, animationDuration: "0.9s" }}
        />
      ))}
    </span>
  );
}

function FaceGlyph() {
  return (
    <span className="relative flex h-9 w-9 items-center justify-center" aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-[rgba(10,132,255,0.16)] blur-[3px]" />
      <svg className="relative h-7 w-7 text-[#0a84ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
        <circle cx="9.5" cy="10" r="0.8" fill="currentColor" />
        <circle cx="14.5" cy="10" r="0.8" fill="currentColor" />
        <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
      </svg>
    </span>
  );
}

function TimerRing({ seconds }: { seconds: number }) {
  const C = 2 * Math.PI * 13;
  const frac = seconds / TIMER_SECONDS;
  return (
    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,159,10,0.22)" strokeWidth="3" />
        <motion.circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke="#ff9f0a"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={C}
          animate={{ strokeDashoffset: C * (1 - frac) }}
          transition={{ type: "spring", stiffness: 120, damping: 24 }}
        />
      </svg>
      <span className="font-mono text-[10px] font-semibold tabular-nums text-[#ff9f0a]">{seconds}</span>
    </span>
  );
}

function ThinkOrb() {
  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center" aria-hidden="true">
      <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#d4ff4f,#7b87ff,#d4ff4f)] opacity-80 blur-[6px] fx-spin-slow" />
      <span className="relative h-6 w-6 rounded-full bg-[radial-gradient(circle_at_35%_30%,#fff,#86d338_70%)] shadow-[0_0_16px_rgba(170,255,80,0.35)] fx-pulse-soft" />
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
        className="ml-0.5 inline-block h-3 w-[2px] translate-y-[2px] bg-[#d4ff4f]"
        style={{ animation: "fx-caret-blink 1s steps(1) infinite" }}
      />
    </span>
  );
}

export function DynamicIsland() {
  const [state, setState] = React.useState<IslandState>("idle");
  const [seconds, setSeconds] = React.useState(TIMER_SECONDS);
  const [lineIdx, setLineIdx] = React.useState(0);

  React.useEffect(() => {
    if (state !== "timer") return;
    setSeconds(TIMER_SECONDS);
    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? TIMER_SECONDS : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [state]);

  React.useEffect(() => {
    if (state !== "think") return;
    setLineIdx(0);
    const id = setInterval(() => setLineIdx((i) => (i + 1) % THINK_LINES.length), 3400);
    return () => clearInterval(id);
  }, [state]);

  const { width, height } = SIZES[state];

  return (
    <div className="flex h-[340px] w-full flex-col items-center pt-12">
      <motion.div
        animate={{ width, height }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        style={{ width, height, transformOrigin: "top center" }}
        className="relative overflow-hidden rounded-full bg-[#000] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_0_0_0.5px_rgba(255,255,255,0.08),0_18px_40px_-16px_rgba(0,0,0,0.9)]"
        role="status"
        aria-live="polite"
      >
        {/* sensors persistent in idle + small states only */}
        <AnimatePresence mode="popLayout" initial={false}>
          {state === "idle" && (
            <motion.div
              key="idle"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center justify-between px-5"
            >
              <Sensors />
            </motion.div>
          )}

          {state === "timer" && (
            <motion.div
              key="timer"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center gap-3 px-4"
            >
              <TimerRing seconds={seconds} />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[12px] font-medium text-white/90">Deploying edge build</span>
                <span className="font-mono text-[10px] tabular-nums text-white/45">{TIMER_SECONDS - seconds}/{TIMER_SECONDS} regions live</span>
              </span>
            </motion.div>
          )}

          {state === "music" && (
            <motion.div
              key="music"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center gap-3 px-3"
            >
              <AlbumTile />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[12px] font-semibold text-white">Midnight Compile</span>
                <span className="truncate font-mono text-[10px] text-white/50">Kokonut & the Tokens</span>
              </span>
              <span className="ml-auto"><EqBars /></span>
            </motion.div>
          )}

          {state === "faceid" && (
            <motion.div
              key="faceid"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center gap-3 px-3.5"
            >
              <FaceGlyph />
              <span className="text-[13px] font-medium text-white/90">Face ID</span>
              <motion.svg
                key="check"
                className="ml-auto h-5 w-5 text-[#0a84ff]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                initial={false}
                animate={{ pathLength: 1 }}
              >
                <motion.path d="M5 13l4 4 10-10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, delay: 0.15 }} />
              </motion.svg>
            </motion.div>
          )}

          {state === "record" && (
            <motion.div
              key="record"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center gap-3 px-4"
            >
              <motion.span
                className="h-2.5 w-2.5 rounded-full bg-[#ff453a]"
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              <span className="text-[12px] font-medium text-white/90">Recording</span>
              <span className="ml-auto flex items-end gap-[2px]" aria-hidden="true">
                {[6, 12, 8, 14, 9].map((h, i) => (
                  <span key={i} className="w-[2px] rounded-full bg-[#ff453a]/85" style={{ height: h, animation: `fx-eq ${0.6 + i * 0.13}s ease-in-out infinite alternate` }} />
                ))}
              </span>
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
            >
              <ThinkOrb />
              <span className="flex min-w-0 flex-col">
                <span className="text-[10px] font-semibold tracking-wide text-[#d4ff4f]">AI agent</span>
                <Typewriter text={THINK_LINES[lineIdx]} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-10" role="tablist" aria-label="Dynamic island state">
        <div className="flex flex-wrap justify-center gap-1 rounded-full border border-[color:var(--b-border)] p-0.5">
          {(
            [
              { id: "idle", label: "Idle" },
              { id: "timer", label: "Timer" },
              { id: "music", label: "Music" },
              { id: "faceid", label: "Face ID" },
              { id: "record", label: "Recording" },
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
