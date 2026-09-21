"use client";

import * as React from "react";
import { cn, fuzzyScore } from "@buildora/utils";
import { motion, AnimatePresence } from "motion/react";

export type Command = { id: string; label: string; hint?: string; group?: string };

export function CommandPalette({
  commands,
  onSelect,
  className,
}: {
  commands?: Command[];
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const seed: Command[] = commands ?? [
    { id: "c1", label: "Add magnetic-button", hint: "component", group: "Components" },
    { id: "c2", label: "Open playground", hint: "⌘P", group: "Go to" },
    { id: "c3", label: "Validate registry", hint: "run", group: "Actions" },
    { id: "c4", label: "Toggle theme", hint: "dark/light", group: "Actions" },
  ];
  const id = React.useId();
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const view = seed
    .map((c) => ({ c, s: q ? fuzzyScore(q, `${c.label} ${c.group ?? ""}`) : 1 }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.c);
  React.useEffect(() => setActive(0), [q]);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)]", className)}>
      <div className="border-b border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] p-2">
        <label htmlFor="cmd-input" className="sr-only">Type a command</label>
        <input
          id="cmd-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setActive((a) => Math.min(view.length - 1, a + 1));
            if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
            if (e.key === "Enter" && view[active]) onSelect?.(view[active].id);
          }}
          placeholder="Type a command…"
          role="combobox"
          aria-expanded
          aria-controls="cmd-list"
          aria-activedescendant={view[active] ? `cmd-${view[active].id}` : undefined}
          className="w-full rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-[color-mix(in_oklab,var(--b-text)_30%,transparent)]"
        />
      </div>
      <ul id="cmd-list" role="listbox" aria-label="Commands" className="max-h-56 overflow-auto p-1.5 space-y-0.5">
        {view.map((c, i) => (
          <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={i === active} className="relative">
            <AnimatePresence>
              {i === active && (
                <motion.div
                  layoutId={`${id}-active-cmd`}
                  className="absolute inset-0 rounded-lg bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
            </AnimatePresence>
            <button
              onClick={() => onSelect?.(c.id)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "relative z-10 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200",
                i === active ? "font-semibold text-[color:var(--b-text)]" : "text-[color-mix(in_oklab,var(--b-text)_75%,transparent)]"
              )}
            >
              <span>{c.label}</span>
              {c.hint && <span className={cn("ml-auto font-mono text-[11px] transition-colors", i === active ? "text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]" : "text-[color-mix(in_oklab,var(--b-text)_35%,transparent)]")}>{c.hint}</span>}
            </button>
          </li>
        ))}
        {view.length === 0 && <li className="px-3 py-4 text-center text-sm text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">No commands.</li>}
      </ul>
    </div>
  );
}

export default CommandPalette;
