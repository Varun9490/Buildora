"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type PhysicsCard = {
  id: string;
  title: string;
  /** Optional metadata shown under the title. */
  meta?: string;
};

export type PhysicsColumn = {
  id: string;
  title: string;
  cards: PhysicsCard[];
};

export type PhysicsKanbanProps = {
  columns: PhysicsColumn[];
  /** Called when a card moves between columns. */
  onMove?: (cardId: string, fromColumn: string, toColumn: string) => void;
  /** Called when a card is dropped on a card, to reorder. */
  onReorder?: (cardId: string, targetCardId: string) => void;
  /** Spring stiffness for the drop. */
  stiffness?: number;
  /** Spring damping for the drop. */
  damping?: number;
  className?: string;
};

type Drag = {
  cardId: string;
  fromColumn: string;
  offsetX: number;
  offsetY: number;
  overColumn: string | null;
  overCardId: string | null;
};

/**
 * PhysicsKanban — a board whose cards are thrown, not teleported.
 *
 * What makes this different from a drag-and-drop board: a card you drag
 * keeps its momentum. When you let go it does not jump into place — it is
 * released into a spring, overshoots slightly, and settles. The card you
 * are holding tracks your pointer exactly, including the throw.
 *
 * The board is still a plain list of lists underneath. Every card is a real
 * button, the columns are real lists, and a card can be moved with the
 * keyboard: pick it up with Enter, move it with the arrow keys, drop it
 * with Enter, cancel with Escape.
 */
export function PhysicsKanban({
  columns,
  onMove,
  onReorder,
  stiffness = 320,
  damping = 26,
  className,
}: PhysicsKanbanProps) {
  const reduced = useReducedMotion();
  const [cards, setCards] = React.useState(() =>
    columns.map((c) => ({ ...c, cards: [...c.cards] }))
  );
  const [drag, setDrag] = React.useState<Drag | null>(null);
  /** The offset the card is springing home from, after release. */
  const [settling, setSettling] = React.useState<{
    cardId: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [carrying, setCarrying] = React.useState<string | null>(null);

  const springPos = React.useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const raf = React.useRef(0);

  /** Run the spring from the drag offset back to the origin. */
  const settle = React.useCallback(
    (cardId: string, from: { x: number; y: number }) => {
      if (reduced) {
        setSettling(null);
        return;
      }
      springPos.current = { x: from.x, y: from.y, vx: 0, vy: 0 };
      let last = performance.now();
      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const p = springPos.current;
        const ax = -stiffness * p.x - damping * p.vx;
        const ay = -stiffness * p.y - damping * p.vy;
        p.vx += ax * dt;
        p.vy += ay * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (Math.abs(p.x) < 0.4 && Math.abs(p.y) < 0.4 && Math.abs(p.vx) < 4 && Math.abs(p.vy) < 4) {
          setSettling(null);
          raf.current = 0;
          return;
        }
        setSettling({ cardId, offsetX: p.x, offsetY: p.y });
        raf.current = requestAnimationFrame(tick);
      };
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    },
    [reduced, stiffness, damping]
  );

  React.useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    },
    []
  );

  const findCard = (cardId: string) => {
    for (const col of cards) {
      const card = col.cards.find((c) => c.id === cardId);
      if (card) return { card, column: col };
    }
    return null;
  };

  const moveCard = (cardId: string, toColumn: string, beforeCardId?: string | null) => {
    const found = findCard(cardId);
    if (!found) return;
    const from = found.column.id;

    setCards((prev) => {
      const next = prev.map((c) => ({ ...c, cards: [...c.cards] }));
      const source = next.find((c) => c.id === from)!;
      const target = next.find((c) => c.id === toColumn)!;
      const idx = source.cards.findIndex((c) => c.id === cardId);
      const [moved] = source.cards.splice(idx, 1);
      if (!moved) return prev;
      const at =
        beforeCardId && beforeCardId !== cardId
          ? Math.max(0, target.cards.findIndex((c) => c.id === beforeCardId))
          : target.cards.length;
      target.cards.splice(at, 0, moved);
      return next;
    });

    if (from !== toColumn) onMove?.(cardId, from, toColumn);
    else if (beforeCardId) onReorder?.(cardId, beforeCardId);
  };

  const onPointerDown = (e: React.PointerEvent, cardId: string, columnId: string) => {
    if (e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setDrag({
      cardId,
      fromColumn: columnId,
      offsetX: 0,
      offsetY: 0,
      overColumn: columnId,
      overCardId: null,
    });
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag) return;
    const target = e.currentTarget as HTMLElement;
    const r = target.getBoundingClientRect();
    setDrag({
      ...drag,
      offsetX: e.clientX - r.left - r.width / 2,
      offsetY: e.clientY - r.top - r.height / 2,
    });
  };

  const onPointerUp = () => {
    if (!drag) return;
    if (drag.overColumn && drag.overColumn !== drag.fromColumn) {
      moveCard(drag.cardId, drag.overColumn, drag.overCardId);
    }
    settle(drag.cardId, { x: drag.offsetX, y: drag.offsetY });
    setDrag(null);
  };

  /** Keyboard: pick up, move with arrows, drop. */
  const onCardKeyDown = (e: React.KeyboardEvent, cardId: string, columnId: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (carrying === cardId) {
        setCarrying(null);
        return;
      }
      setCarrying(cardId);
      setDrag({
        cardId,
        fromColumn: columnId,
        offsetX: 0,
        offsetY: 0,
        overColumn: columnId,
        overCardId: null,
      });
      return;
    }
    if (carrying !== cardId) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setCarrying(null);
      setDrag(null);
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const idx = cards.findIndex((c) => c.id === columnId);
      const next = cards[idx + (e.key === "ArrowRight" ? 1 : -1)];
      if (!next) return;
      setDrag({
        ...drag!,
        overColumn: next.id,
        overCardId: null,
      });
      return;
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const col = cards.find((c) => c.id === columnId);
      if (!col) return;
      const pos = col.cards.findIndex((c) => c.id === cardId);
      const nextPos = pos + (e.key === "ArrowDown" ? 1 : -1);
      const target = col.cards[nextPos];
      setDrag({
        ...drag!,
        overCardId: target ? target.id : null,
      });
    }
  };

  return (
    <div
      className={cn("grid gap-4", className)}
      style={{ gridTemplateColumns: `repeat(${cards.length}, minmax(0, 1fr))` }}
    >
      {cards.map((column) => (
        <section
          key={column.id}
          aria-label={column.title}
          className="flex min-h-[180px] flex-col rounded-2xl border border-[color:var(--b-border)] bg-[color:var(--b-surface)] p-3"
        >
          <h3 className="mb-2 px-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[color:var(--b-muted)]">
            {column.title}
          </h3>
          <ul className="flex flex-1 flex-col gap-2">
            {column.cards.map((card) => {
              const isDragging = drag?.cardId === card.id;
              const springOffset =
                settling?.cardId === card.id ? settling : null;
              const offset = isDragging && drag ? drag : springOffset;
              return (
                <li key={card.id} className="list-none">
                  <button
                    type="button"
                    onPointerDown={(e) => onPointerDown(e, card.id, column.id)}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onKeyDown={(e) => onCardKeyDown(e, card.id, column.id)}
                    aria-pressed={carrying === card.id}
                    className={cn(
                      "w-full cursor-grab rounded-xl border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-3 text-left transition-shadow",
                      "hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)]",
                      isDragging && "cursor-grabbing opacity-40"
                    )}
                    style={
                      offset
                        ? {
                            transform: `translate3d(${offset.offsetX}px, ${offset.offsetY}px, 0)`,
                          }
                        : undefined
                    }
                  >
                    <span className="block text-sm font-medium text-[color:var(--b-text)]">
                      {card.title}
                    </span>
                    {card.meta ? (
                      <span className="mt-0.5 block text-[11px] text-[color:var(--b-muted)]">
                        {card.meta}
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default PhysicsKanban;
