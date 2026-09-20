"use client";

import * as React from "react";
import { cn, fuzzyScore } from "@buildora/utils";

export type SlashItem = { id: string; cmd: string; desc: string };

export function SlashCommands({
  items,
  onPick,
  className,
}: {
  items?: SlashItem[];
  onPick?: (cmd: string) => void;
  className?: string;
}) {
  const seed: SlashItem[] = items ?? [
    { id: "s1", cmd: "/table", desc: "Insert data table" },
    { id: "s2", cmd: "/terminal", desc: "Insert terminal block" },
    { id: "s3", cmd: "/ai-review", desc: "Request AI review" },
    { id: "s4", cmd: "/kanban", desc: "Insert board" },
  ];
  const [q, setQ] = React.useState("/");
  const [active, setActive] = React.useState(0);
  const view = seed
    .map((x) => ({ x, s: fuzzyScore(q, `${x.cmd} ${x.desc}`) }))
    .filter((v) => v.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((v) => v.x);
  React.useEffect(() => setActive(0), [q]);
  return (
    <div className={cn("overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]", className)}>
      <div className="border-b border-white/10 p-2">
        <label htmlFor="slash-input" className="sr-only">Slash command</label>
        <input
          id="slash-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") setActive((a) => Math.min(view.length - 1, a + 1));
            if (e.key === "ArrowUp") setActive((a) => Math.max(0, a - 1));
            if (e.key === "Enter" && view[active]) onPick?.(view[active].cmd);
          }}
          role="combobox"
          aria-expanded
          aria-controls="slash-list"
          className="w-full rounded-xl bg-transparent px-3 py-2 font-mono text-sm outline-none"
        />
      </div>
      <ul id="slash-list" role="listbox" aria-label="Slash commands" className="p-1.5">
        {view.map((x, i) => (
          <li key={x.id} role="option" aria-selected={i === active}>
            <button
              onClick={() => onPick?.(x.cmd)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left",
                i === active ? "bg-[#d4ff4f] text-black" : "hover:bg-white/5"
              )}
            >
              <span className="font-mono text-sm font-bold">{x.cmd}</span>
              <span className={cn("text-xs", i === active ? "text-black/60" : "text-white/40")}>{x.desc}</span>
            </button>
          </li>
        ))}
        {view.length === 0 && <li className="px-3 py-4 text-center text-sm text-white/40">No match.</li>}
      </ul>
    </div>
  );
}

export default SlashCommands;
