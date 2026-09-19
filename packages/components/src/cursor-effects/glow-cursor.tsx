"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type GlowCursorProps = {
  color?: string;
  size?: number;
  blur?: number;
  opacity?: number;
  className?: string;
};

export function GlowCursor({
  color = "#d4ff4f",
  size = 400,
  blur = 150,
  opacity = 0.15,
  className,
}: GlowCursorProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [visible, setVisible] = React.useState(false);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);
    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <div
        className="absolute"
        style={{
          width: size,
          height: size,
          left: pos.x - size / 2,
          top: pos.y - size / 2,
          background: `radial-gradient(circle, ${color}${opacity < 16 ? "0" : ""}${Math.round(opacity * 255).toString(16)} 0%, transparent 70%)`,
          filter: `blur(${blur}px)`,
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}

export default GlowCursor;
