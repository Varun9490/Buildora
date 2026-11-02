"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const AnimatedCounterBadgeSchema = z.object({
  className: z.string().optional(),
});

export type AnimatedCounterBadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function AnimatedCounterBadge({ className, children, ...rest }: AnimatedCounterBadgeProps) {
  const reduced = useReducedMotion();
  const [key, setKey] = React.useState(0);
  React.useEffect(() => { setKey((k) => k + 1); }, [children]);
  return (
    <motion.span
      key={key}
      initial={reduced ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 18 }}
      className={cn("inline-flex items-center rounded-full border border-[color:var(--b-border)] bg-[color:var(--b-surface)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--b-text)]", className)}
    >
      {children}
    </motion.span>
  );
}
export default AnimatedCounterBadge;
