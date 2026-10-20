"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type ParallaxLayer = {
  /** How fast this layer moves relative to the scroll. 0 is fixed, 1 scrolls with the page. */
  speed?: number;
  className?: string;
  children?: React.ReactNode;
};

export type ParallaxStackProps = {
  /** The layers, painted back to front. */
  layers: ParallaxLayer[];
  /** Height of the section, in px. Defaults to the viewport. */
  height?: number;
  className?: string;
};

/**
 * ParallaxStack — layers that move at different rates as you scroll.
 *
 * What makes this different from a CSS `background-attachment: fixed`:
 * the offsets are computed once per frame from the section's own scroll
 * progress, so every layer is exactly where it should be at any point,
 * and the whole thing collapses to a static stack when reduced motion is
 * on. Nothing is composited off-screen by the browser.
 *
 * The layers are decorative; the content inside them is not.
 */
export function ParallaxStack({ layers, height, className }: ParallaxStackProps) {
  const reduced = useReducedMotion();
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = React.useState(0);
  const frame = React.useRef(0);

  React.useEffect(() => {
    if (reduced) {
      setProgress(0);
      return;
    }
    const read = () => {
      frame.current = 0;
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // 0 when the section's top hits the bottom of the viewport,
      // 1 when its bottom hits the top.
      const span = r.height + window.innerHeight;
      const moved = (window.innerHeight - r.top) / span;
      setProgress(Math.min(1, Math.max(0, moved)));
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
  }, [reduced]);

  return (
    <div
      ref={sectionRef}
      className={cn("relative w-full overflow-hidden", className)}
      style={{ height: height ?? "100vh" }}
    >
      {layers.map((layer, i) => {
        const speed = layer.speed ?? i * 0.15;
        // Centre the layer on the section's midpoint, then offset it by
        // its share of the scroll progress.
        const offset = reduced ? 0 : (progress - 0.5) * speed * 100;
        return (
          <div
            key={i}
            className={cn("absolute inset-x-0 will-change-transform", layer.className)}
            style={{ transform: `translate3d(0, ${offset}%, 0)` }}
          >
            {layer.children}
          </div>
        );
      })}
    </div>
  );
}

export default ParallaxStack;
