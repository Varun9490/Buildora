"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type BeamBackgroundProps = {
  colors?: string[];
  beamCount?: number;
  width?: number;
  className?: string;
  children?: React.ReactNode;
};

export function BeamBackground({
  colors = ["#d4ff4f", "#5f4de8"],
  beamCount = 10,
  width = 2,
  className,
  children,
}: BeamBackgroundProps) {
  const reduced = useReducedMotion();
  const beams = React.useMemo(() => {
    return Array.from({ length: beamCount }, (_, i) => ({
      color: colors[i % colors.length],
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 10,
      height: 30 + Math.random() * 70,
      opacity: 0.1 + Math.random() * 0.3,
    }));
  }, [beamCount, colors]);

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
        {beams.map((beam, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width,
              height: `${beam.height}%`,
              left: `${beam.left}%`,
              top: "100%",
              background: `linear-gradient(to top, transparent, ${beam.color}, transparent)`,
              opacity: beam.opacity,
              filter: "blur(1px)",
              animation: `beamRise ${beam.duration}s ease-in-out infinite`,
              animationDelay: `${beam.delay}s`,
            }}
          />
        ))}
      </div>
      <style>{`
        @keyframes beamRise {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-200vh); opacity: 0; }
        }
      `}</style>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default BeamBackground;
