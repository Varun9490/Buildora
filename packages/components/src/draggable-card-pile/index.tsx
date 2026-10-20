"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { motion } from "motion/react";

export type PileCard = {
  title: string;
  sub?: string;
};

export type DraggableCardPileProps = React.HTMLAttributes<HTMLDivElement> & {
  cards: PileCard[];
  /** Horizontal fly-out threshold in px. */
  threshold?: number;
  onChange?: (remaining: number) => void;
};

const CARD_TINTS = [
  "color-mix(in oklab, var(--b-accent) 14%, var(--b-panel))",
  "color-mix(in oklab, var(--b-iris, #9d8cff) 14%, var(--b-panel))",
  "color-mix(in oklab, var(--b-success) 12%, var(--b-panel))",
  "color-mix(in oklab, var(--b-warning) 14%, var(--b-panel))",
];

/**
 * DraggableCardPile — a riffled stack: the top card drags horizontally and
 * flies out past the threshold, cycling to the back with a spring. Enter
 * flings for keyboard users; reduced motion cycles on click.
 */
export function DraggableCardPile({
  cards,
  threshold = 130,
  onChange,
  className,
  ...rest
}: DraggableCardPileProps) {
  const reduced = useReducedMotion();
  const [order, setOrder] = React.useState(cards.map((_, i) => i));
  const [flying, setFlying] = React.useState<number | null>(null);
  const n = cards.length;
  const id = React.useId();

  const cycle = React.useCallback(() => {
    setOrder((prev) => [...prev.slice(1), prev[0]]);
  }, []);

  const fling = React.useCallback(() => {
    if (n === 0) return;
    if (reduced) {
      cycle();
      return;
    }
    setFlying(order[0]);
    window.setTimeout(() => {
      setFlying(null);
      cycle();
      onChange?.(n);
    }, 320);
  }, [cycle, order, reduced, n, onChange]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fling();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Card stack, ${n - (flying != null ? 1 : 0)} cards. Enter flings the top card.`}
      onKeyDown={onKey}
      className={cn("relative h-64 w-56 select-none outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--b-accent)] rounded-2xl", className)}
      {...rest}
    >
      {order.slice().reverse().map((idx, fromTop) => {
        const pos = n - 1 - fromTop; // 0 = top
        if (pos > 2) return null;
        const card = cards[idx];
        const isTop = pos === 0;
        const tint = CARD_TINTS[idx % CARD_TINTS.length];
        return (
          <motion.div
            key={`${id}-${idx}`}
            layout
            drag={isTop && !reduced ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) > threshold) fling();
            }}
            initial={{ x: 0 }}
            animate={
              flying === idx && !reduced
                ? { x: 320, rotate: 9, opacity: 0 }
                : { x: 0, y: pos * -9, rotate: pos * (pos % 2 === 0 ? -2 : 2.4), opacity: pos === 2 ? 0.95 : 1 }
            }
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.32, duration: 0.5 }}
            style={{
              zIndex: 10 - pos,
              background: tint,
              transformOrigin: "50% 120%",
              cursor: isTop ? (reduced ? "pointer" : "grab") : undefined,
            } as React.CSSProperties}
            onClick={isTop && reduced ? fling : undefined}
            className={cn(
              "absolute inset-x-4 top-6 flex h-44 flex-col justify-between rounded-2xl border p-4",
              "border-[color:color-mix(in_oklab,var(--b-border)_60%,transparent)] shadow-card",
              "will-change-transform"
            )}
          >
            <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--b-muted)]">
              {String(idx + 1).padStart(2, "0")}
            </div>
            <div>
              <p className={cn("font-display font-bold leading-tight", pos === 0 ? "text-lg" : "text-base", pos > 0 && "opacity-70")}>
                {card?.title}
              </p>
              {card?.sub && pos < 2 && (
                <p className="mt-1 line-clamp-2 text-xs text-[color:var(--b-text-secondary)]">{card.sub}</p>
              )}
            </div>
            {isTop && !reduced && (
              <motion.div
                aria-hidden="true"
                className="absolute inset-x-6 top-[42%] h-px"
                animate={{ opacity: 0 }}
                style={{ background: "color-mix(in oklab, var(--b-text) 20%, transparent)" }}
              />
            )}
          </motion.div>
        );
      })}
      <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-widest text-[color:var(--b-muted)]">
        drag → restack
      </span>
    </div>
  );
}

export default DraggableCardPile;
