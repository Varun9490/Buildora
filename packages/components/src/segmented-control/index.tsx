"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type SegmentedControlSize = "sm" | "md" | "lg";

export type SegmentedItem = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export type SegmentedControlProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> & {
  items: SegmentedItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  size?: SegmentedControlSize;
  /** Accessible name for the radiogroup. */
  label?: string;
};

const SIZES: Record<SegmentedControlSize, string> = {
  sm: "h-7 px-2.5 text-xs gap-1",
  md: "h-9 px-3 text-sm gap-1.5",
  lg: "h-11 px-4 text-[15px] gap-2",
};

/**
 * SegmentedControl — one-axis option picker with a spring-gliding pill.
 * Radiogroup semantics: roving focus, arrow keys move + commit, Space toggles.
 */
export function SegmentedControl({
  items,
  value,
  defaultValue,
  onChange,
  size = "md",
  label = "Options",
  className,
  ...rest
}: SegmentedControlProps) {
  const reduced = useReducedMotion();
  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const active = value ?? internal;
  const [focusIdx, setFocusIdx] = React.useState(-1);
  const groupId = React.useId();

  const commit = (v: string) => {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const idx = items.findIndex((it) => it.value === active);
    let next = idx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (idx + 1) % items.length;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (idx - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      commit(items[idx].value);
      return;
    } else return;
    e.preventDefault();
    commit(items[next].value);
    document.getElementById(`${groupId}-opt-${next}`)?.focus();
  };

  return (
    <div
      role="radiogroup"
      aria-label={label}
      id={groupId}
      onKeyDown={onKey}
      className={cn(
        "inline-flex max-w-full items-center gap-1 rounded-full border p-1",
        "border-[color:var(--b-border)] bg-[color:var(--b-surface)]",
        className
      )}
      {...rest}
    >
      {items.map((item, i) => {
        const isActive = item.value === active;
        return (
          <button
            key={item.value}
            id={`${groupId}-opt-${i}`}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive || focusIdx === i ? 0 : -1}
            onFocus={() => setFocusIdx(i)}
            onClick={() => commit(item.value)}
            className={cn(
              "relative inline-flex shrink-0 items-center justify-center rounded-full outline-none",
              "font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]",
              SIZES[size],
              isActive
                ? "text-[color:var(--b-accent-foreground)]"
                : "text-[color:var(--b-text-secondary)] hover:text-[color:var(--b-text)]"
            )}
          >
            {isActive && (
              <motion.span
                layoutId={reduced ? undefined : `${groupId}-pill`}
                transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.2, duration: 0.5 }}
                className="absolute inset-0 rounded-full bg-[color:var(--b-accent)]"
                aria-hidden="true"
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1.5">
              {item.icon}
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
