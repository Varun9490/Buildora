"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SliderGlowProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function SliderGlow({ className, ...rest }: SliderGlowProps) {
  const [val, setVal] = React.useState(50);
  return (
    <div className={cn("w-full", className)} {...rest}>
      <input
        type="range"
        min={0} max={100} value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full accent-[color:var(--b-accent)]"
      />
      <div className="mt-2 text-center font-mono text-sm text-[color:var(--b-text)]">{val}</div>
    </div>
  );
}
export default SliderGlow;
