"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

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
  const items = React.Children.toArray(children);

  if (items.length === 0) return null;

  const renderItems = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
      style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
    >
      {items.map((child, i) => (
        <React.Fragment key={i}>{child}</React.Fragment>
      ))}
    </div>
  );

  // Static fallbacks: no animation, no duplication.
  if (reduced) {
    return (
      <div className={cn("relative overflow-hidden", className)} {...rest}>
        <div className="flex flex-wrap items-center" style={{ gap: `${gap}px` }}>
          {items.map((child, i) => (
            <React.Fragment key={i}>{child}</React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        className
      )}
      {...rest}
    >
      <div
        className={cn(
          "flex w-max animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
        style={{
          animationDuration: `${duration}s`,
          animationDirection: direction === "right" ? "reverse" : "normal",
        }}
      >
        {renderItems(false)}
        {renderItems(true)}
      </div>
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

export default InfiniteMarquee;
