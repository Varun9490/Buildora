"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

export type ChatMessage = { id: string; role: "user" | "assistant" | "tool"; text: string; citations?: string[]; };

export function StreamingChat({ seed, className }: { seed?: string; className?: string }) {
  const full = seed ?? "Buildora components stream token-by-token. This is a frontend-only demo — plug in any LLM backend. Citations, tool calls, and review states compose around the stream.";
  const [text, setText] = React.useState("");
  const [streaming, setStreaming] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: "m1", role: "user", text: "Show me a magnetic button" },
  ]);
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const stream = React.useCallback(() => {
    setStreaming(true);
    setText("");
    if (reduced) { setText(full); setStreaming(false); return; }
    let i = 0;
    const t = setInterval(() => {
      i += 2;
      setText(full.slice(0, i));
      if (i >= full.length) {
        clearInterval(t);
        setStreaming(false);
        setMessages((m) => [...m, { id: `a-${Date.now()}`, role: "assistant", text: full, citations: ["registry/magnetic-button.json", "docs/accessibility.md"] }]);
        setText("");
      }
    }, 24);
  }, [full, reduced]);

  React.useEffect(() => { stream(); }, [stream]);

  return (
    <div className={cn("flex flex-col h-[400px] rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)]", className)}>
      <div className="flex-1 overflow-y-auto space-y-3 p-4 b-scroll" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((m) => (
          <div key={m.id} className={cn("max-w-[85%] rounded-xl px-3 py-2 text-sm", m.role === "user" ? "ml-auto bg-[color:var(--b-accent)] text-[color:var(--b-accent-foreground)]" : "bg-[color-mix(in_oklab,var(--b-text)_6%,transparent)] text-[color-mix(in_oklab,var(--b-text)_90%,transparent)]")}>
            <p>{m.text}</p>
            {m.citations && (
              <div className="mt-2 flex flex-wrap gap-1">
                {m.citations.map((c) => <span key={c} className="rounded bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] px-1.5 py-0.5 font-mono text-[10px] text-[color-mix(in_oklab,var(--b-text)_70%,transparent)]">[{c}]</span>)}
              </div>
            )}
          </div>
        ))}
        {(streaming || text) && (
          <div className="max-w-[85%] rounded-xl bg-[color-mix(in_oklab,var(--b-text)_6%,transparent)] px-3 py-2 text-sm text-[color-mix(in_oklab,var(--b-text)_90%,transparent)]">
            <p>{text}<span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-[color:var(--b-accent)] align-middle" aria-hidden /></p>
          </div>
        )}
      </div>
      <form className="flex gap-2 border-t border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-3" onSubmit={(e) => { e.preventDefault(); if (!input.trim()) return; setMessages((m) => [...m, { id: `u-${Date.now()}`, role: "user", text: input }]); setInput(""); stream(); }}>
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <input id="chat-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about components… (demo only)" className="min-h-[44px] min-w-0 flex-1 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_4%,transparent)] px-3 py-2 text-sm outline-none focus:border-[color:var(--b-accent)]" />
        <button className="min-h-[44px] min-w-[44px] rounded-xl bg-[color:var(--b-accent)] px-4 py-2 text-sm font-bold text-[color:var(--b-accent-foreground)] disabled:opacity-50" disabled={streaming}>Send</button>
      </form>
      <p className="px-4 pb-3 text-[11px] text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">Frontend component only. No Buildora AI backend.</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TOKEN METER — a context window you can *read*: segments
   of the window render as bars, threshold tiers change the
   color rail (ok → warm → danger), and the split readout
   (used / reserved / free) announces honestly to AT.
   ───────────────────────────────────────────────────────── */
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
export type ModelOption = {
  id: string;
  name: string;
  context?: string;
  latency?: string;
  grade?: "flagship" | "fast" | "oss" | "custom";
};

export type ModelSelectorProps = {
  /** strings are upgraded to full option rows; full rows take precedence */
  models?: (string | ModelOption)[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  className?: string;
  /** Accessible name for the combobox. */
  label?: string;
};

const GRADE_STYLES: Record<NonNullable<ModelOption["grade"]>, string> = {
  flagship: "bg-[color:color-mix(in_oklab,var(--b-accent)_14%,transparent)] text-[color:var(--b-accent)]",
  fast: "bg-[color:color-mix(in_oklab,var(--b-warning)_14%,transparent)] text-[color:var(--b-warning)]",
  oss: "bg-[color:color-mix(in_oklab,var(--b-iris)_14%,transparent)] text-[color:var(--b-iris)]",
  custom: "bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)] text-[color:var(--b-text-secondary)]",
};

const GRADE_LABELS: Record<NonNullable<ModelOption["grade"]>, string> = {
  flagship: "PRO",
  fast: "FAST",
  oss: "OSS",
  custom: "CUSTOM",
};

export function ModelSelector({ models, value, defaultValue, onValueChange, className, label }: ModelSelectorProps) {
  const opts: ModelOption[] = (models ?? ["buildora-1-pro", "buildora-1-flash", "oss-70b"]).map((raw) =>
    typeof raw === "string"
      ? {
          id: raw,
          name: raw,
          context: raw.includes("pro") ? "128k" : raw.includes("flash") ? "32k" : "64k",
          latency: raw.includes("flash") ? "85ms" : raw.includes("pro") ? "240ms" : "410ms",
          grade: raw.includes("pro") ? "flagship" : raw.includes("flash") ? "fast" : "oss",
        }
      : raw
  );

  const [uncontrolled, setUncontrolled] = React.useState(defaultValue ?? opts[0]?.id ?? "");
  const selectedId = value ?? uncontrolled;
  const selected = opts.find((o) => o.id === selectedId) ?? opts[0];

  const [open, setOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState(selected?.id);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const listId = React.useId();
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (!open) return;
    const onDocPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, [open]);

  React.useEffect(() => {
    if (open) setActiveId(selected?.id);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (id: string) => {
    if (value === undefined) setUncontrolled(id);
    onValueChange?.(id);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    const idx = opts.findIndex((o) => o.id === activeId);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveId(opts[(idx + 1) % opts.length]?.id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveId(opts[(idx - 1 + opts.length) % opts.length]?.id);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (activeId) pick(activeId);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)} onKeyDown={onKeyDown}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label ?? "Model"}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeId}` : undefined}
        className={cn(
          "flex min-h-[44px] min-w-[228px] items-center gap-2.5 rounded-xl border px-3 py-1.5 text-sm transition-colors",
          "bg-[color:var(--b-panel)] border-[color:var(--b-border)] hover:border-[color:var(--b-border-hover)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-ring)]"
        )}
      >
        <span
          className={cn(
            "h-2 w-2 shrink-0 rounded-full",
            selected?.grade === "flagship" ? "bg-[color:var(--b-accent)]" : selected?.grade === "fast" ? "bg-[color:var(--b-warning)]" : "bg-[color:var(--b-iris)]"
          )}
          aria-hidden
        />
        <span className="font-medium text-[color:var(--b-text)]">{selected?.name}</span>
        {selected?.grade && (
          <span className={cn("rounded px-1 py-0.5 font-mono text-[9px] font-bold tracking-wider", GRADE_STYLES[selected.grade])}>
            {GRADE_LABELS[selected.grade]}
          </span>
        )}
        {selected?.context && <span className="ml-auto font-mono text-[11px] tabular-nums text-[color:var(--b-muted)]">{selected.context}</span>}
        <motion.svg
          className="h-4 w-4 shrink-0 text-[color:var(--b-muted)]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
          aria-hidden
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            aria-label="Model"
            initial={reduced ? false : { opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="absolute z-50 mt-1.5 w-full min-w-[268px] overflow-hidden rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.65)]"
          >
            {opts.map((o) => {
              const active = o.id === activeId;
              const isSelected = o.id === selectedId;
              return (
                <li
                  key={o.id}
                  id={`${listId}-${o.id}`}
                  role="option"
                  aria-selected={isSelected}
                  onPointerMove={() => setActiveId(o.id)}
                  onClick={() => pick(o.id)}
                  className={cn(
                    "flex cursor-default items-center gap-2.5 px-3 py-2.5",
                    active && "bg-[color:color-mix(in_oklab,var(--b-text)_6%,transparent)]",
                    isSelected && !active && "bg-[color:color-mix(in_oklab,var(--b-text)_3%,transparent)]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      isSelected ? "border-[color:var(--b-accent)] bg-[color:var(--b-accent)]" : "border-[color:var(--b-border-hover)]"
                    )}
                    aria-hidden
                  >
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--b-accent-foreground)]" />}
                  </span>
                  <motion.span layout>
                    <span className={cn("block text-sm", isSelected ? "font-semibold text-[color:var(--b-text)]" : "font-medium text-[color:var(--b-text)]")}>{o.name}</span>
                    <span className="block font-mono text-[10px] tabular-nums text-[color:var(--b-muted)]">
                      {o.context ? `${o.context} ctx` : ""}{o.context && o.latency ? " · " : ""}{o.latency ?? ""}
                    </span>
                  </motion.span>
                  {o.grade && (
                    <span className={cn("ml-auto shrink-0 rounded px-1 py-0.5 font-mono text-[9px] font-bold tracking-wider", GRADE_STYLES[o.grade])}>
                      {GRADE_LABELS[o.grade]}
                    </span>
                  )}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ToolCallViz({ calls = [{ name: "search_registry", args: "{ query: 'magnetic' }", status: "done" }, { name: "read_file", args: "magnetic-button/index.tsx", status: "running" }], className }: { calls?: { name: string; args: string; status: string }[]; className?: string }) {
  return (
    <ol className={cn("space-y-2", className)} aria-label="Tool calls">
      {calls.map((c) => (
        <li key={c.name} className="flex items-center gap-3 rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-bg)_30%,transparent)] px-3 py-2 font-mono text-xs">
          <span className={cn("h-2 w-2 rounded-full", c.status === "done" ? "bg-[color:var(--b-success)]" : "animate-pulse bg-[color:var(--b-warning)]")} aria-hidden />
          <span className="font-bold text-[color:var(--b-iris)]">{c.name}</span>
          <span className="truncate text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]">{c.args}</span>
          <span className="ml-auto text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">{c.status}</span>
        </li>
      ))}
    </ol>
  );
}

export default StreamingChat;
