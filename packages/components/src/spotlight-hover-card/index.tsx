"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const SpotlightHoverCardSchema = z.object({
  className: z.string().optional(),
});

export type SpotlightHoverCardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function SpotlightHoverCard({ className, children, ...rest }: SpotlightHoverCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 50, y: 50 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setPos({ x: 50, y: 50 })}
      className={cn("relative overflow-hidden rounded-[var(--b-radius-lg)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-6 text-[color:var(--b-text)]", className)}
    >
      {!reduced && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60 transition-opacity"
          style={{ background: `radial-gradient(circle at ${pos.x}% ${pos.y}%, var(--b-accent-muted), transparent 55%)` }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
export default SpotlightHoverCard;
