"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type BlobCursorProps = {
  color?: string;
  size?: number;
  trailLength?: number;
  className?: string;
};

export function BlobCursor({
  color = "#d4ff4f",
  size = 20,
  trailLength = 8,
  className,
}: BlobCursorProps) {
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [visible, setVisible] = React.useState(false);
  const [targets, setTargets] = React.useState<{ x: number; y: number }[]>([]);
  const rafRef = React.useRef<number>(0);
  const posRef = React.useRef({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
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
    const animate = () => {
      setPos((prev) => {
        const dx = posRef.current.x - prev.x;
        const dy = posRef.current.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reduced]);

  React.useEffect(() => {
    if (reduced) return;
    const interval = setInterval(() => {
      setTargets((prev) => {
        const next = [...prev, { x: pos.x, y: pos.y }];
        return next.slice(-trailLength);
      });
    }, 16);
    return () => clearInterval(interval);
  }, [pos.x, pos.y, trailLength, reduced]);

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
      {targets.map((t, i) => (
        <div
          key={i}
          className="absolute rounded-full transition-transform duration-100"
          style={{
            width: size * (0.3 + (i / targets.length) * 0.7),
            height: size * (0.3 + (i / targets.length) * 0.7),
            left: t.x,
            top: t.y,
            transform: "translate(-50%, -50%)",
            background: color,
            opacity: 0.1 + (i / targets.length) * 0.2,
            filter: `blur(${2 + i}px)`,
          }}
        />
      ))}
      <div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          left: pos.x,
          top: pos.y,
          transform: "translate(-50%, -50%)",
          background: color,
          boxShadow: `0 0 ${size}px ${color}`,
        }}
      />
    </div>
  );
}

export default BlobCursor;
