"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const FadeStaggerListSchema = z.object({
  className: z.string().optional(),
});

export type FadeStaggerListProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function FadeStaggerList({ className, children, ...rest }: FadeStaggerListProps) {
  const ref = React.useRef<HTMLUListElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-80px" });
  const items = React.Children.toArray(children);
  return (
    <ul ref={ref} className={cn("flex flex-col gap-2", className)} {...rest}>
      {items.map((c, i) => (
        <motion.li
          key={i}
          initial={reduced ? false : { opacity: 0, x: -12 }}
          animate={reduced ? {} : inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-[color:var(--b-text)]"
        >
          {c}
        </motion.li>
      ))}
    </ul>
  );
}
export default FadeStaggerList;
