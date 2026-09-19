"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type GhostCursorProps = {
  color?: string;
  size?: number;
  delay?: number;
  ghostCount?: number;
  className?: string;
};

export function GhostCursor({
  color = "#d4ff4f",
  size = 20,
  delay = 100,
  ghostCount = 3,
  className,
}: GhostCursorProps) {
  const [currentPos, setCurrentPos] = React.useState({ x: 0, y: 0 });
  const [ghosts, setGhosts] = React.useState<{ x: number; y: number }[]>(
    Array.from({ length: ghostCount }, () => ({ x: 0, y: 0 }))
  );
  const [visible, setVisible] = React.useState(false);
  const reduced = useReducedMotion();
  const historyRef = React.useRef<{ x: number; y: number; t: number }[]>([]);

  React.useEffect(() => {
    if (reduced) return;
    const handleMove = (e: MouseEvent) => {
      setCurrentPos({ x: e.clientX, y: e.clientY });
      historyRef.current.push({ x: e.clientX, y: e.clientY, t: Date.now() });
      if (historyRef.current.length > 50) {
        historyRef.current.shift();
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
  }, [reduced]);

  React.useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const newGhosts = Array.from({ length: ghostCount }, (_, i) => {
        const targetTime = now - delay * (i + 1);
        const history = historyRef.current;
        for (let j = history.length - 1; j >= 0; j--) {
          if (history[j].t <= targetTime) {
            return history[j];
          }
        }
        return history[0] || { x: 0, y: 0 };
      });
      setGhosts(newGhosts);
    }, 16);
    return () => clearInterval(interval);
  }, [delay, ghostCount, reduced]);

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
      {ghosts.map((ghost, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * (1 - i * 0.15),
            height: size * (1 - i * 0.15),
            left: ghost.x,
            top: ghost.y,
            transform: "translate(-50%, -50%)",
            background: color,
            opacity: 0.5 - i * 0.1,
            filter: `blur(${i * 2}px)`,
          }}
        />
      ))}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          left: currentPos.x,
          top: currentPos.y,
          transform: "translate(-50%, -50%)",
          background: color,
          boxShadow: `0 0 ${size / 2}px ${color}`,
        }}
      />
    </div>
  );
}

export default GhostCursor;
