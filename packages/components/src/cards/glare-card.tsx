"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type GlareCardProps = React.HTMLAttributes<HTMLDivElement> & {
  glareColor?: string;
  glareIntensity?: number;
};

export function GlareCard({
  glareColor = "rgba(255, 255, 255, 0.12)",
  glareIntensity = 0.7,
  className,
  children,
  ...rest
}: GlareCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50 });
  const reduced = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePos({ x, y });
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      className={cn(
        "group relative rounded-2xl border border-white/10 bg-[#12141d] p-6",
        "transition-transform duration-200 hover:scale-[1.02]",
        "focus-within:ring-2 focus-within:ring-[#d4ff4f]/50",
        className
      )}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 60%)`,
          opacity: glareIntensity,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export default GlareCard;
