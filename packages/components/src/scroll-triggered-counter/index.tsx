"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ScrollTriggeredCounterProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function ScrollTriggeredCounter({ className, ...rest }: ScrollTriggeredCounterProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    if (reduced) { setVal(1234); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => { const pp = Math.min(1, (t - start) / 1400); setVal(Math.round(pp * 1234)); if (pp < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);
  return <div ref={ref} className={cn("font-mono text-5xl font-bold tabular-nums text-[color:var(--b-accent)]", className)}>{val.toLocaleString()}</div>;
}
export default ScrollTriggeredCounter;
