"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ThreadLineProps = React.SVGAttributes<SVGSVGElement> & {
  /** SVG path data string */
  path: string;
  /** Stroke color */
  strokeColor?: string;
  /** Stroke width */
  strokeWidth?: number;
  /** Whether the line draws itself on scroll (vs. on mount) */
  triggerOnScroll?: boolean;
  /** Duration of draw animation in seconds (mount mode only) */
  drawDuration?: number;
  /** Show a dot at the starting position */
  showDot?: boolean;
  /** Dot radius */
  dotRadius?: number;
  /** ViewBox for the SVG */
  viewBox?: string;
};

export function ThreadLine({
  path,
  strokeColor = "currentColor",
  strokeWidth = 3,
  triggerOnScroll = true,
  drawDuration = 2.6,
  showDot = false,
  dotRadius = 9,
  viewBox = "0 0 5700 1000",
  className,
  ...rest
}: ThreadLineProps) {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const reduced = useReducedMotion();
  const [dashOffset, setDashOffset] = React.useState(1);
  const [dotPos, setDotPos] = React.useState<{ x: number; y: number } | null>(
    null
  );

  /* ---- Scroll-driven draw ---- */
  React.useEffect(() => {
    if (reduced) {
      setDashOffset(0);
      return;
    }

    if (!triggerOnScroll) return;

    const svg = svgRef.current;
    if (!svg) return;

    let raf: number | null = null;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = svg.getBoundingClientRect();
        const start = window.innerHeight;
        const end = -rect.height;
        const progress = Math.max(
          0,
          Math.min(1, (start - rect.top) / (start - end))
        );
        setDashOffset(1 - progress);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [triggerOnScroll, reduced]);

  /* ---- Compute dot position ---- */
  React.useEffect(() => {
    if (!showDot || !pathRef.current) return;
    try {
      const p = pathRef.current.getPointAtLength(0);
      setDotPos({ x: p.x, y: p.y });
    } catch {
      /* ignore in SSR */
    }
  }, [showDot, path]);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio="none"
      className={cn(
        "buildora-thread-line pointer-events-none overflow-visible",
        className
      )}
      {...rest}
    >
      <path
        ref={pathRef}
        pathLength={1}
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        style={
          triggerOnScroll
            ? { strokeDashoffset: dashOffset }
            : {
                strokeDashoffset: 1,
                animation: reduced
                  ? "none"
                  : `buildora-draw ${drawDuration}s ease-out forwards`,
              }
        }
      />

      {showDot && dotPos && (
        <circle
          r={dotRadius}
          cx={dotPos.x}
          cy={dotPos.y}
          fill={strokeColor}
          style={{
            opacity: triggerOnScroll ? (dashOffset < 0.99 ? 1 : 0) : 0,
            transition: "opacity 0.3s",
          }}
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
@keyframes buildora-draw {
  from { stroke-dashoffset: 1; }
  to   { stroke-dashoffset: 0; }
}
          `,
        }}
      />
    </svg>
  );
}

export default ThreadLine;
