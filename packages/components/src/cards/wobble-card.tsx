"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type WobbleCardProps = React.HTMLAttributes<HTMLDivElement> & {
  wobbleIntensity?: "subtle" | "medium" | "strong";
  wobbleColor?: string;
};

export function WobbleCard({
  wobbleIntensity = "medium",
  wobbleColor = "rgba(212, 255, 79, 0.08)",
  className,
  children,
  ...rest
}: WobbleCardProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const reduced = useReducedMotion();

  const intensityValues = {
    subtle: { scale: 1.01, rotate: 0.5, duration: 300 },
    medium: { scale: 1.03, rotate: 1.5, duration: 400 },
    strong: { scale: 1.05, rotate: 2.5, duration: 500 },
  };

  const { scale, rotate, duration } = intensityValues[wobbleIntensity];

  return (
    <div
      onPointerEnter={() => !reduced && setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      className={cn(
        "group relative rounded-2xl border border-white/10 bg-[#12141d] p-6",
        "transition-shadow duration-300 hover:shadow-xl hover:shadow-[#d4ff4f]/5",
        "focus-within:ring-2 focus-within:ring-[#d4ff4f]/50",
        className
      )}
      style={{
        transform: reduced ? "none" : isHovered ? `scale(${scale}) rotate(${rotate}deg)` : "scale(1) rotate(0deg)",
        transition: `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
      {...rest}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: wobbleColor }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export default WobbleCard;
