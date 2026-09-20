"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type MeteorBackgroundProps = {
  meteorCount?: number;
  color?: string;
  minSize?: number;
  maxSize?: number;
  className?: string;
  children?: React.ReactNode;
};

export function MeteorBackground({
  meteorCount = 20,
  color = "#d4ff4f",
  minSize = 1,
  maxSize = 3,
  className,
  children,
}: MeteorBackgroundProps) {
  const reduced = useReducedMotion();
  const meteors = React.useMemo(() => {
    return Array.from({ length: meteorCount }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 5,
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, [meteorCount, minSize, maxSize]);

  if (reduced) {
    return (
      <div className={cn("relative", className)}>
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {meteors.map((meteor, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: meteor.size,
              height: meteor.size * 50,
              left: `${meteor.x}%`,
              top: `${meteor.y}%`,
              background: `linear-gradient(to bottom, ${color}, transparent)`,
              opacity: meteor.opacity,
              animation: `meteorFall ${meteor.duration}s linear infinite`,
              animationDelay: `${meteor.delay}s`,
              transform: "rotate(-45deg)",
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes meteorFall {
          0% { transform: translate(0, 0) rotate(-45deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(-100vh, 100vh) rotate(-45deg); opacity: 0; }
        }
      `}</style>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default MeteorBackground;
