"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion, AnimatePresence } from "motion/react";

export type MorphOption = {
  value: string;
  label: string;
  desc?: string;
};

export type MorphSelectProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  options: (string | MorphOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Accessible trigger label. */
  label?: string;
  placeholder?: string;
};

/**
 * MorphSelect — the trigger itself stretches into the options list and
 * seals back into a pill. Listbox semantics, arrow navigation, Escape/
 * outside close, roving focus.
 */
export function MorphSelect({
  options,
  value,
  defaultValue,
  onChange,
  label = "Choose",
  placeholder = "Select…",
  className,
  ...rest
}: MorphSelectProps) {
  const reduced = useReducedMotion();
  const opts: MorphOption[] = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const [internal, setInternal] = React.useState(defaultValue ?? null);
  const active = value !== undefined ? value : internal;
  const [open, setOpen] = React.useState(false);
  const [cursor, setCursor] = React.useState(0);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const id = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const current = opts.find((o) => o.value === active);

  const pick = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setCursor(Math.max(0, opts.findIndex((o) => o.value === active)));
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % opts.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + opts.length) % opts.length);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (opts[cursor]) pick(opts[cursor].value);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={cn("relative inline-block w-56 max-w-full", className)} onKeyDown={onKey} {...rest}>
      <div
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-list`}
        aria-label={label}
        id={id}
        tabIndex={0}
        onClick={() => !open && setOpen(true)}
        className={cn(
          "group relative flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 outline-none",
          "border-[color:var(--b-border)] bg-[color:var(--b-surface)] transition-colors",
          "hover:border-[color:var(--b-border-hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]",
          open && "border-[color:var(--b-accent)] bg-[color:var(--b-panel)]"
        )}
      >
        <div className="min-w-0 flex-1 overflow-hidden">
          {current ? (
            <div>
              <motion.p layout className="truncate text-sm font-semibold text-[color:var(--b-text)]">
                {current.label}
              </motion.p>
              {current.desc && !open && (
                <motion.p layout className="truncate text-xs text-[color:var(--b-muted)]">
                  {current.desc}
                </motion.p>
              )}
            </div>
          ) : (
            <p className="truncate text-sm text-[color:var(--b-muted)]">{placeholder}</p>
          )}
        </div>
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="shrink-0 text-[color:var(--b-muted)]"
          animate={reduced ? undefined : { rotate: open ? 180 : 0 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.45 }}
          aria-hidden="true"
        >
          <path d="m3 6 5 5 5-5" />
        </motion.svg>
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            id={`${id}-list`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -10, scaleY: 0.9 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scaleY: 0.92 }}
            transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.22, duration: 0.42 }}
            style={{ originY: 0 }}
            className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] shadow-xl"
          >
            {opts.map((o, i) => {
              const selected = o.value === active;
              return (
                <motion.li
                  key={o.value}
                  role="option"
                  aria-selected={selected}
                  id={`${id}-opt-${i}`}
                  onPointerEnter={() => setCursor(i)}
                  onClick={() => pick(o.value)}
                  className={cn(
                    "relative flex cursor-pointer items-start justify-between gap-3 px-4 py-3 text-sm outline-none",
                    "before:absolute before:inset-y-0 before:left-0 before:w-[2px] before:bg-[color:var(--b-accent)]",
                    i === cursor ? "before:opacity-100 bg-[color:color-mix(in_oklab,var(--b-text)_6%,transparent)]" : "before:opacity-0",
                    selected ? "text-[color:var(--b-text)]" : "text-[color:var(--b-text-secondary)]"
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{o.label}</span>
                    {o.desc && <span className="mt-0.5 block text-xs text-[color:var(--b-muted)]">{o.desc}</span>}
                  </span>
                  <motion.span
                    animate={{ scale: selected ? 1 : 0.5, opacity: selected ? 1 : 0 }}
                    transition={{ type: "spring", bounce: 0.45, duration: 0.45 }}
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color:var(--b-accent)]"
                    aria-hidden="true"
                  >
                    <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="var(--b-accent-foreground)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m2 5.2 2 2.3 4-4.5" />
                    </svg>
                  </motion.span>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MorphSelect;
