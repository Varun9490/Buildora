"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const RotateCardStackSchema = z.object({
  className: z.string().optional(),
});

export type RotateCardStackProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function RotateCardStack({ className, children, ...rest }: RotateCardStackProps) {
  const items = React.Children.toArray(children);
  const [hover, setHover] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <div
      className={cn("relative h-64 w-48", className)}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
    >
      {items.map((c, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-[var(--b-radius-lg)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] p-4 shadow-sm text-[color:var(--b-text)]"
          animate={reduced ? {} : hover ? { rotate: (i - (items.length-1)/2) * 8, y: i * -6 } : { rotate: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 22 }}
          style={{ zIndex: items.length - i }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}
export default RotateCardStack;
