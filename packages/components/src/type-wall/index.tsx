"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type TypeWallProps = React.HTMLAttributes<HTMLDivElement> & {
  rows?: number;
  words?: string[];
  speed?: number;
  pauseOnHover?: boolean;
};

const WALL_CSS = `
@keyframes bk-wall-slide{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.bk-wall:hover .bk-wall-track{animation-play-state:paused}
`;

/**
 * TypeWall — alternating solid and outline marquee rows under a top-and-bottom
 * fade mask. Pauses on hover, fully static under reduced motion.
 */
export function TypeWall({ rows = 4, words, speed = 60, pauseOnHover = true, className, ...rest }: TypeWallProps) {
  const reduced = useReducedMotion();
  const list = words && words.length > 0 ? words : ["Momentum", "Material", "Method", "Motion"];
  const n = Math.max(1, Math.min(8, rows));
  const dur = Math.max(8, Math.min(90, 2600 / speed));

  const face = (r: number): React.CSSProperties => {
    if (r % 2 === 1) {
      return {
        WebkitTextStroke: "1px color-mix(in oklab, var(--b-text) 40%, transparent)",
        color: "transparent",
      };
    }
    if (r % 4 === 2) {
      return { color: "color-mix(in oklab, var(--b-text) 30%, transparent)" };
    }
    return { color: "var(--b-text)" };
  };

  return (
    <div aria-hidden className={cn("bk-wall w-full select-none", className)} {...rest}>
      {(pauseOnHover || !reduced) && <style>{WALL_CSS}</style>}
      <div
        className="flex flex-col overflow-hidden py-2"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)",
          maskImage: "linear-gradient(to bottom, transparent, #000 14%, #000 86%, transparent)",
        }}
      >
        {Array.from({ length: n }, (_, r) => {
          const word = list[r % list.length] ?? "Motion";
          const reverse = r % 2 === 1;
          return (
            <div key={r} className="flex overflow-hidden">
              <div
                className="flex shrink-0 items-center gap-[3vw] whitespace-nowrap pr-[3vw] font-display font-black leading-[1.05] tracking-tight"
                style={{
                  fontSize: "clamp(2.25rem, 6vw, 4.5rem)",
                  ...face(r),
                  animation: reduced ? undefined : `bk-wall-slide ${dur}s linear infinite`,
                  animationDirection: !reduced && reverse ? "reverse" : undefined,
                }}
              >
                {Array.from({ length: 10 }, (_, k) => (
                  <span key={k}>{word}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TypeWall;
