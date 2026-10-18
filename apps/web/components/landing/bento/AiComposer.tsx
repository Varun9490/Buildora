"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";

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
  const [streamHeight, setStreamHeight] = React.useState(0);
  const timer = React.useRef<number>(0);
  const areaRef = React.useRef<HTMLDivElement | null>(null);
  const innerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => () => window.clearInterval(timer.current), []);

  React.useEffect(() => {
    const inner = innerRef.current;
    if (!inner || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect.height ?? 0;
      setStreamHeight(Math.ceil(h) + 24);
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  const stop = React.useCallback(() => {
    window.clearInterval(timer.current);
    setStatus((s) => (s === "streaming" ? "done" : s));
  }, []);

  const send = () => {
    if (!prompt.trim() || status === "streaming") return;
    setStreamed("");
    setStatus("streaming");
    const words = RESPONSE.split(" ");
    let i = 0;
    timer.current = window.setInterval(() => {
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
    <div className="flex h-[340px] w-full items-center justify-center">
      <div className="flex w-full max-w-[480px] flex-col gap-3">
        <div className="flex items-center gap-1" role="radiogroup" aria-label="Model">
          {MODELS.map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={model === m}
              onClick={() => setModel(m)}
              className={cn(
                "relative rounded-full px-2.5 py-1 text-[11px] transition-colors",
                model === m ? "font-medium text-[color:var(--b-text)]" : "text-[color:var(--b-muted)] hover:text-[color:var(--b-text-secondary)]"
              )}
            >
              {model === m && (
                <motion.span
                  layoutId="composer-model-pill"
                  className="absolute inset-0 rounded-full bg-[color:color-mix(in_oklab,var(--b-text)_8%,transparent)]"
                  transition={{ type: "spring", stiffness: 480, damping: 32 }}
                />
              )}
              <span className="relative z-10">{m}</span>
            </button>
          ))}
        </div>

        <motion.div
          ref={areaRef}
          className="overflow-hidden"
          initial={false}
          animate={{ height: status === "idle" ? 0 : streamHeight }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          aria-live="polite"
        >
          <div ref={innerRef} className="flex gap-2.5 px-1 pb-1 pt-2">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[conic-gradient(from_140deg,var(--b-accent),var(--b-iris),var(--b-accent))] text-[10px] font-bold text-black">
              B
            </span>
            <p className="text-[12.5px] leading-relaxed text-[color:var(--b-text-secondary)]">
              {renderTokens(streamed)}
              {status === "streaming" && (
                <span
                  className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] bg-[color:var(--b-accent)]"
                  style={{ animation: "fx-caret-blink 0.9s steps(1) infinite" }}
                />
              )}
            </p>
          </div>
        </motion.div>

        <div className="flex flex-wrap items-center gap-1.5 px-1">
          <AnimatePresence mode="popLayout" initial={false}>
            {chips.map((c) => (
              <motion.span
                key={c.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", stiffness: 520, damping: 32 }}
                className="flex items-center gap-1.5 rounded-lg bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)] py-1 pl-2 pr-1 font-mono text-[10px] text-[color:var(--b-text-secondary)]"
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
                className="rounded-lg px-2 py-1 font-mono text-[10px] text-[color:var(--b-muted)] transition-colors hover:text-[color:var(--b-accent)]"
                aria-label="Attach another file"
              >
                + attach
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-end gap-2 rounded-xl bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)] p-2 transition-colors focus-within:bg-[color:color-mix(in_oklab,var(--b-text)_6%,transparent)]">
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
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 font-mono text-[10px] font-medium text-[color:var(--b-text-secondary)] transition-colors hover:text-red-400"
            >
              <span className="h-2.5 w-2.5 rounded-[3px] bg-current" />
              Stop
            </button>
          ) : (
            <button
              onClick={status === "done" ? reset : send}
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-[color:var(--b-accent)] px-3 font-mono text-[10px] font-bold text-[color:var(--b-accent-foreground)] transition-transform active:scale-95"
            >
              {status === "done" ? "↺ Again" : "Send"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
