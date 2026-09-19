"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type RippleBackgroundProps = {
  color?: string;
  count?: number;
  size?: number;
  speed?: number;
  className?: string;
  children?: React.ReactNode;
};

export function RippleBackground({
  color = "#d4ff4f",
  count = 4,
  size = 300,
  speed = 4,
  className,
  children,
}: RippleBackgroundProps) {
  const reduced = useReducedMotion();
  const actualSpeed = reduced ? 0 : speed;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size,
              height: size,
              border: `2px solid ${color}20`,
              animation: actualSpeed > 0 ? `rippleExpand ${actualSpeed}s ease-out infinite` : undefined,
              animationDelay: `${i * (actualSpeed / count)}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes rippleExpand {
          0% { transform: scale(0.5); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default RippleBackground;
