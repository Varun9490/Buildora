"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const MagneticNavPillSchema = z.object({
  className: z.string().optional(),
});

export type MagneticNavPillProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function MagneticNavPill({ className, children, ...rest }: MagneticNavPillProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    setPos({ x: (e.clientX - cx) * 0.18, y: (e.clientY - cy) * 0.18 });
  };
  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setPos({ x: 0, y: 0 })}
      animate={reduced ? {} : pos}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn("inline-flex items-center gap-2 rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-4 py-2 text-sm text-[color:var(--b-text)]", className)}
    >
      {children}
    </motion.div>
  );
}
export default MagneticNavPill;
