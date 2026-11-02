"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const BlurTextEntranceSchema = z.object({
  className: z.string().optional(),
});

export type BlurTextEntranceProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function BlurTextEntrance({ className, children, ...rest }: BlurTextEntranceProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={reduced ? false : { opacity: 0, filter: "blur(12px)", scale: 0.96 }}
      animate={reduced ? {} : inView ? { opacity: 1, filter: "blur(0px)", scale: 1 } : { opacity: 0, filter: "blur(12px)", scale: 0.96 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn("text-[color:var(--b-text)]", className)}
    >
      {children}
    </motion.div>
  );
}
export default BlurTextEntrance;
