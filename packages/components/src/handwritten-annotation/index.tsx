"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type HandwrittenAnnotationProps = React.HTMLAttributes<HTMLDivElement> & {
  /** The handwritten text */
  text: string;
  /** Arrow direction pointing from the text to the target */
  arrowDirection?: "down-left" | "down-right" | "up-left" | "up-right" | "left" | "right" | "none";
  /** Rotation of the text in degrees */
  rotation?: number;
  /** Max width of the text block */
  maxWidth?: string;
  /** Font family override */
  fontFamily?: string;
};

const arrowPaths: Record<string, { path: string; head: string; viewBox: string }> = {
  "down-left": {
    path: "M30 4 C32 20 22 32 6 36",
    head: "M6 36 L16 29 M6 36 L15 42",
    viewBox: "0 0 40 50",
  },
  "down-right": {
    path: "M4 8 C8 22 18 30 34 30",
    head: "M34 30 L25 24 M34 30 L26 37",
    viewBox: "0 0 40 44",
  },
  "up-left": {
    path: "M30 36 C24 20 14 10 4 8",
    head: "M4 8 L14 6 M4 8 L8 17",
    viewBox: "0 0 40 44",
  },
  "up-right": {
    path: "M4 36 C12 22 22 14 34 10",
    head: "M34 10 L24 7 M34 10 L32 20",
    viewBox: "0 0 40 44",
  },
  left: {
    path: "M40 18 C30 30 18 32 6 30",
    head: "M6 30 L15 24 M6 30 L14 37",
    viewBox: "0 0 44 44",
  },
  right: {
    path: "M4 18 C14 30 26 32 38 30",
    head: "M38 30 L29 24 M38 30 L30 37",
    viewBox: "0 0 44 44",
  },
};

export function HandwrittenAnnotation({
  text,
  arrowDirection = "down-left",
  rotation = -12,
  maxWidth = "9rem",
  fontFamily,
  className,
  style,
  ...rest
}: HandwrittenAnnotationProps) {
  const reduced = useReducedMotion();
  const arrow = arrowDirection !== "none" ? arrowPaths[arrowDirection] : null;

  const isArrowBelow = arrowDirection === "down-left" || arrowDirection === "down-right";

  return (
    <div
      className={cn("buildora-handwritten-annotation relative inline-block", className)}
      style={{ maxWidth, ...style }}
      {...rest}
    >
      <p
        className="leading-[1.3] tracking-[0.08em]"
        style={{
          fontFamily:
            fontFamily ||
            "var(--b-font-hand, 'Patrick Hand', 'Caveat', cursive)",
          fontSize: "1.05rem",
          color: "color-mix(in oklab, var(--b-fg, #000) 75%, transparent)",
          rotate: `${rotation}deg`,
        }}
        dangerouslySetInnerHTML={{
          __html: text.replace(/\n/g, "<br/>"),
        }}
      />

      {arrow && (
        <svg
          aria-hidden
          viewBox={arrow.viewBox}
          className={cn(
            "h-10 w-10 overflow-visible",
            isArrowBelow ? "mt-1" : "mb-1"
          )}
          style={{
            color: "color-mix(in oklab, var(--b-fg, #000) 70%, transparent)",
          }}
        >
          <path
            d={arrow.path}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={
              reduced
                ? {}
                : {
                    strokeDasharray: "1",
                    strokeDashoffset: "0",
                    pathLength: 1,
                  }
            }
          />
          <path
            d={arrow.head}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

export default HandwrittenAnnotation;
