"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type DotGridBackgroundProps = {
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
  className?: string;
  children?: React.ReactNode;
};

export function DotGridBackground({
  dotColor = "rgba(255, 255, 255, 0.15)",
  dotSize = 1,
  spacing = 20,
  className,
  children,
}: DotGridBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} ${dotSize}px, transparent ${dotSize}px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default DotGridBackground;
