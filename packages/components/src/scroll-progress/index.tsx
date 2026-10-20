"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ScrollProgressProps = {
  /** The element to track. Defaults to the window. */
  target?: React.RefObject<HTMLElement>;
  /** Thickness of the bar, in px. */
  height?: number;
  /** Where the bar sits. */
  position?: "top" | "bottom";
  /** Colour of the filled part. */
  color?: string;
  className?: string;
};

/**
 * ScrollProgress — a reading-progress bar.
 *
 * What makes this different from a naive scroll listener: the value is
 * written to a CSS custom property inside a rAF tick, and the bar is
 * scaled with `transform`, so scrolling never triggers a layout. It also
 * tracks a specific element rather than always the page, which is what you
 * want inside a long scroll container.
 */
export function ScrollProgress({
  target,
  height = 3,
  position = "top",
  color = "var(--b-accent)",
  className,
}: ScrollProgressProps) {
  const barRef = React.useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const el = target?.current ?? null;
    let frame = 0;

    const read = () => {
      frame = 0;
      let ratio = 0;
      if (el) {
        const scrollable = el.scrollHeight - el.clientHeight;
        ratio = scrollable > 0 ? el.scrollTop / scrollable : 0;
      } else if (typeof window !== "undefined") {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
      }
      const clamped = Math.min(1, Math.max(0, ratio));
      setProgress(clamped);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${clamped})`;
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(read);
    };

    read();
    const scroller = el ?? (typeof window !== "undefined" ? window : null);
    scroller?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      scroller?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [target]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 z-40",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      style={{ height }}
      aria-hidden="true"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left"
        style={{
          background: color,
          transform: `scaleX(${progress})`,
          transition: reduced ? "none" : "transform 80ms linear",
        }}
      />
    </div>
  );
}

export default ScrollProgress;
