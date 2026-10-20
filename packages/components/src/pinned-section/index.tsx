"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type PinnedSectionProps = {
  children: React.ReactNode;
  /** How many viewport heights the section scrolls through while pinned. */
  length?: number;
  /** Sticky top offset, in px. */
  top?: number;
  className?: string;
};

/**
 * PinnedSection — a section that sticks while its content scrolls past.
 *
 * What makes this different from `position: sticky`: the pinning is
 * explicit. The section reserves a scroll length, the inner content sticks
 * for exactly that long, and the release is handled by the scroll position
 * rather than by the browser guessing where a sticky element should stop.
 * That means a pinned panel can hand off to the next section cleanly.
 *
 * Under reduced motion the section collapses to its natural height and
 * nothing sticks.
 */
export function PinnedSection({
  children,
  length = 2,
  top = 0,
  className,
}: PinnedSectionProps) {
  const reduced = useReducedMotion();
  const outerRef = React.useRef<HTMLDivElement | null>(null);
  const [pinned, setPinned] = React.useState(false);
  const frame = React.useRef(0);

  React.useEffect(() => {
    if (reduced) {
      setPinned(false);
      return;
    }
    const read = () => {
      frame.current = 0;
      const el = outerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // Pinned while the section's top is above the sticky offset and its
      // bottom is still below it.
      const isPinned = r.top <= top && r.bottom > top + window.innerHeight * 0.5;
      setPinned(isPinned);
    };
    const onScroll = () => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced, top]);

  return (
    <div
      ref={outerRef}
      className={cn("relative w-full", className)}
      style={reduced ? undefined : { height: `${length * 100}vh` }}
    >
      <div
        className={cn("w-full", !reduced && "sticky")}
        style={{ top: reduced ? undefined : `${top}px` }}
      >
        {children}
      </div>
      {pinned ? (
        <span className="sr-only" role="status">
          Section pinned
        </span>
      ) : null}
    </div>
  );
}

export default PinnedSection;
