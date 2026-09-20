"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type MagneticCardProps = React.HTMLAttributes<HTMLDivElement> & {
  tilt?: number; // max deg
  glowColor?: string;
};

/** MagneticCard — pointer tilt + spotlight. Div with keyboard focus support. */
export function MagneticCard({ tilt = 8, glowColor = "rgba(212,255,79,.35)", className, children, ...rest }: MagneticCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || reduced) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * tilt).toFixed(2)}deg) rotateY(${(px * tilt).toFixed(2)}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="group"
      onPointerMove={onMove}
      onPointerLeave={reset}
      onBlur={reset}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-[#12141d] p-5 shadow-card transition-transform duration-200 will-change-transform",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity hover:before:opacity-100",
        className
      )}
      style={{ ["--glow" as string]: glowColor }}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx,50%) var(--my,50%), var(--glow), transparent 65%)` }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export default MagneticCard;
