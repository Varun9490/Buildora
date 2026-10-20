"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type HorizontalScrollProps = React.HTMLAttributes<HTMLElement> & {
  /** Total width multiplier (e.g. 5 means the inner track is 5x viewport width) */
  widthMultiplier?: number;
  /** Height of the scroll region in vh units (determines scroll range) */
  scrollHeight?: string;
  /** Whether to show on mobile (falls back to vertical) */
  mobileBreakpoint?: number;
};

export function HorizontalScroll({
  widthMultiplier = 5,
  scrollHeight = "600vh",
  mobileBreakpoint = 768,
  className,
  children,
  ...rest
}: HorizontalScrollProps) {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);
  // A scroll-driven pan is still motion. Under reduced motion the section
  // becomes a normal horizontal scroller the reader drives themselves.
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${mobileBreakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mobileBreakpoint]);

  React.useEffect(() => {
    if (isMobile || reduced) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    let raf: number | null = null;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const rect = section.getBoundingClientRect();
        const sectionHeight = section.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollRange = sectionHeight - viewportHeight;

        if (scrollRange <= 0) return;

        const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
        const trackWidth = track.scrollWidth;
        const maxTranslate = trackWidth - window.innerWidth;
        track.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isMobile, reduced]);

  if (isMobile || reduced) {
    // Small screens and reduced motion get the same thing: a plain section
    // the reader scrolls themselves, with no scroll hijacking.
    return (
      <section
        className={cn("buildora-horizontal-scroll relative", className)}
        {...rest}
      >
        {children}
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className={cn("buildora-horizontal-scroll relative", className)}
      style={{ height: scrollHeight }}
      {...rest}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={trackRef}
          className="relative h-full will-change-transform"
          style={{ width: `${widthMultiplier * 100}vw` }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export default HorizontalScroll;
