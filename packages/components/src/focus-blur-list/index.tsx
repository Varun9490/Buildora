"use client";

import * as React from "react";
import { cn } from "@buildora/utils";
import { useReducedMotion } from "@buildora/hooks";

export type FocusBlurItem = {
  title: string;
  meta?: string;
  href?: string;
};

export type FocusBlurListProps = React.HTMLAttributes<HTMLUListElement> & {
  items: FocusBlurItem[];
  /** Hovering/focusing one item dims + blurs the rest this much. */
  depth?: number;
  onSelect?: (item: FocusBlurItem, index: number) => void;
};

/**
 * FocusBlurList — a list where the hovered/focused row stays crisp while
 * siblings sink back (blur + dim). Keyboard focus produces the same
 * behavior; motion-reduced users get dim-only.
 */
export function FocusBlurList({
  items,
  depth = 2.2,
  onSelect,
  className,
  ...rest
}: FocusBlurListProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = React.useState<number | null>(null);

  const sink = (i: number) => active != null && active !== i;

  return (
    <ul className={cn("flex flex-col", className)} {...rest}>
      {items.map((item, i) => {
        const isSink = sink(i);
        const isActive = active === i;
        const Tag = (item.href ? "a" : "button") as React.ElementType;
        const row = (
          <>
            <span className="flex-1 min-w-0">
              <span
                className={cn(
                  "block truncate text-[15px] font-semibold transition-colors duration-200",
                  isActive ? "text-[color:var(--b-text)]" : "text-[color:var(--b-text-secondary)]"
                )}
              >
                {item.title}
              </span>
              {item.meta && (
                <span className="mt-0.5 block truncate text-xs text-[color:var(--b-muted)]">{item.meta}</span>
              )}
            </span>
            <svg
              className="shrink-0 transition-all duration-200"
              style={{ transform: isActive ? "translateX(2px)" : undefined, opacity: isActive ? 1 : 0.35 }}
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 3.5 10.5 8 6 12.5" />
            </svg>
          </>
        );

        return (
          <li key={item.title}>
            <Tag
              href={item.href}
              onClick={item.href ? undefined : () => onSelect?.(item, i)}
              onPointerEnter={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className={cn(
                "flex w-full items-center justify-between gap-4 px-4 py-3.5 outline-none transition-all duration-250",
                "border-b border-[color:var(--b-border)] last:border-b-0",
                !isActive && "hover:bg-[color:color-mix(in_oklab,var(--b-text)_4%,transparent)]",
                item.href ? "group cursor-pointer" : "cursor-pointer text-left"
              )}
              style={{
                filter: !reduced && isSink ? `blur(${depth}px)` : undefined,
                opacity: isSink ? 0.45 : 1,
                transitionFilter: "260ms",
              }}
            >
              {row}
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}

export default FocusBlurList;
