"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type SpotlightCursorProps = {
  spotlightColor?: string;
  spotlightSize?: number;
  backgroundOpacity?: number;
  className?: string;
  children?: React.ReactNode;
};

export function SpotlightCursor({
  spotlightColor = "rgba(255, 255, 255, 0.08)",
  spotlightSize = 400,
  backgroundOpacity = 0.7,
  className,
  children,
}: SpotlightCursorProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [visible, setVisible] = React.useState(false);
  const reduced = useReducedMotion();

  const handleMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setVisible(true);
  };

  const handleLeave = () => {
    if (!reduced) setVisible(false);
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: backgroundOpacity }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle ${spotlightSize}px at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent)`,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
}

export default SpotlightCursor;
