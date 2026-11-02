"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const HoverLiftImageSchema = z.object({
  className: z.string().optional(),
});

export type HoverLiftImageProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function HoverLiftImage({ className, children, ...rest }: HoverLiftImageProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      whileHover={reduced ? {} : { y: -6, boxShadow: "0 12px 32px -12px var(--b-accent-glow)" }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn("overflow-hidden rounded-[var(--b-radius-lg)] border border-[color:var(--b-border)] bg-[color:var(--b-panel)] text-[color:var(--b-text)]", className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
export default HoverLiftImage;
