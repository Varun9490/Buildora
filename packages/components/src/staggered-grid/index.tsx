"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type StaggeredGridProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function StaggeredGrid({ className, children, ...rest }: StaggeredGridProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });
  const items = React.Children.toArray(children);
  return (
    <div ref={ref} className={cn("grid grid-cols-2 gap-4 md:grid-cols-3", className)}>
      {items.map((c, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={reduced ? {} : inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="text-[color:var(--b-text)]"
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}
export default StaggeredGrid;
