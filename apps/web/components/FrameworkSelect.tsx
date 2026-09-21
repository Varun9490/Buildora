"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@buildora/utils";

export type FrameworkStatus = "Full" | "Partial" | "Experimental" | "Unsupported";

const dot: Record<FrameworkStatus, string> = {
  Full: "bg-[color:var(--b-accent)]",
  Partial: "bg-[color:var(--b-warning)]",
  Experimental: "bg-[color:var(--b-muted)]",
  Unsupported: "bg-[color:var(--b-border-hover)]",
};

/**
 * FrameworkSelect — sleek single-select dropdown replacing the 11-chip row.
 * Real buttons (native Enter/Space/Tab), arrow-key roving focus, Escape to
 * close with focus restoration, outside-pointer dismissal, fluid spring open.
 */
export function FrameworkSelect({
  value,
  onChange,
  frameworks,
  labels,
  statuses,
  id = "framework-select",
}: {
  value: string;
  onChange: (fw: string) => void;
  frameworks: string[];
  labels: Record<string, string>;
  statuses: Record<string, FrameworkStatus>;
  id?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const optionRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const close = React.useCallback((refocus = true) => {
    setOpen(false);
    if (refocus) triggerRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const focusOption = (i: number) => {
    const n = frameworks.length;
    const next = ((i % n) + n) % n;
    optionRefs.current[next]?.focus();
    optionRefs.current[next]?.scrollIntoView({ block: "nearest" });
  };

  const current = statuses[value] ?? "Partial";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "flex items-center gap-2 rounded-lg border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-3 py-1.5",
          "font-mono text-[11px] font-bold uppercase tracking-wider text-[color:var(--b-text)]",
          "transition-colors hover:border-[color:var(--b-border-hover)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]"
        )}
      >
        <span aria-hidden className={cn("h-2 w-2 rounded-full", dot[current])} />
        {labels[value] ?? value}
        <motion.svg
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="h-3 w-3 text-[color:var(--b-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-labelledby={id}
            initial={{ opacity: 0, scale: 0.97, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="scroll-sleek absolute right-0 z-30 mt-2 max-h-64 w-56 origin-top overflow-y-auto rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-elevated)] p-1.5 shadow-card"
          >
            {frameworks.map((f, i) => {
              const selected = f === value;
              const status = statuses[f] ?? "Partial";
              return (
                <li key={f} role="presentation">
                  <button
                    ref={(el) => {
                      optionRefs.current[i] = el;
                    }}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    autoFocus={selected}
                    onClick={() => {
                      onChange(f);
                      close(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        focusOption(i + 1);
                      } else if (e.key === "ArrowUp") {
                        e.preventDefault();
                        focusOption(i - 1);
                      } else if (e.key === "Home") {
                        e.preventDefault();
                        focusOption(0);
                      } else if (e.key === "End") {
                        e.preventDefault();
                        focusOption(frameworks.length - 1);
                      }
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--b-accent)]",
                      selected
                        ? "bg-[color:var(--b-accent-muted)] text-[color:var(--b-text)]"
                        : "text-[color:var(--b-text-secondary)] hover:bg-[color:var(--b-surface)] hover:text-[color:var(--b-text)]"
                    )}
                  >
                    <span aria-hidden className={cn("h-2 w-2 shrink-0 rounded-full", dot[status])} />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                      {labels[f] ?? f}
                    </span>
                    <span className="ml-auto font-mono text-[10px] text-[color:var(--b-muted)]">{status}</span>
                    {selected && (
                      <svg aria-hidden className="h-3.5 w-3.5 text-[color:var(--b-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FrameworkSelect;
