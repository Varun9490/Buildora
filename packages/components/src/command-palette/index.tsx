"use client";

import * as React from "react";
import { cn, fuzzyScore } from "@buildora/utils";

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
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const view = seed
    .map((c) => ({ c, s: q ? fuzzyScore(q, `${c.label} ${c.group ?? ""}`) : 1 }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((x) => x.c);
  React.useEffect(() => setActive(0), [q]);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <div className="border-b border-white/10 p-2">
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
          className="w-full rounded-xl bg-transparent px-3 py-2 text-sm outline-none placeholder:text-white/30"
        />
      </div>
      <ul id="cmd-list" role="listbox" aria-label="Commands" className="max-h-56 overflow-auto p-1.5">
        {view.map((c, i) => (
          <li key={c.id} id={`cmd-${c.id}`} role="option" aria-selected={i === active}>
            <button
              onClick={() => onSelect?.(c.id)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm",
                i === active ? "bg-[#d4ff4f] font-semibold text-black" : "text-white/75 hover:bg-white/5"
              )}
            >
              <span>{c.label}</span>
              {c.hint && <span className={cn("ml-auto font-mono text-[11px]", i === active ? "text-black/60" : "text-white/35")}>{c.hint}</span>}
            </button>
          </li>
        ))}
        {view.length === 0 && <li className="px-3 py-4 text-center text-sm text-white/40">No commands.</li>}
      </ul>
    </div>
  );
}

export default CommandPalette;
