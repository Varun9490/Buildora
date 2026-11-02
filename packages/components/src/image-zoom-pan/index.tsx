"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ImageZoomPanProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function ImageZoomPan({ className, children, ...rest }: ImageZoomPanProps) {
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 50, y: 50, scale: 1 });
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100, scale: 1.15 });
  };
  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={() => setPos({ x: 50, y: 50, scale: 1 })}
      className={cn("overflow-hidden rounded-[var(--b-radius-lg)]", className)}
    >
      <motion.div
        animate={reduced ? {} : pos}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        style={{ transformOrigin: `${pos.x}% ${pos.y}%` }}
        className="text-[color:var(--b-text)]"
      >
        {children}
      </motion.div>
    </div>
  );
}
export default ImageZoomPan;
