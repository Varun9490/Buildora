"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const NumberCounterRevealSchema = z.object({
  className: z.string().optional(),
});

export type NumberCounterRevealProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function NumberCounterReveal({ className, children, ...rest }: NumberCounterRevealProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView || reduced) { if (inView) setVal(100); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1200);
      setVal(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);
  return (
    <div ref={ref} className={cn("font-mono text-4xl font-bold text-[color:var(--b-accent)] tabular-nums", className)}>
      {val}
      {children}
    </div>
  );
}
export default NumberCounterReveal;
