"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const SectionDividerLineSchema = z.object({
  className: z.string().optional(),
});

export type SectionDividerLineProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function SectionDividerLine({ className, ...rest }: SectionDividerLineProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={cn("h-px w-full overflow-hidden", className)} {...rest}>
      <motion.div
        className="h-full w-full origin-center bg-[color:var(--b-border-hover)]"
        initial={reduced ? false : { scaleX: 0 }}
        animate={reduced ? {} : inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
export default SectionDividerLine;
