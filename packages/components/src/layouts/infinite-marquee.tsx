"use client";

import * as React from "react";
import { cn } from "../utils";
import { useReducedMotion } from "../hooks/use-reduced-motion";

export type InfiniteMarqueeProps = React.HTMLAttributes<HTMLDivElement> & {
  direction?: "left" | "right";
  speed?: "slow" | "normal" | "fast";
  pauseOnHover?: boolean;
  gap?: number;
};

export function InfiniteMarquee({
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  gap = 48,
  className,
  children,
  ...rest
}: InfiniteMarqueeProps) {
  const reduced = useReducedMotion();

  const speedValues = {
    slow: 50,
    normal: 30,
    fast: 15,
  };

  const duration = speedValues[speed];

  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        pauseOnHover && "hover:[animation-play-state:paused]",
        className
      )}
      {...rest}
    >
      <div
        className={cn(
          "flex",
          !reduced && "animate-marquee"
        )}
        style={{
          gap: `${gap}px`,
          animationDuration: `${duration}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {children}
        {!reduced && React.cloneElement(children as React.ReactElement, {
          "aria-hidden": true,
        })}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#0a0b10] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#0a0b10] to-transparent"
      />
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </div>
  );
}

export default InfiniteMarquee;
