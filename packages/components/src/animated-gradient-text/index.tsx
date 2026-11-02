"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type AnimatedGradientTextProps = React.HTMLAttributes<HTMLSpanElement> & { className?: string; children?: React.ReactNode };

export function AnimatedGradientText({ className, children, ...rest }: AnimatedGradientTextProps) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={cn("inline-block bg-clip-text text-transparent", className)}
      style={{ backgroundImage: "linear-gradient(90deg, var(--b-accent), var(--b-iris), var(--b-accent))", backgroundSize: "200% 100%" }}
      animate={reduced ? {} : { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
      transition={reduced ? {} : { duration: 4, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}
export default AnimatedGradientText;
