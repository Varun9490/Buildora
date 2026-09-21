"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  blurAmount?: "sm" | "md" | "lg" | "xl";
  opacity?: number;
  borderColor?: string;
  glowEffect?: boolean;
};

export function GlassCard({
  blurAmount = "lg",
  opacity = 0.95,
  borderColor = "rgba(255, 255, 255, 0.08)",
  glowEffect = false,
  className,
  children,
  ...rest
}: GlassCardProps) {
  const reduced = useReducedMotion();

  const blurValues = {
    sm: "blur-sm",
    md: "blur-md",
    lg: "blur-lg",
    xl: "blur-xl",
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl border p-6",
        "transition-all duration-300",
        glowEffect && "hover:shadow-[0_0_40px_rgba(212,255,79,0.15)]",
        "focus-within:ring-2 focus-within:ring-[color-mix(in_oklab,var(--b-accent)_50%,transparent)]",
        className
      )}
      style={{
        background: `rgba(18, 20, 29, ${opacity})`,
        borderColor,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      {...rest}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          blurValues[blurAmount]
        )}
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(212, 255, 79, 0.08) 0%, transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export default GlassCard;
