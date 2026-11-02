"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ScrollSnapSectionProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function ScrollSnapSection({ className, children, ...rest }: ScrollSnapSectionProps) {
  return (
    <section className={cn("snap-start min-h-screen flex items-center justify-center text-[color:var(--b-text)]", className)}>
      {children}
    </section>
  );
}
export default ScrollSnapSection;
