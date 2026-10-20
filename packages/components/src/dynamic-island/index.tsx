"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type DynamicIslandStatus = "idle" | "timer" | "music" | "faceid" | "record" | "think";

export type DynamicIslandProps = {
  /** Which state the island is showing. */
  status?: DynamicIslandStatus;
  /** Label shown in the timer state. */
  timerLabel?: string;
  /** Seconds remaining, for the timer state. */
  seconds?: number;
  /** Total seconds, for the timer state. */
  totalSeconds?: number;
  /** Track title, for the music state. */
  track?: string;
  /** Track artist, for the music state. */
  artist?: string;
  /** Rotating status lines, for the think state. */
  thinkLines?: string[];
  /** Replace the whole content. */
  children?: React.ReactNode;
  className?: string;
};

const SIZES: Record<DynamicIslandStatus, { width: number; height: number }> = {
  idle: { width: 172, height: 44 },
  timer: { width: 230, height: 44 },
  music: { width: 296, height: 52 },
  faceid: { width: 238, height: 48 },
  record: { width: 262, height: 44 },
  think: { width: 266, height: 58 },
};

const TIMER_SECONDS = 8;
const THINK_LINES = [
  "Analyzing motion tokens…",
  "Compiling spring curves…",
  "Streaming props to the island…",
];
const EQ_BARS = [0.45, 0.85, 0.35, 1, 0.6, 0.78, 0.42];

const SCREEN = {
  initial: { opacity: 0, filter: "blur(6px)", scale: 0.94 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
  exit: { opacity: 0, filter: "blur(6px)", scale: 0.96 },
};

function Sensors() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span className="h-[7px] w-[7px] rounded-full bg-[#16161a]" />
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
      <svg
        className="h-full w-full p-1.5 text-black/75"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
      <svg
        className="relative h-7 w-7 text-[#0a84ff]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
      >
        <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
        <circle cx="9.5" cy="10" r="0.8" fill="currentColor" />
        <circle cx="14.5" cy="10" r="0.8" fill="currentColor" />
        <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
      </svg>
    </span>
  );
}

function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const C = 2 * Math.PI * 13;
  const frac = total > 0 ? seconds / total : 0;
  return (
    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,159,10,0.22)" strokeWidth={3} />
        <motion.circle
          cx="16"
          cy="16"
          r="13"
          fill="none"
          stroke="#ff9f0a"
          strokeWidth={3}
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

/**
 * DynamicIsland — a morphing status pill that expands and contracts around
 * whatever the app is doing right now.
 *
 * The pill is a live region, so a screen reader hears the state change. The
 * decorative parts (sensors, album art, equaliser) are aria-hidden.
 */
export function DynamicIsland({
  status = "idle",
  timerLabel = "Deploying edge build",
  seconds = TIMER_SECONDS,
  totalSeconds = TIMER_SECONDS,
  track = "Midnight Compile",
  artist = "Kokonut & the Tokens",
  thinkLines = THINK_LINES,
  children,
  className,
}: DynamicIslandProps) {
  const reduced = useReducedMotion();
  const [lineIdx, setLineIdx] = React.useState(0);

  React.useEffect(() => {
    if (status !== "think" || thinkLines.length === 0) return;
    setLineIdx(0);
    const id = setInterval(() => setLineIdx((i) => (i + 1) % thinkLines.length), 3400);
    return () => clearInterval(id);
  }, [status, thinkLines]);

  const { width, height } = SIZES[status];

  return (
    <div className={cn("flex w-full flex-col items-center", className)}>
      <motion.div
        animate={{ width, height }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        style={{ width, height, transformOrigin: "top center" }}
        className="relative overflow-hidden rounded-full bg-[#000] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06),0_0_0_0.5px_rgba(255,255,255,0.08),0_18px_40px_-16px_rgba(0,0,0,0.9)]"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {children ? (
            <motion.div
              key="custom"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center px-5"
            >
              {children}
            </motion.div>
          ) : status === "idle" ? (
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
          ) : status === "timer" ? (
            <motion.div
              key="timer"
              initial={SCREEN.initial}
              animate={SCREEN.animate}
              exit={SCREEN.exit}
              transition={{ duration: 0.18 }}
              className="flex h-full w-full items-center gap-3 px-4"
            >
              <TimerRing seconds={seconds} total={totalSeconds} />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-[12px] font-medium text-white/90">{timerLabel}</span>
                <span className="font-mono text-[10px] tabular-nums text-white/45">
                  {Math.max(0, totalSeconds - seconds)}/{totalSeconds} regions live
                </span>
              </span>
            </motion.div>
          ) : status === "music" ? (
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
                <span className="truncate text-[12px] font-semibold text-white">{track}</span>
                <span className="truncate font-mono text-[10px] text-white/50">{artist}</span>
              </span>
              <span className="ml-auto">
                <EqBars />
              </span>
            </motion.div>
          ) : status === "faceid" ? (
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
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                initial={false}
                animate={{ pathLength: 1 }}
              >
                <motion.path
                  d="M5 13l4 4 10-10"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                />
              </motion.svg>
            </motion.div>
          ) : status === "record" ? (
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
                animate={reduced ? undefined : { opacity: [1, 0.35, 1] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden="true"
              />
              <span className="text-[12px] font-medium text-white/90">Recording</span>
              <span className="ml-auto flex items-end gap-[2px]" aria-hidden="true">
                {[6, 12, 8, 14, 9].map((h, i) => (
                  <span
                    key={i}
                    className="w-[2px] rounded-full bg-[#ff453a]/85"
                    style={{ height: h, animation: `fx-eq ${0.6 + i * 0.13}s ease-in-out infinite alternate` }}
                  />
                ))}
              </span>
            </motion.div>
          ) : (
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
                <Typewriter text={thinkLines[lineIdx] ?? ""} />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default DynamicIsland;
