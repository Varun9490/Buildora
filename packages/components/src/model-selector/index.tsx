"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@buildora/hooks";

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

export default ModelSelector;
