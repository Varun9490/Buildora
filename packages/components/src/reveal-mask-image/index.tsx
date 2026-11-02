"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const RevealMaskImageSchema = z.object({
  className: z.string().optional(),
});

export type RevealMaskImageProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function RevealMaskImage({ className, children, ...rest }: RevealMaskImageProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} {...rest}>
      <motion.div
        initial={reduced ? false : { clipPath: "inset(0 100% 0 0)" }}
        animate={reduced ? {} : inView ? { clipPath: "inset(0 0% 0 0)" } : { clipPath: "inset(0 100% 0 0)" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
export default RevealMaskImage;
