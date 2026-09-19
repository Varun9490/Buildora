"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type NoiseBackgroundProps = {
  opacity?: number;
  color?: string;
  className?: string;
  children?: React.ReactNode;
};

export function NoiseBackground({
  opacity = 0.05,
  color = "white",
  className,
  children,
}: NoiseBackgroundProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

export default NoiseBackground;
