"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const GradientBorderCardSchema = z.object({
  className: z.string().optional(),
});

export type GradientBorderCardProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function GradientBorderCard({ className, children, ...rest }: GradientBorderCardProps) {
  const reduced = useReducedMotion();
  return (
    <div className={cn("relative rounded-[var(--b-radius-lg)] p-[1.5px] overflow-hidden", className)}>
      {!reduced && (
        <motion.span
          aria-hidden
          className="absolute inset-[-40%] bg-[conic-gradient(from_0deg,var(--b-accent),var(--b-iris),var(--b-accent))]"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />
      )}
      <div className="relative rounded-[calc(var(--b-radius-lg)-1.5px)] bg-[color:var(--b-panel)] p-6 text-[color:var(--b-text)]">
        {children}
      </div>
    </div>
  );
}
export default GradientBorderCard;
