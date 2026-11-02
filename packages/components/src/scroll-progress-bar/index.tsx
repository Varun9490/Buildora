"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const ScrollProgressBarSchema = z.object({
  className: z.string().optional(),
});

export type ScrollProgressBarProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function ScrollProgressBar({ className, ...rest }: ScrollProgressBarProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <motion.div
      className={cn("fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-[color:var(--b-accent)]", className)}
      style={{ scaleX }}
      {...rest}
    />
  );
}
export default ScrollProgressBar;
