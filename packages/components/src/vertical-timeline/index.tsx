"use client";

import * as React from "react";
import { cn } from "@buildora/utils";

export type TimelineEntry = {
  /** Title of the timeline entry */
  title: string;
  /** Description text */
  description?: string;
  /** Date or label */
  date?: string;
  /** Optional icon/badge node */
  icon?: React.ReactNode;
};

export type VerticalTimelineProps = React.HTMLAttributes<HTMLOListElement> & {
  /** Timeline entries */
  entries: TimelineEntry[];
  /** Line color */
  lineColor?: string;
  /** Dot color */
  dotColor?: string;
  /** Whether to animate entries on scroll */
  animated?: boolean;
  /** Stagger delay between items (seconds) */
  staggerDelay?: number;
};

export function VerticalTimeline({
  entries,
  lineColor,
  dotColor,
  animated = true,
  staggerDelay = 0.08,
  className,
  ...rest
}: VerticalTimelineProps) {
  const listRef = React.useRef<HTMLOListElement | null>(null);
  const [visibleSet, setVisibleSet] = React.useState<Set<number>>(new Set());

  React.useEffect(() => {
    if (!animated) {
      setVisibleSet(new Set(entries.map((_, i) => i)));
      return;
    }

    const el = listRef.current;
    if (!el) return;

    const items = el.querySelectorAll("[data-tl-item]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.tlItem);
            setVisibleSet((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [animated, entries.length]);

  const resolvedLineColor =
    lineColor || "color-mix(in oklab, var(--b-fg, #000) 40%, transparent)";
  const resolvedDotColor =
    dotColor || "color-mix(in oklab, var(--b-fg, #000) 60%, transparent)";

  return (
    <ol
      ref={listRef}
      className={cn(
        "buildora-vertical-timeline relative pl-9",
        className
      )}
      style={{
        borderLeft: `1px solid ${resolvedLineColor}`,
      }}
      {...rest}
    >
      {entries.map((entry, i) => {
        const isVisible = visibleSet.has(i);

        return (
          <li
            key={i}
            data-tl-item={i}
            className="relative pb-7"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(1rem)",
              transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)`,
              transitionDelay: `${i * staggerDelay}s`,
            }}
          >
            {/* Horizontal tick */}
            <span
              aria-hidden
              className="absolute h-px w-3"
              style={{
                left: "-1.1rem",
                top: "0.7rem",
                background: resolvedLineColor,
              }}
            />

            {/* Dot */}
            <span
              aria-hidden
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                left: "-0.4rem",
                top: "0.55rem",
                background: resolvedDotColor,
              }}
            />

            {/* Content */}
            <div>
              {entry.icon && (
                <span className="mb-1 inline-block">{entry.icon}</span>
              )}
              <p className="font-medium">{entry.title}</p>
              {entry.description && (
                <p
                  className="text-sm leading-snug"
                  style={{
                    color:
                      "color-mix(in oklab, var(--b-fg, #000) 55%, transparent)",
                  }}
                >
                  {entry.description}
                </p>
              )}
              {entry.date && (
                <p
                  className="mt-0.5 text-xs"
                  style={{
                    color:
                      "color-mix(in oklab, var(--b-fg, #000) 40%, transparent)",
                  }}
                >
                  {entry.date}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export default VerticalTimeline;
