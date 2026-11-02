"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const PortfolioHeroEntranceSchema = z.object({
  className: z.string().optional(),
});

export type PortfolioHeroEntranceProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function PortfolioHeroEntrance({ className, children, ...rest }: PortfolioHeroEntranceProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const items = React.Children.toArray(children);
  return (
    <div ref={ref} className={cn("flex flex-col gap-4", className)} {...rest}>
      {items.map((c, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={reduced ? {} : inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {c}
        </motion.div>
      ))}
    </div>
  );
}
export default PortfolioHeroEntrance;
