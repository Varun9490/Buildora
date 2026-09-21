"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type GradientMeshBackgroundProps = {
  colors?: string[];
  speed?: number;
  blur?: number;
  className?: string;
  children?: React.ReactNode;
};

export function GradientMeshBackground({
  colors = ["#5f4de8", "#d4ff4f", "#ff8a3d", "#3dd4ff"],
  speed = 20,
  blur = 100,
  className,
  children,
}: GradientMeshBackgroundProps) {
  const reduced = useReducedMotion();
  const actualSpeed = reduced ? 0 : speed;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {colors.map((color, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: "60%",
              height: "60%",
              left: `${(i % 2) * 30}%`,
              top: `${Math.floor(i / 2) * 30}%`,
              background: color,
              opacity: 0.4,
              filter: `blur(${blur}px)`,
              borderRadius: "50%",
              mixBlendMode: "screen",
              animation: actualSpeed > 0 ? `meshDrift ${actualSpeed}s ease-in-out infinite alternate` : undefined,
              animationDelay: `${i * 2}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes meshDrift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(10%, 15%) scale(1.1); }
        }
      `}</style>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default GradientMeshBackground;
