"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type AuroraBeamBackgroundProps = {
  colors?: string[];
  beamCount?: number;
  className?: string;
  children?: React.ReactNode;
};

export function AuroraBeamBackground({
  colors = ["#5f4de8", "#d4ff4f", "#ff8a3d"],
  beamCount = 5,
  className,
  children,
}: AuroraBeamBackgroundProps) {
  const reduced = useReducedMotion();
  const beams = React.useMemo(() => {
    return Array.from({ length: beamCount }, (_, i) => ({
      color: colors[i % colors.length],
      width: 200 + Math.random() * 300,
      top: Math.random() * 100,
      delay: i * 3,
      duration: 30 + Math.random() * 20,
      direction: i % 2 === 0 ? 1 : -1,
    }));
  }, [beamCount, colors]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {beams.map((beam, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: beam.width,
              height: "100%",
              top: `${beam.top}%`,
              background: `linear-gradient(${90 * beam.direction}deg, transparent, ${beam.color}40, transparent)`,
              filter: "blur(60px) saturate(1.5)",
              transform: `translateX(${-beam.direction * 100}%)`,
              animation: reduced
                ? undefined
                : `auroraDrift${beam.direction > 0 ? "" : "Reverse"} ${beam.duration}s linear infinite`,
              animationDelay: `${beam.delay}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes auroraDrift {
          from { transform: translateX(-100%); }
          to { transform: translateX(calc(100vw + 100%)); }
        }
        @keyframes auroraDriftReverse {
          from { transform: translateX(calc(100vw + 100%)); }
          to { transform: translateX(-100%); }
        }
      `}</style>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default AuroraBeamBackground;
