"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type CardT = { id: string; title: string; tag?: string; };
export type ColT = { id: string; title: string; cards: CardT[]; };

export function Kanban({ initial, className }: { initial?: ColT[]; className?: string }) {
  const [cols, setCols] = React.useState<ColT[]>(initial ?? [
    { id: "todo", title: "To do", cards: [{ id: "a", title: "Slingshot OTP a11y pass", tag: "a11y" }, { id: "b", title: "Registry JSON schema", tag: "registry" }] },
    { id: "doing", title: "Doing", cards: [{ id: "c", title: "Kanban spring tuning", tag: "motion" }] },
    { id: "done", title: "Done", cards: [{ id: "d", title: "Magnetic button", tag: "creative" }] }
  ]);
  const [drag, setDrag] = React.useState<{ card: string; from: string } | null>(null);
  const [over, setOver] = React.useState<string | null>(null);

  const move = (cardId: string, from: string, to: string) => {
    if (from === to) return;
    setCols((cs) => {
      const next = cs.map((c) => ({ ...c, cards: [...c.cards] }));
      const s = next.find((c) => c.id === from);
      const d = next.find((c) => c.id === to);
      if (!s || !d) return cs;
      const idx = s.cards.findIndex((c) => c.id === cardId);
      if (idx < 0) return cs;
      const [card] = s.cards.splice(idx, 1);
      d.cards.push(card);
      return next;
    });
  };

  const moveKeyboard = (colIdx: number, cardIdx: number, dir: -1 | 1) => {
    const target = colIdx + dir;
    if (target < 0 || target >= cols.length) return;
    const card = cols[colIdx].cards[cardIdx];
    move(card.id, cols[colIdx].id, cols[target].id);
  };

  return (
    <div className={cn("grid gap-3 md:grid-cols-3", className)} role="group" aria-label="Kanban board">
      {cols.map((col, ci) => (
        <div key={col.id}
          onDragOver={(e) => { e.preventDefault(); setOver(col.id); }}
          onDragLeave={() => setOver((o) => (o === col.id ? null : o))}
          onDrop={(e) => { e.preventDefault(); if (drag) move(drag.card, drag.from, col.id); setDrag(null); setOver(null); }}
          className={cn("min-h-[12rem] rounded-2xl border p-2 transition-all", over === col.id ? "border-[color:var(--b-accent)] bg-var(--b-accent)/[0.06] scale-[1.01]" : "border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[color-mix(in_oklab,var(--b-text)_2%,transparent)]")}>
          <p className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[color-mix(in_oklab,var(--b-text)_50%,transparent)]">{col.title} · {col.cards.length}</p>
          <ul className="space-y-2">
            {col.cards.map((card, ki) => (
              <li key={card.id}
                draggable
                onDragStart={() => setDrag({ card: card.id, from: col.id })}
                onDragEnd={() => { setDrag(null); setOver(null); }}
                tabIndex={0}
                aria-label={`${card.title} in ${col.title}. Arrow keys with Alt move columns.`}
                onKeyDown={(e) => {
                  if (e.altKey && e.key === "ArrowRight") moveKeyboard(ci, ki, 1);
                  if (e.altKey && e.key === "ArrowLeft") moveKeyboard(ci, ki, -1);
                }}
                className="cursor-grab rounded-xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[#141726] p-3 text-sm shadow transition-transform active:cursor-grabbing active:scale-[1.02]">
                <p className="font-medium">{card.title}</p>
                {card.tag && <span className="mt-1 inline-block rounded bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)] px-1.5 py-0.5 font-mono text-[10px] text-[color-mix(in_oklab,var(--b-text)_60%,transparent)]">{card.tag}</span>}
                <span className="sr-only">Press Alt plus arrow keys to move.</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Calendar({ className }: { className?: string }) {
  const [day, setDay] = React.useState(14);
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  return (
    <div className={cn("rounded-2xl border border-[color-mix(in_oklab,var(--b-border)_10%,transparent)] bg-[var(--b-bg)] p-4", className)}>
      <p className="mb-2 text-sm font-bold">February <span className="text-[color-mix(in_oklab,var(--b-text)_40%,transparent)]">— scheduling demo</span></p>
      <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Calendar">
        {days.map((d) => (
          <button key={d} role="gridcell" aria-selected={d === day} onClick={() => setDay(d)}
            className={cn("aspect-square rounded-lg text-sm transition-all", d === day ? "bg-[color:var(--b-accent)] font-bold text-[color:var(--b-accent-foreground)] scale-105" : "text-[color-mix(in_oklab,var(--b-text)_70%,transparent)] hover:bg-[color-mix(in_oklab,var(--b-text)_10%,transparent)]")}>{d}</button>
        ))}
      </div>
    </div>
  );
}

export default Kanban;
