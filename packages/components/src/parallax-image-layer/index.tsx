"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const ParallaxImageLayerSchema = z.object({
  className: z.string().optional(),
});

export type ParallaxImageLayerProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function ParallaxImageLayer({ className, children, ...rest }: ParallaxImageLayerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["-8%", "8%"]);
  return (
    <motion.div ref={ref} style={{ y }} className={cn("overflow-hidden", className)}>
      {children}
    </motion.div>
  );
}
export default ParallaxImageLayer;
