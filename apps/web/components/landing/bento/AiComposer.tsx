"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";

/* ─────────────────────────────────────────────────────
   CARD 8 · AI COMPOSER SURFACE
   Model pills, removable attachment chips, streaming
   token response with caret — a full composer loop.
   ───────────────────────────────────────────────────── */

const MODELS = ["sonnet-4.6", "gpt-5.2", "local-7b"] as const;
type Model = (typeof MODELS)[number];

const CHIP_POOL = [
  { name: "spring.ts", size: "2.1kb" },
  { name: "logo.svg", size: "14kb" },
  { name: "tokens.css", size: "3.4kb" },
  { name: "report.pdf", size: "820kb" },
];

const RESPONSE =
  "Mounted `<MagneticButton strength={34} />` — field radius 34px with spring 220/26 damping. First paint 1.2ms, zero layout shift on reflow. Tip: drop damping to 18 for a snappier release, or wrap in `<MotionConfig reducedMotion=\"user\">` for a11y.";

function renderTokens(text: string) {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") ? (
      <code
        key={i}
        className="rounded bg-[color:var(--b-accent-muted)] px-1 py-[1px] font-mono text-[11px] text-[color:var(--b-accent)]"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

export function AiComposer() {
  const [model, setModel] = React.useState<Model>("sonnet-4.6");
  const [chips, setChips] = React.useState([CHIP_POOL[0], CHIP_POOL[1]]);
  const [prompt, setPrompt] = React.useState("Make this button feel like it weighs something");
  const [streamed, setStreamed] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "streaming" | "done">("idle");
  const timer = React.useRef<number>(0);

  const stop = React.useCallback(() => {
    window.clearInterval(timer.current);
    setStatus((s) => (s === "streaming" ? "done" : s));
  }, []);

  React.useEffect(() => () => window.clearInterval(timer.current), []);

  const send = () => {
    if (!prompt.trim() || status === "streaming") return;
    setStreamed("");
    setStatus("streaming");
    const words = RESPONSE.split(" ");
    let i = 0;
    timer.current = window.setInterval(() => {
      // 1–3 words per tick for an organic cadence
      const burst = 1 + Math.floor(Math.random() * 3);
      i += burst;
      setStreamed(words.slice(0, i).join(" "));
      if (i >= words.length) {
        window.clearInterval(timer.current);
        setStatus("done");
      }
    }, 46);
  };

  const reset = () => {
    window.clearInterval(timer.current);
    setStreamed("");
    setStatus("idle");
  };

  const addChip = () => {
    const next = CHIP_POOL.find((c) => !chips.some((x) => x.name === c.name));
    if (next) setChips((c) => [...c, next]);
  };

  return (
    <div className="w-full max-w-[480px]">
      <div className="overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-glass)] shadow-[0_28px_60px_-30px_rgba(0,0,0,0.75)] backdrop-blur-2xl">
        {/* model pills */}
        <div className="flex items-center justify-between border-b border-[color:var(--b-border)] px-3 py-2">
          <div className="flex gap-1" role="radiogroup" aria-label="Model">
            {MODELS.map((m) => (
              <button
                key={m}
                role="radio"
                aria-checked={model === m}
                onClick={() => setModel(m)}
                className={cn(
                  "relative rounded-full px-2.5 py-1 font-mono text-[10px] transition-colors",
                  model === m ? "text-[color:var(--b-accent-foreground)]" : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
                )}
              >
                {model === m && (
                  <motion.span
                    layoutId="composer-model-pill"
                    className="absolute inset-0 rounded-full bg-[color:var(--b-accent)]"
                    transition={{ type: "spring", stiffness: 480, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{m}</span>
              </button>
            ))}
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[color:var(--b-muted)]">
            <span className={cn("h-1.5 w-1.5 rounded-full", status === "streaming" ? "bg-[color:var(--b-accent)] fx-pulse-soft" : "bg-emerald-400")} />
            {status === "streaming" ? "generating" : "ready"}
          </span>
        </div>

        {/* transcript */}
        <div className="min-h-[132px] px-4 py-3" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            {status === "idle" ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-6 text-center font-mono text-[11px] text-[color:var(--b-muted)]"
              >
                Ask for a variant — the composer streams the diff.
              </motion.p>
            ) : (
              <motion.div key="response" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[conic-gradient(from_140deg,var(--b-accent),var(--b-iris),var(--b-accent))] text-[10px] font-bold text-black">
                  B
                </span>
                <p className="text-[12.5px] leading-relaxed text-[color:var(--b-text-secondary)]">
                  {renderTokens(streamed)}
                  {status === "streaming" && (
                    <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] bg-[color:var(--b-accent)]" style={{ animation: "fx-caret-blink 0.9s steps(1) infinite" }} />
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* attachments */}
        {(chips.length > 0 || status === "idle") && (
          <div className="flex flex-wrap items-center gap-1.5 px-4 pb-2">
            <AnimatePresence initial={false}>
              {chips.map((c) => (
                <motion.span
                  key={c.name}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 520, damping: 32 }}
                  className="flex items-center gap-1.5 rounded-lg border border-[color:var(--b-border)] bg-[color:var(--b-surface)] py-1 pl-2 pr-1 font-mono text-[10px] text-[color:var(--b-text-secondary)]"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[color:var(--b-accent)]" aria-hidden="true">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <path d="M13 2v7h7" />
                  </svg>
                  {c.name}
                  <span className="text-[color:var(--b-muted)]">{c.size}</span>
                  <button
                    onClick={() => setChips((list) => list.filter((x) => x.name !== c.name))}
                    aria-label={`Remove ${c.name}`}
                    className="flex h-4 w-4 items-center justify-center rounded text-[color:var(--b-muted)] hover:bg-[color:var(--b-accent-muted)] hover:text-[color:var(--b-accent)]"
                  >
                    ×
                  </button>
                </motion.span>
              ))}
              {chips.length < CHIP_POOL.length && (
                <motion.button
                  key="add"
                  layout
                  onClick={addChip}
                  className="rounded-lg border border-dashed border-[color:var(--b-border)] px-2 py-1 font-mono text-[10px] text-[color:var(--b-muted)] transition-colors hover:border-[color:var(--b-accent)] hover:text-[color:var(--b-accent)]"
                >
                  + attach
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* input row */}
        <div className="border-t border-[color:var(--b-border)] p-2.5">
          <div className="flex items-end gap-2 rounded-xl border border-[color:var(--b-border)] bg-[color:color-mix(in_oklab,var(--b-bg)_55%,transparent)] p-2 transition-colors focus-within:border-[color:var(--b-accent)]">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={2}
              placeholder="Describe the motion you want…"
              className="max-h-24 min-h-[38px] w-full resize-none bg-transparent px-1 text-[12.5px] leading-relaxed text-[color:var(--b-text)] outline-none placeholder:text-[color:var(--b-muted)]"
              aria-label="Prompt"
            />
            {status === "streaming" ? (
              <button
                onClick={stop}
                className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[color:var(--b-border)] px-3 font-mono text-[10px] font-semibold text-[color:var(--b-text-secondary)] transition-colors hover:border-red-400/60 hover:text-red-400"
              >
                <span className="h-2.5 w-2.5 rounded-[3px] bg-current" />
                Stop
              </button>
            ) : (
              <button
                onClick={status === "done" ? reset : send}
                className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[color:var(--b-accent)] px-3 font-mono text-[10px] font-bold text-[color:var(--b-accent-foreground)] transition-transform active:scale-95"
              >
                {status === "done" ? "↺ Again" : "Send ⏎"}
              </button>
            )}
          </div>
          <p className="mt-1.5 px-1 font-mono text-[9px] text-[color:var(--b-muted)]">
            ⏎ to send · ⇧⏎ for newline · {model} · temp 0.4
          </p>
        </div>
      </div>
    </div>
  );
}
