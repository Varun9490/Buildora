"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";
import { z } from "zod";

const CursorTrailDotSchema = z.object({
  className: z.string().optional(),
});

export type CursorTrailDotProps = React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  children?: React.ReactNode;
};

export function CursorTrailDot({ className, ...rest }: CursorTrailDotProps) {
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (reduced) return;
    let raf = 0; let target = { x: 0, y: 0 }; let cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => { target = { x: e.clientX, y: e.clientY }; setVisible(true); };
    const onLeave = () => setVisible(false);
    const loop = () => {
      cur.x += (target.x - cur.x) * 0.18;
      cur.y += (target.y - cur.y) * 0.18;
      setPos({ x: cur.x, y: cur.y });
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerleave", onLeave); cancelAnimationFrame(raf); };
  }, [reduced]);
  if (reduced) return null;
  return (
    <motion.span
      aria-hidden
      className={cn("pointer-events-none fixed left-0 top-0 z-50 h-3 w-3 rounded-full bg-[color:var(--b-accent)] mix-blend-difference", className)}
      style={{ x: pos.x - 6, y: pos.y - 6, opacity: visible ? 1 : 0 }}
      {...rest}
    />
  );
}
export default CursorTrailDot;
