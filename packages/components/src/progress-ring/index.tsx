"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ProgressRingProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function ProgressRing({ className, ...rest }: ProgressRingProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    if (!inView) return;
    if (reduced) { setPct(75); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / 1000);
      setPct(Math.round(p * 75));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced]);
  const r = 40; const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div ref={ref} className={cn("inline-flex items-center justify-center", className)} {...rest}>
      <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--b-border)" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke="var(--b-accent)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`} transform="rotate(-90 50 50)"
        />
      </svg>
      <span className="absolute font-mono text-sm text-[color:var(--b-text)]">{pct}%</span>
    </div>
  );
}
export default ProgressRing;
