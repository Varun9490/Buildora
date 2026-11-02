"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type FadeInImageProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function FadeInImage({ className, ...rest }: FadeInImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const reduced = useReducedMotion();
  return (
    <motion.img
      onLoad={() => setLoaded(true)}
      initial={reduced ? false : { opacity: 0, filter: "blur(8px)", scale: 1.02 }}
      animate={reduced ? {} : loaded ? { opacity: 1, filter: "blur(0px)", scale: 1 } : { opacity: 0, filter: "blur(8px)", scale: 1.02 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn("rounded-[var(--b-radius-lg)]", className)}
      {...rest}
    />
  );
}
export default FadeInImage;
