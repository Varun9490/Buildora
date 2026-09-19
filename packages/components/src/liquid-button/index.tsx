"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type LiquidButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  intensity?: number; // goo wobble 0..1
  color?: string;
};

/** LiquidButton — gooey blob fill that follows the pointer. Real button underneath. */
export function LiquidButton({ intensity = 0.6, color, className, children, ...rest }: LiquidButtonProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const blob = React.useRef<HTMLSpanElement | null>(null);
  const reduced = useReducedMotion();

  const onMove = (e: React.PointerEvent) => {
    if (reduced) return;
    const el = ref.current;
    const b = blob.current;
    if (!el || !b) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    b.style.transform = `translate(${x - 50}%, ${y - 50}%) scale(${1 + intensity})`;
  };

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      className={cn(
        "group relative overflow-hidden rounded-full border border-white/12 bg-white/[0.04] px-6 py-2.5 text-sm font-semibold text-white",
        "transition-colors hover:border-white/25",
        className
      )}
      {...rest}
    >
      <span
        ref={blob}
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[220%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-md transition-transform duration-300 ease-out group-hover:opacity-100"
        style={{ background: color ?? "linear-gradient(135deg,#9d8cff,#5f4de8 60%,#d4ff4f 130%)" }}
      />
      <span className="relative z-10">{children}</span>
      <style>{`@media (prefers-reduced-motion: reduce){.group span{transition:none!important}}`}</style>
    </button>
  );
}

export default LiquidButton;
