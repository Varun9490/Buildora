"use client";

import * as React from "react";

export function TemplateIframePreview({ slug, category = "TEMPLATE" }: { slug: string, category?: string }) {
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
    <div ref={ref} className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden bg-[color:var(--b-surface)]">
      {inView ? (
        <div className="w-[200%] h-[200%] flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-500 scale-[0.5] origin-center">
          <iframe 
            src={`/templates/${slug}`} 
            className="w-full h-full border-0 pointer-events-none rounded-xl"
            tabIndex={-1}
            title={`${slug} preview`}
          />
        </div>
      ) : (
        <h3 className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--b-muted)] group-hover:text-[color:var(--b-accent)]/60 transition-colors duration-500">
          {category}
        </h3>
      )}
    </div>
  );
}
