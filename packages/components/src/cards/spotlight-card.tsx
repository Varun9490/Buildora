"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type SpotlightCardProps = React.HTMLAttributes<HTMLDivElement> & {
  spotlightColor?: string;
  spotlightSize?: number;
  borderStyle?: "none" | "subtle" | "glow";
};

export function SpotlightCard({
  spotlightColor = "rgba(212, 255, 79, 0.18)",
  spotlightSize = 280,
  borderStyle = "subtle",
  className,
  children,
  ...rest
}: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0, active: false });
  const reduced = useReducedMotion();

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleLeave = () => setPos((p) => ({ ...p, active: false }));

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={cn(
        "group relative rounded-2xl bg-[#12141d] p-6",
        "transition-all duration-200",
        borderStyle === "none" && "border-0",
        borderStyle === "subtle" && "border border-white/10",
        borderStyle === "glow" && "border border-[#d4ff4f]/20",
        "focus-within:ring-2 focus-within:ring-[#d4ff4f]/50",
        className
      )}
      {...rest}
    >
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            background: pos.active
              ? `radial-gradient(${spotlightSize}px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 40%)`
              : "none",
            opacity: pos.active ? 1 : 0,
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}

export default SpotlightCard;
