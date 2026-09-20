"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type GlowButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  glowColor?: string;
  glowIntensity?: "subtle" | "medium" | "strong";
  variant?: "solid" | "outline";
};

export function GlowButton({
  glowColor = "#d4ff4f",
  glowIntensity = "medium",
  variant = "solid",
  className,
  children,
  ...rest
}: GlowButtonProps) {
  const ref = React.useRef<HTMLButtonElement | null>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0.5, y: 0.5 });
  const reduced = useReducedMotion();

  const intensityValues = {
    subtle: { blur: 20, spread: 30, opacity: 0.4 },
    medium: { blur: 35, spread: 50, opacity: 0.6 },
    strong: { blur: 50, spread: 70, opacity: 0.8 },
  };

  const { blur, spread, opacity } = intensityValues[glowIntensity];

  const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  return (
    <button
      ref={ref}
      onPointerMove={handleMove}
      className={cn(
        "relative rounded-xl px-6 py-2.5 text-sm font-semibold",
        "transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:opacity-50 disabled:pointer-events-none",
        variant === "solid"
          ? "bg-[--b-accent] text-[--b-accent-foreground] hover:brightness-110 focus:ring-[#d4ff4f]/50"
          : "border-2 border-[--b-accent] bg-transparent text-[--b-accent] hover:bg-[#d4ff4f]/10 focus:ring-[#d4ff4f]/50",
        className
      )}
      {...rest}
    >
      <span className="relative z-10">{children}</span>
      {!reduced && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-300 group-hover:opacity-100"
          style={{
            opacity,
            background: `radial-gradient(${spread}px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${glowColor}, transparent ${blur}%)`,
          }}
        />
      )}
    </button>
  );
}

export default GlowButton;
