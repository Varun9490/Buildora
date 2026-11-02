"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ElasticUnderlineProps = React.HTMLAttributes<HTMLSpanElement> & { className?: string; children?: React.ReactNode };

export function ElasticUnderline({ className, children, ...rest }: ElasticUnderlineProps) {
  const reduced = useReducedMotion();
  return (
    <span className={cn("relative inline-block cursor-pointer text-[color:var(--b-text)]", className)}>
      {children}
      <motion.span
        aria-hidden
        className="absolute left-0 -bottom-0.5 h-[2px] w-full origin-left bg-[color:var(--b-accent)]"
        initial={{ scaleX: 0.4 }}
        whileHover={reduced ? {} : { scaleX: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </span>
  );
}
export default ElasticUnderline;
