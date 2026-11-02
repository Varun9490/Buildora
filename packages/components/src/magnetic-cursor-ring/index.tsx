"use client";

import * as React from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "motion/react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type MagneticCursorRingProps = React.HTMLAttributes<HTMLDivElement> & { className?: string; children?: React.ReactNode };

export function MagneticCursorRing({ className, ...rest }: MagneticCursorRingProps) {
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 0, y: 0, down: false });
  React.useEffect(() => {
    if (reduced) return;
    let raf = 0; let target = { x: 0, y: 0 }; let cur = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => { target = { x: e.clientX, y: e.clientY }; };
    const onDown = () => setPos((v) => ({ ...v, down: true }));
    const onUp = () => setPos((v) => ({ ...v, down: false }));
    const loop = () => { cur.x += (target.x - cur.x) * 0.12; cur.y += (target.y - cur.y) * 0.12; setPos((v) => ({ ...v, x: cur.x, y: cur.y })); raf = requestAnimationFrame(loop); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerdown", onDown); window.removeEventListener("pointerup", onUp); cancelAnimationFrame(raf); };
  }, [reduced]);
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none fixed left-0 top-0 z-50 rounded-full border-2 border-[color:var(--b-accent)]", className)}
      style={{ x: pos.x - (pos.down ? 12 : 18), y: pos.y - (pos.down ? 12 : 18), width: pos.down ? 24 : 36, height: pos.down ? 24 : 36 }}
      {...rest}
    />
  );
}
export default MagneticCursorRing;
