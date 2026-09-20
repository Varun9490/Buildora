"use client";

import * as React from "react";
import nextDynamic from "next/dynamic";
import { cn } from "@buildora/utils";

/**
 * ComponentPreview — a non-interactive, lazily-mounted live preview of a
 * registry component for use inside browse cards and the homepage bento.
 *
 * - Mounts the real ComponentRenderer (code-split, never in the initial chunk)
 *   once the card approaches the viewport (IntersectionObserver, 400px margin).
 * - `inert` + pointer-events-none keep the card a single clean Link target and
 *   keep preview controls out of the tab order. Full interaction lives on the
 *   component's detail page / playground, as the directive intends.
 * - Falls back to a layout-matched skeleton before mount.
 */

const ComponentRenderer = nextDynamic(() => import("@/components/ComponentRenderer"), {
  ssr: false,
  loading: () => <PreviewSkeleton />,
});

const DEFAULTS = {
  strength: 0.35,
  radius: 120,
  intensity: 0.6,
  speed: 1,
  glow: true,
  scale: 0.85,
  count: 40,
  length: 6,
  pageSize: 4,
  tilt: 8,
  variant: "accent",
};

function PreviewSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6">
      <div className="skeleton h-9 w-36 rounded-[10px]" />
      <div className="skeleton h-3.5 w-48 rounded" />
    </div>
  );
}

function useInView(rootMargin = "400px") {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      // No IO support: mount immediately rather than showing nothing.
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}

export function ComponentPreview({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const { ref, inView } = useInView();
  const inertRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (inertRef.current) inertRef.current.setAttribute("inert", "");
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex h-40 items-center justify-center overflow-hidden border-b border-[--b-border] bg-[--b-bg] px-4",
        className
      )}
      aria-hidden="true"
    >
      {inView ? (
        <div
          ref={inertRef}
          className="pointer-events-none flex max-h-full w-full max-w-md items-center justify-center select-none"
        >
          <ComponentRenderer slug={slug} controls={DEFAULTS} />
        </div>
      ) : (
        <PreviewSkeleton />
      )}
    </div>
  );
}

export default ComponentPreview;
