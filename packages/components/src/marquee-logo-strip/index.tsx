"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const MarqueeLogoStripSchema = z.object({
  className: z.string().optional(),
});

export type MarqueeLogoStripProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function MarqueeLogoStrip({ className, children, ...rest }: MarqueeLogoStripProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("overflow-hidden border-y border-[color:var(--b-border)] py-6 text-[color:var(--b-text)]", className)} {...rest}>
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={reduced ? {} : { x: ["0%", "-50%"] }}
        transition={reduced ? {} : { duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <div className="flex gap-12">{children}</div>
        <div className="flex gap-12" aria-hidden>{children}</div>
      </motion.div>
    </div>
  );
}
export default MarqueeLogoStrip;
