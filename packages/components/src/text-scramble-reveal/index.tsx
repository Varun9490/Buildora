"use client";

import * as React from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type TextScrambleRevealProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
export function TextScrambleReveal({ className, children, ...rest }: TextScrambleRevealProps) {
  const text = typeof children === "string" ? children : "HELLO";
  const [out, setOut] = React.useState(text.split("").map(() => " "));
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref as React.RefObject<Element>, { once: true });
  React.useEffect(() => {
    if (!inView || reduced) { setOut(text.split("")); return; }
    let frame = 0; const total = 24;
    const id = setInterval(() => {
      frame++;
      setOut(text.split("").map((ch, i) => (frame / total > i / text.length ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])));
      if (frame >= total) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [inView, reduced, text]);
  return <span ref={ref} className={cn("font-mono text-[color:var(--b-text)]", className)}>{out.join("")}</span>;
}
export default TextScrambleReveal;
