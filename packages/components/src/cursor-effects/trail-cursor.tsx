"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type TrailCursorProps = {
  color?: string;
  size?: number;
  count?: number;
  trailDelay?: number;
  className?: string;
};

export function TrailCursor({
  color = "#d4ff4f",
  size = 8,
  count = 12,
  trailDelay = 50,
  className,
}: TrailCursorProps) {
  const [positions, setPositions] = React.useState<{ x: number; y: number }[]>([]);
  const [visible, setVisible] = React.useState(false);
  const reduced = useReducedMotion();
  const historyRef = React.useRef<{ x: number; y: number }[]>([]);

  React.useEffect(() => {
    if (reduced) return;
    const handleMove = (e: MouseEvent) => {
      historyRef.current.unshift({ x: e.clientX, y: e.clientY });
      if (historyRef.current.length > count) {
        historyRef.current.pop();
      }
      setVisible(true);
    };
    const handleLeave = () => setVisible(false);
    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [count, reduced]);

  React.useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setPositions([...historyRef.current].slice(0, count));
    }, trailDelay);
    return () => clearInterval(interval);
  }, [count, trailDelay, reduced]);

  if (reduced) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {positions.map((pos, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * (1 - i / count),
            height: size * (1 - i / count),
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, -50%)",
            background: color,
            opacity: 1 - (i / count) * 0.8,
            transition: "opacity 0.15s ease",
          }}
        />
      ))}
    </div>
  );
}

export default TrailCursor;
