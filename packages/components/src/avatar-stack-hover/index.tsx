"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type AvatarStackHoverProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function AvatarStackHover({ className, ...rest }: AvatarStackHoverProps) {
  const [hover, setHover] = React.useState(false);
  const reduced = useReducedMotion();
  const items = [1, 2, 3, 4];
  return (
    <div className={cn("flex", className)} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      {items.map((n, i) => (
        <motion.div
          key={n}
          className="h-10 w-10 -ml-3 first:ml-0 rounded-full border-2 border-[color:var(--b-panel)] bg-[color:var(--b-surface)] flex items-center justify-center text-xs text-[color:var(--b-text)]"
          animate={reduced ? {} : hover ? { x: i * 6 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {n}
        </motion.div>
      ))}
    </div>
  );
}
export default AvatarStackHover;
