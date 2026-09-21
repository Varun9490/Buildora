"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { DEFAULT_RENDER_CONTROLS } from "@/lib/render-controls";

const ComponentRenderer = dynamic(() => import("@/components/ComponentRenderer").then(mod => mod.ComponentRenderer), {
  ssr: false,
});

export function LazyPreview({ slug, category }: { slug: string, category: string }) {
  const [inView, setInView] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Render slightly before it comes into view
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
      {inView ? (
        <div className="w-[160%] h-[160%] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-[0.6] origin-center">
          <ComponentRenderer slug={slug} controls={DEFAULT_RENDER_CONTROLS} />
        </div>
      ) : (
        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--b-muted)] group-hover:text-[color:var(--b-accent)]/60 transition-colors duration-500">
          {category}
        </h3>
      )}
    </div>
  );
}
