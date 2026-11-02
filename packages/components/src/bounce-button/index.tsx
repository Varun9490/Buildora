"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type BounceButtonProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function BounceButton({ className, children, ...rest }: BounceButtonProps) {
  const reduced = useReducedMotion();
  return (
    <motion.button
      whileTap={reduced ? {} : { scale: 0.92 }}
      whileHover={reduced ? {} : { y: -2 }}
      transition={{ type: "spring", stiffness: 420, damping: 14 }}
      className={cn("rounded-[var(--b-radius)] bg-[color:var(--b-accent)] px-5 py-2.5 text-sm font-semibold text-[color:var(--b-accent-foreground)]", className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
export default BounceButton;
