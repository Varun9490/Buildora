"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ScrollLinkedPathProps = {
  /** SVG path data. The path is revealed in the order it is written. */
  path: string;
  /** Stroke colour. Defaults to the accent token. */
  color?: string;
  /** Stroke width, in px. */
  strokeWidth?: number;
  /** The element to track. Defaults to the window. */
  target?: React.RefObject<HTMLElement>;
  /** How much of the path is drawn at the end of the scroll range: 1 = all. */
  progress?: number;
  /** Show a dot that travels along the path. */
  showDot?: boolean;
  /** Height of the scroll area the path is drawn in, in px. */
  height?: number;
  className?: string;
};

/**
 * ScrollLinkedPath — an SVG path drawn by scroll position.
 *
 * What makes this different from an animation that plays once on scroll
 * into view: the path is tied to the scroll position continuously, so
 * scrolling back up un-draws it. The stroke is a dash offset on a real
 * path, which means it works on any path shape with no geometry maths.
 *
 * The drawing is decorative; give the path an accessible name if it
 * carries meaning.
 */
export function ScrollLinkedPath({
  path,
  color = "var(--b-accent)",
  strokeWidth = 2,
  target,
  progress = 1,
  showDot = true,
  height = 320,
  className,
}: ScrollLinkedPathProps) {
  const reduced = useReducedMotion();
  const pathRef = React.useRef<SVGPathElement | null>(null);
  const dotRef = React.useRef<SVGCircleElement | null>(null);
  const frame = React.useRef(0);

  React.useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    // jsdom has no SVG geometry. Without it there is nothing to draw, so
    // leave the path as authored rather than throwing.
    if (typeof el.getTotalLength !== "function") return;

    const length = el.getTotalLength();
    el.style.strokeDasharray = `${length}`;
    el.style.strokeDashoffset = `${length}`;

    if (reduced) {
      el.style.strokeDashoffset = `${length * (1 - progress)}`;
      if (dotRef.current) dotRef.current.setAttribute("opacity", "0");
      return;
    }

    const read = () => {
      frame.current = 0;
      const scroller = target?.current ?? null;
      let ratio = 0;

      if (scroller) {
        const span = scroller.scrollHeight - scroller.clientHeight;
        ratio = span > 0 ? scroller.scrollTop / span : 0;
      } else if (typeof window !== "undefined") {
        const span = document.documentElement.scrollHeight - window.innerHeight;
        ratio = span > 0 ? window.scrollY / span : 0;
      }

      const t = Math.min(1, Math.max(0, ratio)) * progress;
      el.style.strokeDashoffset = `${length * (1 - t)}`;

      if (dotRef.current && t > 0 && t < 1 && typeof el.getPointAtLength === "function") {
        const point = el.getPointAtLength(length * t);
        dotRef.current.setAttribute("cx", `${point.x}`);
        dotRef.current.setAttribute("cy", `${point.y}`);
        dotRef.current.setAttribute("opacity", "1");
      } else if (dotRef.current) {
        dotRef.current.setAttribute("opacity", "0");
      }
    };

    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(read);
    };

    read();
    const scroller = target?.current ?? (typeof window !== "undefined" ? window : null);
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      scroller?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [path, progress, reduced, target]);

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      style={{ height }}
      role="img"
      aria-label="A path that draws itself as you scroll"
    >
      <svg
        viewBox="0 0 400 320"
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d={path}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          ref={dotRef}
          r={4}
          fill={color}
          opacity="0"
          aria-hidden="true"
        />
      </svg>
    </div>
  );
}

export default ScrollLinkedPath;
