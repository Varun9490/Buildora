"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type GridBackgroundProps = {
  gridColor?: string;
  gridSize?: number;
  perspective?: boolean;
  fade?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function GridBackground({
  gridColor = "rgba(255, 255, 255, 0.05)",
  gridSize = 40,
  perspective = true,
  fade = true,
  className,
  children,
}: GridBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          perspective && "[perspective:500px]"
        )}
      >
        <div
          className={cn(
            "absolute inset-0",
            perspective && "origin-bottom [transform:rotateX(60deg)]"
          )}
          style={{
            backgroundImage: `
              linear-gradient(${gridColor} 1px, transparent 1px),
              linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />
        {fade && (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, var(--bg-color, #0b0d13) 100%)",
            }}
          />
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default GridBackground;
